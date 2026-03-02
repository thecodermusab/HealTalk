"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileShareButtonProps {
  url: string;
  title: string;
}

export default function ProfileShareButton({ url, title }: ProfileShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore user-cancelled native share.
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="text-slate-600 hover:text-slate-900 gap-2"
    >
      <Share2 size={18} />
      {copied ? "Link Copied" : "Share"}
    </Button>
  );
}
