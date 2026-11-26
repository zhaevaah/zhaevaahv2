"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { X, Printer, Download, ShieldCheck, CheckCircle2, Award, FileText } from "lucide-react";

interface InvoiceOrderItem {
  id: string;
  name: string;
  specs?: string;
  price: string;
  qty: number;
  image?: string;
}

interface InvoiceOrder {
  id: string;
  orderNumber?: string;
  date: string;
  total: string;
  totalAmount?: number;
  paymentMethod?: string;
  status?: string;
  carrier?: string;
  trackingNumber?: string;
  shippingAddress?: any;
  items: InvoiceOrderItem[];
}

interface OrderInvoiceModalProps {
  order: InvoiceOrder | null;
  user?: any;
  isOpen: boolean;
  onClose: () => void;
}

function numberToWordsINR(amount: number): string {
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (amount === 0) return "Zero Rupees Only";

  function convertTwoDigits(n: number): string {
    if (n < 10) return units[n];
    if (n >= 10 && n < 20) return teens[n - 10];
    return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    const hundredStr = hundred > 0 ? `${units[hundred]} Hundred ` : "";
    const restStr = rest > 0 ? convertTwoDigits(rest) : "";
    return `${hundredStr}${restStr}`.trim();
  }

  const crores = Math.floor(amount / 10000000);
  amount %= 10000000;
  const lakhs = Math.floor(amount / 100000);
  amount %= 100000;
  const thousands = Math.floor(amount / 1000);
  amount %= 1000;
  const remaining = Math.floor(amount);

  let result = "";
  if (crores > 0) result += `${convertTwoDigits(crores)} Crore `;
  if (lakhs > 0) result += `${convertTwoDigits(lakhs)} Lakh `;
  if (thousands > 0) result += `${convertTwoDigits(thousands)} Thousand `;
  if (remaining > 0) result += `${convertThreeDigits(remaining)} `;

  return `${result.trim()} Rupees Only`;
}

export default function OrderInvoiceModal({
  order,
  user,
  isOpen,
  onClose,
}: OrderInvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const rawTotal =
    order.totalAmount ||
    parseInt((order.total || "").replace(/[^0-9]/g, ""), 10) ||
    24999;

  // 3% GST on Fine Jewellery in India (1.5% CGST + 1.5% SGST)
  const taxableSubtotal = Math.round((rawTotal / 1.03) * 100) / 100;
  const totalGst = Math.round((rawTotal - taxableSubtotal) * 100) / 100;
  const halfGst = Math.round((totalGst / 2) * 100) / 100;

  const orderNum = order.orderNumber || order.id || "ZH-46524";
  const customerName =
    order.shippingAddress?.name ||
    order.shippingAddress?.fullName ||
    user?.name ||
    "Valued Patron";

  const customerPhone =
    order.shippingAddress?.phone || user?.phone || "+91 98765 43210";
  const customerEmail = user?.email || "customer@zhaevaah.com";

  const fullAddress = order.shippingAddress
    ? [
        order.shippingAddress.street || order.shippingAddress.addressLine1,
        order.shippingAddress.locality || order.shippingAddress.addressLine2,
        order.shippingAddress.city,
        order.shippingAddress.state,
        order.shippingAddress.pincode || order.shippingAddress.postalCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "Bandra West, Mumbai, Maharashtra 400050";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-[#1C1208] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-[#B8933F]/30 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#B8933F]" />
            <span className="font-montserrat text-xs sm:text-sm font-semibold tracking-wide">
              Official Tax Invoice • Order #{orderNum}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B8933F] hover:bg-[#9E792B] text-white text-[11px] sm:text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FAF9F7]">
          <div
            id="invoice-printable-area"
            ref={printRef}
            className="bg-white border border-[#EAE3D5] rounded-xl p-5 sm:p-8 md:p-10 text-[#1C1208] shadow-sm font-poppins text-xs"
          >
            {/* Header: Brand & Invoice Meta */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-[#1C1208]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#1C1208] tracking-widest">
                    ZHAEVAAH
                  </span>
                </div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#B8933F]">
                  Atelier of Fine Jewellery & BIS Hallmarked Gold
                </p>
                <div className="text-[10px] text-[#6E675F] leading-tight mt-1.5 space-y-0.5">
                  <p>ZHAEVAAH LUXURY ATELIER PVT. LTD.</p>
                  <p>Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051</p>
                  <p>GSTIN: <span className="font-mono font-semibold text-[#1C1208]">27AAACZ1234F1Z8</span> • CIN: U36911MH2024PTC123456</p>
                  <p>BIS Hallmark Reg No: <span className="font-mono">BIS-HM-750-98421</span></p>
                </div>
              </div>

              <div className="sm:text-right bg-[#FAF8F5] sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none w-full sm:w-auto border sm:border-0 border-[#EAE3D5]">
                <span className="inline-block bg-[#1C1208] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full mb-2">
                  Tax Invoice / Cash Memo
                </span>
                <p className="font-mono text-sm sm:text-base font-bold text-[#1C1208]">
                  INV-{orderNum}
                </p>
                <p className="text-[11px] text-[#767069] mt-0.5">
                  Invoice Date: <span className="font-semibold text-[#1C1208]">{order.date}</span>
                </p>
                <p className="text-[11px] text-[#767069]">
                  Order ID: <span className="font-mono font-semibold text-[#1C1208]">#{orderNum}</span>
                </p>
                <p className="text-[10px] text-[#2E7D32] font-semibold mt-1 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" />
                  <span>PAID • Razorpay Verified</span>
                </p>
              </div>
            </div>

            {/* Billed To & Logistics Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-5 border-b border-[#EAE3D5]">
              {/* Customer */}
              <div className="bg-[#FAF9F7] p-3.5 rounded-lg border border-[#EAE3D5]">
                <span className="text-[9.5px] uppercase font-bold tracking-wider text-[#B8933F] block mb-1">
                  Billed & Shipped To (Recipient)
                </span>
                <p className="font-semibold text-[13px] text-[#1C1208]">{customerName}</p>
                <p className="text-[#6E675F] text-[11px] mt-0.5 leading-relaxed">{fullAddress}</p>
                <p className="text-[11px] text-[#767069] mt-1.5 font-mono">
                  Phone: {customerPhone} • Email: {customerEmail}
                </p>
                <p className="text-[10px] text-[#8C827A] mt-0.5">
                  Place of Supply: Maharashtra (State Code 27)
                </p>
              </div>

              {/* Logistics & Security */}
              <div className="bg-[#FAF9F7] p-3.5 rounded-lg border border-[#EAE3D5]">
                <span className="text-[9.5px] uppercase font-bold tracking-wider text-[#B8933F] block mb-1">
                  Insured Armored Logistics
                </span>
                <p className="font-semibold text-xs text-[#1C1208]">
                  Carrier: {order.carrier || "BlueDart Air Express Priority"}
                </p>
                <p className="text-[#6E675F] text-[11px] font-mono mt-0.5">
                  AWB Tracking: <span className="font-bold text-[#1C1208]">{order.trackingNumber || "BLUEDART-AIR-943697"}</span>
                </p>
                <p className="text-[11px] text-[#6E675F] mt-1">
                  Payment Mode: <span className="font-medium text-[#1C1208]">{order.paymentMethod || "Prepaid (Razorpay Gateway)"}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#C8E6C9]">
                    <ShieldCheck className="w-3 h-3" /> 100% Transit Insured
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-[#B8933F] bg-[#FAF6EE] px-2 py-0.5 rounded-full border border-[#B8933F]/30">
                    <Award className="w-3 h-3" /> 18kt BIS 750
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-5 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1C1208] text-[10px] uppercase font-bold text-[#767069] tracking-wider">
                    <th className="py-2.5 px-2">#</th>
                    <th className="py-2.5 px-2">Description of Jewellery</th>
                    <th className="py-2.5 px-2 text-center">HSN</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-right">Unit Rate (₹)</th>
                    <th className="py-2.5 px-2 text-right">Total Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D5] text-[11px]">
                  {order.items.map((item, index) => {
                    const itemPriceNum =
                      parseInt((item.price || "").replace(/[^0-9]/g, ""), 10) ||
                      Math.round(rawTotal / (order.items.length || 1));

                    return (
                      <tr key={item.id + index} className="even:bg-[#FAF9F7]">
                        <td className="py-3 px-2 font-mono text-[#767069]">{index + 1}</td>
                        <td className="py-3 px-2">
                          <p className="font-semibold text-xs text-[#1C1208]">{item.name}</p>
                          <p className="text-[10px] text-[#6E675F] mt-0.5">
                            {item.specs || "18kt Yellow Gold • Natural Diamond • BIS Hallmarked 750"}
                          </p>
                        </td>
                        <td className="py-3 px-2 text-center font-mono text-[#767069]">7113</td>
                        <td className="py-3 px-2 text-center font-semibold text-[#1C1208]">{item.qty || 1}</td>
                        <td className="py-3 px-2 text-right font-mono text-[#1C1208]">
                          ₹{itemPriceNum.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-bold text-[#1C1208]">
                          ₹{(itemPriceNum * (item.qty || 1)).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Summary & Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-4 border-t-2 border-[#1C1208] items-start">
              {/* Left Column: In Words & Terms */}
              <div className="sm:col-span-7 space-y-3">
                <div>
                  <span className="text-[9.5px] uppercase font-bold tracking-wider text-[#767069] block mb-0.5">
                    Invoice Total (in words):
                  </span>
                  <p className="font-medium text-[11.5px] text-[#1C1208] italic">
                    {numberToWordsINR(rawTotal)}
                  </p>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#EAE3D5] text-[10px] text-[#6E675F] space-y-1">
                  <p className="font-bold text-[#1C1208] uppercase tracking-wider text-[9.5px]">
                    Atelier Quality & Hallmarking Guarantee:
                  </p>
                  <p>1. All gold articles are 100% BIS Hallmarked (750 / 18KT) with unique HUID as mandated by Govt of India.</p>
                  <p>2. Natural diamonds are certified under strict international gemological laboratory grading standards.</p>
                  <p>3. 15-day complimentary resizing & exchange against original tax invoice & certification card.</p>
                </div>
              </div>

              {/* Right Column: Calculations */}
              <div className="sm:col-span-5 bg-[#FAF9F7] p-3.5 rounded-lg border border-[#EAE3D5] space-y-2">
                <div className="flex justify-between text-[11px] text-[#6E675F]">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono text-[#1C1208]">₹{taxableSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#6E675F]">
                  <span>CGST (1.5%):</span>
                  <span className="font-mono text-[#1C1208]">₹{halfGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#6E675F]">
                  <span>SGST (1.5%):</span>
                  <span className="font-mono text-[#1C1208]">₹{halfGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#2E7D32]">
                  <span>Armored Express Delivery:</span>
                  <span className="font-semibold uppercase text-[10px]">FREE (Insured)</span>
                </div>

                <div className="pt-2 border-t border-[#DDD5C7] flex justify-between items-center">
                  <span className="font-bold text-xs uppercase tracking-wide text-[#1C1208]">Grand Total:</span>
                  <span className="font-serif-luxury text-base sm:text-lg font-extrabold text-[#B8933F] font-mono">
                    ₹{rawTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Signatory & Official Stamp Footer */}
            <div className="pt-6 mt-4 border-t border-[#EAE3D5] flex flex-col sm:flex-row justify-between items-end gap-4 text-[10px] text-[#767069]">
              <div className="text-left w-full sm:w-auto">
                <p>E. & O.E. • This is a computer generated, authenticated tax invoice.</p>
                <p className="mt-0.5 text-[#B8933F]">ZHAEVAAH Fine Jewellery Atelier • support@zhaevaah.com</p>
              </div>

              <div className="text-center sm:text-right border border-[#DDD5C7] p-2.5 rounded-lg bg-[#FAF8F5] min-w-[200px]">
                <p className="font-semibold text-[#1C1208]">For ZHAEVAAH LUXURY ATELIER PVT. LTD.</p>
                <div className="my-2 h-7 flex items-center justify-center sm:justify-end">
                  <span className="font-serif-luxury italic text-[#B8933F] text-xs font-bold border-b border-[#B8933F] px-4">
                    Authorized Signatory
                  </span>
                </div>
                <p className="text-[9px] text-[#8C827A]">Digitally Signed & Validated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
