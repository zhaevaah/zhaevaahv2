"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Toast() {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className="bg-[#1C1208] text-white px-5 py-3.5 rounded-xs shadow-xl flex items-center gap-3 border border-[#B8933F]/30 max-w-sm">
        <CheckCircle2 className="w-5 h-5 text-[#B8933F] flex-shrink-0" />
        <p className="text-xs sm:text-[13px] font-normal leading-snug">
          {toastMessage}
        </p>
      </div>
    </div>
  );
}

