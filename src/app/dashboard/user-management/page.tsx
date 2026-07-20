"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsers, createUser, toggleUserStatus, deleteUser, getMe, AdminUser } from "@/services/api";
import { SkeletonTable } from "@/components/dashboard/Skeleton";

const ROLE_BADGE: Record<string, string> = {
  Admin: "bg-red-100 text-red-700",
  Staff: "bg-blue-100 text-blue-700",
};

export default function UserManagementPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getMe()
      .then((u) => {
        if (u.role !== "Admin") {
          router.replace("/dashboard/cow");
          return;
        }
        setAuthorized(true);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  useEffect(() => {
    if (authorized) loadUsers();
  }, [authorized]);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data.users);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  function showMsg(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await createUser({ name, email, password });
      showMsg("success", "Staff created successfully");
      setName("");
      setEmail("");
      setPassword("");
      setShowForm(false);
      loadUsers();
    } catch (err: any) {
      showMsg("error", err?.response?.data?.message || "Failed to create staff");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(id: string) {
    try {
      await toggleUserStatus(id);
      loadUsers();
    } catch {
      showMsg("error", "Failed to update user");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      showMsg("success", "User deleted");
      loadUsers();
    } catch (err: any) {
      showMsg("error", err?.response?.data?.message || "Failed to delete user");
    }
  }

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm"><SkeletonTable rows={5} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">User Management</h1>
          <p className="text-sm text-zinc-500">Manage staff accounts and their access</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {showForm ? "Cancel" : "+ Add Staff"}
        </button>
      </div>

      {message && (
        <div className={`rounded-lg p-3 text-sm font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border border-zinc-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-zinc-700">New Staff Account</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahim Mia" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Email *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. rahim@farm.com" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Password *</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 chars" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-400">This account will be created with the <strong>Staff</strong> role.</p>
          <button type="submit" disabled={isSaving} className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-emerald-400">
            {isSaving ? "Creating..." : "Create Staff"}
          </button>
        </form>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-medium uppercase text-zinc-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-zinc-400">No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-800">{u.name || "-"}</td>
                    <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_BADGE[u.role] || "bg-zinc-100 text-zinc-600"}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleToggle(u._id)} className="mr-2 rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200">
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
