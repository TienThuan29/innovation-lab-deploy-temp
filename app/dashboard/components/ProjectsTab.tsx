import React, { useMemo } from 'react';
import {
    CalendarIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { Project } from '@/types/project';
import { User } from '@/types/user'; // Ensure this type is available or use 'any' if needed

interface ProjectsTabProps {
    projects: Project[];
    members?: { id: string; name: string; avatar: string; role?: string }[];
}

const StatusBadge = ({ status }: { status: string }) => {
    const s = status.toLowerCase();
    let colorClass = 'bg-gray-100 text-gray-800';
    if (s === 'active' || s === 'ongoing') colorClass = 'bg-blue-50 text-blue-700 border border-blue-100';
    if (s === 'completed') colorClass = 'bg-green-50 text-green-700 border border-green-100';
    if (s === 'delayed') colorClass = 'bg-red-50 text-red-700 border border-red-100';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
            {status}
        </span>
    );
};

export default function ProjectsTab({ projects, members = [] }: ProjectsTabProps) {
    if (projects.length === 0) {
        return <div className="text-center py-12 text-gray-400">No active projects.</div>;
    }

    // Helper to get consistent random members for a project
    const getProjectMembers = (projectId: string) => {
        if (!members.length) return [];
        // Simple hash to pick members
        let hash = 0;
        for (let i = 0; i < projectId.length; i++) hash = projectId.charCodeAt(i) + ((hash << 5) - hash);

        const count = 2 + (Math.abs(hash) % 4); // 2 to 5 members
        const projectMembers = [];
        for (let i = 0; i < count; i++) {
            const index = (Math.abs(hash) + i * 7) % members.length;
            projectMembers.push(members[index]);
        }
        return projectMembers;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
                const projectMembers = getProjectMembers(project.id);
                // Deterministic progress based on Project ID hash instead of Math.random()
                let hash = 0;
                for (let i = 0; i < project.id.length; i++) hash = project.id.charCodeAt(i) + ((hash << 5) - hash);
                const progress = project.id === 'P4' ? 40 : (Math.abs(hash) % 80) + 10;

                return (
                    <div key={project.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group relative">
                        {/* ID Badge */}
                        <div className="absolute top-6 right-6 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            ID: {project.id}
                        </div>

                        {/* Header */}
                        <div className="mb-4 pr-12">
                            <StatusBadge status={project.status} />
                            <h3 className="text-lg font-bold text-gray-900 mt-3 leading-tight group-hover:text-blue-600 transition-colors">
                                {project.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px]">
                                {project.summary || project.description}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                                <span>Completion</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-auto space-y-4">
                            {/* Members */}
                            <div className="flex items-center -space-x-2 overflow-hidden py-1">
                                {projectMembers.map((m, i) => (
                                    <img
                                        key={i}
                                        src={m.avatar || `https://ui-avatars.com/api/?name=${m.name.replace(' ', '+')}&background=random`}
                                        alt={m.name}
                                        title={m.name}
                                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                                    />
                                ))}
                                {/* Add button placeholder */}
                                <button className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                    <EllipsisHorizontalIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
                                <div>
                                    {/* Source or extra info */}
                                    {project.fundingSource && (
                                        <div className="text-[10px] font-medium text-gray-400 transform origin-left">
                                            Source: {project.fundingSource}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900 leading-none">
                                        ${(project.budget / 1000).toFixed(0)}k
                                    </div>
                                    {/* <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Budget</div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
