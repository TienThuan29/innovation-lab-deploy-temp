"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import {
    Card,
    Badge,
    Button,
    TextInput,
    Select,
    Timeline,
    TimelineBody,
    TimelineContent,
    TimelineItem,
    TimelinePoint,
    TimelineTime,
    TimelineTitle,
} from "flowbite-react";
import { mockLabs } from "@/mocks/labs";
import { getUsersByLab } from "@/mocks/users";
import { getPublicationsByLab } from "@/mocks/publications";
import { Publication, PublicationType } from "@/types/publication";
import { User } from "@/types/user";
import Header from "@/components/header";
import LabHeader from "@/app/labs/components/lab-header";
import {
    ArrowLeftIcon,
    StarIcon,
    CalendarIcon,
    DocumentTextIcon,
    MagnifyingGlassIcon,
    ArrowTopRightOnSquareIcon,
    UserGroupIcon,
    ClipboardIcon,
} from "@heroicons/react/24/outline";

type PageProps = {
    params: Promise<{ id: string }>;
};

// Helper function to get authors for a publication (simulate from lab members)
function getPublicationAuthors(pub: Publication, labId: string): User[] {
    const labMembers = getUsersByLab(labId);
    const allMembers = labMembers.filter((u) =>
        ["DIRECTOR", "LECTURER", "RESEARCHER"].includes(u.role),
    );

    if (allMembers.length === 0) return [];

    // Simulate authors: select 2-4 deterministic members for each publication
    // Use publication ID hash for consistency
    let hash = 0;
    for (let i = 0; i < pub.id.length; i++) {
        hash = (hash << 5) - hash + pub.id.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    const seed = Math.abs(hash);
    const numAuthors = 2 + (seed % 3); // 2-4 authors
    const numToSelect = Math.min(numAuthors, allMembers.length);

    // Deterministic shuffle based on hash
    const shuffled = [...allMembers].sort((a, b) => {
        const hashA = a.id
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hashB = b.id
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return ((hashA + seed) % 1000) - ((hashB + seed) % 1000);
    });

    return shuffled.slice(0, numToSelect);
}

// Format authors list (e.g., "John Doe, Jane Smith, et al.")
function formatAuthors(authors: User[]): string {
    if (authors.length === 0) return "";
    if (authors.length === 1) return authors[0].fullname;
    if (authors.length <= 3) {
        return authors.map((a) => a.fullname).join(", ");
    }
    return `${authors
        .slice(0, 2)
        .map((a) => a.fullname)
        .join(", ")}, et al.`;
}

// Copy citation helper
async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }
}

// Format citation
function formatCitation(pub: Publication, authors: User[]): string {
    const authorsStr = formatAuthors(authors);
    const doiShort = pub.doi?.startsWith("http")
        ? pub.doi
        : `https://doi.org/${pub.doi}`;
    return `${authorsStr}. ${pub.title}. ${pub.venue}, ${pub.year}. DOI: ${doiShort}`;
}

// Group publications by year
function groupPublicationsByYear(pubs: Publication[]) {
    const map = new Map<number, Publication[]>();
    for (const p of pubs) {
        map.set(p.year, [...(map.get(p.year) ?? []), p]);
    }
    // Year desc
    return Array.from(map.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([year, items]) => ({ year, items }));
}

export default function ShowcasesPage({ params }: PageProps) {
    const { id } = use(params);
    const lab = mockLabs.find((l) => l.id === id);
    const director = getUsersByLab(id).find((user) => user.role === "DIRECTOR");

    const showcasedPublications = useMemo(() => {
        const allPublications = getPublicationsByLab(id);
        return allPublications.filter((pub) => pub.isSelectedForShowcase);
    }, [id]);

    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<"ALL" | PublicationType>("ALL");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

    const filteredAndSortedPublications = useMemo(() => {
        let result = [...showcasedPublications];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (pub) =>
                    pub.title.toLowerCase().includes(query) ||
                    pub.abstract.toLowerCase().includes(query) ||
                    pub.venue.toLowerCase().includes(query),
            );
        }

        // Filter by type
        if (typeFilter !== "ALL") {
            result = result.filter((pub) => pub.type === typeFilter);
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return (
                        b.year - a.year ||
                        b.publishedDate.getTime() - a.publishedDate.getTime()
                    );
                case "oldest":
                    return (
                        a.year - b.year ||
                        a.publishedDate.getTime() - b.publishedDate.getTime()
                    );
                case "title":
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return result;
    }, [showcasedPublications, searchQuery, typeFilter, sortBy]);

    const groupedPublications = useMemo(() => {
        return groupPublicationsByYear(filteredAndSortedPublications);
    }, [filteredAndSortedPublications]);

    if (!lab) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center pt-24">
                    <div className="text-center">
                        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                            Lab Not Found
                        </h1>
                        <p className="mb-8 text-gray-600 dark:text-gray-400">
                            The lab you&apos;re looking for doesn&apos;t exist.
                        </p>
                        <Link href="/">
                            <Button color="blue">Go Back Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <LabHeader lab={lab} director={director} />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Back to lab and Header */}
                <div className="mb-8">
                    <Link href={`/labs/${id}`}>
                        <Button
                            outline
                            color="blue"
                            className="mb-6 inline-flex items-center gap-2"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Lab
                        </Button>
                    </Link>

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
                                <StarIcon className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
                                Outstanding Publications
                            </h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Explore our lab&apos;s most significant research publications
                                and contributions
                            </p>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="w-full flex-1 sm:max-w-md">
                            <TextInput
                                type="text"
                                placeholder="Search publications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={MagnifyingGlassIcon}
                                className="w-full"
                            />
                        </div>
                        <div className="flex w-full items-center gap-4 sm:w-auto">
                            <Select
                                id="filter-type"
                                value={typeFilter}
                                onChange={(e) =>
                                    setTypeFilter(e.target.value as "ALL" | PublicationType)
                                }
                                className="w-full sm:w-auto"
                            >
                                <option value="ALL">All Types</option>
                                <option value="JOURNAL">Journal</option>
                                <option value="CONFERENCE">Conference</option>
                            </Select>
                            <Select
                                id="sort-publications"
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value as "newest" | "oldest" | "title")
                                }
                                className="w-full sm:w-auto"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="title">Title A–Z</option>
                            </Select>
                            <Badge color="blue" className="px-3 py-1 text-sm">
                                {filteredAndSortedPublications.length}{" "}
                                {filteredAndSortedPublications.length === 1
                                    ? "publication"
                                    : "publications"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Publications Timeline */}
                {filteredAndSortedPublications.length > 0 ? (
                    <div className="space-y-12">
                        {groupedPublications.map((group) => (
                            <div key={group.year} className="space-y-4">
                                {/* Year Header */}
                                <div className="sticky top-24 z-10 -mx-2 px-2">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/70">
                                        <CalendarIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            {group.year}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            ({group.items.length}{" "}
                                            {group.items.length === 1
                                                ? "publication"
                                                : "publications"}
                                            )
                                        </span>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <Timeline>
                                    {group.items.map((publication) => {
                                        const authors = getPublicationAuthors(publication, id);
                                        return (
                                            <PublicationTimelineItem
                                                key={publication.id}
                                                publication={publication}
                                                authors={authors}
                                                labId={id}
                                            />
                                        );
                                    })}
                                </Timeline>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card className="bg-white dark:bg-gray-800">
                        <p className="py-8 text-center text-gray-500 italic dark:text-gray-400">
                            {searchQuery.trim() || typeFilter !== "ALL"
                                ? "No publications found matching your filters."
                                : "No showcased publications available at this time."}
                        </p>
                    </Card>
                )}
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
                            <StarIcon className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
                            Orther Archivements (patents, awards, projects, ...){" "}
                            <span className="text-gray-500 dark:text-gray-400">
                                (Comming soon...)
                            </span>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Publication Timeline Item Component
function PublicationTimelineItem({
    publication,
    authors,
    labId,
}: {
    publication: Publication;
    authors: User[];
    labId: string;
}) {
    const doiDisplay = publication.doi?.split("/").pop() ?? publication.doi;
    const authorsStr = formatAuthors(authors);

    return (
        <TimelineItem>
            <TimelinePoint
                icon={publication.type === "JOURNAL" ? DocumentTextIcon : CalendarIcon}
            />
            <TimelineContent>
                <TimelineTime className="mb-2 text-sm leading-none font-normal text-gray-500 dark:text-gray-400">
                    <div className="flex flex-wrap items-center gap-3">
                        <span>{publication.year}</span>
                        <Badge
                            color={publication.type === "JOURNAL" ? "blue" : "purple"}
                            className="text-xs"
                        >
                            {publication.type === "JOURNAL" ? "Journal" : "Conference"}
                        </Badge>
                    </div>
                </TimelineTime>

                <TimelineTitle className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    {publication.title}
                </TimelineTitle>

                <TimelineBody>
                    {/* Authors */}
                    {authors.length > 0 && (
                        <div className="mb-3 flex items-start gap-2">
                            <UserGroupIcon className="mt-0.5 h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {authorsStr}
                            </span>
                        </div>
                    )}

                    {/* Venue */}
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <DocumentTextIcon className="h-4 w-4 shrink-0" />
                        <span>{publication.venue}</span>
                    </div>

                    {/* Abstract */}
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {publication.abstract}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                        <Button
                            size="xs"
                            color="blue"
                            className="inline-flex items-center gap-1.5"
                            onClick={() => window.open(publication.url, "_blank")}
                        >
                            View Paper
                            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                            size="xs"
                            color="gray"
                            className="inline-flex items-center gap-1.5"
                            onClick={() =>
                                copyToClipboard(formatCitation(publication, authors))
                            }
                        >
                            <ClipboardIcon className="h-3.5 w-3.5" />
                            Copy Citation
                        </Button>

                        {publication.doi && (
                            <button
                                type="button"
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/40"
                                onClick={() => copyToClipboard(publication.doi)}
                                title="Copy DOI"
                            >
                                DOI: {doiDisplay}
                            </button>
                        )}
                    </div>
                </TimelineBody>
            </TimelineContent>
        </TimelineItem>
    );
}
