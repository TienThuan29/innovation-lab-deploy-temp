import React from 'react';
import {
    CpuChipIcon,
    UserGroupIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { Infrastructure, InfrastructureStatus } from '@/types/infrastructure';
import Image from 'next/image';

const StatusBadge = ({ status, type = 'dot' }: { status: string, type?: 'dot' | 'badge' }) => {
    const isOperational = status.toLowerCase() === 'available';
    const colorClass = isOperational ? 'text-green-500' : 'text-red-500';
    const bgClass = isOperational ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200';

    if (type === 'dot') {
        return (
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <span className={`w-2 h-2 rounded-full ${isOperational ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {isOperational ? 'Systems Operational' : 'Systems Offline'}
            </div>
        );
    }
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${bgClass}`}>
            {status}
        </span>
    );
};

interface InfrastructureTabProps {
    infrastructure: Infrastructure[];
}

export default function InfrastructureTab({ infrastructure }: InfrastructureTabProps) {
    if (infrastructure.length === 0) {
        return <div className="text-center py-12 text-gray-400">No infrastructure resources listed.</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {infrastructure.map((infra) => (
                <div key={infra.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                        <img
                            src={infra.coverImageUrl}
                            alt={infra.typeName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{infra.typeName}</span>
                            <StatusBadge status={infra.status.toUpperCase()} type="badge" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{infra.description}</h3>
                        <p className="text-sm text-gray-500 mb-4">{infra.specifications}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50">
                            <span className="flex items-center gap-1.5">
                                <UserGroupIcon className="w-4 h-4" /> {infra.contactPerson}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <EnvelopeIcon className="w-4 h-4" /> {infra.contactEmail}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
