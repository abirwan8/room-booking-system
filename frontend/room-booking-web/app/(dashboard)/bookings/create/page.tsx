"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Room } from "@/types/room";

export default function CreateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rooms, setRooms] = useState<Room[]>([]);

  const [roomId, setRoomId] = useState(searchParams.get("roomId") || "");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);

  const [loadingRooms, setLoadingRooms] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRooms() {
      try {
        const response = await apiFetch("/rooms");

        setRooms(response.data ?? []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load rooms.");
      } finally {
        setLoadingRooms(false);
      }
    }

    loadRooms();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");

    if (!roomId) {
      setError("Please select a room.");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          roomId: Number(roomId),
          title,
          description,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        }),
      });

      router.push("/bookings");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">Create Booking</h1>

        <p className="mt-1 text-sm text-gray-500">Request a room booking.</p>

        {error && <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-medium">Room</label>

            <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="w-full rounded-lg border p-3" disabled={loadingRooms} required>
              <option value="">{loadingRooms ? "Loading rooms..." : "Select a room"}</option>

              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - {room.capacity} people
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>

            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border p-3" placeholder="Project Meeting" required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Description</label>

            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-28 w-full rounded-lg border p-3" placeholder="Describe your meeting..." />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Start Time</label>

              <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full rounded-lg border p-3" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">End Time</label>

              <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full rounded-lg border p-3" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary p-3 font-medium text-white hover:bg-primary-dark disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
