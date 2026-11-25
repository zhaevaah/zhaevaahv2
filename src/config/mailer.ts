import nodemailer from "nodemailer";
import prisma from "./prisma";

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "zhaevaah@gmail.com";
const FROM_NAME = process.env.MAIL_FROM_NAME || "ZHAEVAAH Fine Jewellery";
const FROM_EMAIL = process.env.MAIL_FROM_EMAIL || "info@zhaevaah.com";

// Create nodemailer transporter supporting Gmail OAuth2 and standard SMTP
export const getTransporter = () => {
  const mailClientId = process.env.MAIL_CLIENT_ID;
  const mailClientSecret = process.env.MAIL_CLIENT_SECRET;
  const mailRefreshToken = process.env.MAIL_REFRESH_TOKEN;
  const mailFromEmail = process.env.MAIL_FROM_EMAIL || "info@zhaevaah.com";

  if (mailClientId && mailClientSecret && mailRefreshToken) {
    try {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: mailFromEmail,
          clientId: mailClientId,
          clientSecret: mailClientSecret,
          refreshToken: mailRefreshToken,
        },
      });
    } catch (err: any) {
      console.error("[Mailer] Failed to init OAuth2 transport:", err.message);
    }
  }

  // Fallback to standard SMTP
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass && smtpPass !== "your_email_app_password") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return null;
};

// Retrieve configured order notification receivers from database settings
export const getOrderNotificationEmails = async (): Promise<string[]> => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "order_mail_settings" },
    });

    if (setting && setting.value) {
      const val = setting.value as any;
      if (Array.isArray(val.receivers) && val.receivers.length > 0) {
        const cleaned = val.receivers
          .map((e: string) => String(e).trim().toLowerCase())
          .filter((e: string) => e.length > 0 && e.includes("@"));
        if (cleaned.length > 0) {
          return cleaned;
        }
      }
    }
  } catch (err: any) {
    console.warn("[Mailer] Could not query order_mail_settings from DB:", err.message);
  }

  return [DEFAULT_ADMIN_EMAIL.toLowerCase().trim()];
};

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    name?: string;
    street: string;
    locality?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    title: string;
    price: string | number;
    quantity: number;
    specs?: string;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus?: string;
  trackingNumber?: string;
}

// 1. Send Order Confirmation Email to User + Order Alert Email to Admin Receivers
export const sendOrderConfirmationEmail = async (data: OrderEmailData) => {
  const transporter = getTransporter();
  const adminReceivers = await getOrderNotificationEmails();
  const adminRecipientsStr = adminReceivers.join(", ");

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #eae3d5;">
        <td style="padding: 12px 0; color: #1c1208; font-size: 13px;">
          <strong>${item.title}</strong>
          ${item.specs ? `<br/><span style="color: #767069; font-size: 11px;">${item.specs}</span>` : ""}
        </td>
        <td style="padding: 12px 0; text-align: center; color: #767069; font-size: 13px;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; color: #1c1208; font-weight: 600; font-size: 13px;">₹${(
          Number(item.price) * item.quantity
        ).toLocaleString("en-IN")}</td>
      </tr>
    `
    )
    .join("");

  // Customer Email HTML
  const customerEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; background-color: #faf9f7; margin: 0; padding: 24px; color: #1c1208; }
          .container { max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #eae3d5; border-radius: 4px; overflow: hidden; }
          .header { background: #1c1208; color: #ffffff; padding: 32px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; letter-spacing: 0.2em; font-weight: 600; color: #b8933f; }
          .header p { margin: 8px 0 0; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #eae3d5; }
          .content { padding: 32px 24px; }
          .badge { display: inline-block; background: #fbf7ee; color: #b8933f; border: 1px solid #b8933f; padding: 6px 14px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 2px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .footer { background: #faf9f7; padding: 24px; text-align: center; font-size: 11px; color: #767069; border-top: 1px solid #eae3d5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ZHAEVAAH</h1>
            <p>Fine Diamond & 18kt Gold Jewellery</p>
          </div>
          <div class="content">
            <span class="badge">Order Confirmed • #${data.orderNumber}</span>
            <h2 style="font-size: 20px; margin: 18px 0 8px;">Thank you for your order, ${data.customerName}!</h2>
            <p style="font-size: 13px; color: #767069; line-height: 1.6; margin: 0 0 24px;">
              Your fine jewellery creation is currently being prepared under strict BIS Hallmark certification and insured for priority courier dispatch.
            </p>

            <div style="background: #faf9f7; border: 1px solid #eae3d5; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #b8933f;">
                Insured Delivery Address
              </h3>
              <p style="margin: 0; font-size: 12.5px; color: #1c1208; line-height: 1.5;">
                ${data.shippingAddress.name || data.customerName}<br/>
                ${data.shippingAddress.street}${data.shippingAddress.locality ? `, ${data.shippingAddress.locality}` : ""}<br/>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}<br/>
                Phone: ${data.customerPhone}
              </p>
              ${
                data.trackingNumber
                  ? `<p style="margin: 8px 0 0; font-size: 12px; color: #b8933f; font-weight: 600;">
                      Air Waybill Tracking: ${data.trackingNumber} (BlueDart Air)
                    </p>`
                  : ""
              }
            </div>

            <h3 style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em;">Ordered Items</h3>
            <table class="table">
              <thead>
                <tr style="border-bottom: 1px solid #1c1208; text-align: left; font-size: 11px; text-transform: uppercase; color: #767069;">
                  <th style="padding-bottom: 8px;">Jewellery Item</th>
                  <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                  <th style="padding-bottom: 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <table style="width: 100%; margin-top: 20px; font-size: 13px;">
              <tr>
                <td style="color: #767069; padding: 4px 0;">Subtotal:</td>
                <td style="text-align: right; font-weight: 500;">₹${data.subtotal.toLocaleString("en-IN")}</td>
              </tr>
              ${
                data.discount > 0
                  ? `<tr>
                      <td style="color: #2f855a; padding: 4px 0;">Promotional Discount:</td>
                      <td style="text-align: right; color: #2f855a; font-weight: 500;">-₹${data.discount.toLocaleString("en-IN")}</td>
                    </tr>`
                  : ""
              }
              <tr>
                <td style="color: #767069; padding: 4px 0;">Insured Shipping:</td>
                <td style="text-align: right; font-weight: 500;">${data.shippingFee === 0 ? "FREE" : `₹${data.shippingFee}`}</td>
              </tr>
              <tr style="border-top: 1px solid #1c1208; font-size: 16px; font-weight: 700;">
                <td style="padding-top: 10px; color: #1c1208;">Total Paid:</td>
                <td style="padding-top: 10px; text-align: right; color: #b8933f;">₹${data.totalAmount.toLocaleString("en-IN")}</td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding: 12px; background: #fbf7ee; border-left: 3px solid #b8933f; font-size: 12px; color: #767069;">
              Payment Method: <strong style="color: #1c1208;">${data.paymentMethod}</strong> • 100% Insured Transit Guarantee Included.
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0 0 6px;">ZHAEVAAH Luxury Fine Jewellery • Mumbai, Maharashtra, India</p>
            <p style="margin: 0;">For concierge assistance, email <a href="mailto:concierge@zhaevaah.com" style="color: #b8933f;">concierge@zhaevaah.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Admin Notification Email HTML
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; background-color: #1c1208; margin: 0; padding: 24px; color: #1c1208; }
          .container { max-width: 620px; margin: 0 auto; background: #ffffff; border: 2px solid #b8933f; border-radius: 4px; overflow: hidden; }
          .header { background: #1c1208; color: #ffffff; padding: 28px 24px; border-bottom: 2px solid #b8933f; }
          .header h1 { margin: 0; font-size: 20px; letter-spacing: 0.15em; font-weight: 700; color: #b8933f; }
          .content { padding: 28px 24px; }
          .badge { display: inline-block; background: #1c1208; color: #b8933f; border: 1px solid #b8933f; padding: 6px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 2px; }
          .section { background: #faf9f7; border: 1px solid #eae3d5; border-radius: 4px; padding: 14px; margin: 16px 0; }
          .table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 12.5px; }
          .footer { background: #faf9f7; padding: 18px; text-align: center; font-size: 11px; color: #767069; border-top: 1px solid #eae3d5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👑 NEW ORDER ALERT • ZHAEVAAH</h1>
            <p style="margin: 6px 0 0; font-size: 12px; color: #eae3d5;">New customer order received for atelier processing</p>
          </div>
          <div class="content">
            <span class="badge">Order #${data.orderNumber} • ₹${data.totalAmount.toLocaleString("en-IN")}</span>

            <div class="section">
              <h3 style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #b8933f;">
                Customer Information
              </h3>
              <p style="margin: 0; font-size: 13px; line-height: 1.6;">
                <strong>Name:</strong> ${data.customerName}<br/>
                <strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a><br/>
                <strong>Phone:</strong> ${data.customerPhone}<br/>
                <strong>Payment Method:</strong> ${data.paymentMethod} (${data.paymentStatus || "PAID"})
              </p>
            </div>

            <div class="section">
              <h3 style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #b8933f;">
                Shipping Destination
              </h3>
              <p style="margin: 0; font-size: 12.5px; line-height: 1.5;">
                ${data.shippingAddress.name || data.customerName}<br/>
                ${data.shippingAddress.street}${data.shippingAddress.locality ? `, ${data.shippingAddress.locality}` : ""}<br/>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}
              </p>
            </div>

            <h3 style="margin: 20px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em;">Ordered Pieces</h3>
            <table class="table">
              <thead>
                <tr style="border-bottom: 1px solid #1c1208; text-align: left; font-size: 11px; text-transform: uppercase; color: #767069;">
                  <th style="padding-bottom: 6px;">Item</th>
                  <th style="padding-bottom: 6px; text-align: center;">Qty</th>
                  <th style="padding-bottom: 6px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 16px; text-align: right; font-size: 15px; font-weight: 700; color: #1c1208;">
              Total Order Value: <span style="color: #b8933f;">₹${data.totalAmount.toLocaleString("en-IN")}</span>
            </div>

            <div style="margin-top: 24px; text-align: center;">
              <a href="http://localhost:3001" style="display: inline-block; background: #b8933f; color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px;">
                Open Admin Orders Panel →
              </a>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0;">Automated notification sent to configured order receivers: ${adminRecipientsStr}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      // 1. Send confirmation to user
      const userMail = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: data.customerEmail,
        subject: `ZHAEVAAH Order Confirmation #${data.orderNumber}`,
        html: customerEmailHtml,
      });
      console.log(`[Mailer] Customer confirmation sent to ${data.customerEmail}: ${userMail.messageId}`);

      // 2. Send order notification to admin receivers
      const adminMail = await transporter.sendMail({
        from: `"${FROM_NAME} Alerts" <${FROM_EMAIL}>`,
        to: adminReceivers,
        subject: `👑 [NEW ORDER #${data.orderNumber}] ₹${data.totalAmount.toLocaleString("en-IN")} from ${data.customerName}`,
        html: adminEmailHtml,
      });
      console.log(`[Mailer] Admin order alert sent to [${adminRecipientsStr}]: ${adminMail.messageId}`);

      return { success: true, userMessageId: userMail.messageId, adminMessageId: adminMail.messageId };
    } catch (err: any) {
      console.error(`[Mailer] Error sending order emails:`, err.message);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`\n======================================================`);
    console.log(`[Mailer: Mock Mode] Order Confirmation & Admin Alert Prepared!`);
    console.log(`→ Customer: ${data.customerEmail}`);
    console.log(`→ Admin Receivers: ${adminRecipientsStr}`);
    console.log(`→ Order #${data.orderNumber} Total: ₹${data.totalAmount.toLocaleString("en-IN")}`);
    console.log(`======================================================\n`);
    return { success: true, mocked: true };
  }
};

// 2. Send Luxury Welcome Email to First-Time User
export const sendWelcomeEmail = async (data: { name: string; email: string }) => {
  const transporter = getTransporter();
  const userName = data.name || "Esteemed Client";

  const welcomeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; background-color: #faf9f7; margin: 0; padding: 24px; color: #1c1208; }
          .container { max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #eae3d5; border-radius: 4px; overflow: hidden; }
          .header { background: #1c1208; color: #ffffff; padding: 36px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 26px; letter-spacing: 0.25em; font-weight: 600; color: #b8933f; }
          .header p { margin: 8px 0 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #eae3d5; }
          .content { padding: 36px 28px; }
          .badge { display: inline-block; background: #fbf7ee; color: #b8933f; border: 1px solid #b8933f; padding: 6px 14px; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px; }
          .perk-box { background: #faf9f7; border: 1px solid #eae3d5; border-radius: 4px; padding: 18px; margin: 20px 0; }
          .footer { background: #faf9f7; padding: 24px; text-align: center; font-size: 11px; color: #767069; border-top: 1px solid #eae3d5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ZHAEVAAH</h1>
            <p>Haute Joaillerie & 18kt Fine Jewellery</p>
          </div>
          <div class="content">
            <span class="badge">Welcome to the Privilege Circle</span>
            <h2 style="font-size: 22px; margin: 20px 0 10px; color: #1c1208;">A Royal Welcome, ${userName}</h2>
            <p style="font-size: 13.5px; color: #6e675f; line-height: 1.7; margin: 0 0 20px;">
              It is our utmost pleasure to welcome you to the world of <strong>ZHAEVAAH</strong>. Every creation in our atelier is a masterpiece of natural brilliance, certified 18kt hallmarked gold, and meticulous artisan craftsmanship.
            </p>

            <div class="perk-box">
              <h3 style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #b8933f;">
                ✨ Your Exclusive Member Privileges
              </h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 12.5px; color: #1c1208; line-height: 1.8;">
                <li><strong>4,850 Welcome Privilege Points</strong> credited to your account for celebratory savings.</li>
                <li><strong>100% Insured Priority Transit</strong> via BlueDart Air for all pan-India orders.</li>
                <li><strong>Complimentary BIS Hallmarking</strong> and authentic IGI gemological certification.</li>
                <li><strong>Annual Ultrasonic Jewellery Cleaning</strong> and prong inspection on all atelier pieces.</li>
                <li><strong>Private Festive Previews</strong> for Akshaya Tritiya, Diwali, and bespoke launches.</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 32px 0 16px;">
              <a href="http://localhost:3000/shop" style="display: inline-block; background: #b8933f; color: #ffffff; text-decoration: none; padding: 14px 34px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; border-radius: 2px;">
                Explore Fine Collections →
              </a>
            </div>

            <p style="font-size: 12px; color: #767069; text-align: center; margin: 24px 0 0;">
              Have questions or need bespoke guidance? Call our Master Jeweller Concierge at <strong>+91 98201 54321</strong>.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 6px;">ZHAEVAAH Fine Jewellery Atelier • Mumbai, Maharashtra, India</p>
            <p style="margin: 0;">You received this email because you created an account with ZHAEVAAH.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: data.email,
        subject: `Welcome to the ZHAEVAAH Privilege Circle, ${userName}`,
        html: welcomeHtml,
      });
      console.log(`[Mailer] Welcome email sent to ${data.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error(`[Mailer] Error sending welcome email to ${data.email}:`, err.message);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`\n======================================================`);
    console.log(`[Mailer: Mock Mode] Welcome Email Prepared for First-Time User!`);
    console.log(`→ To: ${data.email} (${userName})`);
    console.log(`→ Subject: Welcome to the ZHAEVAAH Privilege Circle, ${userName}`);
    console.log(`======================================================\n`);
    return { success: true, mocked: true };
  }
};

// 3. Send Test Notification Email (from Admin Panel)
export const sendTestNotificationEmail = async (targetEmail: string) => {
  const transporter = getTransporter();
  const testHtml = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background: #faf9f7; padding: 24px;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #b8933f; padding: 24px; border-radius: 4px;">
          <h2 style="color: #b8933f; margin-top: 0;">ZHAEVAAH Email Test</h2>
          <p style="color: #1c1208; font-size: 13px;">
            This is a test notification confirming that the <strong>ZHAEVAAH Order Notification Service</strong> is properly configured and successfully transmitting emails.
          </p>
          <p style="color: #767069; font-size: 12px; margin-top: 20px;">
            Timestamp: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
          </p>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: targetEmail,
        subject: `ZHAEVAAH Notification Service: Test Email Succeeded`,
        html: testHtml,
      });
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  } else {
    return { success: true, mocked: true };
  }
};

// 4. Send Registration Verification OTP Email
export const sendVerificationOtpEmail = async (data: {
  email: string;
  name: string;
  otp: string;
}) => {
  const transporter = getTransporter();
  const userName = data.name || "Valued Client";

  const otpHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your ZHAEVAAH Account</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf9f7; margin: 0; padding: 24px 12px; color: #1c1208; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #eae3d5; border-radius: 3px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
          .header { background: #1c1208; padding: 32px 24px; text-align: center; border-bottom: 2px solid #b8933f; }
          .brand-title { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; }
          .brand-sub { font-size: 10px; color: #b8933f; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 6px; }
          .content { padding: 36px 32px; }
          .otp-badge { background: #faf6ee; border: 1.5px dashed #b8933f; border-radius: 4px; padding: 20px; text-align: center; margin: 28px 0; }
          .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #1c1208; font-family: 'Courier New', Courier, monospace; margin: 0; }
          .footer { background: #1c1208; padding: 24px; text-align: center; color: #8e8880; font-size: 11px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-title">ZHAEVAAH</h1>
            <div class="brand-sub">Fine Jewellery Atelier • Email Verification</div>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; font-weight: 600; color: #1c1208; margin-top: 0; margin-bottom: 12px;">
              Welcome to ZHAEVAAH, ${userName}
            </h2>
            <p style="font-size: 13.5px; line-height: 1.65; color: #4a453e; margin: 0 0 16px;">
              Thank you for initiating your membership with the ZHAEVAAH Atelier. To complete your luxury registration and verify your email address, please enter the one-time verification code below:
            </p>

            <div class="otp-badge">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #b8933f; margin-bottom: 8px; font-weight: 600;">One-Time Verification Code</div>
              <div class="otp-code">${data.otp}</div>
              <div style="font-size: 11.5px; color: #767069; margin-top: 8px;">Valid for <strong>10 minutes</strong>. Do not share this code with anyone.</div>
            </div>

            <p style="font-size: 12.5px; line-height: 1.6; color: #6e685f; margin: 20px 0 0;">
              If you did not request this registration, please disregard this email. Your account will not be activated without this verification code.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 6px;">ZHAEVAAH Fine Jewellery Atelier • Mumbai, Maharashtra, India</p>
            <p style="margin: 0;">Secured with 256-bit encryption. For concierge support, contact concierge@zhaevaah.com</p>
          </div>
        </div>
      </body>
    </html>
  `;

  console.log(`\n======================================================`);
  console.log(`[Mailer] REGISTRATION VERIFICATION OTP GENERATED`);
  console.log(`→ To: ${data.email} (${userName})`);
  console.log(`→ OTP: ${data.otp}`);
  console.log(`======================================================\n`);

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: data.email,
        subject: `Your ZHAEVAAH Verification Code: ${data.otp}`,
        html: otpHtml,
      });
      console.log(`[Mailer] Verification OTP email sent to ${data.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error(`[Mailer] Error sending verification OTP email to ${data.email}:`, err.message);
      return { success: false, error: err.message };
    }
  } else {
    return { success: true, mocked: true };
  }
};

// 5. Send Password Reset OTP Email
export const sendPasswordResetOtpEmail = async (data: {
  email: string;
  name: string;
  otp: string;
}) => {
  const transporter = getTransporter();
  const userName = data.name || "Valued Client";

  const resetHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your ZHAEVAAH Password</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf9f7; margin: 0; padding: 24px 12px; color: #1c1208; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #eae3d5; border-radius: 3px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
          .header { background: #1c1208; padding: 32px 24px; text-align: center; border-bottom: 2px solid #b8933f; }
          .brand-title { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; }
          .brand-sub { font-size: 10px; color: #b8933f; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 6px; }
          .content { padding: 36px 32px; }
          .otp-badge { background: #faf6ee; border: 1.5px dashed #b8933f; border-radius: 4px; padding: 20px; text-align: center; margin: 28px 0; }
          .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #1c1208; font-family: 'Courier New', Courier, monospace; margin: 0; }
          .footer { background: #1c1208; padding: 24px; text-align: center; color: #8e8880; font-size: 11px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-title">ZHAEVAAH</h1>
            <div class="brand-sub">Fine Jewellery Atelier • Security Notification</div>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; font-weight: 600; color: #1c1208; margin-top: 0; margin-bottom: 12px;">
              Password Reset Request, ${userName}
            </h2>
            <p style="font-size: 13.5px; line-height: 1.65; color: #4a453e; margin: 0 0 16px;">
              We received a request to reset the password for your ZHAEVAAH client account. Please enter the verification code below to verify your identity and set a new password:
            </p>

            <div class="otp-badge">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #b8933f; margin-bottom: 8px; font-weight: 600;">Password Reset Code</div>
              <div class="otp-code">${data.otp}</div>
              <div style="font-size: 11.5px; color: #767069; margin-top: 8px;">Valid for <strong>10 minutes</strong>. Never share this code.</div>
            </div>

            <p style="font-size: 12.5px; line-height: 1.6; color: #6e685f; margin: 20px 0 0;">
              If you did not initiate this request, your account is secure and you may safely ignore this email. No changes will be made to your account.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 6px;">ZHAEVAAH Fine Jewellery Atelier • Mumbai, Maharashtra, India</p>
            <p style="margin: 0;">For immediate security assistance, contact security@zhaevaah.com</p>
          </div>
        </div>
      </body>
    </html>
  `;

  console.log(`\n======================================================`);
  console.log(`[Mailer] PASSWORD RESET OTP GENERATED`);
  console.log(`→ To: ${data.email} (${userName})`);
  console.log(`→ OTP: ${data.otp}`);
  console.log(`======================================================\n`);

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: data.email,
        subject: `Your ZHAEVAAH Password Reset Code: ${data.otp}`,
        html: resetHtml,
      });
      console.log(`[Mailer] Password reset OTP email sent to ${data.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error(`[Mailer] Error sending reset OTP email to ${data.email}:`, err.message);
      return { success: false, error: err.message };
    }
  } else {
    return { success: true, mocked: true };
  }
};

// 6. Send Sign-In / Login Verification OTP Email
export const sendLoginOtpEmail = async (data: {
  email: string;
  name: string;
  otp: string;
}) => {
  const transporter = getTransporter();
  const userName = data.name || "Valued Client";

  const loginHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ZHAEVAAH Sign-In Code</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf9f7; margin: 0; padding: 24px 12px; color: #1c1208; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #eae3d5; border-radius: 3px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
          .header { background: #1c1208; padding: 32px 24px; text-align: center; border-bottom: 2px solid #b8933f; }
          .brand-title { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; }
          .brand-sub { font-size: 10px; color: #b8933f; letter-spacing: 0.18em; text-transform: uppercase; margin-top: 6px; }
          .content { padding: 36px 32px; }
          .otp-badge { background: #faf6ee; border: 1.5px dashed #b8933f; border-radius: 4px; padding: 20px; text-align: center; margin: 28px 0; }
          .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #1c1208; font-family: 'Courier New', Courier, monospace; margin: 0; }
          .footer { background: #1c1208; padding: 24px; text-align: center; color: #8e8880; font-size: 11px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-title">ZHAEVAAH</h1>
            <div class="brand-sub">Fine Jewellery Atelier • Security Verification</div>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; font-weight: 600; color: #1c1208; margin-top: 0; margin-bottom: 12px;">
              Welcome Back, ${userName}
            </h2>
            <p style="font-size: 13.5px; line-height: 1.65; color: #4a453e; margin: 0 0 16px;">
              A sign-in attempt was initiated for your ZHAEVAAH account. To complete your login and protect your account, please enter this one-time verification code:
            </p>

            <div class="otp-badge">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #b8933f; margin-bottom: 8px; font-weight: 600;">Sign-In Verification Code</div>
              <div class="otp-code">${data.otp}</div>
              <div style="font-size: 11.5px; color: #767069; margin-top: 8px;">Valid for <strong>10 minutes</strong>. Never share this code.</div>
            </div>

            <p style="font-size: 12.5px; line-height: 1.6; color: #6e685f; margin: 20px 0 0;">
              If you did not attempt to sign in, please secure your account immediately or notify our concierge at concierge@zhaevaah.com.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 6px;">ZHAEVAAH Fine Jewellery Atelier • Mumbai, Maharashtra, India</p>
            <p style="margin: 0;">Secured with 256-bit bank encryption.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  console.log(`\n======================================================`);
  console.log(`[Mailer] LOGIN VERIFICATION OTP GENERATED`);
  console.log(`→ To: ${data.email} (${userName})`);
  console.log(`→ OTP: ${data.otp}`);
  console.log(`======================================================\n`);

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: data.email,
        subject: `Your ZHAEVAAH Sign-In Code: ${data.otp}`,
        html: loginHtml,
      });
      console.log(`[Mailer] Login OTP email sent to ${data.email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error(`[Mailer] Error sending login OTP email to ${data.email}:`, err.message);
      return { success: false, error: err.message };
    }
  } else {
    return { success: true, mocked: true };
  }
};
