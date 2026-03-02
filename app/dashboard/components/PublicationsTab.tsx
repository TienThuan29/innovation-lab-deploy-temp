import React from 'react';
import {
    DocumentTextIcon,
    LinkIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication'; // Assuming types are aligned

// Helper to find avatar for author
const getAuthorAvatar = (authorName: string, members: any[]) => {
    const member = members.find(m => m.name === authorName);
    return member?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&size=32`;
};

interface PublicationsTabProps {
    publications: Publication[];
    members?: any[]; // Optional members list for avatar lookup
}

export default function PublicationsTab({ publications, members = [] }: PublicationsTabProps) {
    if (publications.length === 0) {
        return <div className="text-center py-12 text-gray-400">No publications found.</div>;
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Publication Title</th>
                            <th className="px-6 py-4">Authors</th>
                            <th className="px-6 py-4">Venue</th>
                            <th className="px-6 py-4 text-center">Year</th>
                            <th className="px-6 py-4 text-center">Citations</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {publications.map((pub) => (
                            <tr key={pub.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex items-start gap-3">
                                        <DocumentTextIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{pub.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        {/* Avatars based on names */}
                                        {pub.authors.slice(0, 3).map((author, i) => (
                                            <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-white" title={author}>
                                                <img
                                                    src={getAuthorAvatar(author, members)}
                                                    alt={author}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                        ))}
                                        {pub.authors.length > 3 && (
                                            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[8px] font-medium text-gray-500">
                                                +{pub.authors.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{pub.venue}</td>
                                <td className="px-6 py-4 text-center font-medium">{pub.year}</td>
                                <td className="px-6 py-4 text-center font-medium">{pub.citations}</td>
                                <td className="px-6 py-4 text-right">
                                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                                        View <LinkIcon className="w-3 h-3" />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
