"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loginWithGoogle, registerUser, verifyOtp } from "@/lib/api/User-Respone";
import Link from "next/link";
import { MailIcon } from "lucide-react";

const GoogleIcon = () => (
    <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.4 0 129.2 110.3 20 244 20c66.2 0 125.4 26.6 168.4 69.9l-67.6 64.9C314.6 125.6 282.5 112 244 112c-88.6 0-160.1 71.7-160.1 159.4s71.5 159.4 160.1 159.4c100.2 0 133.4-86.3 136.2-127.3H244v-75.2h236.1c2.3 12.7 3.9 26.1 3.9 40.2z"></path>
    </svg>
);
// --- Form Validation Schemas ---

const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "STAFF"]),
  avatar: z.any(), // Allow any file type for the avatar
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // --- Form Hooks ---

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "STAFF",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // --- Submission Handlers ---

  const onSignUpSubmit = async (values: SignUpFormValues) => {
    setIsSubmitting(true);
    setUserEmail(values.email);

    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("password", values.password || "");
    formData.append("role", values.role);
    if (values.avatar && values.avatar[0]) {
      formData.append("avatar", values.avatar[0]);
    }

    try {
      const response = await registerUser(formData);
      toast.success(response.data.message || "Registration successful! Please check your email.");
      setShowOtpForm(true); // Switch to the OTP form
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred during sign-up.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpSubmit = async (values: OtpFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await verifyOtp({ email: userEmail, otp: values.otp });
      toast.success(response.data.message || "Verification successful! Redirecting...");
      // On successful verification, store token and redirect
      const { accessToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      router.push("/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred during OTP verification.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleGoogleLogin = async () => {
      await loginWithGoogle()
      router.push("/dashboard");
      
    };

  // --- Render Logic ---

  if (showOtpForm) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p className="text-muted-foreground">
            An OTP has been sent to <strong>{userEmail}</strong>.
          </p>
        </div>
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify & Sign Up"}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-4 m-1">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Create an account</h2>
        <p className="text-xs text-muted-foreground">Enter your details to get started.</p>
      </div>
      <Form {...signUpForm}>
        <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField control={signUpForm.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={signUpForm.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
          </div>
          <FormField control={signUpForm.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={signUpForm.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem> )} />
          
          <FormField
            control={signUpForm.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="OWNER">Owner</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField control={signUpForm.control} name="avatar" render={({ field }) => ( <FormItem><FormLabel>Avatar</FormLabel><FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem> )} />
          
          <Button type="submit" className="w-full transition-all duration-200 hover:scale-105" disabled={isSubmitting}>
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>Already have an account?</p>
        <Link href="/login" className="text-sm text-blue-60">
        <Button  variant="outline" className="w-full mt-4 flex items-center justify-center gap-4 transition-all duration-200 hover:bg-gray-100 hover:scale-105">
            <MailIcon />
            Login
        </Button>
        </Link>
      </div>
      <Button onClick={handleGoogleLogin}  variant="outline" className="w-full mt-4 flex items-center justify-center gap-4 transition-all duration-200 hover:bg-gray-100 hover:scale-105">
          <GoogleIcon />
          Login with Google
      </Button>
    </div>
  );
}
