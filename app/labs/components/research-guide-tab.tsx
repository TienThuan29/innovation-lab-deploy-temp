import { useState, useMemo } from 'react';
import { Card, Badge, TextInput, Select } from 'flowbite-react';
import Link from 'next/link';
import { DocumentTextIcon, CalendarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ResearchGuide } from '@/types/research-guide';

export function ResearchGuidesSection({ guides, labId }: { guides: ResearchGuide[]; labId: string }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

    const filteredAndSortedGuides = useMemo(() => {
        let result = [...guides];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (guide) =>
                    guide.title.toLowerCase().includes(query) ||
                    guide.summary.toLowerCase().includes(query)
            );
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return b.updatedDate.getTime() - a.updatedDate.getTime();
                case 'oldest':
                    return a.updatedDate.getTime() - b.updatedDate.getTime();
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return result;
    }, [guides, searchQuery, sortBy]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <DocumentTextIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        Research Guides
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Comprehensive guides to help you navigate your research journey
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:max-w-md">
                    <TextInput
                        type="text"
                        placeholder="Search guides..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={MagnifyingGlassIcon}
                        className="w-full"
                    />
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Select
                        id="sort-guides"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                        className="w-full sm:w-auto"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="title">Title A–Z</option>
                    </Select>
                    <Badge color="blue" className="text-sm px-3 py-1">
                        {filteredAndSortedGuides.length} {filteredAndSortedGuides.length === 1 ? 'guide' : 'guides'}
                    </Badge>
                </div>
            </div>

            {/* Directory Rows */}
            {filteredAndSortedGuides.length > 0 ? (
                <div className="space-y-2">
                    {filteredAndSortedGuides.map((guide) => (
                        <ResearchGuideRow key={guide.id} guide={guide} labId={labId} />
                    ))}
                </div>
            ) : (
                <Card className="bg-white dark:bg-gray-800">
                    <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                        {searchQuery.trim()
                            ? 'No guides found matching your search.'
                            : 'No research guides available at this time.'}
                    </p>
                </Card>
            )}
        </div>
    );
}

// Research Guide Row Component (Notion/Docs style)
function ResearchGuideRow({ guide, labId }: { guide: ResearchGuide; labId: string }) {
    const guideUrl = `/labs/${labId}/rbl-hub/research-guide/${guide.id}`;

    return (
        <Link
            href={guideUrl}
            className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
            <div className="flex items-start justify-between gap-4">
                {/* Left Section: Title + Summary */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {guide.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {guide.summary}
                    </p>
                </div>

                {/* Right Section: Status + Date + CTA */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <Badge
                            color={guide.status === 'PUBLISHED' ? 'success' : 'gray'}
                            className="text-xs"
                        >
                            {guide.status}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="whitespace-nowrap">
                                {guide.updatedDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}