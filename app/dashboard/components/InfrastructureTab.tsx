import React from "react";
import { UserGroupIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { Infrastructure } from "@/types/infrastructure";

const StatusBadge = ({
  status,
  type = "dot",
}: {
  status: string;
  type?: "dot" | "badge";
}) => {
  const isOperational = status.toLowerCase() === "available";
  const bgClass = isOperational
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-red-50 text-red-700 border-red-200";

  if (type === "dot") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
        <span
          className={`h-2 w-2 rounded-full ${isOperational ? "bg-green-500" : "bg-red-500"}`}
        ></span>
        {isOperational ? "Systems Operational" : "Systems Offline"}
      </div>
    );
  }
  return (
    <span
      className={`rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${bgClass}`}
    >
      {status}
    </span>
  );
};

interface InfrastructureTabProps {
  infrastructure: Infrastructure[];
}

export default function InfrastructureTab({
  infrastructure,
}: InfrastructureTabProps) {
  if (infrastructure.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        No infrastructure resources listed.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {infrastructure.map((infra) => (
        <div
          key={infra.id}
          className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row"
        >
          <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 md:w-64">
            <img
              src={infra.coverImageUrl}
              alt={infra.description?.slice(0, 80) ?? "Infrastructure"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <div className="mb-2 flex items-start justify-between">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                {infra.typeId || "Infrastructure"}
              </span>
              <StatusBadge status={infra.status.toUpperCase()} type="badge" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              {infra.description}
            </h3>
            <p className="mb-4 text-sm text-gray-500">{infra.specifications}</p>

            <div className="mt-auto flex items-center gap-4 border-t border-gray-50 pt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <UserGroupIcon className="h-4 w-4" /> {infra.contactPerson}
              </span>
              <span className="flex items-center gap-1.5">
                <EnvelopeIcon className="h-4 w-4" /> {infra.contactEmail}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
