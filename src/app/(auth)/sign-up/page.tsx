"use client"
import React from "react"
import { SignUpForm } from "@/features/auth/components/sign-up-form"
import { Logo } from "@/assets/files/Logo"
import { Banner } from "@/assets/files/Banner"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-secondary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Logo/>
            </div>
            Gym Fusion.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs p-5 rounded-lg bg-primary-foreground/20 text-secondary-foreground shadow-lg ">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
      <Banner/>
      </div>
    </div>
  )
}
