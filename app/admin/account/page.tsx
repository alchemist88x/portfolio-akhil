"use client";

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingState from "@/components/admin/LoadingState";
import ErrorState from "@/components/admin/ErrorState";
import { formatDateTime } from "@/lib/utils";
import { UserCheck, Shield, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

interface AdminProfile {
  id: string;
  email: string;
  lastLoginAt?: string;
  createdAt: string;
}

export default function AdminAccountPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/me");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load account profile");
      setProfile(data.data);
      setFormData((prev) => ({ ...prev, email: data.data.email }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "DATABASE ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New password and confirmation do not match.");
        return;
      }
      if (!formData.currentPassword) {
        setError("Current password is required to change to a new password.");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update account");

      setSuccessMsg("Account credentials updated successfully.");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      fetchProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="AUTHENTICATING ACCOUNT PROTOCOL..." />;

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminHeader
        title="ADMIN ACCOUNT & SECURITY"
        subtitle="Manage administrative identity, cryptographic credentials, and session auditing"
        badge="ROOT ACCESS"
      />

      {error && (
        <div className="p-3.5 rounded bg-red-950/40 border border-red-800 text-red-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Account Info Card */}
      {profile && (
        <div className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs font-semibold uppercase border-b border-zinc-800 pb-2">
            <UserCheck size={15} className="text-emerald-400" />
            <span>SESSION AUDIT &amp; PROFILE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-1">
            <div>
              <span className="text-zinc-500">Current Login Email</span>
              <p className="font-semibold text-zinc-100 mt-0.5">{profile.email}</p>
            </div>
            <div>
              <span className="text-zinc-500">Last Successful Login</span>
              <p className="text-emerald-400 mt-0.5">
                {profile.lastLoginAt ? formatDateTime(profile.lastLoginAt) : "Current active session"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Update Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-6">
        <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs font-semibold uppercase border-b border-zinc-800 pb-2">
          <KeyRound size={15} className="text-sky-400" />
          <span>UPDATE CREDENTIALS</span>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Administrator Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-4 pt-2 border-t border-zinc-800/80">
          <span className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Change Password (Leave blank to keep existing password)
          </span>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              placeholder="••••••••••••"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                New Password (Min 8 chars)
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs font-mono tracking-wider transition-all disabled:opacity-50"
          >
            <Shield size={14} />
            {saving ? "UPDATING ACCOUNT..." : "UPDATE CREDENTIALS"}
          </button>
        </div>
      </form>
    </div>
  );
}
