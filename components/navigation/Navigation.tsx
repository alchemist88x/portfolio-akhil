"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, ShieldCheck } from "lucide-react";

interface NavItem {
  _id?: string;
  label: string;
  sectionId: string;
  published: boolean;
}

interface NavigationProps {
  items: NavItem[];
  engineerName?: string;
}

export default function Navigation({ items, engineerName = "AKHIL" }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const publishedItems = items.filter((item) => item.published);

  const getHref = (item: NavItem) => {
    if (item.sectionId.startsWith("/")) return item.sectionId;
    if (item.sectionId === "blog" || item.label.toLowerCase() === "blog") return "/blog";
    return `/#${item.sectionId}`;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          scrolled
            ? "bg-[#0A0A0A]/85 backdrop-blur-md border-b border-zinc-800/80 py-3 shadow-lg"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Engineer Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-mono text-sm tracking-widest text-zinc-100 uppercase hover:text-emerald-400 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
            <span className="font-bold">{engineerName}</span>
            <span className="text-[10px] text-zinc-500 tracking-wider hidden sm:inline font-nothing">
              // DEVOPS &amp; CLOUD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-wider">
            {publishedItems.map((item) => {
              const href = getHref(item);
              const isBlog = item.sectionId === "blog" || item.label.toLowerCase() === "blog";
              return (
                <Link
                  key={item.sectionId}
                  href={href}
                  className={`uppercase transition-colors hover:underline underline-offset-4 decoration-emerald-500/60 ${
                    isBlog
                      ? "text-emerald-400 hover:text-emerald-300 font-bold"
                      : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/admin/login"
              className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 border border-zinc-800 px-2.5 py-1 rounded hover:border-zinc-700 transition-colors"
            >
              <ShieldCheck size={12} className="text-emerald-500" />
              <span className="font-nothing">CONTROL</span>
            </Link>
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-zinc-400 hover:text-zinc-100 bg-zinc-900/60 border border-zinc-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col justify-between p-6 sm:p-10 font-mono animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
              <span className="text-sm font-bold tracking-widest text-zinc-100 uppercase">
                {engineerName}
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-100 rounded bg-zinc-900 border border-zinc-800"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links list */}
          <div className="flex flex-col gap-6 py-8">
            <span className="text-xs text-zinc-600 tracking-widest uppercase font-nothing">NAVIGATION INDEX</span>
            {publishedItems.map((item, idx) => {
              const href = getHref(item);
              return (
                <Link
                  key={item.sectionId}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-baseline justify-between text-2xl font-bold tracking-tight text-zinc-200 hover:text-emerald-400 transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-zinc-600 font-normal font-nothing">
                    /0{idx + 1}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Footer info */}
          <div className="pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span className="font-nothing">KOCHI, KERALA, INDIA</span>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1 text-emerald-400"
            >
              <span className="font-nothing">CONTROL PLANE</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
