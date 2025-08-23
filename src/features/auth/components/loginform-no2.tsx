"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@/schemas/User/login.schema";
import { useLogin } from "@/features/auth/hooks/use.Login.Auth";
import { GoogleIcon } from "@/assets/files/Logo";
import { loginWithGoogle } from "@/features/auth/services/signup.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MailIcon } from "lucide-react";

export default function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useLogin();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      await mutateAsync(values);
      router.push("/main/[branchId]/admin"); 
    } catch (err: any) {
      setServerError(err.message || "Login failed");
    }
  };

  return (
    <div className="max-w-sm p-1 space-y-3">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
        <p className="text-xs text-gray-500 mt-2">Enter your Credentials or Login with Google</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            autoComplete="username"
            {...register("email")}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      
      <br/>
      <Button
        type="submit"
        disabled={isPending}
        className="w-full transition-all duration-200 hover:scale-105"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
      </form>
      <p className="text-xs text-muted-foreground text-center">Sign In with Google</p>
      <Button type="button" 
      variant="outline" 
      onClick={loginWithGoogle}
      className="w-full mt-4 flex items-center justify-center gap-4 transition-all duration-200 hover:bg-gray-100 hover:scale-105"
      >
      <GoogleIcon />
      Continue with Google
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
