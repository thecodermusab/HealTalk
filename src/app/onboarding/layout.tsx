"use client";

export default function OnboardingRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full font-heading">
      {children}
    </div>
  );
}
