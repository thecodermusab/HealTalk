import CTASection from "@/components/layout/CTASection";
import Footer from "@/components/layout/Footer";

export default function CTAFooterShell() {
  return (
    <section className="w-full bg-background pt-16 md:pt-20">
      <div className="w-full">
        <div className="rounded-[40px] border border-[#e7eaf2] bg-background overflow-hidden">
          <CTASection />
          <div className="border-t border-[#e7eaf2]" />
          <Footer withShell={false} />
        </div>
      </div>
    </section>
  );
}
