"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Room {
  id: number;
  name: string;
  capacity: number;
  facilities?: string;
  createdAt: string;
}

interface RoomForm {
  name: string;
  capacity: string;
  facilities: string;
}

const emptyForm: RoomForm = {
  name: "",
  capacity: "",
  facilities: "",
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [form, setForm] = useState<RoomForm>(emptyForm);

  // =========================================================
  // LOAD ROOMS
  // =========================================================

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/rooms");

      if (!response.success) {
        throw new Error(response.message || "Failed to load rooms.");
      }

      setRooms(response.data ?? []);
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ADD ROOM
  // =========================================================

  const openAddModal = () => {
    setEditingRoom(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  // =========================================================
  // EDIT ROOM
  // =========================================================

  const openEditModal = (room: Room) => {
    setEditingRoom(room);

    setForm({
      name: room.name ?? "",
      capacity: String(room.capacity ?? ""),
      facilities: room.facilities ?? "",
    });

    setError("");
    setShowModal(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingRoom(null);
    setForm(emptyForm);
    setError("");
  };

  // =========================================================
  // HANDLE FORM CHANGE
  // =========================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE / UPDATE ROOM
  // =========================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Room name is required.");
      return;
    }

    if (!form.capacity || Number(form.capacity) <= 0) {
      setError("Capacity must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        capacity: Number(form.capacity),
        facilities: form.facilities.trim(),
      };

      let response;

      // UPDATE
      if (editingRoom) {
        response = await apiFetch(`/rooms/${editingRoom.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }

      // CREATE
      else {
        response = await apiFetch("/rooms", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (!response.success) {
        throw new Error(response.message || (editingRoom ? "Failed to update room." : "Failed to create room."));
      }

      closeModal();

      await loadRooms();

      alert(response.message || (editingRoom ? "Room updated successfully." : "Room created successfully."));
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Failed to save room.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE ROOM
  // =========================================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this room?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const response = await apiFetch(`/rooms/${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to delete room.");
      }

      await loadRooms();

      alert(response.message || "Room deleted successfully.");
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Failed to delete room.");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadRooms();
  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Rooms</h1>

          <p className="mt-1 text-sm text-gray-500">Manage rooms available for booking.</p>
        </div>

        <button type="button" onClick={openAddModal} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          + Add Room
        </button>
      </div>

      {/* ERROR */}
      {error && !showModal && <div className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

      {/* LOADING */}
      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-sm text-gray-500">Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        /* EMPTY */
        <div className="rounded-xl border bg-white p-10 text-center">
          <div className="mb-4 text-4xl">🏢</div>

          <h2 className="text-lg font-semibold">No rooms found</h2>

          <p className="mt-1 text-sm text-gray-500">Start by adding a new room.</p>

          <button type="button" onClick={openAddModal} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            + Add Room
          </button>
        </div>
      ) : (
        /* TABLE */
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-4">ID</th>

                  <th className="px-5 py-4">Room Name</th>

                  <th className="px-5 py-4">Capacity</th>

                  <th className="px-5 py-4">Facilities</th>

                  <th className="px-5 py-4">Created At</th>

                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    {/* ID */}
                    <td className="px-5 py-4">{room.id}</td>

                    {/* NAME */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{room.name}</p>
                    </td>

                    {/* CAPACITY */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{room.capacity} people</span>
                    </td>

                    {/* FACILITIES */}
                    <td className="max-w-xs px-5 py-4">
                      {room.facilities ? (
                        <div className="flex flex-wrap gap-1">
                          {room.facilities.split(",").map((facility, index) => (
                            <span key={index} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                              {facility.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* CREATED AT */}
                    <td className="px-5 py-4 text-gray-600">{room.createdAt ? new Date(room.createdAt).toLocaleString("id-ID") : "-"}</td>

                    {/* ACTION */}
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() => openEditModal(room)}
                          disabled={deletingId === room.id}
                          className="rounded-lg bg-yellow-500 px-3 py-2 text-xs font-medium text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() => handleDelete(room.id)}
                          disabled={deletingId === room.id}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === room.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">{editingRoom ? "Edit Room" : "Add New Room"}</h2>

                <p className="mt-1 text-sm text-gray-500">{editingRoom ? "Update room information." : "Add a new room to the booking system."}</p>
              </div>

              <button type="button" onClick={closeModal} disabled={saving} className="text-2xl leading-none text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>

            {/* MODAL ERROR */}
            {error && <div className="mx-6 mt-5 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* ROOM NAME */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Room Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Meeting Room A"
                  disabled={saving}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* CAPACITY */}
              <div>
                <label htmlFor="capacity" className="mb-2 block text-sm font-medium text-gray-700">
                  Capacity
                </label>

                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="20"
                  disabled={saving}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* FACILITIES */}
              <div>
                <label htmlFor="facilities" className="mb-2 block text-sm font-medium text-gray-700">
                  Facilities
                </label>

                <textarea
                  id="facilities"
                  name="facilities"
                  value={form.facilities}
                  onChange={handleChange}
                  placeholder="Projector, AC, Whiteboard, WiFi"
                  rows={3}
                  disabled={saving}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />

                <p className="mt-1 text-xs text-gray-400">Pisahkan fasilitas dengan koma.</p>
              </div>

              {/* ACTION */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button type="button" onClick={closeModal} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>

                <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50">
                  {saving ? "Saving..." : editingRoom ? "Update Room" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
