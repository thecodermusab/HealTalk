import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | HealTalk",
  description: "Simple terms for using HealTalk.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Terms of Service
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          These terms explain how HealTalk works and what you can expect.
        </p>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>
            HealTalk connects you with licensed psychologists for online
            therapy. It does not replace emergency services.
          </p>
          <p>
            You are responsible for providing accurate information and keeping
            your account secure.
          </p>
          <p>
            Payments are handled securely. Session fees are shown before you
            book.
          </p>
          <p>
            If you need urgent help, contact local emergency services or a crisis
            hotline right away.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-black hover:bg-primary/90"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
}
