import React from "react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, badge, actions }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-zinc-100 uppercase">
            {title}
          </h1>
          {badge && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs font-mono text-zinc-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
