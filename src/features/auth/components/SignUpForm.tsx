"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { SignupSchema, type SignupInput, type VerifyEmailInput } from "@/schemas/User/signup.schema";
import { useSignup, useVerifyEmail } from "@/features/auth/hooks/use.Signup.Auth";
import { useAuthStore } from "@/stores/auth.store";

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
import { ro } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from "@/features/auth/services/signup.service";
import { GoogleIcon } from "@/assets/files/Logo";

// If your project has shadcn InputOTP, you can switch to it.

const ROLE_OPTIONS: SignupInput["role"][] = ["OWNER", "ADMIN", "MANAGER", "STAFF"];

export default function SignupForm() {
    const router = useRouter()
  const [step, setStep] = useState<"form" | "verify">("form");
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const setAuth = useAuthStore((s) => s.setAuth);

  const form = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "OWNER",
      // avatar: undefined,
    },
  });

  const signupMutation = useSignup();
  const verifyMutation = useVerifyEmail();
  

  /** Handle submit: triggers OTP to email */
  const onSubmit = async (values: SignupInput) => {
    try {
      await signupMutation.mutateAsync(values);
      setRegisteredEmail(values.email);
      setStep("verify");
      toast.success("OTP sent to your email");
    } catch (err: any) {
      toast.error(err?.message ?? "Signup failed");
    }
  };

  /** Verify OTP and complete login */
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otp = String(formData.get("otp") || "").trim();
    const payload: VerifyEmailInput = { email: registeredEmail, otp } as any;

    try {
      const result = await verifyMutation.mutateAsync(payload);
      // If your useVerifyEmail hook already sets auth, you can drop next 4 lines.
      if (result && (result as any).user && (result as any).accessToken) {
        setAuth({
          user: (result as any).user,
          accessToken: (result as any).accessToken,
          refreshToken: (result as any).refreshToken ?? "",
        });
      }
      toast.success("Email verified. You are logged in.");
      router.push("/login"); // Redirect to home or dashboard
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
            We sent a 6‑digit code to <span className="font-medium">{registeredEmail}</span>
          </p>
        </div>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">One‑Time Password</Label>
            <Input id="otp" name="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="Enter 6‑digit code" required />
            <p className="text-xs text-muted-foreground">Check spam if you don’t see the email.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? "Verifying…" : "Verify & Continue"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setStep("form")}>Back</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-sm p-1 space-y-3">
      <div className="text-center space-y-1 mb-4">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p className="text-xs text-muted-foreground">Manage gyms, members, and more.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
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

          {/* Avatar uploader (optional) */}
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
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <br/>
      <Button 
        className="w-full transition-all duration-200 hover:scale-105" 
        type="submit" 
        disabled={signupMutation.isPending}
        >
        {signupMutation.isPending ? "Creating…" : "Create account"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">SignUp with Google</p>
        <Button type="button" 
        variant="outline" 
        onClick={loginWithGoogle}
        className="w-full mt-4 flex items-center justify-center gap-4 transition-all duration-200 hover:bg-gray-100 hover:scale-105"
        >
        <GoogleIcon />
        Continue with Google
        </Button>
    </div>
  );
}

