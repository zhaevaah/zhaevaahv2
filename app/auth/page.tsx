"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  AlertCircle,
  Mail,
  KeyRound,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  apiLogin,
  apiRegister,
  apiVerifyRegistrationOtp,
  apiResendVerificationOtp,
  apiVerifyLoginOtp,
  apiResendLoginOtp,
  apiForgotPassword,
  apiResetPassword,
  apiCompleteProfile,
} from "../../lib/api";
import GoogleSignInButton from "../../components/GoogleSignInButton";

type AuthMode =
  | "login"
  | "register"
  | "verify-registration"
  | "verify-login-otp"
  | "complete-profile"
  | "forgot-password"
  | "reset-password";

interface CarouselSlide {
  id: number;
  image: string;
  tagline: string;
}

const AUTH_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    image: "/images/hero_woman.jpg",
    tagline: "Timeless Golden Brilliance",
  },
  {
    id: 2,
    image: "/images/drop_cut_blue_banner.jpg",
    tagline: "The Sapphire Drop Edit",
  },
  {
    id: 3,
    image: "/images/ZhaevaahHero.jpg",
    tagline: "Certified Diamond Elegance",
  },
  {
    id: 4,
    image: "/images/collection.webp",
    tagline: "Royal Heritage Masterpieces",
  },
];

export default function AuthPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  // Route Protection: If already logged in, redirect away from /auth to home (/)
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("zhaevaah_token") : null;
    const user = typeof window !== "undefined" ? localStorage.getItem("zhaevaah_user") : null;

    if (token === "demo-token-12345") {
      localStorage.removeItem("zhaevaah_token");
      localStorage.removeItem("zhaevaah_user");
      setIsCheckingAuth(false);
      return;
    }

    if (token && user) {
      router.replace("/");
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Female");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // OTP states
  const [loginOtp, setLoginOtp] = useState("");
  const [registrationOtp, setRegistrationOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Visibility & UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Carousel
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-slide carousel on right half
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % AUTH_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const clearMessages = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  // 1. Handle Login Submit (Email + Password -> OTP)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    try {
      const res = await apiLogin(email, password);
      if (res.success && res.requiresOtp) {
        // Requires OTP verification to complete sign-in
        setSuccessMsg(
          res.message ||
            `A 6-digit verification code has been sent to ${email}.`
        );
        setAuthMode("verify-login-otp");
        setResendCooldown(60);
      } else if (res.success && res.token) {
        // Direct sign-in without OTP (e.g. testing account admin@zhaevaah.com)
        setSuccessMsg("Logged in successfully! Redirecting...");
        setTimeout(() => router.push("/profile"), 1000);
      } else if (res.requiresVerification) {
        // User account email unverified
        setErrorMsg(
          res.message ||
            "Your email address is not verified yet. We have sent a verification code to your email."
        );
        setAuthMode("verify-registration");
        setResendCooldown(60);
      } else {
        setErrorMsg(res.message || "Invalid email or password.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify Login OTP
  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!loginOtp || loginOtp.trim().length < 6) {
      setErrorMsg("Please enter the complete 6-digit login verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiVerifyLoginOtp({
        email,
        otp: loginOtp.trim(),
      });
      if (res.success) {
        setSuccessMsg("Verification successful! Welcome to ZHAEVAAH.");
        setTimeout(() => router.push("/profile"), 1000);
      } else {
        setErrorMsg(res.message || "Invalid or expired verification code.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify login code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resend Login OTP
  const handleResendLoginOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    clearMessages();
    setIsLoading(true);

    try {
      const res = await apiResendLoginOtp(email);
      if (res.success) {
        setSuccessMsg(res.message || `A fresh login code has been sent to ${email}.`);
        setResendCooldown(60);
      } else {
        setErrorMsg(res.message || "Failed to resend login code.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error resending login code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Auth callback (handles existing vs new user missing phone/dob/gender)
  const handleGoogleSuccess = (u: any, fullRes?: any) => {
    const isMissingDetails =
      !u.phone || !u.dateOfBirth || !u.gender || fullRes?.requiresProfileCompletion;

    if (isMissingDetails) {
      if (u.email) setEmail(u.email);
      if (u.name) setName(u.name);
      if (u.phone) setPhone(u.phone);
      if (u.gender) setGender(u.gender);
      if (u.dateOfBirth) setDateOfBirth(u.dateOfBirth);
      setAuthMode("complete-profile");
      setSuccessMsg("Please provide your phone number, gender, and date of birth to complete your atelier profile.");
    } else {
      setSuccessMsg(`Welcome, ${u.name}! Redirecting...`);
      setTimeout(() => router.push("/profile"), 1000);
    }
  };

  // Handle Profile Completion (for Google users or updated users)
  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!phone || !phone.trim()) {
      setErrorMsg("Please enter your contact phone number.");
      return;
    }
    if (!dateOfBirth) {
      setErrorMsg("Please enter your date of birth for privilege gifts.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiCompleteProfile({
        email,
        phone: phone.trim(),
        gender,
        dateOfBirth,
      });

      if (res.success) {
        setSuccessMsg("Atelier profile updated! Welcome to ZHAEVAAH.");
        setTimeout(() => router.push("/profile"), 1000);
      } else {
        setErrorMsg(res.message || "Failed to save profile details.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    try {
      const res = await apiRegister({
        name,
        email,
        password,
        phone,
        gender,
        dateOfBirth,
      });
      if (res.success && res.requiresVerification) {
        setSuccessMsg(
          res.message ||
            `A 6-digit verification code has been sent to ${email}. Please enter it below.`
        );
        setAuthMode("verify-registration");
        setResendCooldown(60);
      } else if (res.success) {
        setSuccessMsg("Registration successful! Redirecting...");
        setTimeout(() => router.push("/profile"), 1000);
      } else {
        setErrorMsg(res.message || "Registration failed. Please check your details.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Verify Registration OTP
  const handleVerifyRegistrationOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!registrationOtp || registrationOtp.trim().length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiVerifyRegistrationOtp({
        email,
        otp: registrationOtp.trim(),
      });
      if (res.success) {
        setSuccessMsg("Email verified successfully! Welcome to ZHAEVAAH.");
        setTimeout(() => router.push("/profile"), 1000);
      } else {
        setErrorMsg(res.message || "Invalid or expired verification code.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify registration code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Registration OTP
  const handleResendRegistrationOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    clearMessages();
    setIsLoading(true);

    try {
      const res = await apiResendVerificationOtp(email);
      if (res.success) {
        setSuccessMsg(res.message || `A new verification code has been sent to ${email}.`);
        setResendCooldown(60);
      } else {
        setErrorMsg(res.message || "Failed to resend code.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error resending verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Forgot Password (Send OTP)
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiForgotPassword(email);
      if (res.success) {
        setSuccessMsg(res.message || `Password reset code sent to ${email}.`);
        setAuthMode("reset-password");
        setResendCooldown(60);
      } else {
        setErrorMsg(res.message || "No account found with this email address.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process forgot password request.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Handle Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!resetOtp || resetOtp.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit reset code sent to your email.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg("New passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiResetPassword({
        email,
        otp: resetOtp.trim(),
        newPassword,
      });

      if (res.success) {
        setSuccessMsg(
          "Your password has been reset successfully! You can now log in with your new password."
        );
        setPassword("");
        setResetOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => {
          setAuthMode("login");
          clearMessages();
        }, 1800);
      } else {
        setErrorMsg(res.message || "Failed to reset password. Please check the code.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while resetting password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#16120E] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B8933F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#16120E] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-poppins relative overflow-hidden">
      {/* Subtle luxury ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#B8933F]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#C38B75]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Auth Container Card */}
      <div className="w-full max-w-[880px] bg-white rounded-xs shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 min-h-[580px]">
        {/* ── Left Half: Form ── */}
        <div className="p-6 sm:p-9 lg:p-11 flex flex-col justify-between relative bg-white">
          {/* Top Header bar inside card */}
          <div className="flex items-center justify-between mb-3">
            {authMode !== "login" && authMode !== "register" ? (
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setAuthMode("login");
                }}
                className="flex items-center gap-1.5 text-xs text-[#767069] hover:text-[#B8933F] transition-colors"
                aria-label="Back to login"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Log In</span>
              </button>
            ) : (
              <Link
                href="/"
                className="p-1.5 -ml-1.5 text-[#1C1208] hover:text-[#B8933F] transition-colors rounded-full"
                aria-label="Back to home"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </Link>
            )}

            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#B8933F]">
              ZHAEVAAH
            </span>
          </div>

          <div className="my-auto py-2">
            {/* Success Feedback Alert */}
            {successMsg && (
              <div className="mb-4 p-3 bg-[#FAF6EE] border border-[#B8933F]/40 text-[#B8933F] text-xs rounded-xs flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#B8933F] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* Error Feedback Alert */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-[#FFF5F2] border border-red-200 text-red-700 text-xs rounded-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* ════════════ VIEW 1: LOGIN ════════════ */}
            {authMode === "login" && (
              <>
                <h1 className="font-montserrat text-2xl sm:text-[28px] font-semibold text-[#1C1208] tracking-tight mb-1">
                  Welcome Back
                </h1>
                <p className="font-poppins text-xs text-[#6E675F] font-light mb-5">
                  Enter your email and password to access your luxury account.
                </p>

                {/* Log in with Google Button */}
                <div className="mb-4">
                  <GoogleSignInButton
                    isRegister={false}
                    onSuccess={handleGoogleSuccess}
                    onError={(err) => {
                      setErrorMsg(err);
                    }}
                  />
                </div>

                {/* Divider "Or" */}
                <div className="relative flex items-center justify-center mb-4">
                  <div className="border-t border-[#EAE3D5] w-full" />
                  <span className="bg-white px-3 text-[11px] text-[#A89F95] uppercase tracking-wider">
                    Or
                  </span>
                  <div className="border-t border-[#EAE3D5] w-full" />
                </div>

                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email Address"
                      required
                      className="w-full px-3.5 py-2.5 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full px-3.5 py-2.5 pr-10 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#1C1208]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 stroke-[1.8]" />
                      ) : (
                        <Eye className="w-4 h-4 stroke-[1.8]" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setAuthMode("forgot-password");
                      }}
                      className="text-[11px] text-[#767069] hover:text-[#B8933F] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#1C1208] hover:bg-[#33281d] text-white text-xs uppercase font-medium tracking-[0.18em] rounded-xs shadow-sm transition-all active:scale-98 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isLoading ? "Signing in..." : "Log in"}</span>
                  </button>
                </form>
              </>
            )}

            {/* ════════════ VIEW 2: REGISTER ════════════ */}
            {authMode === "register" && (
              <>
                <h1 className="font-montserrat text-2xl sm:text-[28px] font-semibold text-[#1C1208] tracking-tight mb-1">
                  Create Account
                </h1>
                <p className="font-poppins text-xs text-[#6E675F] font-light mb-4">
                  Enter your details to register. An OTP will be sent to verify your email.
                </p>

                {/* Google Sign In */}
                <div className="mb-4">
                  <GoogleSignInButton
                    isRegister={true}
                    onSuccess={handleGoogleSuccess}
                    onError={(err) => {
                      setErrorMsg(err);
                    }}
                  />
                </div>

                {/* Divider "Or" */}
                <div className="relative flex items-center justify-center mb-3">
                  <div className="border-t border-[#EAE3D5] w-full" />
                  <span className="bg-white px-3 text-[11px] text-[#A89F95] uppercase tracking-wider">
                    Or
                  </span>
                  <div className="border-t border-[#EAE3D5] w-full" />
                </div>

                <form onSubmit={handleRegister} className="space-y-2.5">
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                      className="w-full px-3.5 py-2 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="w-full px-3.5 py-2 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] focus:outline-none transition-colors"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Unspecified">Prefer Not to Say</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                        title="Date of Birth"
                        className="w-full px-3 py-2 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number (+91)"
                      required
                      className="w-full px-3.5 py-2 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create Password (min. 8 characters)"
                      required
                      minLength={8}
                      className="w-full px-3.5 py-2 pr-10 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#1C1208]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 stroke-[1.8]" />
                      ) : (
                        <Eye className="w-4 h-4 stroke-[1.8]" />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#1C1208] hover:bg-[#33281d] text-white text-xs uppercase font-medium tracking-[0.18em] rounded-xs shadow-sm transition-all active:scale-98 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-1"
                  >
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isLoading ? "Sending verification code..." : "Register & Send OTP"}</span>
                  </button>
                </form>
              </>
            )}

            {/* ════════════ VIEW 3: VERIFY REGISTRATION OTP ════════════ */}
            {authMode === "verify-registration" && (
              <>
                <div className="w-12 h-12 rounded-full bg-[#FAF6EE] border border-[#B8933F]/40 flex items-center justify-center text-[#B8933F] mb-3">
                  <Mail className="w-6 h-6" />
                </div>
                <h1 className="font-montserrat text-2xl font-semibold text-[#1C1208] tracking-tight mb-1">
                  Verify Your Email
                </h1>
                <p className="font-poppins text-xs text-[#6E675F] font-light mb-4">
                  We sent a 6-digit verification code to{" "}
                  <strong className="text-[#1C1208] font-medium">{email}</strong>. Enter it
                  below to activate your account.
                </p>

                <form onSubmit={handleVerifyRegistrationOtp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#767069] font-medium mb-1.5">
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={registrationOtp}
                      onChange={(e) => setRegistrationOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      required
                      autoFocus
                      className="w-full px-4 py-3 bg-[#F6F6F6] border border-[#EAE3D5] focus:border-[#B8933F] rounded-xs text-center text-xl font-mono tracking-[8px] font-bold text-[#1C1208] placeholder:text-[#BBB] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || registrationOtp.length < 6}
                    className="w-full py-3 bg-[#1C1208] hover:bg-[#33281d] text-white text-xs uppercase font-medium tracking-[0.18em] rounded-xs shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isLoading ? "Verifying..." : "Verify & Complete Registration"}</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={handleResendRegistrationOtp}
                      disabled={resendCooldown > 0 || isLoading}
                      className="text-[#B8933F] hover:underline disabled:text-[#999] disabled:no-underline font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                      <span>
                        {resendCooldown > 0
                          ? `Resend code in ${resendCooldown}s`
                          : "Resend Verification Code"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setAuthMode("register");
                      }}
                      className="text-[#767069] hover:text-[#1C1208] text-[11px]"
                    >
                      Change Email
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ════════════ VIEW: VERIFY LOGIN OTP ════════════ */}
            {authMode === "verify-login-otp" && (
              <>
                <div className="w-12 h-12 rounded-full bg-[#FAF6EE] border border-[#B8933F]/40 flex items-center justify-center text-[#B8933F] mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="font-montserrat text-2xl font-semibold text-[#1C1208] tracking-tight mb-1">
                  Login Verification
                </h1>
                <p className="font-poppins text-xs text-[#6E675F] font-light mb-4">
                  We sent a 6-digit login verification code to{" "}
                  <strong className="text-[#1C1208] font-medium">{email}</strong>. Enter it
                  below to sign in securely.
                </p>

                <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#767069] font-medium mb-1.5">
                      6-Digit Login Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      required
                      autoFocus
                      className="w-full px-4 py-3 bg-[#F6F6F6] border border-[#EAE3D5] focus:border-[#B8933F] rounded-xs text-center text-xl font-mono tracking-[8px] font-bold text-[#1C1208] placeholder:text-[#BBB] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || loginOtp.length < 6}
                    className="w-full py-3 bg-[#1C1208] hover:bg-[#33281d] text-white text-xs uppercase font-medium tracking-[0.18em] rounded-xs shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isLoading ? "Verifying..." : "Verify & Sign In"}</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={handleResendLoginOtp}
                      disabled={resendCooldown > 0 || isLoading}
                      className="text-[#B8933F] hover:underline disabled:text-[#999] disabled:no-underline font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                      <span>
                        {resendCooldown > 0
                          ? `Resend code in ${resendCooldown}s`
                          : "Resend Login Code"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setAuthMode("login");
                      }}
                      className="text-[#767069] hover:text-[#1C1208] text-[11px]"
                    >
                      Use another account
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ════════════ VIEW: COMPLETE PROFILE ════════════ */}
            {authMode === "complete-profile" && (
              <>
                <div className="w-12 h-12 rounded-full bg-[#FAF6EE] border border-[#B8933F]/40 flex items-center justify-center text-[#B8933F] mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="font-montserrat text-2xl font-semibold text-[#1C1208] tracking-tight mb-1">
                  Complete Your Profile
                </h1>
                <p className="font-poppins text-xs text-[#6E675F] font-light mb-4">
                  Welcome to ZHAEVAAH! Please provide your phone number, gender, and date of birth to receive celebration privileges and order tracking.
                </p>

                <form onSubmit={handleCompleteProfile} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#767069] font-medium mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] focus:outline-none transition-colors"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Unspecified">Prefer Not to Say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#767069] font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full px-3.5 py-2.5 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#767069] font-medium mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !phone || !dateOfBirth}
                    className="w-full py-3 bg-[#1C1208] hover:bg-[#33281d] text-white text-xs uppercase font-medium tracking-[0.18em] rounded-xs shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isLoading ? "Saving profile..." : "Save Details & Enter Atelier"}</span>
                  </button>
                </form>
              </>
            )}

            {/* ════════════ VIEW 4: FORGOT PASSWORD (EMAIL INPUT) ════════════ */}
            {authMode === "forgot-password" && (
              <>
                <div className="w-12 h-12 rounded-full bg-[#FAF6EE] border border-[#B8933F]/40 flex items-center justify-center text-[#B8933F] mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="font-montserrat text-2xl font-semibold text-[#1C1208] tracking-tight mb-1">
                  Forgot Password?
                </h1>
                <p className="font-poppins text-xs text-[#6E675F] font-light mb-5">
                  Enter your registered email address and we will send you a 6-digit OTP to reset your password securely.
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Registered Email Address"
                      required
                      autoFocus
                      className="w-full px-3.5 py-2.5 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#1C1208] hover:bg-[#33281d] text-white text-xs uppercase font-medium tracking-[0.18em] rounded-xs shadow-sm transition-all active:scale-98 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isLoading ? "Sending code..." : "Send Reset Code"}</span>
                  </button>
                </form>
              </>
            )}

            {/* ════════════ VIEW 5: RESET PASSWORD (OTP + NEW PASS) ════════════ */}
            {authMode === "reset-password" && (
              <>
                <div className="w-12 h-12 rounded-full bg-[#FAF6EE] border border-[#B8933F]/40 flex items-center justify-center text-[#B8933F] mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="font-montserrat text-2xl font-semibold text-[#1C1208] tracking-tight mb-1">
                  Reset Password
                </h1>
                <p className="font-poppins text-xs text-[#6E675F] font-light mb-4">
                  Enter the 6-digit code sent to <strong className="text-[#1C1208]">{email}</strong> and set your new password.
                </p>

                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#767069] font-medium mb-1">
                      Reset Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      required
                      autoFocus
                      className="w-full px-4 py-2.5 bg-[#F6F6F6] border border-[#EAE3D5] focus:border-[#B8933F] rounded-xs text-center text-lg font-mono tracking-[6px] font-bold text-[#1C1208] placeholder:text-[#BBB] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password (min. 8 characters)"
                      required
                      minLength={8}
                      className="w-full px-3.5 py-2.5 pr-10 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#1C1208]"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4 stroke-[1.8]" />
                      ) : (
                        <Eye className="w-4 h-4 stroke-[1.8]" />
                      )}
                    </button>
                  </div>

                  <div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm New Password"
                      required
                      minLength={8}
                      className="w-full px-3.5 py-2.5 bg-[#F6F6F6] border border-transparent focus:border-[#B8933F] rounded-xs text-xs text-[#1C1208] placeholder:text-[#999] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || resetOtp.length < 6}
                    className="w-full py-3 bg-[#1C1208] hover:bg-[#33281d] text-white text-xs uppercase font-medium tracking-[0.18em] rounded-xs shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isLoading ? "Resetting..." : "Reset Password"}</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={resendCooldown > 0 || isLoading}
                      className="text-[#B8933F] hover:underline disabled:text-[#999] disabled:no-underline font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                      <span>
                        {resendCooldown > 0
                          ? `Resend code in ${resendCooldown}s`
                          : "Resend Reset Code"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setAuthMode("login");
                      }}
                      className="text-[#767069] hover:text-[#1C1208] text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Bottom Switch Link */}
          {(authMode === "login" || authMode === "register") && (
            <div className="pt-4 text-center border-t border-[#f0ece5]">
              <p className="text-[11px] text-[#767069]">
                {authMode === "register" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setAuthMode("login");
                      }}
                      className="font-semibold text-[#1C1208] hover:text-[#B8933F] underline ml-1 cursor-pointer"
                    >
                      Log In
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        clearMessages();
                        setAuthMode("register");
                      }}
                      className="font-semibold text-[#1C1208] hover:text-[#B8933F] underline ml-1 cursor-pointer"
                    >
                      Register
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* ── Right Half: Image Carousel with Bottom Branding ── */}
        <div className="relative hidden md:block w-full h-full min-h-[580px] bg-[#16120E] overflow-hidden">
          {/* Carousel Images */}
          {AUTH_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.tagline}
                fill
                sizes="50vw"
                className="object-cover object-center"
                priority={index === 0}
              />
              {/* Luxury dark bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
            </div>
          ))}

          {/* Bottom Branding */}
          <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-6">
            {/* Carousel Dot Indicators */}
            <div className="flex items-center space-x-1.5 mb-5">
              {AUTH_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeSlide
                      ? "w-6 h-1.5 bg-[#B8933F]"
                      : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Brand Logo */}
            <div className="flex items-center mb-1">
              <Image
                src="/brand/ZHAEVAAH_LOGO.webp"
                alt="ZHAEVAAH"
                width={170}
                height={64}
                className="h-10 w-auto object-contain brightness-110 drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
