"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  const handleGoogleSignUp = async () => {
    try {
      await signUp.sso({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectCallbackUrl: "/sso-callback",
      });
    } catch (err) {
      console.error("Google Sign-up error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (!error) {
      const { error: sendErr } = await signUp.verifications.sendEmailCode();
      if (!sendErr) {
        setPendingVerification(true);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await signUp.verifications.verifyEmailCode({ code });

    if (!error && signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          const url = decorateUrl(session?.currentTask ? `/sign-up/tasks/${session.currentTask.key}` : "/dashboard");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-background p-6 text-foreground sm:p-10">
      {/* Top Header */}
      <header className="flex w-full max-w-5xl items-center justify-between">
        <Logo />
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <Link href="/" className="flex items-center gap-1.5">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </Button>
      </header>

      {/* Main Form Card */}
      <main className="my-auto w-full max-w-sm space-y-6 py-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {pendingVerification ? "Verify your email" : "Create an account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {pendingVerification
              ? `We sent a 6-digit code to ${email}`
              : "Start collaborating on Canvasly for free"}
          </p>
        </div>

        {/* Global Error Banner */}
        {errors?.global && errors.global.length > 0 && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {errors.global[0].message}
          </div>
        )}

        {!pendingVerification ? (
          <>
            {/* Google OAuth Button */}
            <Button
              variant="outline"
              className="w-full h-10 gap-2 font-medium cursor-pointer"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative bg-background px-3 text-xs uppercase text-muted-foreground">
                Or
              </span>
            </div>

            {/* Registration Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground" htmlFor="first-name">
                    First name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground" htmlFor="last-name">
                    Last name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Morgan"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground" htmlFor="email">
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@work-email.com"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                  disabled={isLoading}
                />
                {errors?.fields?.emailAddress && (
                  <p className="text-xs text-destructive">{errors.fields.emailAddress.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                {errors?.fields?.password && (
                  <p className="text-xs text-destructive">{errors.fields.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-10 font-medium cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Creating account...</span>
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </>
        ) : (
          /* Email Verification Code Form */
          <form className="space-y-4" onSubmit={handleVerify}>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground" htmlFor="code">
                Verification code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-center text-base tracking-widest font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
                disabled={isLoading}
              />
              {errors?.fields?.code && (
                <p className="text-xs text-destructive">{errors.fields.code.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 font-medium cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Verifying...</span>
                </span>
              ) : (
                "Verify & Continue"
              )}
            </Button>
          </form>
        )}

        <div id="clerk-captcha" />

        {/* Toggle to Sign In */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground">
        Canvasly © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
