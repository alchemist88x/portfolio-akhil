import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUp } from "lucide-react";

interface SocialItem {
  platform: string;
  label: string;
  url: string;
  icon?: string;
  published: boolean;
}

interface FooterProps {
  settings?: {
    name?: string;
    fullName?: string;
    title?: string;
    experienceYears?: string;
    contactEmail?: string;
  };
  socialLinks?: SocialItem[];
}

export default function Footer({ settings, socialLinks = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const publishedSocials = socialLinks.filter((s) => s.published);

  return (
    <footer className="border-t border-zinc-800/80 bg-[#0A0A0A] py-14 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Brand & Titles */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
              <span className="text-base font-bold text-zinc-100 uppercase tracking-widest">
                {settings?.name || "AKHIL"}
              </span>
            </div>
            <div className="text-xs text-zinc-400 space-y-0.5">
              <p className="font-semibold uppercase text-zinc-300">
                {settings?.title || "DEVOPS ENGINEER & CLOUD INFRASTRUCTURE"}
              </p>
              <p className="text-zinc-500">
                {settings?.experienceYears || "10+ YEARS"} · AWS · LINUX · AUTOMATION · CLOUD
              </p>
            </div>
          </div>

          {/* Social and Reachability */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {publishedSocials.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-emerald-400 transition-colors uppercase"
              >
                {link.platform}
              </a>
            ))}
            <a
              href={`mailto:${settings?.contactEmail || "akhilkanil99@gmail.com"}`}
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              {settings?.contactEmail || "akhilkanil99@gmail.com"}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            <span>© {currentYear} {settings?.fullName || "Akhil K Anil"}. All rights reserved.</span>
            <span className="mx-2 text-zinc-700">|</span>
            <span className="text-zinc-400">BUILT WITH NEXT.JS &amp; TAILWIND</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              SYSTEM: ONLINE <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>

            <Link
              href="/admin/login"
              className="text-zinc-600 hover:text-zinc-400 flex items-center gap-1"
            >
              <ShieldCheck size={11} />
              <span>CONTROL</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
