"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft, Mail, MailCheck, Archive, Trash2, Calendar, User, Shield } from "lucide-react";

interface MessageDetail {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: string;
  ipHash?: string;
  userAgent?: string;
}

export default function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [message, setMessage] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const fetchMessage = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/messages/${resolvedParams.id}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Message not found");
      setMessage(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, [resolvedParams.id]);

  const handleUpdateStatus = async (newStatus: "new" | "read" | "archived") => {
    try {
      const res = await fetch(`/api/admin/messages/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setMessage(data.data);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/messages/${resolvedParams.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.push("/admin/messages");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete message");
    }
  };

  if (loading) return <LoadingState message="RETRIEVING INQUIRY RECORD..." />;
  if (error || !message) return <ErrorState message={error || "Message not found"} />;

  const replyMailto = `mailto:${message.email}?subject=${encodeURIComponent(
    `Re: Communication from Akhil K Anil — DevOps Engineer`
  )}`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/messages"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={14} /> BACK TO MESSAGES
        </Link>
        <StatusBadge status={message.status} />
      </div>

      <AdminHeader
        title={`INQUIRY FROM ${message.name.toUpperCase()}`}
        subtitle={`Submitted on ${formatDateTime(message.createdAt)}`}
      />

      {/* Message Content Container */}
      <div className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-6">
        {/* Sender details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-zinc-800 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <User size={13} /> Sender Name
            </span>
            <p className="text-sm font-semibold text-zinc-100">{message.name}</p>
          </div>

          <div className="space-y-1">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Mail size={13} /> Email Address
            </span>
            <a
              href={`mailto:${message.email}`}
              className="text-sm font-semibold text-emerald-400 hover:underline"
            >
              {message.email}
            </a>
          </div>

          <div className="space-y-1">
            <span className="text-zinc-500 flex items-center gap-1.5">
              <Calendar size={13} /> Timestamp
            </span>
            <p className="text-zinc-300">{formatDateTime(message.createdAt)}</p>
          </div>

          {message.ipHash && (
            <div className="space-y-1">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Shield size={13} /> Anonymized IP Hash (SHA-256)
              </span>
              <p className="text-zinc-400 truncate text-[11px]">{message.ipHash}</p>
            </div>
          )}
        </div>

        {/* Message body */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Inquiry Message
          </span>
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-md font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
            {message.message}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            {message.status !== "read" && (
              <button
                onClick={() => handleUpdateStatus("read")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
              >
                <MailCheck size={14} className="text-emerald-400" />
                MARK AS READ
              </button>
            )}
            {message.status !== "archived" && (
              <button
                onClick={() => handleUpdateStatus("archived")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
              >
                <Archive size={14} className="text-amber-400" />
                ARCHIVE
              </button>
            )}
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 text-xs font-mono text-red-400 transition-colors"
            >
              <Trash2 size={14} />
              DELETE
            </button>
          </div>

          <a
            href={replyMailto}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono tracking-wider transition-colors"
          >
            <Mail size={14} />
            REPLY VIA EMAIL →
          </a>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to permanently delete this message record?"
      />
    </div>
  );
}
