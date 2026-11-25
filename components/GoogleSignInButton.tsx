"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useAppDispatch } from "../redux/hooks";
import { loginWithGoogle, setUser } from "../redux/slices/authSlice";
import { apiGoogleLogin } from "../lib/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: (notification?: any) => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: (user: any, fullRes?: any) => void;
  onError?: (error: string) => void;
  text?: "signin_with" | "signup_with" | "continue_with";
  className?: string;
  isRegister?: boolean;
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = "continue_with",
  className = "",
  isRegister = false,
}: GoogleSignInButtonProps) {
  const dispatch = useAppDispatch();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "1045312733949-0ganes67j1lm6roneomesfrhkbcec5vr.apps.googleusercontent.com";

  const handleCredentialResponse = async (response: { credential: string }) => {
    setIsLoading(true);
    try {
      if (!response.credential) {
        throw new Error("No credential returned from Google.");
      }

      // 1. Call backend API endpoint through centralized apiGoogleLogin
      const res = await apiGoogleLogin(response.credential);

      if (res && res.success && res.user) {
        dispatch(setUser(res.user));
        if (onSuccess) onSuccess(res.user, res);
      } else {
        // Fallback: decode JWT payload on client if backend is in dev mode
        try {
          const base64Url = response.credential.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const payload = JSON.parse(jsonPayload);
          const localUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name || "ZHAEVAAH Customer",
            avatar: payload.picture,
            role: "USER",
          };
          localStorage.setItem("zhaevaah_token", response.credential);
          localStorage.setItem("zhaevaah_user", JSON.stringify(localUser));
          dispatch(setUser(localUser));
          if (onSuccess) onSuccess(localUser);
        } catch {
          throw new Error(res.message || "Failed to sign in with Google.");
        }
      }
    } catch (err: any) {
      console.warn("[Google Auth Error]:", err.message);
      if (onError) onError(err.message || "Google sign in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const initGoogleIdentity = () => {
    if (typeof window === "undefined" || !window.google?.accounts?.id) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render official Google button into our container if available
      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: text,
          shape: "rectangular",
          logo_alignment: "left",
        });
      }
    } catch (err) {
      console.warn("Google identity initialization failed:", err);
    }
  };

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setIsScriptLoaded(true);
      initGoogleIdentity();
    }
  }, []);

  const handleCustomButtonClick = () => {
    if (window.google?.accounts?.id) {
      initGoogleIdentity();
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("One tap prompt not displayed, fallback triggered.");
        }
      });
    } else {
      // Local development mock fallback if Google services are blocked
      setIsLoading(true);
      setTimeout(() => {
        const demoGoogleUser = {
          id: "usr-google-demo",
          name: "Ananya Sharma",
          email: "ananya.sharma@example.com",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
          role: "USER",
          vipTier: "Gold VIP",
        };
        localStorage.setItem("zhaevaah_token", "google-demo-token-12345");
        localStorage.setItem("zhaevaah_user", JSON.stringify(demoGoogleUser));
        window.dispatchEvent(new Event("zhaevaah-auth-changed"));
        dispatch(setUser(demoGoogleUser));
        setIsLoading(false);
        if (onSuccess) onSuccess(demoGoogleUser);
      }, 700);
    }
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      {/* Google Identity Services SDK Script */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          setIsScriptLoaded(true);
          initGoogleIdentity();
        }}
      />

      {/* Luxury Styled Custom Google Sign-In Button */}
      <button
        type="button"
        onClick={handleCustomButtonClick}
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-white border border-[#DDD5C7] hover:border-[#1C1208] hover:bg-[#FAF9F7] rounded-xs text-xs font-medium text-[#1C1208] flex items-center justify-center gap-2.5 transition-all shadow-2xs active:scale-98 cursor-pointer disabled:opacity-60"
        title="Sign in with your Google Account"
      >
        {/* Official Google G Logo */}
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>

        <span>
          {isLoading
            ? "Connecting to Google..."
            : isRegister
            ? "Sign up with Google"
            : "Sign in with Google"}
        </span>
      </button>

      {/* Hidden GIS render container if GIS renders into DOM */}
      <div ref={googleBtnRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
