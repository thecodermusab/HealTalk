/* src/components/home/HeroSection.tsx */
"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";


export default function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);
    const heroSectionStyle = {
        "--hero-nav-gap": "18px"
    } as CSSProperties;

    useEffect(() => {
        setIsVisible(true);
    }, []); // Updated: 2026-01-27

    return (
        <section
            className="relative w-full min-h-screen bg-[#F5F1E8] overflow-hidden flex flex-col font-sans text-[#1A3B2F] z-0"
            style={heroSectionStyle}
        >

            {/*
              HERO CONTENT CONTAINER
              - Layout: Left (55%) and Right (45%)
              - Height: Fill remaining viewport (navbar: 78px + top gap: 22px = 100px total)
              - 18px gap from navbar to video card is applied via video wrapper paddingTop below
            */}
            <div className="flex w-full h-[calc(100vh-100px)] mt-0">
                
                {/*
                  LEFT COLUMN: Text Content (55%)
                  - Position: Relative for absolute child positioning
                  - Padding: 0 strict
                */}
                <div className="w-[55%] relative h-full p-0">
                    {/*
                      HEADLINE CONTAINER
                      - Position: Absolute with bottom: 120px, left: 80px (exact spec for desktop)
                      - Responsive: adjust for tablet/mobile to prevent overflow
                    */}
                    <div
                        className="headline-container absolute flex flex-col items-start transition-all duration-1000 max-md:relative max-md:bottom-auto max-md:left-auto max-md:p-6 max-md:pt-20"
                        style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
                        }}
                    >
                        <h1
                            className="headline-text mb-0 max-md:text-[48px] max-md:leading-[56px]"
                            style={{
                                fontFamily: 'var(--font-logo)',
                                fontWeight: 400,
                                fontSize: '80px',
                                lineHeight: 0.95,
                                color: '#000000'
                            }}
                        >
                            <span className="whitespace-nowrap">
                                Finding <span className="circled-word relative inline-block whitespace-nowrap">
                                    <span className="relative z-10">your</span>
                                    {/* Orange oval behind "your" */}
                                    <span
                                        className="absolute pointer-events-none"
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%) rotate(-2deg)',
                                            width: '120%',
                                            height: '140%',
                                            border: '3px solid #FF7A59',
                                            borderRadius: "50%",
                                            zIndex: 0
                                        }}
                                    />
                                </span> people.
                            </span>
                            <br />
                            Made simpler.
                        </h1>

                        <Link href="/book">
                            <button
                                className="bg-black text-white text-[18px] font-normal px-10 py-4 hover:bg-gray-900 transition-transform hover:scale-105 shadow-none"
                                style={{
                                    marginTop: '58px',
                                    borderRadius: '50px'
                                }}
                            >
                                Book a call
                            </button>
                        </Link>
                    </div>
                </div>

                {/*
                  RIGHT COLUMN: Video Card (45%)
                  - Width: 580px video card with 45px right offset
                  - Height: 793px
                  - Top Padding: 22px (navbar sticky offset) + 18px gap
                  - Right Padding: 45px (offset from right edge)
                */}
                <div
                    className="w-[45%] h-full flex items-start justify-end"
                    style={{
                        paddingTop: 'calc(22px + var(--hero-nav-gap))',
                        paddingRight: '45px'
                    }}
                >
                    <div
                        className="relative overflow-hidden shadow-sm"
                        style={{
                            width: '580px', // Exact width
                            height: '793px', // Updated height
                            maxWidth: '100%',
                            borderRadius: '24px',
                            backgroundColor: '#C8B5E6',
                            zIndex: 1 // Lower than navbar
                        }}
                    >
                        {/*
                           VIDEO ELEMENT
                           - Autoplay, loop, muted, playsinline
                        */}
                        <video
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster="/assets/images/fredrik-solstad.jpg"
                        >
                            <source src="/assets/video/hero-video.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>

            </div>

        </section>
    );
}
