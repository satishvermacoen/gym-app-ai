"use client"

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // The API endpoint you provided
      const apiUrl = "https://gym-api-test-a123-hcbmbvchhnd8htdr.centralindia-01.azurewebsites.net/api/v1/users/login";
      
      const response = await axios.post(apiUrl, {
        email,
        password,
      });

      // Check if the login was successful based on the response
      if (response.data && response.data.success) {
        // You can optionally store the accessToken for future API calls
        // const { accessToken } = response.data.data;
        // localStorage.setItem('accessToken', accessToken);

        // Redirect to the dashboard on successful login
        router.push("/dashboard");
      } else {
        // Handle cases where the API returns a success status but indicates a failure
        setError(response.data.message || "An unknown error occurred.");
      }

    } catch (err: any) {
      // Handle network errors or errors returned from the API
      const errorMessage = err.response?.data?.message || err.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email to login
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      <Link href="/user/google">
      <Button type="button" variant="outline" className="w-full">
        Login with Google
      </Button>
      </Link>
    </form>
  );
}
