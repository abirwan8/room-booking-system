"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Department {
  id: number;
  name: string;
  createdAt: string;
}

interface DepartmentForm {
  name: string;
}

const emptyForm: DepartmentForm = {
  name: "",
};

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const [form, setForm] = useState<DepartmentForm>(emptyForm);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch("/departments");

      if (!response.success) {
        throw new Error(response.message || "Failed to load departments.");
      }

      setDepartments(response.data ?? []);
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingDepartment(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (department: Department) => {
    setEditingDepartment(department);

    setForm({
      name: department.name ?? "",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingDepartment(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Department name is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
      };

      let response;

      // UPDATE
      if (editingDepartment) {
        response = await apiFetch(`/departments/${editingDepartment.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }

      // CREATE
      else {
        response = await apiFetch("/departments", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to save department.");
      }

      closeModal();

      await loadDepartments();

      alert(response.message || "Department saved successfully.");
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Failed to save department.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this department?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const response = await apiFetch(`/departments/${id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to delete department.");
      }

      await loadDepartments();

      alert(response.message || "Department deleted successfully.");
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Failed to delete department.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  return (
    <div className="p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Departments</h1>

          <p className="mt-1 text-sm text-gray-500">Manage departments in the room booking system.</p>
        </div>

        <button type="button" onClick={openAddModal} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          + Add Department
        </button>
      </div>

      {/* ERROR */}
      {error && !showModal && <div className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

      {/* LOADING */}
      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-sm text-gray-500">Loading departments...</p>
        </div>
      ) : departments.length === 0 ? (
        /* EMPTY */
        <div className="rounded-xl border bg-white p-10 text-center">
          <div className="mb-4 text-4xl">🏢</div>

          <h2 className="text-lg font-semibold">No departments found</h2>

          <p className="mt-1 text-sm text-gray-500">Start by adding a new department.</p>

          <button type="button" onClick={openAddModal} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            + Add Department
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

                  <th className="px-5 py-4">Name</th>

                  <th className="px-5 py-4">Created At</th>

                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {departments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    {/* ID */}
                    <td className="px-5 py-4">{department.id}</td>

                    {/* NAME */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{department.name}</p>
                    </td>

                    {/* CREATED AT */}
                    <td className="px-5 py-4 text-gray-600">{department.createdAt ? new Date(department.createdAt).toLocaleString("id-ID") : "-"}</td>

                    {/* ACTION */}
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() => openEditModal(department)}
                          disabled={deletingId === department.id}
                          className="rounded-lg bg-yellow-500 px-3 py-2 text-xs font-medium text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() => handleDelete(department.id)}
                          disabled={deletingId === department.id}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === department.id ? "Deleting..." : "Delete"}
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
            {/* HEADER */}

            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">{editingDepartment ? "Edit Department" : "Add New Department"}</h2>

                <p className="mt-1 text-sm text-gray-500">{editingDepartment ? "Update department information." : "Add a new department."}</p>
              </div>

              <button type="button" onClick={closeModal} disabled={saving} className="text-2xl leading-none text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>

            {/* MODAL ERROR */}

            {error && <div className="mx-6 mt-5 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>}

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Department Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Information Technology"
                  disabled={saving}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* ACTION */}

              <div className="flex justify-end gap-3 border-t pt-5">
                <button type="button" onClick={closeModal} disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>

                <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50">
                  {saving ? "Saving..." : editingDepartment ? "Update Department" : "Add Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
