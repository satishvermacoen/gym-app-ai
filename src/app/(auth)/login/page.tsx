import { GalleryVerticalEnd, LogOutIcon } from "lucide-react"

import { LoginForm } from "@/components/forms/login-form"
import Image from "next/image"
import { Logo } from "@/components/layout/Logo"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-secondary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Logo/>
            </div>
            GYM FUSION.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs p-10 rounded-lg bg-primary-foreground/20 text-secondary-foreground shadow-lg">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
        src="/1.jpg"
        alt="Image"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
