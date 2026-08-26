"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { User } from "@/types/auth";

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <aside className="hidden min-h-[calc(100vh-64px)] w-64 border-r border-primary-dark bg-primary p-4 text-white md:block">
      <nav className="space-y-1">
        <Link href="/dashboard" className="block rounded-lg px-4 py-3 hover:bg-white/15">
          Dashboard
        </Link>

        <Link href="/calendar" className="block rounded-lg px-4 py-3 hover:bg-white/15">
          Calendar
        </Link>

        <Link href="/bookings" className="block rounded-lg px-4 py-3 hover:bg-white/15">
          My Bookings
        </Link>

        <Link href="/bookings/create" className="block rounded-lg px-4 py-3 hover:bg-white/15">
          Create Booking
        </Link>

        <Link href="/rooms" className="block rounded-lg px-4 py-3 hover:bg-white/15">
          Rooms
        </Link>

        {user?.role === "Admin" && (
          <>
            <div className="mt-6 px-4 text-xs font-semibold uppercase text-white/70">Administration</div>

            <Link href="/admin/bookings" className="block rounded-lg px-4 py-3 hover:bg-white/15">
              Manage Bookings
            </Link>

            <Link href="/admin/rooms" className="block rounded-lg px-4 py-3 hover:bg-white/15">
              Manage Rooms
            </Link>

            <Link href="/admin/departments" className="block rounded-lg px-4 py-3 hover:bg-white/15">
              Manage Departments
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
