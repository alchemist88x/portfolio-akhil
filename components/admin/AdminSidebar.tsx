"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  FileText,
  Menu,
  X,
  Code2,
  Briefcase,
  FolderGit2,
  Heart,
  BookOpen,
  Newspaper,
  Terminal,
  Network,
  GitBranch,
  MessageSquare,
  Share2,
  Search,
  UserCheck,
  LogOut,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  unreadMessagesCount?: number;
}

export default function AdminSidebar({ unreadMessagesCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const navSections = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      title: "CONTENT",
      items: [
        { label: "Site Settings", href: "/admin/settings", icon: Settings },
        { label: "About", href: "/admin/about", icon: FileText },
        { label: "Navigation", href: "/admin/navigation", icon: Menu },
        { label: "Skills", href: "/admin/skills", icon: Code2 },
        { label: "Experience", href: "/admin/experience", icon: Briefcase },
        { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
        { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
        { label: "Hobbies", href: "/admin/hobbies", icon: Heart },
        { label: "Principles", href: "/admin/principles", icon: BookOpen },
      ],
    },
    {
      title: "INTERACTIVE",
      items: [
        { label: "Terminal", href: "/admin/terminal", icon: Terminal },
        { label: "Architecture", href: "/admin/architecture", icon: Network },
        { label: "CI/CD Pipeline", href: "/admin/pipelines", icon: GitBranch },
      ],
    },
    {
      title: "CONTACT",
      items: [
        {
          label: "Messages",
          href: "/admin/messages",
          icon: MessageSquare,
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
        },
        { label: "Social Links", href: "/admin/social", icon: Share2 },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "SEO Settings", href: "/admin/seo", icon: Search },
        { label: "Admin Account", href: "/admin/account", icon: UserCheck },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Drawer Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-800 text-zinc-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-sm font-semibold tracking-wider">AKHIL / ADMIN</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded bg-zinc-900 border border-zinc-800"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-zinc-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
              <span className="font-mono text-xs font-semibold tracking-widest text-zinc-100 uppercase">
                AKHIL / CONTROL
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mt-1">DevOps Control Plane</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-zinc-400 hover:text-zinc-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className="px-3 text-[10px] font-mono font-semibold tracking-widest text-zinc-500 uppercase">
                {sec.title}
              </div>
              <div className="space-y-0.5 pt-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-colors ${
                        isActive
                          ? "bg-zinc-800/90 text-emerald-400 font-medium border-l-2 border-emerald-500"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={15} className={isActive ? "text-emerald-400" : "text-zinc-500"} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/40">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-zinc-800/80 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-zinc-500" />
              Public Portfolio
            </span>
            <span className="text-[10px] text-zinc-600">↗</span>
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-mono text-red-400/90 hover:text-red-300 hover:bg-red-950/20 transition-colors text-left"
          >
            <LogOut size={14} />
            <span>{loggingOut ? "Logging out..." : "Logout Session"}</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}
