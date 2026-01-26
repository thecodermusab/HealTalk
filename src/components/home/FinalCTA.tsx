import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="py-32 bg-gradient-to-r from-primary via-primary/90 to-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Take the First Step Towards Better Mental Health?
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Join thousands of people who found support through PsyConnect
        </p>
        <Link href="/signup">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 px-12 py-7 text-xl h-auto font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            Get Started Today
          </Button>
        </Link>
      </div>
    </section>
  );
}
