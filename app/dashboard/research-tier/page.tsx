"use client";

import React, { useMemo, useState, useEffect } from "react";
import { mockResearchTiers } from "@/mocks/research-tiers";
import { mockLabs } from "@/mocks/labs";
import { ResearchTier } from "@/types/research-tier";
import { getStoredSession, type SessionData } from "@/utils/session";

type FormState = {
  name?: string;
  description?: string;
  requirements?: string;
  labId?: string;
};

export default function ResearchTierPage() {
  const [filterLabId, setFilterLabId] = useState<string>("ALL");
  // Use a composite key (labId + tier.id) to uniquely track expanded item
  const [expandedTierKey, setExpandedTierKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<ResearchTier | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    description: "",
    requirements: "",
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

  const filteredTiers = useMemo(
    () =>
      mockResearchTiers.filter((t) => {
        // Director and Lecturer only see tiers of their own lab
        if ((isDirector || isLecturer) && userLabId && t.labId !== userLabId) {
          return false;
        }
        const matchLab = filterLabId === "ALL" ? true : t.labId === filterLabId;
        return matchLab;
      }),
    [filterLabId, isDirector, isLecturer, userLabId],
  );
  const getLabName = (labId: string) => {
    return mockLabs.find((l) => l.id === labId)?.name || labId;
  };

  const getLabShortName = (labId: string) => {
    return mockLabs.find((l) => l.id === labId)?.shortName || labId;
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

  const getTierBadgeColor = (name: string) => {
    switch (name.toLowerCase()) {
      case "intern":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "junior researcher":
      case "junior":
      case "design assistant":
      case "founder":
      case "supply chain associate":
      case "robotics technician":
      case "edtech developer":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "senior researcher":
      case "senior":
      case "creative director":
      case "business analyst":
      case "logistics manager":
      case "robotics engineer":
      case "education specialist":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "principal investigator":
      case "principal":
      case "art director":
      case "executive consultant":
      case "supply chain director":
      case "chief roboticist":
      case "edtech director":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
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
    if (editingTier) {
      console.log("Updating tier:", editingTier.id, formData);
    } else {
      console.log("Creating new tier:", formData);
    }
    setIsModalOpen(false);
    setEditingTier(null);
  };

  const handleEditTier = (tier: ResearchTier) => {
    setEditingTier(tier);
    setFormData({
      name: tier.name,
      description: tier.description,
      requirements: tier.conditions,
      labId: tier.labId,
    });
    setIsModalOpen(true);
  };

  const handleDeleteTier = (tierId: string) => {
    console.log("Delete tier:", tierId);
  };

  // Group tiers by lab
  const tiersByLab = useMemo(() => {
    const grouped: { [key: string]: typeof mockResearchTiers } = {};
    filteredTiers.forEach((tier) => {
      if (!grouped[tier.labId]) {
        grouped[tier.labId] = [];
      }
      grouped[tier.labId].push(tier);
    });
    return grouped;
  }, [filteredTiers]);

  return (
    <div className="space-y-6 py-2">
      <section className="relative overflow-hidden rounded-2xl bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop"
            alt="Research tiers"
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <div className="max-w-3xl space-y-4 text-white">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              Lộ trình nghiên cứu
            </p>
            <h1 className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
              Research Tiers
            </h1>
            <p className="max-w-2xl text-sm text-gray-100 sm:text-base md:text-lg">
              Khám phá các cấp độ nghiên cứu và sự phát triển nghề nghiệp tại
              mỗi phòng lab.
            </p>
          </div>
        </div>
      </section>
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Research Tiers
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lọc theo phòng lab để xem cấp bậc tương ứng.
            </p>
          </div>
          {isDirector && (
            <button
              onClick={() => {
                setEditingTier(null);
                setFormData({
                  name: "",
                  description: "",
                  requirements: "",
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
              Create Tier
            </button>
          )}
        </div>
      </div>

      {isSuperDirector && (
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bộ lọc
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lọc theo phòng lab để xem cấp bậc tương ứng.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterLabId("ALL")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  filterLabId === "ALL"
                    ? "bg-indigo-600 text-white shadow"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                Tất cả
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
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(tiersByLab).length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Không có cấp độ nào cho phòng lab đã chọn.
          </div>
        ) : (
          Object.entries(tiersByLab).map(([labId, tiers]) => {
            const labIndex = mockLabs.findIndex((l) => l.id === labId);
            return (
              <section
                key={labId}
                className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800"
              >
                <header className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${getLabColor(labIndex)}`}
                    ></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase dark:text-gray-400">
                        Phòng lab
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {getLabName(labId)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getLabShortName(labId)}
                      </p>
                    </div>
                  </div>
                </header>

                <div className="relative space-y-3 px-5 py-5">
                  <div className="absolute top-5 bottom-5 left-5 w-px bg-gray-100 dark:bg-gray-800" />
                  {tiers
                    .sort(
                      (a, b) =>
                        (a.minYear || 0) - (b.minYear || 0) ||
                        a.name.localeCompare(b.name),
                    )
                    .map((tier, idx) => {
                      const tierKey = `${labId}:${tier.id}`;
                      const isExpanded = expandedTierKey === tierKey;

                      return (
                        <article
                          key={tierKey}
                          className="relative overflow-hidden rounded-lg border border-gray-100 bg-gray-50/60 shadow-sm transition hover:border-indigo-200 hover:bg-white dark:border-gray-800 dark:bg-gray-900"
                        >
                          <button
                            onClick={() =>
                              setExpandedTierKey(isExpanded ? null : tierKey)
                            }
                            className="flex w-full items-start gap-4 px-4 py-3 text-left"
                          >
                            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200">
                              <span className="text-sm font-semibold">
                                {idx + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getTierBadgeColor(
                                    tier.name,
                                  )}`}
                                >
                                  {tier.name}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
                                  {tier.minYear === 0 && tier.maxYear === 1
                                    ? "0-1 Year"
                                    : tier.minYear === 1 && tier.maxYear === 2
                                      ? "1-2 Years"
                                      : tier.minYear === 2 && tier.maxYear === 5
                                        ? "2-5 Years"
                                        : tier.minYear === 3 &&
                                            tier.maxYear === 7
                                          ? "3-7 Years"
                                          : tier.minYear === 5 &&
                                              tier.maxYear === 100
                                            ? "5+ Years"
                                            : tier.minYear === 6 &&
                                                tier.maxYear === 100
                                              ? "6+ Years"
                                              : tier.minYear === 7 &&
                                                  tier.maxYear === 100
                                                ? "7+ Years"
                                                : `${tier.minYear}-${tier.maxYear} Years`}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                {tier.description}
                              </p>
                              <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Tạo bởi: {tier.createdBy}</span>
                                <span
                                  className={`transition ${isExpanded ? "rotate-180" : ""}`}
                                >
                                  <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="space-y-3 border-t border-gray-100 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900">
                              <div>
                                <h4 className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                  Yêu cầu
                                </h4>
                                <p className="mt-1 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                  {tier.conditions}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                  Lợi ích
                                </h4>
                                <p className="mt-1 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                  {tier.benefits}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Cập nhật:{" "}
                                {tier.updatedDate.toLocaleDateString("vi-VN")}
                              </p>
                              {isDirector && (
                                <div className="flex items-center gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditTier(tier);
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
                                      handleDeleteTier(tier.id);
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
                    })}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Modal for Create/Edit Tier */}
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
                setEditingTier(null);
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
                        {editingTier
                          ? "Chỉnh sửa Research Tier"
                          : "Tạo Research Tier mới"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Điền thông tin cho research tier
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingTier(null);
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
                        Tên cấp bậc *
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Tên tier..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Mô tả
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Mô tả về tier..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Yêu cầu
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Yêu cầu và điều kiện..."
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
                  </div>
                </div>
                <div className="gap-3 bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse dark:bg-gray-700/50">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto sm:text-sm"
                  >
                    {editingTier ? "Cập nhật" : "Tạo mới"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingTier(null);
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
