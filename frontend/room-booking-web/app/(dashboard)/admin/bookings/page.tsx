"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Booking } from "@/types/booking";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  // =========================================================
  // LOAD BOOKINGS
  // =========================================================
  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/bookings");

      if (!response.success) {
        throw new Error(response.message || "Failed to load bookings.");
      }

      setBookings(response.data ?? []);
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // APPROVE BOOKING
  // =========================================================
  const handleApprove = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to approve this booking?");

    if (!confirmed) {
      return;
    }

    try {
      setLoadingAction(id);
      setError("");

      const response = await apiFetch(`/bookings/${id}/approve`, {
        method: "PUT",
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to approve booking.");
      }

      alert(response.message || "Booking approved successfully.");

      // Refresh data setelah approve
      await loadBookings();
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Failed to approve booking.");
    } finally {
      setLoadingAction(null);
    }
  };

  // =========================================================
  // REJECT BOOKING
  // =========================================================
  const handleReject = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to reject this booking?");

    if (!confirmed) {
      return;
    }

    try {
      setLoadingAction(id);
      setError("");

      const response = await apiFetch(`/bookings/${id}/reject`, {
        method: "PUT",
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to reject booking.");
      }

      alert(response.message || "Booking rejected successfully.");

      // Refresh data setelah reject
      await loadBookings();
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Failed to reject booking.");
    } finally {
      setLoadingAction(null);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    loadBookings();
  }, []);

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>

        <p className="mt-1 text-sm text-gray-500">Approve or reject booking requests.</p>
      </div>

      {/* ERROR */}
      {error && <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-600">{error}</div>}

      {/* LOADING */}
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        /* EMPTY */
        <div className="rounded-xl border bg-white p-10 text-center">No bookings found.</div>
      ) : (
        /* TABLE */
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-4">Booking</th>

                  <th className="px-5 py-4">Room</th>

                  <th className="px-5 py-4">User</th>

                  <th className="px-5 py-4">Schedule</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {bookings.map((booking) => {
                  const isProcessing = loadingAction === booking.id;

                  const isPending = Number(booking.status) === 0;

                  return (
                    <tr key={booking.id}>
                      {/* BOOKING */}
                      <td className="px-5 py-4">
                        <p className="font-medium">{booking.title}</p>

                        {booking.description && <p className="mt-1 text-xs text-gray-500">{booking.description}</p>}
                      </td>

                      {/* ROOM */}
                      <td className="px-5 py-4">{booking.roomName}</td>

                      {/* USER */}
                      <td className="px-5 py-4">{booking.userName}</td>

                      {/* SCHEDULE */}
                      <td className="px-5 py-4">
                        <p>{new Date(booking.startTime).toLocaleString()}</p>

                        <p className="text-gray-500">{new Date(booking.endTime).toLocaleString()}</p>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            Number(booking.status) === 0
                              ? "bg-yellow-100 text-yellow-700"
                              : Number(booking.status) === 1
                                ? "bg-green-100 text-green-700"
                                : Number(booking.status) === 2
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {Number(booking.status) === 0 ? "Pending" : Number(booking.status) === 1 ? "Approved" : Number(booking.status) === 2 ? "Rejected" : "Cancelled"}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4">
                        {isPending ? (
                          <div className="flex gap-2">
                            {/* APPROVE */}
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleApprove(booking.id)}
                              className="rounded-lg bg-green-600 px-3 py-2 text-xs text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing ? "Processing..." : "Approve"}
                            </button>

                            {/* REJECT */}
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleReject(booking.id)}
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing ? "Processing..." : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No action</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
