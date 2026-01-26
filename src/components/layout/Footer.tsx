import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

type FooterProps = {
  withShell?: boolean;
};

export default function Footer({ withShell = true }: FooterProps) {
  const contactInfo = [
    {
      icon: <Phone className="size-4" />,
      text: "602-774-4735",
      href: "tel:6027744735",
    },
    {
      icon: <MapPin className="size-4" />,
      text: "11022 South 51st Street Suite 105 Phoenix, AZ 85044",
      href: "#",
    },
    {
      icon: <Mail className="size-4" />,
      text: "hello@unifiedui.com",
      href: "mailto:hello@unifiedui.com",
    },
  ];

  const navigateLinks = [
    { title: "Services", href: "#" },
    { title: "Success Stories", href: "#" },
    { title: "Our Team", href: "#" },
    { title: "Discover", href: "#" },
    { title: "Care", href: "#" },
    { title: "Download App", href: "#" },
  ];

  const solutionLinks = [
    { title: "Get in Touch", href: "#" },
    { title: "Technology", href: "#" },
    { title: "Who're We?", href: "#" },
    { title: "Expertise", href: "#" },
  ];

  const discoverLinks = [
    { title: "Latest News", href: "#" },
    { title: "New Arrivals", href: "#" },
    { title: "Solution", href: "#" },
    { title: "Gain Profession", href: "#" },
    { title: "Career", href: "#" },
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
              {contactInfo.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-start gap-3 text-sm text-[#667085] transition-colors hover:text-[#1f2937]"
                >
                  <div className="mt-0.5 flex size-9 items-center justify-center rounded-full border border-[#e7eaf2] bg-white text-[#5b61e7]">
                    {item.icon}
                  </div>
                  <span className="leading-relaxed">{item.text}</span>
                </a>
              ))}
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
          <span>&copy;Copyright UnifiedUI.com All rights reserved.2024</span>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="transition-colors hover:text-[#1f2937]">
              Privacy &amp; Policy
            </a>
            <a href="#" className="transition-colors hover:text-[#1f2937]">
              Terms &amp; Condition
            </a>
          </div>
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
