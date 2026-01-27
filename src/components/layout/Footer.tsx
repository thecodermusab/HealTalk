import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

type FooterProps = {
  withShell?: boolean;
};

export default function Footer({ withShell = true }: FooterProps) {
  const contactInfo = [
    {
      icon: <Phone className="size-4" />,
      text: "1-800-555-0145",
      href: "tel:18005550145",
    },
    {
      icon: <MapPin className="size-4" />,
      text: "Online care, available nationwide",
      href: "/contact",
    },
    {
      icon: <Mail className="size-4" />,
      text: "support@healtalk.com",
      href: "mailto:support@healtalk.com",
    },
  ];

  const navigateLinks = [
    { title: "About", href: "/about" },
    { title: "Find Psychologists", href: "/find-psychologists" },
    { title: "Client Stories", href: "/#testimonials" },
    { title: "Contact", href: "/contact" },
  ];

  const solutionLinks = [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
    { title: "Sign In", href: "/login" },
    { title: "Create Account", href: "/signup" },
  ];

  const discoverLinks = [
    { title: "How It Works", href: "/onboarding/step-1" },
    { title: "Book a Session", href: "/find-psychologists" },
    { title: "Privacy & Confidentiality", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
  ];

  const socialLinks = [
    { title: "Facebook", href: "https://facebook.com" },
    { title: "Instagram", href: "https://instagram.com" },
    { title: "LinkedIn", href: "https://linkedin.com" },
    { title: "Twitter", href: "https://twitter.com" },
  ];

  const content = (
    <>
      {/* Footer Links Grid */}
      <div className="px-6 py-12 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {/* Contact Column */}
          <div>
            <h3 className="text-base font-semibold text-[#1f2937]">Contact</h3>
            <div className="mt-4 space-y-4">
              {contactInfo.map((item, i) => {
                const content = (
                  <>
                    <div className="mt-0.5 flex size-9 items-center justify-center rounded-full border border-[#e7eaf2] bg-white text-[#5b61e7]">
                      {item.icon}
                    </div>
                    <span className="leading-relaxed">{item.text}</span>
                  </>
                );

                if (item.href.startsWith("/")) {
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      className="flex items-start gap-3 text-sm text-[#667085] transition-colors hover:text-[#1f2937]"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <a
                    key={i}
                    href={item.href}
                    className="flex items-start gap-3 text-sm text-[#667085] transition-colors hover:text-[#1f2937]"
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigate Column */}
          <div>
            <h3 className="text-base font-semibold text-[#1f2937]">Navigate</h3>
            <ul className="mt-4 space-y-2">
              {navigateLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#667085] transition-colors hover:text-[#1f2937]"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Column */}
          <div>
            <h3 className="text-base font-semibold text-[#1f2937]">Solution</h3>
            <ul className="mt-4 space-y-2">
              {solutionLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#667085] transition-colors hover:text-[#1f2937]"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover Column */}
          <div>
            <h3 className="text-base font-semibold text-[#1f2937]">Discover</h3>
            <ul className="mt-4 space-y-2">
              {discoverLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#667085] transition-colors hover:text-[#1f2937]"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h3 className="text-base font-semibold text-[#1f2937]">Follow Us</h3>
            <ul className="mt-4 space-y-2">
              {socialLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#667085] transition-colors hover:text-[#1f2937]"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar Divider */}
      <div className="border-t border-[#e7eaf2]" />

      {/* Bottom Bar */}
      <div className="px-6 py-6 text-xs text-[#667085] md:px-12 lg:px-16">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <span>HealTalk — private, supportive therapy, on your schedule.</span>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-[#1f2937]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#1f2937]">
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-[#667085]">
          © {new Date().getFullYear()} HealTalk. All rights reserved.
        </div>
      </div>
    </>
  );

  if (!withShell) {
    return content;
  }

  return (
    <section className="w-full bg-background pt-16 md:pt-20">
      <div className="w-full">
        <div className="rounded-[40px] border border-[#e7eaf2] bg-background overflow-hidden">
          {content}
        </div>
      </div>
    </section>
  );
}
