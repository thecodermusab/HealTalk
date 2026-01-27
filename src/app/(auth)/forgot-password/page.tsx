"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reset password for:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-1">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Back to Login */}
          <Link href="/login" className="flex items-center gap-2 text-sm text-primary hover:underline mb-8">
            <ArrowLeft size={16} />
            Back to login
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <img
              src="/images/New_Logo.png"
              alt="HealTalk logo"
              className="h-10 w-auto"
            />
          </Link>

          {!isSubmitted ? (
            <>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Forgot Password?
              </h1>
              <p className="text-text-secondary mb-8">
                No worries. Enter your email and we will send reset instructions.
              </p>

              {/* Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-black h-12 text-base"
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-success" size={40} />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Check Your Email
              </h1>
              <p className="text-text-secondary mb-8">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-sm text-text-secondary mb-6">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:underline"
                >
                  try another email address
                </button>
              </p>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full h-12"
                >
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent items-center justify-center p-12">
        <div className="text-center text-background max-w-lg">
          <div className="w-24 h-24 bg-card/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8">
            <Mail size={48} className="text-background" />
          </div>
          <h2 className="text-4xl font-bold mb-6">
            We are here to help
          </h2>
          <p className="text-xl text-background/90">
            Resetting your password is quick and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
