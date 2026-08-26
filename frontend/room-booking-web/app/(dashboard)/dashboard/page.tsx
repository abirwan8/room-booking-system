"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { User } from "@/types/auth";

export default function DashboardPage() {
  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div className="p-6 md:p-8">
      <div>
        <p className="text-sm text-gray-500">
          Welcome back
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          {user?.name || "User"}
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your room bookings from here.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/rooms"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="text-3xl">🏢</div>

          <h2 className="mt-4 font-semibold">
            Meeting Rooms
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Browse available meeting rooms.
          </p>
        </Link>

        <Link
          href="/bookings/create"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="text-3xl">📅</div>

          <h2 className="mt-4 font-semibold">
            New Booking
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Request a room booking.
          </p>
        </Link>

        <Link
          href="/bookings"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="text-3xl">📋</div>

          <h2 className="mt-4 font-semibold">
            My Bookings
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            View and manage your bookings.
          </p>
        </Link>

        <Link
          href="/calendar"
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="text-3xl">🗓️</div>

          <h2 className="mt-4 font-semibold">
            Calendar
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            View approved room schedules.
          </p>
        </Link>

        {user?.role === "Admin" && (
          <Link
            href="/admin/bookings"
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl">⚙️</div>

            <h2 className="mt-4 font-semibold">
              Manage Bookings
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Approve or reject booking requests.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}