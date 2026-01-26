"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

function LightweightBackground({ className = "w-full h-full" }) {
    return (
        <div className={className}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 animate-gradient" />
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
        </div>
    );
}

export default function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="relative h-svh w-full overflow-hidden bg-black text-white">
            <div className="absolute inset-0">
                <LightweightBackground className="h-full w-full" />
            </div>

            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_80%_at_50%_50%,_transparent_40%,_black_100%)]" />

            <div className="relative z-10 flex h-svh w-full items-center justify-center px-6">
                <div className="text-center">
                    <h1
                        className={`mx-auto max-w-2xl lg:max-w-4xl text-[clamp(2.25rem,6vw,4rem)] font-extralight leading-[0.95] tracking-tight transition-all duration-1000 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                    >
                        Connect with Licensed Psychologists from the Comfort of Your Home
                    </h1>
                    <p
                        className={`mx-auto mt-4 max-w-2xl md:text-balance text-sm/6 md:text-base/7 font-light tracking-tight text-white/70 transition-all duration-1000 delay-200 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                    >
                        Professional mental health support, whenever you need it.
                        No waiting rooms, no delays, just compassionate care tailored to your journey.
                    </p>

                    <div
                        className={`mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                    >
                        <Link href="/find-psychologists">
                            <button
                                type="button"
                                className="group relative overflow-hidden border border-white/30 bg-gradient-to-r from-white/20 to-white/10 px-6 py-3 text-sm rounded-lg font-medium tracking-wide text-white backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-500 hover:border-white/50 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10 cursor-pointer"
                            >
                                Find a Psychologist
                            </button>
                        </Link>

                        <Link href="/how-it-works">
                            <button
                                type="button"
                                className="group relative px-6 py-3 text-sm font-medium tracking-wide text-white/90 transition-[filter,color] duration-500 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] hover:text-white cursor-pointer"
                            >
                                How It Works
                            </button>
                        </Link>
                    </div>

                    <div
                        className={`mt-8 flex flex-wrap justify-center items-center gap-4 md:gap-6 text-white/70 text-xs md:text-sm transition-all duration-1000 delay-500 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-[#81C784]" />
                            <span>Licensed Professionals</span>
                        </div>
                        <span className="hidden sm:inline text-white/30">•</span>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-[#81C784]" />
                            <span>Secure Platform</span>
                        </div>
                        <span className="hidden sm:inline text-white/30">•</span>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-[#81C784]" />
                            <span>Hospital Partnerships</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
