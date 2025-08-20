"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ✅ React Query hooks from your auth.service.ts
import {
  useLoginUserMutation,
  useLoginVerificationMutation,
  type LoginUserDto,
} from "@/features/auth/services/auth.login.service";

import { loginWithGoogle } from "@/features/auth/services/auth.service";
import Link from "next/link";
import { MailIcon } from "lucide-react";
// ---------------- Validation ----------------
const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "Digits only"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function LoginForm() {
  const router = useRouter();

  const [step, setStep] = useState<"LOGIN" | "OTP">("LOGIN");
  const [emailForOtp, setEmailForOtp] = useState("");

  // Forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // ✅ React Query mutations (your hooks)
  const loginMut = useLoginUserMutation();
  const verifyMut = useLoginVerificationMutation();


  // ---------------- Handlers ----------------
  async function onSubmitLogin(values: LoginFormValues) {
    try {
      const res = await loginMut.mutateAsync(values as LoginUserDto);

      const statusCode = res?.statusCode ?? res?.data?.statusCode;
      const message = res?.message ?? res?.data?.message ?? "OTP sent successfully";
      const email = res?.data?.email ?? values.email;

      if (statusCode === 202) {
        setEmailForOtp(email);
        toast.success(message);
        setStep("OTP");
        return;
      }

      // If your backend ever allows direct success without OTP:
      toast.success(message || "Logged in successfully");
      router.push("/(dashboard)");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please check your credentials."
      );
    }
  }

  async function onSubmitOtp(values: OtpFormValues) {
    try {
      const res = await verifyMut.mutateAsync({ email: emailForOtp, otp: values.otp });
      const statusCode = res?.statusCode ?? res?.data?.statusCode;
      const message = res?.message ?? res?.data?.message ?? "Login successful";

      if (statusCode === 200) {
        toast.success(message);
        router.push("/(dashboard)");
      } else {
        toast.error(message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "OTP verification failed"
      );
    }
  }


  const handleGoogleLogin = async () => {
      try {
        await loginWithGoogle(); // if this redirects internally; otherwise do: window.location.href = getGoogleLoginUrl();
      } finally {
        // after OAuth callback sets cookies, you can route:
        router.push("/(dashboard)");
      }
    };

  // ---------------- UI ----------------
  if (step === "OTP") {
    return (
      <div className="max-w-sm mx-auto space-y-4">
        <h2 className="text-xl font-bold text-center">Enter OTP</h2>
        <p className="text-sm text-center text-muted-foreground">
          We sent a code to <strong>{emailForOtp}</strong>
        </p>

        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(onSubmitOtp)}
            className="space-y-4"
            // prevent browsers from autofilling with email
            autoComplete="off"
          >
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="123456"
                      autoComplete="one-time-code"
                      autoCorrect="off"
                      autoCapitalize="none"
                      name="one-time-code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={verifyMut.isPending}
            >
              {verifyMut.isPending ? "Verifying..." : "Verify & Login"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("LOGIN")}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to login
              </button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // LOGIN step
  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h2 className="text-xl font-bold text-center">Login</h2>

      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-4">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loginMut.isPending}
          >
            {loginMut.isPending ? "Sending OTP..." : "Login"}
          </Button>
        </form>
      </Form>
       <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <Button onClick={handleGoogleLogin} variant="outline" className="w-full mt-4 flex items-center justify-center gap-4 transition-all duration-200 hover:bg-gray-100 hover:scale-105">
        {loginMut.isPending ? "Logging in..." : "Login with Google"}
      </Button>
      <Link href="/sign-up" className="text-sm text-blue-60">
        <Button  variant="outline" className="w-full mt-4 flex items-center justify-center gap-4 transition-all duration-200 hover:bg-gray-100 hover:scale-105">
            <MailIcon />
            Sign Up with Email
        </Button>
      </Link>
    </div>
  );
}
