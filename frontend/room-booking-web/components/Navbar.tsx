"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";
import { User } from "@/types/auth";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <header className="border-b border-primary-dark bg-primary text-white">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/dashboard" className="text-xl font-bold text-white">
          RoomBooking
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>

                <p className="text-xs text-white/70">{user.role}</p>
              </div>

              <button onClick={logout} className="rounded-lg border border-white/60 px-4 py-2 text-sm text-white hover:bg-white/15">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
