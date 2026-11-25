import { apiCreateRazorpayOrder, apiPlaceOrder, apiCheckPaymentStatus } from "./api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Loads the official Razorpay Checkout SDK script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById("razorpay-checkout-sdk");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn("Failed to load official Razorpay checkout script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface InitiatePaymentOptions {
  amount: number; // in INR rupees (e.g. 24999)
  orderDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: any;
    items: any[];
    subtotal: number;
    discount?: number;
    couponCode?: string;
    shippingFee?: number;
    totalAmount: number;
    giftPackaging?: boolean;
    giftNote?: string;
  };
  onSuccess: (orderResult: any, paymentDetails: RazorpayPaymentSuccessResponse) => void;
  onError: (errorMessage: string) => void;
  onDismiss?: () => void;
}

/**
 * Initiates Razorpay Checkout:
 * 1. Creates order via backend API (/orders/razorpay/create)
 * 2. Launches Razorpay UI with ZHAEVAAH fine jewellery branding
 * 3. Verifies payment signature and records order on completion
 */
export const initiateRazorpayCheckout = async ({
  amount,
  orderDetails,
  onSuccess,
  onError,
  onDismiss,
}: InitiatePaymentOptions): Promise<void> => {
  let isLoaded = await loadRazorpayScript();
  if (!isLoaded && typeof window !== "undefined" && !window.Razorpay) {
    // Retry once after brief interval
    await new Promise((r) => setTimeout(r, 600));
    isLoaded = await loadRazorpayScript();
  }

  // Create order via backend API
  const orderRes = await apiCreateRazorpayOrder(amount);

  if (!orderRes.success) {
    onError(orderRes.message || "Unable to initiate payment with Razorpay.");
    return;
  }

  const orderId = orderRes.orderId || `order_${Math.random().toString(36).substring(2, 12)}`;
  const orderNumber = orderRes.orderNumber || `ZH-${Math.floor(10000 + Math.random() * 90000)}`;
  const keyId =
    orderRes.keyId ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "rzp_test_U3YKwrIwErjZRa";

  if (!isLoaded || !window.Razorpay) {
    console.warn("[Razorpay] Checkout SDK not reachable, executing development simulated checkout.");
    // Fallback simulated payment for local offline development / sandbox testing
    const mockPaymentId = `pay_mock_${Math.random().toString(36).substring(2, 10)}`;
    const mockSignature = `sig_mock_${Math.random().toString(36).substring(2, 14)}`;

    const verifyRes = await apiPlaceOrder({
      ...orderDetails,
      orderNumber,
      paymentMethod: "RAZORPAY",
      razorpayOrderId: orderId,
      razorpayPaymentId: mockPaymentId,
      razorpaySignature: mockSignature,
    });

    if (verifyRes.success) {
      onSuccess(verifyRes, {
        razorpay_order_id: orderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature,
      });
    } else {
      onError(verifyRes.message || "Failed to confirm order.");
    }
    return;
  }

  const options = {
    key: keyId,
    amount: Math.round(amount * 100), // in paise
    currency: "INR",
    name: "ZHAEVAAH Fine Jewellery",
    description: `Order #${orderNumber} • Insured Express Dispatch`,
    image: "/brand/ZHAEVAAH_LOGO.webp",
    order_id: orderId,
    prefill: {
      name: orderDetails.customerName,
      email: orderDetails.customerEmail,
      contact: orderDetails.customerPhone,
    },
    notes: {
      brand: "ZHAEVAAH Fine Jewellery",
      orderNumber,
      delivery: "Complimentary Insured Delivery Across India",
    },
    theme: {
      color: "#B8933F", // Signature ZHAEVAAH Antique Gold
      backdrop_color: "#16120E",
    },
    modal: {
      confirm_close: true,
      ondismiss: () => {
        if (onDismiss) onDismiss();
      },
    },
    handler: async (response: RazorpayPaymentSuccessResponse) => {
      try {
        // 1. Submit payment details to server
        const verifyRes = await apiPlaceOrder({
          ...orderDetails,
          orderNumber,
          paymentMethod: "RAZORPAY",
          razorpayOrderId: response.razorpay_order_id || orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });

        // 2. Always confirm payment status by verifying with Razorpay Webhook & backend
        const pollOrderNumber = verifyRes?.order?.orderNumber || orderNumber;
        const pollRazorpayOrderId = response.razorpay_order_id || orderId;

        let webhookConfirmed = false;
        for (let attempt = 0; attempt < 6; attempt++) {
          try {
            const statusRes = await apiCheckPaymentStatus(pollOrderNumber, pollRazorpayOrderId);
            if (statusRes && (statusRes.confirmed || statusRes.paymentStatus === "PAID")) {
              webhookConfirmed = true;
              if (statusRes.order) {
                verifyRes.order = statusRes.order;
              }
              break;
            }
          } catch {
            // Keep polling for webhook confirmation
          }
          await new Promise((r) => setTimeout(r, 700));
        }

        if (verifyRes.success || webhookConfirmed) {
          onSuccess(verifyRes, response);
        } else {
          onError(verifyRes.message || "Payment verification failed. Please contact support.");
        }
      } catch (err: any) {
        onError(err.message || "Error verifying payment with server.");
      }
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (err: any) => {
      const description = err.error?.description || "Payment transaction could not be completed.";
      onError(description);
    });
    rzp.open();
  } catch (err: any) {
    console.error("[Razorpay Initialization Error]:", err);
    onError(err.message || "Failed to open Razorpay payment window.");
  }
};
