"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@/schemas/auth.schema";
import { useLogin } from "@/hooks/useAuth";

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
      router.push("/"); // or /dashboard
    } catch (err: any) {
      setServerError(err.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm space-y-3">
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

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
