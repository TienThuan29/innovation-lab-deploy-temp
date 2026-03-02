import React from "react";
import {
  BriefcaseIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Opportunity } from "@/types/opportunity";

interface OpportunitiesTabProps {
  opportunities: Opportunity[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const isClosed = status === "closed";
  const bgClass = isClosed
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-green-50 text-green-700 border-green-200";

  return (
    <span
      className={`rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${bgClass}`}
    >
      {status}
    </span>
  );
};

export default function OpportunitiesTab({
  opportunities,
}: OpportunitiesTabProps) {
  if (opportunities.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        No open opportunities listed.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {opportunities.map((opp) => (
        <div
          key={opp.id}
          className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row"
        >
          <div className="flex-1">
            <div className="mb-2 flex items-start justify-between">
              {/* Assuming projectTitle is available or we display just the title */}
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                {opp.projectTitle || "General Lab Opportunity"}
              </span>
              <StatusBadge status={opp.status} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              {opp.title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              {opp.description}
            </p>

            <div className="mt-auto flex flex-wrap gap-4">
              {(opp.requiredSkills ?? []).slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                >
                  {skill}
                </span>
              ))}
              {(opp.requiredSkills?.length ?? 0) > 4 && (
                <span className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-400">
                  +{(opp.requiredSkills?.length ?? 0) - 4} more
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-6 border-t border-gray-50 pt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <BriefcaseIcon className="h-4 w-4" /> {opp.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" /> Deadline:{" "}
                {opp.deadline
                  ? new Date(opp.deadline).toLocaleDateString()
                  : "—"}
              </span>
              <span className="flex items-center gap-1.5">
                <UserGroupIcon className="h-4 w-4" /> {opp.openPositions} Open
                Positions
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 text-center md:w-48">
            <span className="mb-2 text-xs font-medium tracking-wider text-gray-400 uppercase">
              Applications
            </span>
            <span className="text-3xl font-bold text-gray-900">
              12{/* Placeholder count */}
            </span>
            <button className="mt-3 text-xs font-bold text-blue-600 hover:underline">
              View All
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
