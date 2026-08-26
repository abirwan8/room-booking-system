"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Booking } from "@/types/booking";
import BookingCard from "@/components/BookingCard";

export default function BookingsPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadBookings() {
    try {
      setLoading(true);

      const response =
        await apiFetch("/bookings/my");

      setBookings(response.data ?? []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      await apiFetch(
        `/bookings/${id}/cancel`,
        {
          method: "PUT",
        }
      );

      await loadBookings();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to cancel booking."
      );
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            My Bookings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your room bookings.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-gray-500">
            You don't have any bookings yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}