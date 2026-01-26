"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";

const getPostLoginPath = (role?: string) => {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "PSYCHOLOGIST") return "/psychologist/dashboard";
  return "/patient/dashboard";
};

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"patient" | "psychologist" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    credentials: "",
    licenseNumber: "",
    experience: "",
    bio: "",
    specializations: "",
    price60: "",
    price90: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setErrorMessage("Please choose a role.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const role = selectedRole === "psychologist" ? "PSYCHOLOGIST" : "PATIENT";
    const isPsychologist = role === "PSYCHOLOGIST";
    const experienceValue = isPsychologist ? Number(formData.experience) : undefined;
    const price60Value = isPsychologist ? Number(formData.price60) : undefined;
    const price90Value = isPsychologist ? Number(formData.price90) : undefined;
    const specializations = isPsychologist
      ? formData.specializations
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    if (isPsychologist) {
      if (
        !formData.credentials.trim() ||
        !formData.licenseNumber.trim() ||
        !formData.bio.trim() ||
        !specializations.length ||
        !Number.isFinite(experienceValue) ||
        !Number.isInteger(experienceValue) ||
        (experienceValue as number) < 0 ||
        !Number.isFinite(price60Value) ||
        (price60Value as number) <= 0 ||
        !Number.isFinite(price90Value) ||
        (price90Value as number) <= 0
      ) {
        setErrorMessage("Please complete all psychologist details.");
        setIsSubmitting(false);
        return;
      }
    }

    const price60Cents = isPsychologist ? Math.round((price60Value as number) * 100) : undefined;
    const price90Cents = isPsychologist ? Math.round((price90Value as number) * 100) : undefined;

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
        credentials: isPsychologist ? formData.credentials : undefined,
        licenseNumber: isPsychologist ? formData.licenseNumber : undefined,
        experience: experienceValue,
        bio: isPsychologist ? formData.bio : undefined,
        specializations,
        price60: price60Cents,
        price90: price90Cents,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setErrorMessage(data?.error ?? "Failed to create account.");
      setIsSubmitting(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (!result || result.error) {
      setErrorMessage("Account created, but login failed. Please log in.");
      setIsSubmitting(false);
      return;
    }

    router.push(getPostLoginPath(role));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-card">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-foreground">PsyConnect</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Your Account
          </h1>
          <p className="text-text-secondary mb-8">
            Join PsyConnect and start your journey to better mental health
          </p>

          {/* Role Selection */}
          {!selectedRole ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                I am a...
              </h2>
              <button
                onClick={() => setSelectedRole("patient")}
                className="w-full p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-colors">
                    <User size={24} className="text-primary group-hover:text-background" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Patient</h3>
                    <p className="text-sm text-text-secondary">
                      Looking for professional mental health support
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole("psychologist")}
                className="w-full p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-colors">
                    <User size={24} className="text-primary group-hover:text-background" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Psychologist</h3>
                    <p className="text-sm text-text-secondary">
                      Join our network of licensed professionals
                    </p>
                  </div>
                </div>
              </button>

              <div className="text-center pt-4">
                <p className="text-sm text-text-secondary">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary font-semibold hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Back Button */}
              <button
                onClick={() => setSelectedRole(null)}
                className="text-sm text-primary hover:underline mb-4 flex items-center gap-1"
              >
                ← Change role
              </button>

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage ? (
                  <div
                    className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                ) : null}
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="pl-10 h-12"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>

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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 h-12"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                    <Input
                      type="tel"
                      placeholder="+90 555 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10 h-12"
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {selectedRole === "psychologist" ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Credentials
                      </label>
                      <Input
                        type="text"
                        placeholder="PhD, Clinical Psychologist"
                        value={formData.credentials}
                        onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        License Number
                      </label>
                      <Input
                        type="text"
                        placeholder="PSY-12345-TR"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Years of Experience
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="10"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Specializations (comma-separated)
                      </label>
                      <Input
                        type="text"
                        placeholder="Anxiety, Depression, Trauma"
                        value={formData.specializations}
                        onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Price (60 min)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="450.00"
                          value={formData.price60}
                          onChange={(e) => setFormData({ ...formData, price60: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Price (90 min)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="650.00"
                          value={formData.price90}
                          onChange={(e) => setFormData({ ...formData, price90: e.target.value })}
                          className="h-12"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 h-12"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 pr-10 h-12"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-text-secondary">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-background h-12 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-text-secondary">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary font-semibold hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent items-center justify-center p-12">
        <div className="text-center text-background max-w-lg">
          <h2 className="text-4xl font-bold mb-6">
            Welcome to PsyConnect
          </h2>
          <p className="text-xl text-background/90 mb-8">
            Join thousands of people who found professional mental health support through our platform
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-card/20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-1">1,234+</div>
              <div className="text-sm">Happy Patients</div>
            </div>
            <div className="bg-card/20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-1">45</div>
              <div className="text-sm">Licensed Psychologists</div>
            </div>
            <div className="bg-card/20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-1">4.8/5</div>
              <div className="text-sm">Average Rating</div>
            </div>
            <div className="bg-card/20 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm">Confidential</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
