"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import NextImage from "next/image";
import type { User } from "@/types/user";
import Pagination from "./pagination";
import { mockLabs } from "@/mocks/labs";

function formatDate(date: Date) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(typeof date === "string" ? new Date(date) : date);
  } catch {
    return "-";
  }
}

export default function UserTable({
  users,
  title,
  showActions = true,
  showCreateButton = true,
  fixedLabId,
}: {
  users: User[];
  title?: string;
  showActions?: boolean;
  showCreateButton?: boolean;
  fixedLabId?: string;
}) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    avartarUrl: "",
    role: "STUDENT" as User["role"],
    labId: fixedLabId || "",
    isEnable: true,
  });
  const itemsPerPage = 7;

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!query) return users;
    const searchTerm = query.toLowerCase();
    return users.filter(
      (user) =>
        user.fullname.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm) ||
        user.labId.toLowerCase().includes(searchTerm),
    );
  }, [users, query]);

  // Reset to first page when query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [query]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - no actual submission
    if (editingUser) {
      console.log("Editing user:", editingUser.id, formData);
    } else {
      console.log("Creating user:", formData);
    }
    setShowCreateModal(false);
    setEditingUser(null);
    // Reset form
    setFormData({
      fullname: "",
      email: "",
      password: "",
      avartarUrl: "",
      role: "STUDENT",
      labId: fixedLabId || "",
      isEnable: true,
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullname: user.fullname,
      email: user.email,
      password: "",
      avartarUrl: user.avartarUrl,
      role: user.role,
      labId: user.labId,
      isEnable: user.isEnable,
    });
    setShowCreateModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    // UI only - no actual deletion
    console.log("Delete user:", userId);
  };

  return (
    <div className="rounded-base relative overflow-x-auto border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex-column flex flex-wrap items-center justify-between space-y-4 pb-4 md:flex-row md:space-y-0">
        <div className="flex items-center gap-3">
          {title ? (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          ) : null}
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
              placeholder="Search users"
              className="rounded-base block w-64 border border-gray-200 bg-white py-2 ps-9 pe-3 text-sm text-gray-900 shadow-xs placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>
        </div>
        {showCreateButton ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            + Create User
          </button>
        ) : null}
      </div>
      <table className="w-full text-left text-sm text-gray-700 rtl:text-right dark:text-gray-300">
        <thead className="border-t border-b border-gray-200 bg-gray-50 text-sm dark:border-gray-700 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 font-medium">
              User
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Enabled
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Role
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Lab
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Last Login
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
          {paginatedUsers.map((u) => (
            <tr
              key={u.id}
              style={{ height: "73px" }}
              className="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <th scope="row" className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <NextImage
                    className="h-10 w-10 rounded-full object-cover"
                    src={u.avartarUrl}
                    alt={u.fullname}
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                      {u.fullname}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {u.email}
                    </div>
                  </div>
                </div>
              </th>
              <td className="px-6 py-4 whitespace-nowrap">
                {u.isEnable ? (
                  <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>{" "}
                    Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-red-600 dark:text-red-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>{" "}
                    Disabled
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{u.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">{u.labId}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(u.lastLoginDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(u.createdDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(u.updatedDate)}
              </td>
              {showActions ? (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditUser(u)}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Edit
                    </button>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
          {Array.from({
            length: Math.max(0, itemsPerPage - paginatedUsers.length),
          }).map((_, index) => (
            <tr
              key={`empty-${index}`}
              style={{ height: "73px" }}
              className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <td
                colSpan={showActions ? 8 : 7}
                className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500"
              >
                {index === 0 && paginatedUsers.length === 0
                  ? "(No users found matching your search)"
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

      {/* Create/Edit User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingUser ? "Edit User" : "Create New User"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingUser(null);
                }}
                className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullname"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password{" "}
                    {editingUser ? "(leave empty to keep current)" : "*"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                    placeholder="••••••••"
                    required={!editingUser}
                  />
                </div>

                {/* Avatar URL */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="avartarUrl"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    name="avartarUrl"
                    id="avartarUrl"
                    value={formData.avartarUrl}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Role *
                  </label>
                  <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="STUDENT">Student</option>
                    <option value="RESEARCHER">Researcher</option>
                    <option value="LECTURER">Lecturer</option>
                    <option value="DIRECTOR">Director</option>
                    <option value="SUPER_DIRECTOR">Super Director</option>
                  </select>
                </div>

                {/* Lab */}
                <div>
                  <label
                    htmlFor="labId"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Lab *
                  </label>
                  <select
                    name="labId"
                    id="labId"
                    value={formData.labId}
                    onChange={handleInputChange}
                    disabled={!!fixedLabId}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-600"
                    required
                  >
                    <option value="">Select a lab</option>
                    {mockLabs.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.shortName} - {lab.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Is Enabled */}
                <div className="flex items-center sm:col-span-2">
                  <input
                    type="checkbox"
                    name="isEnable"
                    id="isEnable"
                    checked={formData.isEnable}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  <label
                    htmlFor="isEnable"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Enable user account
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingUser(null);
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
