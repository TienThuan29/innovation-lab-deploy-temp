import React from "react";
import {
  CalendarIcon,
  ClockIcon,
  GlobeAltIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Activity } from "@/types/activity";

interface ActivitiesTabProps {
  activities: Activity[];
}

export default function ActivitiesTab({ activities }: ActivitiesTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row"
        >
          <div className="flex-1">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-bold tracking-wider text-gray-600 uppercase">
                  {/* Assuming typeName is available or mock it, relying on passed props */}
                  Activity
                </span>
                <span
                  className={`rounded-md border px-2.5 py-1 text-xs font-bold tracking-wider uppercase ${
                    activity.status === "FUTURE"
                      ? "border-green-100 bg-green-50 text-green-600"
                      : activity.status === "COMPLETED"
                        ? "border-blue-100 bg-blue-50 text-blue-600"
                        : "border-gray-100 bg-gray-50 text-gray-500"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
              {activity.isFeatured && (
                <span className="text-yellow-500">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              )}
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              {activity.title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              {activity.summary}
            </p>

            <div className="flex flex-wrap gap-4 border-t border-gray-50 pt-4 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />{" "}
                {new Date(activity.startDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />{" "}
                {new Date(activity.startDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ({activity.duration} min)
              </span>
              {activity.isOnline ? (
                <span className="flex items-center gap-1.5 text-blue-600">
                  <GlobeAltIcon className="h-4 w-4" /> Online Event
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-orange-600">
                  <MapPinIcon className="h-4 w-4" /> On-site
                </span>
              )}
            </div>
          </div>
          <div className="flex min-h-[120px] w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-xs font-medium text-gray-400 md:w-48">
            Preview Image
          </div>
        </div>
      ))}
    </div>
  );
}
