import React from "react";
import { FolderX, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon: Icon = FolderX,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-lg bg-zinc-950/40">
      <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 mb-3">
        <Icon size={24} />
      </div>
      <h3 className="text-sm font-mono font-semibold tracking-wider text-zinc-300 uppercase">
        {title}
      </h3>
      {description && (
        <p className="text-xs font-mono text-zinc-500 max-w-sm mt-1 mb-4">{description}</p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors"
        >
          <Plus size={14} />
          {actionText}
        </button>
      )}
    </div>
  );
}
