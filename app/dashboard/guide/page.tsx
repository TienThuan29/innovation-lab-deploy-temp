"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockResearchGuides } from "@/mocks/research-guides";
import { mockLabs } from "@/mocks/labs";
import { ResearchGuide, ResearchGuideStatus } from "@/types/research-guide";
import { getStoredSession, type SessionData } from "@/utils/session";

type FilterStatus = "ALL" | ResearchGuideStatus;

type FormState = {
  title?: string;
  summary?: string;
  content?: string;
  status?: ResearchGuideStatus;
  labId?: string;
};

export default function GuidePage() {
  const router = useRouter();
  const [filterLabId, setFilterLabId] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<ResearchGuide | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    title: "",
    summary: "",
    content: "",
    status: "DRAFT",
    labId: "",
  });

  useEffect(() => {
    const currentSession = getStoredSession();
    setSession(currentSession);

    // Check if user is logged in and not a student
    if (!currentSession || currentSession.role === "STUDENT") {
      router.push("/");
      return;
    }

    setIsAuthorized(true);

    const handleStorage = () => {
      const newSession = getStoredSession();
      setSession(newSession);
      if (!newSession || newSession.role === "STUDENT") {
        router.push("/");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [router]);

  const isDirector = session?.role === "DIRECTOR";
  const isLecturer = session?.role === "LECTURER";
  const isSuperDirector = session?.role === "SUPER_DIRECTOR";
  const userLabId = session?.labId;

  const filteredGuides = useMemo(
    () =>
      mockResearchGuides.filter((g) => {
        // Director and Lecturer only see guides of their own lab
        if ((isDirector || isLecturer) && userLabId && g.labId !== userLabId) {
          return false;
        }
        const matchLab = filterLabId === "ALL" ? true : g.labId === filterLabId;
        const matchStatus =
          filterStatus === "ALL" ? true : g.status === filterStatus;
        return matchLab && matchStatus;
      }),
    [filterLabId, filterStatus, isDirector, isLecturer, userLabId],
  );

  const getStatusColor = (status: ResearchGuideStatus) => {
    switch (status) {
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "PUBLISHED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "";
    }
  };

  const getLabName = (labId: string) => {
    return mockLabs.find((l) => l.id === labId)?.name || labId;
  };

  const getLabColor = (index: number) => {
    const colors = [
      "from-red-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-green-500 to-emerald-500",
      "from-indigo-500 to-blue-500",
    ];
    return colors[index % colors.length];
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGuide) {
      console.log("Updating guide:", editingGuide.id, formData);
    } else {
      console.log("Creating new guide:", formData);
    }
    setIsModalOpen(false);
    setEditingGuide(null);
  };

  const handleEditGuide = (guide: ResearchGuide) => {
    setEditingGuide(guide);
    setFormData({
      title: guide.title,
      summary: guide.summary,
      content: guide.content,
      status: guide.status,
      labId: guide.labId,
    });
    setIsModalOpen(true);
  };

  const handleDeleteGuide = (guideId: string) => {
    console.log("Delete guide:", guideId);
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6 py-2">
      <section className="relative overflow-hidden rounded-2xl bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop"
            alt="Research and learning"
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <div className="max-w-3xl space-y-4 text-white">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              Research Guides
            </p>
            <h1 className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
              Research Guides
            </h1>
            <p className="max-w-2xl text-sm text-gray-100 sm:text-base md:text-lg">
              Khám phá các hướng dẫn nghiên cứu chi tiết cho mỗi phòng lab.
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-300">
              Dashboard
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Research Guides
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lọc và xem chi tiết các guide theo phòng lab và trạng thái.
            </p>
          </div>
          {isDirector && (
            <button
              onClick={() => {
                setEditingGuide(null);
                setFormData({
                  title: "",
                  summary: "",
                  content: "",
                  status: "DRAFT",
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
              Create Guide
            </button>
          )}
        </div>
      </div>

      {isSuperDirector && (
        <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Lọc theo phòng lab
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterLabId("ALL")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  filterLabId === "ALL"
                    ? "bg-indigo-600 text-white shadow"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                Tất cả phòng
              </button>
              {mockLabs.map((lab) => (
                <button
                  key={lab.id}
                  onClick={() => setFilterLabId(lab.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    filterLabId === lab.id
                      ? "bg-indigo-600 text-white shadow"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`}
                  title={lab.name}
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
              {(
                ["ALL", "DRAFT", "PUBLISHED", "ARCHIVED"] as FilterStatus[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as FilterStatus)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    filterStatus === status
                      ? "bg-indigo-600 text-white shadow"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  {status === "ALL"
                    ? "Tất cả"
                    : status === "DRAFT"
                      ? "Nháp"
                      : status === "PUBLISHED"
                        ? "Đã xuất bản"
                        : "Lưu trữ"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredGuides.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Không có guide nào theo bộ lọc hiện tại.
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const isExpanded = expandedGuideId === guide.id;
            const labIndex = mockLabs.findIndex((l) => l.id === guide.labId);

            return (
              <article
                key={guide.id}
                className="group rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md dark:bg-gray-900 dark:ring-gray-800"
              >
                <button
                  onClick={() =>
                    setExpandedGuideId(isExpanded ? null : guide.id)
                  }
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-4 p-6">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${getLabColor(labIndex)} font-bold text-white`}
                    >
                      {getLabName(guide.labId)[0]}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                            {guide.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {guide.summary}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                guide.status,
                              )}`}
                            >
                              {guide.status}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Lab: {getLabName(guide.labId)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Cập nhật:{" "}
                              {guide.updatedDate.toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>

                        <div className="ml-auto shrink-0">
                          <svg
                            className={`h-5 w-5 text-gray-400 transition ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 px-6 py-4 text-sm dark:border-gray-800">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {guide.content}
                    </div>
                    <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                      <span>
                        Tạo: {guide.createdDate.toLocaleDateString("vi-VN")}
                      </span>
                      <span className="ml-auto">
                        Người tạo: {guide.createdBy}
                      </span>
                    </div>
                    {isDirector && (
                      <div className="mt-3 flex items-center gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGuide(guide);
                          }}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Chỉnh sửa
                        </button>
                        <span className="text-gray-300 dark:text-gray-600">
                          |
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGuide(guide.id);
                          }}
                          className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Modal for Create/Edit Guide */}
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
                setEditingGuide(null);
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
                        {editingGuide
                          ? "Chỉnh sửa Research Guide"
                          : "Tạo Research Guide mới"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Điền thông tin cho research guide
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingGuide(null);
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
                        placeholder="Tên guide..."
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
                        rows={5}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Chi tiết về guide..."
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
                        disabled={isDirector}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400 dark:disabled:bg-gray-700"
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
                        <option value="PUBLISHED">Đã xuất bản</option>
                        <option value="ARCHIVED">Lưu trữ</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="gap-3 bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse dark:bg-gray-700/50">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto sm:text-sm"
                  >
                    {editingGuide ? "Cập nhật" : "Tạo mới"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingGuide(null);
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
    </div>
  );
}
