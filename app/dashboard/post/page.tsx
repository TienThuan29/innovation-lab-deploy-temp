"use client";

import React, { useMemo, useState, useEffect } from "react";
import { mockPublications } from "@/mocks/publications";
import { Publication, PublicationType } from "@/types/publication";
import { getStoredSession, type SessionData } from "@/utils/session";

type FilterType = "ALL" | PublicationType;

type FormState = {
  title?: string;
  abstract?: string;
  venue?: string;
  type?: PublicationType;
  year?: number;
  url?: string;
  doi?: string;
  poster?: string;
  intellectualProperty?: string;
  citationText?: string;
  publishedDate?: string;
  createdDate?: string;
  updatedDate?: string;
  labId?: string;
  isSelectedForShowcase?: boolean;
};

export default function PostPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPublication, setEditingPublication] =
    useState<Publication | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [yearFilter, setYearFilter] = useState<string>("ALL");
  const [session, setSession] = useState<SessionData | null>(null);
  const [formData, setFormData] = useState<FormState>({
    title: "",
    abstract: "",
    venue: "",
    type: "JOURNAL",
    year: new Date().getFullYear(),
    url: "",
    doi: "",
    poster: "",
    intellectualProperty: "",
    citationText: "",
    publishedDate: "",
    createdDate: "",
    updatedDate: "",
    labId: "",
    isSelectedForShowcase: false,
  });

  useEffect(() => {
    setSession(getStoredSession());
    const handleStorage = () => setSession(getStoredSession());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isDirector = session?.role === "DIRECTOR";
  const isLecturer = session?.role === "LECTURER";
  const userLabId = session?.labId;

  const years = useMemo(
    () =>
      Array.from(new Set(mockPublications.map((p) => p.year)))
        .sort((a, b) => b - a)
        .map((y) => y.toString()),
    [],
  );

  const filteredPublications = useMemo(
    () =>
      mockPublications.filter((p) => {
        // Director and Lecturer only see publications of their own lab
        if ((isDirector || isLecturer) && userLabId && p.labId !== userLabId) {
          return false;
        }
        const matchType = filterType === "ALL" ? true : p.type === filterType;
        const matchYear =
          yearFilter === "ALL" ? true : p.year === Number(yearFilter);
        return matchType && matchYear;
      }),
    [filterType, yearFilter, isDirector, isLecturer, userLabId],
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "year") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPublication) {
      console.log("Updating publication:", editingPublication.id, formData);
    } else {
      console.log("Creating new publication:", formData);
    }
    setIsModalOpen(false);
    setEditingPublication(null);
  };

  const handleEditPublication = (publication: Publication) => {
    setEditingPublication(publication);
    setFormData({
      title: publication.title,
      abstract: publication.abstract,
      venue: publication.venue,
      type: publication.type,
      year: publication.year,
      url: publication.url,
      doi: publication.doi,
      poster: publication.poster,
      intellectualProperty: publication.intellectualProperty,
      citationText: publication.citationText,
      publishedDate:
        publication.publishedDate?.toISOString().split("T")[0] || "",
      createdDate: publication.createdDate?.toISOString().split("T")[0] || "",
      updatedDate: publication.updatedDate?.toISOString().split("T")[0] || "",
      labId: publication.labId,
      isSelectedForShowcase: publication.isSelectedForShowcase,
    });
    setIsModalOpen(true);
  };

  const handleDeletePublication = (publicationId: string) => {
    console.log("Delete publication:", publicationId);
    // TODO: Implement delete logic
  };

  return (
    <div className="space-y-6 py-2">
      <section className="relative overflow-hidden rounded-2xl bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1920&h=1080&fit=crop"
            alt="Publications"
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <div className="max-w-3xl space-y-4 text-white">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              Publications
            </p>
            <h1 className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
              Danh sách Publications
            </h1>
            <p className="max-w-2xl text-sm text-gray-100 sm:text-base md:text-lg">
              Xem nhanh các bài báo, conference papers và showcase của labs.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:items-center sm:justify-between dark:bg-gray-900 dark:ring-gray-800">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-300">
            Dashboard
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Publications
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Thêm mới, lọc và quản lý danh sách publication.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
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
            New Publication
          </button>
          <button
            onClick={() => {
              setFilterType("ALL");
              setYearFilter("ALL");
            }}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-200 hover:text-indigo-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-indigo-500 dark:hover:text-white"
          >
            Reset filter
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:items-center sm:justify-between dark:bg-gray-900 dark:ring-gray-800">
        <div className="flex flex-wrap gap-2">
          {["ALL", "JOURNAL", "CONFERENCE"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as FilterType)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filterType === type
                  ? "bg-indigo-600 text-white shadow"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {type === "ALL"
                ? "Tất cả"
                : type === "JOURNAL"
                  ? "Journal"
                  : "Conference"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Năm
          </label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-indigo-400"
          >
            <option value="ALL">Tất cả</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredPublications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Không có publication nào theo bộ lọc hiện tại.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPublications.map((post) => (
            <article
              key={post.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md dark:bg-gray-800 dark:ring-gray-700"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.poster}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm backdrop-blur dark:bg-gray-900/80 dark:text-indigo-300">
                    {post.type}
                  </span>
                  {post.isSelectedForShowcase && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-200">
                      Showcase
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {post.venue} · {post.year}
                </div>
                <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 transition group-hover:text-indigo-600 dark:text-white">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                  {post.abstract}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-700">
                    DOI: {post.doi}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-700">
                    Lab: {post.labId}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
                  >
                    Đọc bài
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Cập nhật {post.updatedDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                  <button
                    onClick={() => handleEditPublication(post)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Chỉnh sửa
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <button
                    onClick={() => handleDeletePublication(post.id)}
                    className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

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
              onClick={() => setIsModalOpen(false)}
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
                        {editingPublication
                          ? "Chỉnh sửa Publication"
                          : "Thêm Publication (demo)"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Form này dựa trên cấu trúc Publication: nhập tiêu đề,
                        tóm tắt, venue, type, năm, URL, DOI, poster, IP,
                        citation, ngày.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingPublication(null);
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
                        Title
                      </label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Enter publication title"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                      >
                        <option value="JOURNAL">Journal</option>
                        <option value="CONFERENCE">Conference</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Year
                      </label>
                      <input
                        type="number"
                        name="year"
                        value={formData.year ?? ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="2024"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Lab Id
                      </label>
                      <input
                        name="labId"
                        value={formData.labId}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="lab-001"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Venue
                      </label>
                      <input
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="IEEE Access, ACM CCS..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Poster URL
                      </label>
                      <input
                        name="poster"
                        value={formData.poster}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        URL
                      </label>
                      <input
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        DOI
                      </label>
                      <input
                        name="doi"
                        value={formData.doi}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="10.1234/..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Abstract
                      </label>
                      <textarea
                        name="abstract"
                        value={formData.abstract}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Brief summary..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Intellectual Property
                      </label>
                      <input
                        name="intellectualProperty"
                        value={formData.intellectualProperty}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Patent Pending ..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Citation Text
                      </label>
                      <input
                        name="citationText"
                        value={formData.citationText}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                        placeholder="Doe, J. (2023)..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Published Date
                      </label>
                      <input
                        type="date"
                        name="publishedDate"
                        value={formData.publishedDate}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Created Date
                      </label>
                      <input
                        type="date"
                        name="createdDate"
                        value={formData.createdDate}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Updated Date
                      </label>
                      <input
                        type="date"
                        name="updatedDate"
                        value={formData.updatedDate}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="showcase"
                        type="checkbox"
                        name="isSelectedForShowcase"
                        checked={Boolean(formData.isSelectedForShowcase)}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor="showcase"
                        className="text-sm text-gray-700 dark:text-gray-200"
                      >
                        Đánh dấu Showcase
                      </label>
                    </div>
                  </div>
                </div>
                <div className="gap-3 bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse dark:bg-gray-700/50">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto sm:text-sm"
                  >
                    {editingPublication ? "Cập nhật" : "Lưu (demo)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingPublication(null);
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
