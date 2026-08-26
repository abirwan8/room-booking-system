"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Booking } from "@/types/booking";

export default function CalendarPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadCalendar() {
      try {
        const response =
          await apiFetch(
            "/bookings/calendar"
          );

        setBookings(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load calendar."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCalendar();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        Loading calendar...
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold">
        Booking Calendar
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-gray-500">
            No approved bookings.
          </p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">
                    {booking.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {booking.roomName}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                  {booking.status}
                </span>
              </div>

              <div className="mt-4 text-sm">
                <p>
                  Start:{" "}
                  {new Date(
                    booking.startTime
                  ).toLocaleString()}
                </p>

                <p>
                  End:{" "}
                  {new Date(
                    booking.endTime
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}