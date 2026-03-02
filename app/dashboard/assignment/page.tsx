"use client";

import React, { useMemo, useState, useEffect } from "react";
import { mockAssignments } from "@/mocks/assignments";
import { AssignmentStatus } from "@/types/assignment";
import { getStoredSession, type SessionData } from "@/utils/session";

type FilterStatus = "ALL" | AssignmentStatus;

export default function AssignmentPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    setSession(getStoredSession());
    const handleStorage = () => setSession(getStoredSession());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isDirector = session?.role === "DIRECTOR";
  const isLecturer = session?.role === "LECTURER";
  const userLabId = session?.labId;

  const filteredAssignments = useMemo(
    () =>
      mockAssignments.filter((a) => {
        // Director and Lecturer only see assignments of their own lab
        if ((isDirector || isLecturer) && userLabId && a.labId !== userLabId) {
          return false;
        }
        return filterStatus === "ALL" ? true : a.status === filterStatus;
      }),
    [filterStatus, isDirector, isLecturer, userLabId],
  );

  const getStatusColor = (status: AssignmentStatus) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "ONGOING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "FAIL":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return "text-gray-400";
    if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6 py-2">
      <section className="relative overflow-hidden rounded-2xl bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=1080&fit=crop"
            alt="Student assignments"
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <div className="max-w-3xl space-y-4 text-white">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              Assignments
            </p>
            <h1 className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
              Student Assignments
            </h1>
            <p className="max-w-2xl text-sm text-gray-100 sm:text-base md:text-lg">
              Quản lý và theo dõi các bài tập của học sinh.
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-300">
          Dashboard
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Assignments
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Lọc và quản lý các bài tập theo trạng thái.
        </p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <div className="flex flex-wrap gap-2">
          {["ALL", "DRAFT", "ONGOING", "COMPLETED", "FAIL"].map((status) => (
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
                  : status === "ONGOING"
                    ? "Đang làm"
                    : status === "COMPLETED"
                      ? "Hoàn thành"
                      : "Không đạt"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            Không có assignment nào theo bộ lọc hiện tại.
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <article
              key={assignment.id}
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md dark:bg-gray-900 dark:ring-gray-800"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      {assignment.name}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(assignment.status)}`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {assignment.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-gray-500 dark:text-gray-400">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Lab: {assignment.labId}
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
                      {assignment.startDate.toLocaleDateString()} -{" "}
                      {assignment.endDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4 md:min-w-max">
                  <div className="text-center">
                    {assignment.finalScore > 0 ? (
                      <>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Final Score
                        </p>
                        <p
                          className={`text-3xl font-bold ${getScoreColor(assignment.finalScore)}`}
                        >
                          {assignment.finalScore}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Not graded yet
                      </p>
                    )}
                  </div>
                  {assignment.feedback && (
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-300">
                        Feedback
                      </p>
                      <p className="line-clamp-2 text-xs text-blue-800 dark:text-blue-200">
                        {assignment.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
