"use client";

import React, { useMemo, useState, useEffect } from "react";
import { mockActivities } from "@/mocks/activities";
import { mockLabs } from "@/mocks/labs";
import { Activity, ActivityStatus } from "@/types/activity";
import { getStoredSession, type SessionData } from "@/utils/session";

type FilterStatus = "ALL" | ActivityStatus;

type FormState = {
  title?: string;
  summary?: string;
  content?: string;
  activityTypeId?: string;
  status?: ActivityStatus;
  isFeatured?: boolean;
  startDate?: string;
  duration?: number;
  isOnline?: boolean;
  meetUrl?: string;
  isPublic?: boolean;
  labId?: string;
};

export default function ActivityPage() {
  const [filterLabId, setFilterLabId] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [formData, setFormData] = useState<FormState>({
    title: "",
    summary: "",
    content: "",
    activityTypeId: "",
    status: "DRAFT",
    isFeatured: false,
    startDate: "",
    duration: 60,
    isOnline: false,
    meetUrl: "",
    isPublic: true,
    labId: "",
  });

  useEffect(() => {
    setSession(getStoredSession());
    const handleStorage = () => setSession(getStoredSession());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isDirector = session?.role === "DIRECTOR";
  const isLecturer = session?.role === "LECTURER";
  const isSuperDirector = session?.role === "SUPER_DIRECTOR";
  const userLabId = session?.labId;

  const filteredActivities = useMemo(
    () =>
      mockActivities.filter((a) => {
        // Director and Lecturer only see activities of their own lab
        if ((isDirector || isLecturer) && userLabId && a.labId !== userLabId) {
          return false;
        }
        const matchLab = filterLabId === "ALL" ? true : a.labId === filterLabId;
        const matchStatus =
          filterStatus === "ALL" ? true : a.status === filterStatus;
        return matchLab && matchStatus;
      }),
    [filterLabId, filterStatus, isDirector, isLecturer, userLabId],
  );

  const stats = useMemo(
    () => ({
      total: mockActivities.length,
      featured: mockActivities.filter((a) => a.isFeatured).length,
      future: mockActivities.filter((a) => a.status === "FUTURE").length,
      completed: mockActivities.filter((a) => a.status === "COMPLETED").length,
    }),
    [],
  );

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "FUTURE":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "";
    }
  };

  const getLabName = (labId: string) => {
    return mockLabs.find((l) => l.id === labId)?.shortName || labId;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pick a representative image per lab (fallback included)
  const getActivityImage = (labId: string) => {
    switch (labId) {
      case "lab-001":
        return "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop&q=60"; // AI/Cyber
      case "lab-002":
        return "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&auto=format&fit=crop&q=60"; // Business
      case "lab-003":
        return "https://images.unsplash.com/photo-1517817748490-58b1c3ad5d63?w=1200&auto=format&fit=crop&q=60"; // Creative
      case "lab-004":
        return "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?w=1200&auto=format&fit=crop&q=60"; // Logistics
      case "lab-005":
        return "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=60"; // Robotics
      case "lab-006":
        return "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=1200&auto=format&fit=crop&q=60"; // Education
      default:
        return "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=60"; // Fallback team
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "duration") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActivity) {
      console.log("Updating activity:", editingActivity.id, formData);
    } else {
      console.log("Creating new activity:", formData);
    }
    setIsModalOpen(false);
    setEditingActivity(null);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      summary: activity.summary,
      content: activity.content,
      activityTypeId: activity.activityTypeId,
      status: activity.status,
      isFeatured: activity.isFeatured,
      startDate: activity.startDate.toISOString().split("T")[0],
      duration: activity.duration,
      isOnline: activity.isOnline,
      meetUrl: activity.meetUrl,
      isPublic: activity.isPublic,
      labId: activity.labId,
    });
    setIsModalOpen(true);
  };

  const handleDeleteActivity = (activityId: string) => {
    console.log("Delete activity:", activityId);
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
        {/* Hero Banner Section */}
        <section className="relative flex h-64 items-center justify-center overflow-hidden md:h-80">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop"
              alt="Lab activities"
              className="h-full w-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 px-4 text-center">
            <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">
              Lab Activities
            </h1>
            <p className="mx-auto max-w-2xl text-base text-gray-100 md:text-lg">
              Khám phá các hoạt động của các phòng lab, sự kiện, workshop và
              những cơ hội học tập
            </p>
          </div>
        </section>

        {/* Content Section */}
        <div className="space-y-6 px-6 py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Danh sách Activities
            </h2>
            {isDirector && (
              <button
                onClick={() => {
                  setEditingActivity(null);
                  setFormData({
                    title: "",
                    summary: "",
                    content: "",
                    activityTypeId: "",
                    status: "DRAFT",
                    isFeatured: false,
                    startDate: "",
                    duration: 60,
                    isOnline: false,
                    meetUrl: "",
                    isPublic: true,
                    labId: userLabId || "",
                  });
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Activity
              </button>
            )}
          </div>
          {isSuperDirector && (
            <div className="space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Chọn phòng lab
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterLabId("ALL")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      filterLabId === "ALL"
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Tất cả
                  </button>
                  {mockLabs.map((lab) => (
                    <button
                      key={lab.id}
                      onClick={() => setFilterLabId(lab.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        filterLabId === lab.id
                          ? "bg-indigo-600 text-white shadow"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {lab.shortName}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Trạng thái
                </label>
                <div className="flex flex-wrap gap-2">
                  {["ALL", "DRAFT", "FUTURE", "COMPLETED", "CANCELLED"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status as FilterStatus)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          filterStatus === status
                            ? "bg-indigo-600 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {status === "ALL"
                          ? "Tất cả"
                          : status === "DRAFT"
                            ? "Nháp"
                            : status === "FUTURE"
                              ? "Sắp tới"
                              : status === "COMPLETED"
                                ? "Hoàn thành"
                                : "Hủy"}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {filteredActivities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Không có activity nào theo bộ lọc hiện tại.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities
                .sort((a, b) => {
                  if (a.isFeatured && !b.isFeatured) return -1;
                  if (!a.isFeatured && b.isFeatured) return 1;
                  return b.startDate.getTime() - a.startDate.getTime();
                })
                .map((activity, idx) => {
                  const isOddDisplay = (idx + 1) % 2 === 1; // odd items: image left
                  const rowDir = isOddDisplay
                    ? "md:flex-row"
                    : "md:flex-row-reverse";
                  const imageUrl = getActivityImage(activity.labId);
                  return (
                    <article
                      key={activity.id}
                      className={`group rounded-2xl transition hover:shadow-md ${
                        activity.isFeatured
                          ? "bg-gradient-to-r from-yellow-50 to-orange-50 ring-2 ring-yellow-200 dark:from-yellow-900/20 dark:to-orange-900/20 dark:ring-yellow-700"
                          : "bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700"
                      }`}
                    >
                      <div className="p-6">
                        {/* Row with alternating image position */}
                        <div
                          className={`flex flex-col items-stretch gap-4 ${rowDir}`}
                        >
                          {/* Image column */}
                          <div className="md:w-1/3">
                            {/* Fixed image height for consistent layout */}
                            <div className="h-48 w-full overflow-hidden rounded-xl md:h-48">
                              <img
                                src={imageUrl}
                                alt={activity.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          </div>

                          {/* Content column */}
                          <div className="md:w-2/3">
                            <div className="flex flex-col gap-3">
                              <div className="flex items-start gap-3">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {activity.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {activity.summary}
                                  </p>
                                </div>
                                {activity.isFeatured && (
                                  <span className="rounded-full bg-yellow-200 px-3 py-1 text-xs font-bold whitespace-nowrap text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                                    ⭐ Featured
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {activity.content}
                              </p>

                              <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                    activity.status,
                                  )}`}
                                >
                                  {activity.status}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m0 0h5.581m0 0a2.003 2.003 0 01-.5-3.98m.5 3.98a2.001 2.001 0 001.972-1.999m-6.444-5.5h1m0 0h1m-1 0a1 1 0 00-1 1v1m0-1a1 1 0 001-1V8m0 4h1m-1 0v1m0-1a1 1 0 001-1V8"
                                    />
                                  </svg>
                                  {getLabName(activity.labId)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {formatDate(activity.startDate)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {Math.floor(activity.duration / 60)}h{" "}
                                  {activity.duration % 60}m
                                </span>
                                {activity.isOnline && (
                                  <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                    🌐 Online
                                  </span>
                                )}
                              </div>
                              {activity.isOnline && activity.meetUrl && (
                                <div className="pt-1">
                                  <a
                                    href={activity.meetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                      />
                                    </svg>
                                    Join Meeting
                                  </a>
                                </div>
                              )}
                              {isDirector && (
                                <div className="mt-3 flex items-center gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                                  <button
                                    onClick={() => handleEditActivity(activity)}
                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                  >
                                    Chỉnh sửa
                                  </button>
                                  <span className="text-gray-300 dark:text-gray-600">
                                    |
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleDeleteActivity(activity.id)
                                    }
                                    className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          )}
        </div>
      </main>

      {/* Modal for Create/Edit Activity */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/20 transition-opacity"
              aria-hidden="true"
              onClick={() => {
                setIsModalOpen(false);
                setEditingActivity(null);
              }}
            ></div>
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="relative inline-block w-full transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-2xl sm:align-middle dark:bg-gray-800">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6 bg-white px-6 py-6 dark:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className="text-xl leading-6 font-bold text-gray-900 dark:text-white"
                        id="modal-title"
                      >
                        {editingActivity
                          ? "Chỉnh sửa Activity"
                          : "Tạo Activity mới"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Điền thông tin cho activity
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingActivity(null);
                      }}
                      className="text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-200"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Tiêu đề *
                      </label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Tên activity..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Tóm tắt
                      </label>
                      <input
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Mô tả ngắn..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Nội dung
                      </label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Chi tiết về activity..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Lab *
                      </label>
                      <select
                        name="labId"
                        value={formData.labId}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                      >
                        <option value="">Chọn lab...</option>
                        {mockLabs.map((lab) => (
                          <option key={lab.id} value={lab.id}>
                            {lab.shortName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                      >
                        <option value="DRAFT">Nháp</option>
                        <option value="FUTURE">Sắp tới</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="CANCELLED">Hủy</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Ngày bắt đầu *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Thời lượng (phút)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="0"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="60"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Activity Type ID
                      </label>
                      <input
                        name="activityTypeId"
                        value={formData.activityTypeId}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="activity-type-001"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Link Meeting (nếu online)
                      </label>
                      <input
                        name="meetUrl"
                        value={formData.meetUrl}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="https://meet.google.com/..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="isOnline"
                        type="checkbox"
                        name="isOnline"
                        checked={Boolean(formData.isOnline)}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor="isOnline"
                        className="text-sm text-gray-700 dark:text-gray-200"
                      >
                        Online
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="isPublic"
                        type="checkbox"
                        name="isPublic"
                        checked={Boolean(formData.isPublic)}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor="isPublic"
                        className="text-sm text-gray-700 dark:text-gray-200"
                      >
                        Public
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="isFeatured"
                        type="checkbox"
                        name="isFeatured"
                        checked={Boolean(formData.isFeatured)}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="text-sm text-gray-700 dark:text-gray-200"
                      >
                        Featured (ghim lên đầu)
                      </label>
                    </div>
                  </div>
                </div>
                <div className="gap-3 bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse dark:bg-gray-700/50">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto sm:text-sm"
                  >
                    {editingActivity ? "Cập nhật" : "Tạo mới"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingActivity(null);
                    }}
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
