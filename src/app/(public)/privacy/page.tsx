import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | HealTalk",
  description: "How HealTalk protects your privacy and keeps your data safe.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Privacy Policy
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          Your privacy matters. We keep your information safe and use it only to
          support your care.
        </p>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>
            We collect only the information we need to provide therapy services,
            such as your name, email, and session details.
          </p>
          <p>
            We never sell your data. We share information only with your consent
            or when required by law.
          </p>
          <p>
            Sessions are encrypted and protected. We also use secure systems to
            store and process your information.
          </p>
          <p>
            If you have questions, contact us anytime at{" "}
            <a className="text-primary hover:underline" href="mailto:support@healtalk.com">
              support@healtalk.com
            </a>
            .
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/find-psychologists"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-black hover:bg-primary/90"
          >
            Find a therapist
          </Link>
        </div>
      </div>
    </main>
  );
}
