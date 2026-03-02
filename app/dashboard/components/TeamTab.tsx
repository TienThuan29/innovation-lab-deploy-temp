import React from 'react';
import {
    EnvelopeIcon
} from '@heroicons/react/24/outline';
// import { ProjectMember } from '@/mocks/supervisor-data'; // Use generic User type if possible, or keep local interface
import { User } from '@/types/user';

interface TeamTabProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members: any[]; // Using any for now to be flexible with the mix of User and ProjectMember, ideally should act on a unified type
}

const RoleBadge = ({ role }: { role: string }) => {
    switch (role.toLowerCase()) {
        case 'lead':
        case 'supervisor':
            return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">{role}</span>;
        case 'researcher':
            return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">{role}</span>;
        default:
            return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-200">{role}</span>;
    }
};

export default function TeamTab({ members }: TeamTabProps) {
    if (members.length === 0) {
        return <div className="text-center py-12 text-gray-400">No active members found.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
                <div key={member.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        <img
                            src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-base font-bold text-gray-900 truncate">{member.name}</h3>
                            {/* Role is usually on project member, might differ for global lab member */}
                            {member.role && <RoleBadge role={member.role} />}
                        </div>
                        <p className="text-sm text-gray-500 truncate mb-1">{member.email || "email@example.com"}</p>
                        <div className="flex items-center gap-2 mt-2">
                            {/* Mock status if not present */}
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-xs text-gray-400">Active</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
