"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Room } from "@/types/room";
import RoomCard from "@/components/RoomCard";

export default function RoomsPage() {
  const [rooms, setRooms] =
    useState<Room[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadRooms() {
      try {
        const response =
          await apiFetch("/rooms");

        setRooms(response.data ?? []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load rooms."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRooms();
  }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Meeting Rooms
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Choose a room for your meeting.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-gray-500">
            No rooms available.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
            />
          ))}
        </div>
      )}
    </div>
  );
}