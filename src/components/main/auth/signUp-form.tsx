// src/features/auth/components/signUp-form.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { SignupInput, VerifyEmailInput } from "@/types/auth";
import { useSignup, useVerifyEmail } from "@/hooks/auth/use.Signup.Auth";
import { loginWithGoogle } from "@/services/auth/signup.service";
import { GoogleIcon } from "@/assets/files/Logo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE_OPTIONS: SignupInput["role"][] = ["OWNER", "ADMIN", "MANAGER", "STAFF"];

export default function SignupForm() {
  const router = useRouter();

  // UI state
  const [step, setStep] = useState<"form" | "verify">("form");
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0); // seconds from ttlMs
  const canResend = countdown <= 0;

  // RHF (no zod)
  const form = useForm<SignupInput>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "OWNER",
      avatar: null,
    },
    mode: "onSubmit",
  });

  // Mutations
  const signupMutation = useSignup();
  const verifyMutation = useVerifyEmail();

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  // 1) Register -> { email, ttlMs }
  const onSubmit = async (values: SignupInput) => {
    try {
      const res = await signupMutation.mutateAsync(values);
      setRegisteredEmail(res.email);
      setCountdown(Math.ceil((res.ttlMs ?? 600_000) / 1000));
      setStep("verify");
      toast.success("OTP sent to your email");
    } catch (err: any) {
      toast.error(err?.message ?? "Signup failed");
    }
  };

  // 2) Verify -> { emailVerified: true } -> redirect to /login
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const otp = String(fd.get("otp") || "").trim();
    if (!otp) return toast.error("OTP is required");

    const payload: VerifyEmailInput = { email: registeredEmail, otp };
    try {
      const res = await verifyMutation.mutateAsync(payload);
      if (res.emailVerified) {
        toast.success("Email verified. Please sign in.");
        router.push("/login");
      } else {
        toast.error("Verification failed");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Invalid OTP");
    }
  };

  if (step === "verify") {
    return (
      <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Verify your email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-medium">{registeredEmail}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">One-Time Password</Label>
            <Input
              id="otp"
              name="otp"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="Enter 6-digit code"
              required
              className="tracking-widest"
            />
            <p className="text-xs text-muted-foreground">
              {canResend ? "You may request a new code from the signup form." : `You can try again in ${countdown}s`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? "Verifying…" : "Verify & Continue"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setStep("form")}>
              Back
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-sm p-1 space-y-3">
      <div className="text-center space-y-1 mb-4">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-xs text-muted-foreground">Manage gyms, branches, members & more.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            rules={{ required: "First name is required", minLength: { value: 2, message: "Min 2 characters" } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl><Input placeholder="John" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            rules={{ required: "Last name is required", minLength: { value: 2, message: "Min 2 characters" } }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
            }}
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{ required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } }}
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Avatar (optional) */}
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="sm:col-span-2">
            <Button
              className="w-full transition-all duration-200 hover:scale-105"
              type="submit"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating…" : "Create account"}
            </Button>
          </div>
        </form>
      </Form>

      <p className="text-xs text-muted-foreground text-center mt-2">Or sign up with Google</p>
      <Button
        type="button"
        variant="outline"
        onClick={loginWithGoogle}
        className="w-full mt-2 flex items-center justify-center gap-3 transition-all duration-200 hover:bg-gray-100 hover:scale-105"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="text-center mt-4">
        <a href="/login" className="text-sm underline">Already have an account? Sign in</a>
      </div>
    </div>
  );
}
