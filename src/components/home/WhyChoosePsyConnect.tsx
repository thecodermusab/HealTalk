"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, Shield, Target, UserCheck } from "lucide-react";

export default function WhyChoosePsyConnect() {
  // TODO: tighten pill size/letter-spacing to match reference.
  // TODO: match headline scale/weight and spacing to the reference.
  // TODO: align card radius/shadow strength with the reference cards.
  // TODO: match icon badge size/placement and stroke weight.
  // TODO: match CTA gradient tones and pill button colors.
  // TODO: confirm grid gaps/row spans align with reference layout.
  const router = useRouter();

  return (
    <section className="w-full bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-[1140px] px-6 lg:px-8">
        <div className="mb-5 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-text-secondary">
            Why Choose Us
          </span>
        </div>

        <h2 className="mb-10 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:mb-12 lg:text-[44px]">
          Why{" "}
          <span className="text-primary">PsyConnect</span> is The Right Choice
          for You
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          <div className="group flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-border">
              <UserCheck className="h-5 w-5 text-secondary" strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-lg font-semibold text-foreground lg:text-xl">
              Licensed Professionals
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              Learn from licensed psychologists with real-world clinical
              experience, proven methods, and compassionate care designed for
              your needs.
            </p>
          </div>

          <div className="group flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-border">
              <Shield className="h-5 w-5 text-secondary" strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-lg font-semibold text-foreground lg:text-xl">
              Confidential & Secure
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              Earn peace of mind with HIPAA-compliant sessions, end-to-end
              encryption, and privacy-first care from day one.
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-b from-secondary to-primary p-6 shadow-lg lg:row-span-2 lg:p-7">
            <div>
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-background/40">
                <Calendar
                  className="h-5 w-5 text-background"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="mb-4 text-lg font-semibold text-background lg:text-xl">
                Flexible Scheduling
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-background/90">
                Balance therapy with real life. Choose from flexible
                appointments, including evenings and weekends, and learn at your
                own pace.
              </p>
              <p className="text-sm leading-relaxed text-background/90">
                Whether you're working or studying, customize a schedule that
                fits your needs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/find-psychologists")}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-success px-6 py-3 text-sm font-semibold text-background shadow-md transition-all duration-300 hover:bg-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/80 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
              aria-label="Start a free trial"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          <div className="group flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg lg:col-span-2 lg:p-7">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-border">
              <Target className="h-5 w-5 text-secondary" strokeWidth={1.5} />
            </div>
            <h3 className="mb-3 text-lg font-semibold text-foreground lg:text-xl">
              Comprehensive Specializations
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              Access psychologists specializing in anxiety, trauma,
              relationships, and more, with practical care you can apply right
              away.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
