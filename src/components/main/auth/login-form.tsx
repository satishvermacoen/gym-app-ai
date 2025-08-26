// src/features/auth/components/login-form.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import type { LoginInput } from "@/types/auth";
import { useLogin } from "@/hooks/auth/use.Login.Auth";
import { useSendLoginOtp, useVerifyLoginOtp } from "@/hooks/auth/use.LoginOTP";
import { loginWithGoogle } from "@/services/auth/signup.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "password" | "otp";

export default function LoginForm() {
  const router = useRouter();
  const qc = useQueryClient();

  const [mode, setMode] = useState<Mode>("password");
  const [serverError, setServerError] = useState<string | null>(null);

  // OTP flow state
  const [emailForOtp, setEmailForOtp] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0); // seconds until resend allowed

  // ----- Password login -----
  const { mutateAsync: login, isPending: isPwdPending } = useLogin();
  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    formState: { errors: pwdErrors },
  } = useForm<LoginInput>({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  async function onPasswordLogin(values: LoginInput) {
    setServerError(null);
    try {
      await login(values);
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
      router.replace("/dashboard");
    } catch (err: any) {
      setServerError(err?.message || "Login failed");
    }
  }

  // ----- OTP login -----
  const { mutateAsync: sendOtp, isPending: isSendPending } = useSendLoginOtp();
  const { mutateAsync: verifyOtp, isPending: isVerifyPending } = useVerifyLoginOtp();

  const canResend = useMemo(() => countdown <= 0, [countdown]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  async function onSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    if (!email) {
      setServerError("Email is required");
      return;
    }
    try {
      const res = await sendOtp({ email });
      setEmailForOtp(res.email);
      setCountdown(Math.ceil((res.ttlMs ?? 600_000) / 1000));
    } catch (err: any) {
      setServerError(err?.message || "Failed to send OTP");
    }
  }

  async function onVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    const otp = String(fd.get("otp") || "").trim();
    if (!emailForOtp || !otp) {
      setServerError("Email and OTP are required");
      return;
    }
    try {
      await verifyOtp({ email: emailForOtp, otp });
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
      router.replace("/dashboard");
    } catch (err: any) {
      setServerError(err?.message || "Invalid OTP");
    }
  }

  return (
    <div className="max-w-sm p-1 space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-xs text-muted-foreground mt-2">Sign in with password or one-time code</p>
      </div>

      {/* Mode switch */}
      <div className="grid grid-cols-2 rounded-lg border overflow-hidden">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`px-3 py-2 text-sm ${mode === "password" ? "bg-gray-100 font-semibold" : ""}`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("otp")}
          className={`px-3 py-2 text-sm ${mode === "otp" ? "bg-gray-100 font-semibold" : ""}`}
        >
          OTP (Email)
        </button>
      </div>

      {mode === "password" ? (
        <form onSubmit={handleSubmitPwd(onPasswordLogin)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              {...registerPwd("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
            />
            {pwdErrors.email && <p className="text-sm text-red-600">{pwdErrors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...registerPwd("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {pwdErrors.password && <p className="text-sm text-red-600">{pwdErrors.password.message}</p>}
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <Button type="submit" disabled={isPwdPending} className="w-full transition-all duration-200 hover:scale-105">
            {isPwdPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      ) : (
        <>
          {/* OTP Step 1: Send */}
          <form onSubmit={onSendOtp} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                defaultValue={emailForOtp}
                disabled={!!emailForOtp && !canResend}
                required
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button type="submit" disabled={isSendPending || (!!emailForOtp && !canResend)} className="flex-1">
                {isSendPending
                  ? "Sending..."
                  : emailForOtp
                  ? canResend
                    ? "Resend OTP"
                    : "OTP Sent"
                  : "Send OTP"}
              </Button>
              {!!emailForOtp && (
                <span className="text-xs text-muted-foreground w-28 text-right">
                  {canResend ? "You can resend now" : `Resend in ${countdown}s`}
                </span>
              )}
            </div>
          </form>

          {/* OTP Step 2: Verify (visible after email is set) */}
          {!!emailForOtp && (
            <form onSubmit={onVerifyOtp} className="space-y-3 pt-2">
              <div>
                <label className="block text-sm font-medium">Enter OTP</label>
                <Input
                  type="text"
                  name="otp"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="6-digit code"
                  required
                  className="tracking-widest"
                />
              </div>

              {serverError && <p className="text-sm text-red-600">{serverError}</p>}

              <Button type="submit" disabled={isVerifyPending} className="w-full">
                {isVerifyPending ? "Verifying..." : "Verify & Sign in"}
              </Button>
            </form>
          )}
        </>
      )}

      {/* Social / signup */}
      <div>
        <p className="text-xs text-muted-foreground text-center mt-4">Sign in with Google</p>
        <Button
          type="button"
          variant="outline"
          onClick={loginWithGoogle}
          className="w-full mt-2 flex items-center justify-center gap-3 transition-all duration-200 hover:bg-gray-100 hover:scale-105"
        >
          Continue with Google
        </Button>

        <div className="text-center mt-4">
          <a href="/sign-up" className="text-sm underline">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
