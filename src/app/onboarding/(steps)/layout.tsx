import React from "react";

export default function StepsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-[#dcfce7] to-[#ccfbf1] flex flex-col font-heading">
      <style>{`
        body {
            background: linear-gradient(to bottom, #dcfce7, #ccfbf1);
            margin: 0;
            padding: 0;
        }
      `}</style>
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-6 mb-24">
        {children}
      </div>
    </div>
  );
}
