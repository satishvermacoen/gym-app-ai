"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, Lock, LogIn, KeyRound, MailIcon } from "lucide-react";
import { loginUser, verifyLoginOtp, loginWithGoogle } from "@/lib/api/User-Respone";
import { Button } from "@/components/ui/button";
import Link from "next/link";


// --- UI Components ---

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

const GoogleIcon = () => (
    <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.4 0 129.2 110.3 20 244 20c66.2 0 125.4 26.6 168.4 69.9l-67.6 64.9C314.6 125.6 282.5 112 244 112c-88.6 0-160.1 71.7-160.1 159.4s71.5 159.4 160.1 159.4c100.2 0 133.4-86.3 136.2-127.3H244v-75.2h236.1c2.3 12.7 3.9 26.1 3.9 40.2z"></path>
    </svg>
);


// --- Form Schemas ---
const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

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
      const response = await loginUser(
        { email: values.email, password: values.password },
         {withCredentials: true}
      );
      if (response.data.statusCode === 202) {
        setFormState('OTP');
        setUserEmail(values.email);
      }
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpSubmit = async (values: OtpFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await verifyLoginOtp(
        { email: userEmail, otp: values.otp },
        {withCredentials: true}
      );
      toast.success(response.data.message);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Google Login Handler ---

  const handleGoogleLogin = async () => {
    await loginWithGoogle()
    router.push("/dashboard");
    
  };

  // --- Render Logic ---
  return (
    <div className="space-y-4 m-1">
      <div>
        
        {formState === 'LOGIN' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
              <p className="text-xs text-gray-500 mt-2">Sign in to continue to your account.</p>
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
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
            </div>
            <Button onClick={handleGoogleLogin} variant="outline" className="w-full mt-4 flex items-center justify-center gap-4 transition-all duration-200 hover:bg-gray-100 hover:scale-105">
                <GoogleIcon />
                Login with Google
            </Button>
            <Link href="/sign-up" className="text-sm text-blue-60">
              <Button  variant="outline" className="w-full mt-4 flex items-center justify-center gap-4 transition-all duration-200 hover:bg-gray-100 hover:scale-105">
                  <MailIcon />
                  Sign Up with Email
              </Button>
            </Link>
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
