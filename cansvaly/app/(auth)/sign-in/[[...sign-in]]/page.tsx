"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-background p-6 text-foreground sm:p-10">
      {/* Top Header */}
      <header className="flex w-full max-w-5xl items-center justify-between">
        <Logo />
        <Button variant="ghost" size="sm">
          <Link href="/" className="flex items-center gap-1.5">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </Button>
      </header>

      {/* Main Form Card */}
      <main className="my-auto flex w-full justify-center py-8">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground">
        Canvasly © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
