"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Pagination from "../components/pagination";
import { useRouter } from "next/navigation";
import { mockLabs } from "@/mocks/labs";
import type { Lab } from "@/types/lab";
import { getStoredSession, type SessionData } from "@/utils/session";

function formatDate(date: Date) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(typeof date === "string" ? new Date(date) : date);
  } catch {
    return "-";
  }
}

export default function LabManagementPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [labs, setLabs] = useState<Lab[]>(mockLabs);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    status: "ACTIVE" as Lab["status"],
    contactEmail: "",
    contactPhone: "",
    coverImageUrl: "",
    address: "",
  });
  const itemsPerPage = 7;

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const filteredLabs = useMemo(() => {
    if (!query) return labs;
    const q = query.toLowerCase();
    return labs.filter(
      (lab) =>
        lab.name.toLowerCase().includes(q) ||
        lab.shortName.toLowerCase().includes(q) ||
        lab.status.toLowerCase().includes(q) ||
        lab.contactEmail.toLowerCase().includes(q),
    );
  }, [labs, query]);

  const totalPages = Math.max(1, Math.ceil(filteredLabs.length / itemsPerPage));

  useMemo(() => setCurrentPage(1), [query]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedLabs = filteredLabs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLab) {
      setLabs((prev) =>
        prev.map((lab) =>
          lab.id === editingLab.id
            ? {
                ...lab,
                ...formData,
                updatedDate: new Date(),
              }
            : lab,
        ),
      );
    } else {
      const newLab: Lab = {
        id: `lab-${Date.now()}`,
        name: formData.name,
        shortName: formData.shortName,
        description: "",
        mission: "",
        scope: "",
        techStacks: [],
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        coverImageUrl: formData.coverImageUrl,
        address: formData.address,
        status: formData.status,
        createdDate: new Date(),
        updatedDate: new Date(),
      };
      setLabs((prev) => [newLab, ...prev]);
    }
    setShowModal(false);
    setEditingLab(null);
    setFormData({
      name: "",
      shortName: "",
      status: "ACTIVE",
      contactEmail: "",
      contactPhone: "",
      coverImageUrl: "",
      address: "",
    });
  };

  const handleEdit = (lab: Lab) => {
    setEditingLab(lab);
    setFormData({
      name: lab.name,
      shortName: lab.shortName,
      status: lab.status,
      contactEmail: lab.contactEmail,
      contactPhone: lab.contactPhone,
      coverImageUrl: lab.coverImageUrl,
      address: lab.address,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setLabs((prev) => prev.filter((lab) => lab.id !== id));
  };

  const isSuperDirector = session?.role === "SUPER_DIRECTOR";
  const showActions = isSuperDirector;

  if (session && !isSuperDirector) {
    return (
      <div className="rounded-base border border-gray-200 bg-white p-6 text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
        <p className="font-semibold text-red-600 dark:text-red-400">
          Access denied
        </p>
        <p className="mt-1">Only Super Director can view Lab Management.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-3 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-base relative overflow-x-auto border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lab Management
          </h2>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search labs"
              className="rounded-base block w-64 border border-gray-200 bg-white py-2 ps-9 pe-3 text-sm text-gray-900 shadow-xs placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>
        </div>
        {isSuperDirector ? (
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            + Create Lab
          </button>
        ) : null}
      </div>

      <table className="w-full text-left text-sm text-gray-700 rtl:text-right dark:text-gray-300">
        <thead className="border-t border-b border-gray-200 bg-gray-50 text-sm dark:border-gray-700 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 font-medium">
              Lab
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Created
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Updated
            </th>
            {showActions ? (
              <th scope="col" className="px-6 py-3 font-medium">
                Action
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {paginatedLabs.map((lab) => (
            <tr
              key={lab.id}
              className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200 shadow-sm dark:border-gray-700">
                    <Image
                      src={
                        lab.coverImageUrl ||
                        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=200&h=200&fit=crop"
                      }
                      alt={lab.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>{lab.name}</span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {lab.shortName}
                    </span>
                  </div>
                </div>
              </th>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex flex-col gap-1">
                  <span>{lab.contactEmail}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {lab.contactPhone}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    lab.status === "ACTIVE"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
                  }`}
                >
                  {lab.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {formatDate(lab.createdDate)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {formatDate(lab.updatedDate)}
              </td>
              {showActions ? (
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-3 text-xs font-semibold">
                    <button
                      onClick={() => handleEdit(lab)}
                      className="text-blue-600 hover:underline dark:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lab.id)}
                      className="text-red-600 hover:underline dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
          {Array.from({
            length: Math.max(0, itemsPerPage - paginatedLabs.length),
          }).map((_, index) => (
            <tr
              key={`empty-${index}`}
              style={{ height: "73px" }}
              className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <td
                colSpan={showActions ? 6 : 5}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {index === 0 && paginatedLabs.length === 0
                  ? "(No labs found matching your search)"
                  : "\u00A0"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-lg border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingLab ? "Edit Lab" : "Create Lab"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This is a UI-only form; changes are not persisted.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingLab(null);
                }}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:ring-2 focus:ring-blue-500/70 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Short Name
                  </label>
                  <input
                    name="shortName"
                    value={formData.shortName}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="STOPPED">STOPPED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contact Email
                  </label>
                  <input
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contact Phone
                  </label>
                  <input
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cover Image URL
                  </label>
                  <input
                    name="coverImageUrl"
                    value={formData.coverImageUrl}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingLab(null);
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-blue-200 focus:outline-none dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                  disabled={!isSuperDirector}
                >
                  {editingLab ? "Save changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
