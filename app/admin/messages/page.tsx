"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import SearchInput from "@/components/admin/SearchInput";
import Pagination from "@/components/admin/Pagination";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import EmptyState from "@/components/admin/EmptyState";
import { formatDateTime } from "@/lib/utils";
import { Eye, Trash2, MailCheck, Archive, Mail } from "lucide-react";

interface MessageItem {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        status: statusFilter,
        search,
      });

      const res = await fetch(`/api/admin/messages?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load messages");

      setMessages(data.data.messages);
      setTotalPages(data.data.pagination.totalPages);
      setTotalRecords(data.data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE CONNECTION ERROR");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id: string, newStatus: "new" | "read" | "archived") => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      fetchMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/messages/${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchMessages();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete message");
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="CLIENT INQUIRIES"
        subtitle="Manage incoming contact submissions, rate-limited inquiries, and communications"
        badge={`${totalRecords} TOTAL`}
      />

      {error && <ErrorState message={error} onRetry={fetchMessages} />}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by name, email, or message text..."
        />

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded border border-zinc-800 text-xs font-mono">
          {["all", "new", "read", "archived"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1 rounded transition-colors uppercase ${
                statusFilter === st
                  ? "bg-zinc-800 text-emerald-400 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState message="QUERYING CONTACT RECORDS..." />
      ) : messages.length === 0 ? (
        <EmptyState
          title="NO CONTACT MESSAGES"
          description="Inquiries submitted via the public contact form will appear here."
          icon={Mail}
        />
      ) : (
        <div className="space-y-4">
          <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900/60 text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">SENDER</th>
                    <th className="py-3 px-4">MESSAGE SNIPPET</th>
                    <th className="py-3 px-4">RECEIVED</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {messages.map((msg) => (
                    <tr
                      key={msg._id}
                      className={`hover:bg-zinc-900/30 transition-colors ${
                        msg.status === "new" ? "bg-sky-950/10" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-zinc-100">{msg.name}</div>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-zinc-400 hover:text-emerald-400 transition-colors"
                        >
                          {msg.email}
                        </a>
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <p className="text-zinc-300 truncate">{msg.message}</p>
                      </td>
                      <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                        {formatDateTime(msg.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={msg.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-zinc-400">
                          <Link
                            href={`/admin/messages/${msg._id}`}
                            className="p-1.5 hover:text-zinc-100 rounded hover:bg-zinc-800"
                            title="Inspect Details"
                          >
                            <Eye size={14} />
                          </Link>
                          {msg.status !== "read" && (
                            <button
                              onClick={() => handleStatusChange(msg._id, "read")}
                              className="p-1.5 hover:text-emerald-400 rounded hover:bg-zinc-800"
                              title="Mark as Read"
                            >
                              <MailCheck size={14} />
                            </button>
                          )}
                          {msg.status !== "archived" && (
                            <button
                              onClick={() => handleStatusChange(msg._id, "archived")}
                              className="p-1.5 hover:text-amber-400 rounded hover:bg-zinc-800"
                              title="Archive"
                            >
                              <Archive size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setItemToDelete(msg._id);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 hover:text-red-400 text-zinc-500 rounded hover:bg-zinc-800"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalRecords={totalRecords}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to permanently delete this contact inquiry?"
      />
    </div>
  );
}
