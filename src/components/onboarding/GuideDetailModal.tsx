"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Volume2 } from "lucide-react";

interface Guide {
  id: number;
  name: string;
  imageSrc: string;
  traits: string[];
}

interface GuideDetailModalProps {
  guide: Guide | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GuideDetailModal({ guide, isOpen, onClose }: GuideDetailModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !guide) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Modal Container: 835px x 545px, 2.5rem radius, white */}
      <div 
        className="relative w-[835px] h-[545px] bg-white rounded-[2.5rem] shadow-2xl flex p-[26px] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Media (390px x 493px) */}
        <div className="relative w-[390px] h-[493px] rounded-[2rem] overflow-hidden bg-[#E8E2D9] shrink-0 group">
          <Image
            src={guide.imageSrc}
            alt={guide.name}
            fill
            className="object-cover object-top"
          />
          
          {/* Sound Icon (Top Left) */}
          <button className="absolute top-4 left-4 w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/80 transition-colors">
            <Volume2 className="w-5 h-5 text-gray-800" />
          </button>

          {/* Caption Pill (Bottom) - Example text */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm whitespace-nowrap">
             <span className="text-[14px] font-medium text-[#2D8B5E]">that everyone deserves</span>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex-1 flex flex-col pl-[32px] pt-[8px] pb-[8px] relative">
          {/* Close Button (Top Right) */}
          <button 
            onClick={onClose}
            className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Info */}
          <div className="mt-2 text-left">
            <h2 className="text-[28px] font-bold text-gray-900 leading-tight font-figtree mb-1">
              {guide.name}
            </h2>
            <p className="text-[15px] font-medium text-gray-500 mb-3">
              CFP® Professional
            </p>
            
            {/* Traits Row */}
            <div className="flex flex-wrap gap-x-3 text-[14px] text-gray-700 font-medium mb-6">
              {guide.traits.map((trait, i) => (
                <span key={i} className="flex items-center">
                   {/* Pass full string which contains emoji */}
                   {trait}
                   {/* Add bullet separator unless last item */}
                   {/* {i < guide.traits.length - 1 && <span className="mx-2 text-gray-300">•</span>} */}
                </span>
              ))}
            </div>
          </div>

          {/* Body Paragraph */}
          <div className="text-[15px] leading-[1.6] text-[#4b5563] space-y-4 pr-4">
            <p>
              {guide.name.split(' ')[0]} has 12 years of financial planning and advising experience. She's all about empowering people to make savvy decisions and unlock a-ha moments on their way to hitting their financial goals.
            </p>
            <p>
              She previously worked at Capital Asset Management Group, Motley Fool Wealth Management, and several boutique firms. Outside of work, {guide.name.split(' ')[0]} loves traveling, all things Beyoncé, and hanging with her husband and dog Smokey.
            </p>
          </div>

          {/* CTA Button (Bottom Center of Right Col) - 354px x 60px */}
          <div className="mt-auto w-full flex justify-center pb-2">
            <button className="w-[354px] h-[60px] bg-black text-white rounded-full font-semibold text-[16px] flex items-center justify-center hover:bg-gray-900 transition-colors active:scale-[0.99]">
              Work with {guide.name.split(' ')[0]}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
