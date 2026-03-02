import React from 'react';
import {
    BriefcaseIcon,
    CalendarIcon,
    ClockIcon,
    UserGroupIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { Opportunity } from '@/types/opportunity';

interface OpportunitiesTabProps {
    opportunities: Opportunity[];
}

const StatusBadge = ({ status }: { status: string }) => {
    const isClosed = status === 'closed';
    const colorClass = isClosed ? 'text-red-500' : 'text-green-500';
    const bgClass = isClosed ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200';

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${bgClass}`}>
            {status}
        </span>
    );
};

export default function OpportunitiesTab({ opportunities }: OpportunitiesTabProps) {
    if (opportunities.length === 0) {
        return <div className="text-center py-12 text-gray-400">No open opportunities listed.</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {opportunities.map((opp) => (
                <div key={opp.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            {/* Assuming projectTitle is available or we display just the title */}
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{opp.projectTitle || 'General Lab Opportunity'}</span>
                            <StatusBadge status={opp.status} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{opp.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{opp.description}</p>

                        <div className="flex flex-wrap gap-4 mt-auto">
                            {opp.requiredSkills.slice(0, 4).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                    {skill}
                                </span>
                            ))}
                            {opp.requiredSkills.length > 4 && (
                                <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded-md font-medium">
                                    +{opp.requiredSkills.length - 4} more
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-6 text-xs text-gray-500 mt-6 pt-4 border-t border-gray-50">
                            <span className="flex items-center gap-1.5">
                                <BriefcaseIcon className="w-4 h-4" /> {opp.duration}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <ClockIcon className="w-4 h-4" /> Deadline: {new Date(opp.deadline).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <UserGroupIcon className="w-4 h-4" /> {opp.openPositions} Open Positions
                            </span>
                        </div>
                    </div>
                    <div className="w-full md:w-48 flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4 text-center border-2 border-dashed border-gray-200">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Applications</span>
                        <span className="text-3xl font-bold text-gray-900">12{/* Placeholder count */}</span>
                        <button className="mt-3 text-xs font-bold text-blue-600 hover:underline">View All</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
