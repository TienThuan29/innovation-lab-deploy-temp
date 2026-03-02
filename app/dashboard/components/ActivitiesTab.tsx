import React from 'react';
import {
    CalendarIcon,
    ClockIcon,
    GlobeAltIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';
import { Activity } from '@/types/activity';

interface ActivitiesTabProps {
    activities: Activity[];
}

export default function ActivitiesTab({ activities }: ActivitiesTabProps) {
    return (
        <div className="grid grid-cols-1 gap-6">
            {activities.map((activity) => (
                <div key={activity.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                                    {/* Assuming typeName is available or mock it, relying on passed props */}
                                    Activity
                                </span>
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${activity.status === 'FUTURE' || activity.status === 'OPEN' as any ? 'bg-green-50 text-green-600 border-green-100' :
                                    activity.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        'bg-gray-50 text-gray-500 border-gray-100'
                                    }`}>
                                    {activity.status}
                                </span>
                            </div>
                            {activity.isFeatured && (
                                <span className="text-yellow-500">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{activity.summary}</p>

                        <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500 pt-4 border-t border-gray-50">
                            <span className="flex items-center gap-1.5">
                                <CalendarIcon className="w-4 h-4" /> {new Date(activity.startDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <ClockIcon className="w-4 h-4" /> {new Date(activity.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({activity.duration} min)
                            </span>
                            {activity.isOnline ? (
                                <span className="flex items-center gap-1.5 text-blue-600">
                                    <GlobeAltIcon className="w-4 h-4" /> Online Event
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-orange-600">
                                    <MapPinIcon className="w-4 h-4" /> On-site
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="w-full md:w-48 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 text-xs font-medium min-h-[120px]">
                        Preview Image
                    </div>
                </div>
            ))}
        </div>
    );
}
