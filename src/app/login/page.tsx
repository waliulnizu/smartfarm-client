"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      await refresh();
      router.push("/");
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse: CredentialResponse) {
    try {
      const { data } = await api.post("/auth/google", { credential: credentialResponse.credential });
      localStorage.setItem("accessToken", data.accessToken);
      await refresh();
      router.push("/");
    } catch {
      setError("Google login failed. Try email login instead.");
    }
  }

  function handleDemoLogin() {
    setEmail("admin@khamari.com");
    setPassword("123456");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-emerald-600 mb-4">&larr; Back to Home</Link>
          <span className="text-4xl">{"\uD83C\uDF3E"}</span>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900">SmartKhamar AI</h1>
          <p className="text-sm text-zinc-500">Sign in to your farm</p>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
          </div>
          <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400">
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 border-t border-zinc-200" />
          <span className="text-xs text-zinc-400">or</span>
          <div className="flex-1 border-t border-zinc-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </div>

        <button onClick={handleDemoLogin} className="mt-4 w-full rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100">
          Demo Login (Auto-fill)
        </button>

        <p className="mt-4 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-emerald-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
