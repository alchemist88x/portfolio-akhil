"use client";

import React from "react";
import AdminModal from "./AdminModal";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "CONFIRM ACTION",
  message,
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  isDestructive = true,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-red-950/40 border border-red-800/50 text-red-400 mt-0.5">
            <AlertTriangle size={18} />
          </div>
          <p className="text-xs font-mono text-zinc-300 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-3.5 py-1.5 rounded text-xs font-mono tracking-wider transition-colors ${
              isDestructive
                ? "bg-red-950 hover:bg-red-900 text-red-300 border border-red-800"
                : "bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800"
            }`}
          >
            {isLoading ? "PROCESSING..." : confirmText}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
