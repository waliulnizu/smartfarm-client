"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { getMe, updateProfile, UserProfile } from "@/services/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { router.replace("/login"); return; }
    getMe().then((u) => {
      setUser(u);
      setForm({ name: u.name || "", email: u.email });
      setIsLoading(false);
    }).catch(() => router.replace("/login"));
  }, [router]);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateProfile({ name: form.name, email: form.email });
      setUser(updated);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccess("Password updated successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navbar />
        <div className="pt-20">
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 rounded bg-zinc-200" />
              <div className="h-4 w-32 rounded bg-zinc-200" />
              <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
                <div className="h-10 rounded bg-zinc-100" />
                <div className="h-10 rounded bg-zinc-100" />
                <div className="h-10 rounded bg-zinc-100" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <h1 className="mb-1 text-3xl font-bold text-zinc-900">Profile</h1>
          <p className="mb-6 text-zinc-500">Manage your account settings</p>

          {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          {success && <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600">{success}</div>}

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900">Personal Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-emerald-600">{user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{user?.name || "No name set"}</p>
                    <p className="text-sm text-zinc-500">{user?.email}</p>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Role</label>
                  <input type="text" value={user?.role || ""} disabled className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-500" />
                </div>

                <button type="submit" disabled={isSaving} className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900">Change Password</h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Current Password</label>
                  <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">New Password</label>
                  <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">Confirm New Password</label>
                  <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                </div>

                <button type="submit" disabled={isSaving || !passwordForm.currentPassword || !passwordForm.newPassword} className="rounded-xl bg-zinc-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-900 disabled:opacity-50">
                  {isSaving ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold text-zinc-900">Account Info</h2>
              <div className="space-y-2 text-sm text-zinc-600">
                <p><span className="font-medium text-zinc-700">Account created:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
