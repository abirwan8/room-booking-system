"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { LoginResponse } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = (await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      })) as LoginResponse;

      saveAuth(response.token, response.user);

      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold">Room Booking</h1>

        <p className="mb-6 text-gray-500">Sign in to your account</p>

        {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>

            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>

            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary" placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary p-3 font-medium text-white hover:bg-primary-dark disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
