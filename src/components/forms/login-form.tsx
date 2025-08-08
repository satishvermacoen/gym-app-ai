"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, Lock, LogIn, KeyRound } from "lucide-react";
import { loginUser, verifyLoginOtp } from "@/lib/api/User-Respone";




// --- UI Components ---

// Standard input field component used for email, password, and now OTP.
const InputField = React.forwardRef<HTMLInputElement, any>(({ icon, ...props }, ref) => (
  <div className="relative flex items-center">
    <div className="absolute left-3 text-gray-400">{icon}</div>
    <input
      ref={ref}
      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      {...props}
    />
  </div>
));
InputField.displayName = "InputField";

const SubmitButton = ({ isSubmitting, text, submittingText, icon }: { isSubmitting: boolean; text: string; submittingText: string; icon: React.ReactNode }) => (
    <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
    >
        {isSubmitting ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {submittingText}
            </>
        ) : (
            <>
                {icon}
                {text}
            </>
        )}
    </button>
);


// --- Form Schemas ---
const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

// Schema for the OTP, now expecting a simple string.
const otpSchema = z.object({
  otp: z.string().min(6, "Code must be 6 digits.").max(6, "Code must be 6 digits."),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;


// --- Main Component ---
export function LoginForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<'LOGIN' | 'OTP'>('LOGIN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // --- Form Submission Handlers ---
  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await loginUser({ email: values.email, password: values.password });
      if (response.data.statusCode === 202) {
        toast.success(response.data.message);
        setUserEmail(values.email);
        setFormState('OTP');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpSubmit = async (values: OtpFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await verifyLoginOtp({ email: userEmail, otp: values.otp });
      toast.success(response.data.message);
      localStorage.setItem('accessToken', response.data.data.accessToken);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  return (
    <div className="">
      <div className="">
        
        {formState === 'LOGIN' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
              <p className="text-gray-500 mt-2">Sign in to continue to your account.</p>
            </div>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <InputField
                  icon={<Mail size={18} />}
                  type="email"
                  placeholder="you@example.com"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <InputField
                  icon={<Lock size={18} />}
                  type="password"
                  placeholder="••••••••"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && <p className="text-xs text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>}
              </div>
              <SubmitButton 
                isSubmitting={isSubmitting} 
                text="Login" 
                submittingText="Logging In..." 
                icon={<LogIn size={18} />} 
              />
            </form>
          </div>
        )}

        {formState === 'OTP' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Enter Code</h1>
              <p className="text-gray-500 mt-2">We sent a verification code to <br/> <strong className="text-gray-700">{userEmail}</strong></p>
            </div>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-8">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Verification Code</label>
                <InputField
                  icon={<KeyRound size={18} />}
                  type="tel" // Use 'tel' for numeric keyboard on mobile
                  placeholder="123456"
                  maxLength="6"
                  {...otpForm.register("otp")}
                />
                {otpForm.formState.errors.otp && <p className="text-xs text-red-500 mt-1">{otpForm.formState.errors.otp.message}</p>}
              </div>
              <SubmitButton 
                isSubmitting={isSubmitting} 
                text="Verify & Login" 
                submittingText="Verifying..." 
                icon={<KeyRound size={18} />} 
              />
            </form>
            <div className="text-center mt-6">
                <button type="button" onClick={() => setFormState('LOGIN')} className="text-sm text-blue-600 hover:underline">
                    Back to login
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Add this to your global CSS file for the animation
/*
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-in-out;
}
*/
