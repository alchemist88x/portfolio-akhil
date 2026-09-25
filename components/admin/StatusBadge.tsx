import React from "react";

interface StatusBadgeProps {
  status: "published" | "draft" | "new" | "read" | "archived" | "online" | "current" | boolean;
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  let text = label;
  let bg = "bg-zinc-800/80 text-zinc-300 border-zinc-700";
  let dotColor = "bg-zinc-400";

  if (status === true || status === "published" || status === "online" || status === "current") {
    text = text || (status === "current" ? "CURRENT" : status === "online" ? "ONLINE" : "PUBLISHED");
    bg = "bg-emerald-950/60 text-emerald-400 border-emerald-800/60";
    dotColor = "bg-emerald-400";
  } else if (status === false || status === "draft") {
    text = text || "DRAFT";
    bg = "bg-zinc-900 text-zinc-400 border-zinc-800";
    dotColor = "bg-zinc-500";
  } else if (status === "new") {
    text = text || "NEW";
    bg = "bg-sky-950/60 text-sky-400 border-sky-800/60";
    dotColor = "bg-sky-400";
  } else if (status === "read") {
    text = text || "READ";
    bg = "bg-zinc-900 text-zinc-400 border-zinc-800";
    dotColor = "bg-zinc-500";
  } else if (status === "archived") {
    text = text || "ARCHIVED";
    bg = "bg-amber-950/50 text-amber-400 border-amber-800/50";
    dotColor = "bg-amber-400";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider uppercase border ${bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {text}
    </span>
  );
}
