'use client';

import { use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Badge, Button, Timeline, TimelineBody, TimelineContent, TimelineItem, TimelinePoint, TimelineTitle } from 'flowbite-react';
import { mockLabs } from '@/mocks/labs';
import { getUsersByLab, mockUsers } from '@/mocks/users';
import { getPublicationsByLab } from '@/mocks/publications';
import { User } from '@/types/user';
import { Publication } from '@/types/publication';
import Header from '@/components/header';
import LabHeader from '@/app/labs/components/lab-header';
import {
    ArrowLeftIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    AcademicCapIcon,
    LightBulbIcon,
    LinkIcon,
    DocumentTextIcon,
    ArrowTopRightOnSquareIcon,
    BookOpenIcon,
    IdentificationIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';

type PageProps = {
    params: Promise<{ id: string; 'researcher-id': string }>;
};

// Helper function to get publications for a researcher (simulate from lab publications)
function getResearcherPublications(researcherId: string, labId: string): Publication[] {
    const allPublications = getPublicationsByLab(labId);
    const labMembers = getUsersByLab(labId);
    const allMembers = labMembers.filter(u => ['DIRECTOR', 'LECTURER', 'RESEARCHER'].includes(u.role));

    if (allMembers.length === 0) return [];

    // Filter publications where this researcher could be an author
    // Using deterministic selection based on researcher ID
    return allPublications.filter((pub) => {
        let hash = 0;
        for (let i = 0; i < pub.id.length; i++) {
            hash = ((hash << 5) - hash) + pub.id.charCodeAt(i);
            hash = hash & hash;
        }
        const seed = Math.abs(hash);

        // Deterministic shuffle to find authors
        const shuffled = [...allMembers].sort((a, b) => {
            const hashA = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const hashB = b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return ((hashA + seed) % 1000) - ((hashB + seed) % 1000);
        });

        // Check if this researcher is in the first few authors (deterministically selected)
        const numAuthors = 2 + (seed % 3); // 2-4 authors
        const authors = shuffled.slice(0, numAuthors);
        return authors.some(a => a.id === researcherId);
    }).slice(0, 10); // Limit to 10 most recent
}

// Format authors list for publication
function formatPublicationAuthors(authors: User[]): string {
    if (authors.length === 0) return '';
    if (authors.length === 1) return authors[0].fullname;
    if (authors.length <= 3) {
        return authors.map(a => a.fullname).join(', ');
    }
    return `${authors.slice(0, 2).map(a => a.fullname).join(', ')}, et al.`;
}

// Get authors for a publication
function getPublicationAuthors(pub: Publication, labId: string): User[] {
    const labMembers = getUsersByLab(labId);
    const allMembers = labMembers.filter(u => ['DIRECTOR', 'LECTURER', 'RESEARCHER'].includes(u.role));

    if (allMembers.length === 0) return [];

    let hash = 0;
    for (let i = 0; i < pub.id.length; i++) {
        hash = ((hash << 5) - hash) + pub.id.charCodeAt(i);
        hash = hash & hash;
    }
    const seed = Math.abs(hash);
    const numAuthors = 2 + (seed % 3);
    const numToSelect = Math.min(numAuthors, allMembers.length);

    const shuffled = [...allMembers].sort((a, b) => {
        const hashA = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hashB = b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return ((hashA + seed) % 1000) - ((hashB + seed) % 1000);
    });

    return shuffled.slice(0, numToSelect);
}

// Helper functions for citation
function formatCitation(pub: Publication, labId: string) {
    const authors = getPublicationAuthors(pub, labId);
    const authorsStr = formatPublicationAuthors(authors);
    const doiUrl = pub.doi?.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`;
    return `${authorsStr}. ${pub.title}. ${pub.venue}, ${pub.year}. DOI: ${doiUrl}`;
}

async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// Stat component
function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/30 backdrop-blur px-4 py-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
        </div>
    );
}

// Publication Row component
function PublicationRow({ publication, labId }: { publication: Publication; labId: string }) {
    const authors = getPublicationAuthors(publication, labId);
    const doiShort = publication.doi?.split('/').pop() ?? publication.doi;

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900
                        hover:border-blue-300 dark:hover:border-blue-700 transition">
            <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge color={publication.type === 'JOURNAL' ? 'info' : 'purple'} className="text-[11px] uppercase tracking-wide">
                                {publication.type === 'JOURNAL' ? 'Journal' : 'Conference'}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {publication.venue} • {publication.year}
                            </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
                            {publication.title}
                        </h3>

                        {authors.length > 0 && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {formatPublicationAuthors(authors)}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                        <Button
                            size="xs"
                            color="gray"
                            onClick={() => copyToClipboard(formatCitation(publication, labId))}
                        >
                            Cite
                        </Button>
                        <Button
                            size="xs"
                            color="blue"
                            onClick={() => window.open(publication.url, '_blank')}
                            className="inline-flex items-center gap-1"
                        >
                            View
                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                <details className="mt-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-3">
                    <summary className="cursor-pointer select-none text-sm font-semibold text-gray-900 dark:text-white">
                        Abstract & DOI
                    </summary>

                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {publication.abstract}
                    </p>

                    {publication.doi && (
                        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span className="truncate">DOI: {publication.doi}</span>
                            <button
                                type="button"
                                className="px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                onClick={() => copyToClipboard(publication.doi!)}
                                title="Copy DOI"
                            >
                                Copy DOI ({doiShort})
                            </button>
                        </div>
                    )}
                </details>
            </div>
        </div>
    );
}

export default function ResearcherProfilePage({ params }: PageProps) {
    const resolvedParams = use(params);
    const labId = resolvedParams.id;
    const researcherId = resolvedParams['researcher-id'];

    const lab = mockLabs.find(l => l.id === labId);
    const director = getUsersByLab(labId).find(user => user.role === 'DIRECTOR');
    const researcher = mockUsers.find(u => u.id === researcherId && u.labId === labId);

    const researcherPublications = useMemo(() => {
        if (!researcher) return [];
        return getResearcherPublications(researcherId, labId).sort((a, b) =>
            b.year - a.year || b.publishedDate.getTime() - a.publishedDate.getTime()
        );
    }, [researcherId, labId]);

    if (!lab) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <div className="pt-24 flex items-center justify-center min-h-[calc(100vh-6rem)]">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Lab Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">The lab you&apos;re looking for doesn&apos;t exist.</p>
                        <Link href="/">
                            <Button color="blue">Go Back Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!researcher) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                {/* <LabHeader lab={lab} director={director} /> */}
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Researcher Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">The researcher you&apos;re looking for doesn&apos;t exist in this lab.</p>
                        <Link href={`/labs/${labId}`}>
                            <Button color="blue" className="inline-flex items-center gap-2 cursor-pointer">
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back to Lab
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            {/* <LabHeader lab={lab} director={director} /> */}

            <div className="container mx-auto max-w-7xl px-4 py-8 mt-24">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href={`/labs/${labId}`}>
                        <Button outline color="blue" className="inline-flex items-center gap-2 cursor-pointer">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Lab
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Profile Header */}
                        <div className="relative overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            {/* subtle header background */}
                            <div className="absolute inset-0">
                                <div className="h-28 sm:h-32 bg-gradient-to-r from-blue-600/15 via-white/5 to-blue-600/15 dark:from-blue-500/10 dark:via-gray-900/10 dark:to-blue-500/10" />
                            </div>

                            <div className="relative p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 border border-gray-200 dark:border-gray-700">
                                            <Image
                                                src={researcher.avartarUrl}
                                                alt={researcher.fullname}
                                                fill
                                                className="object-cover"
                                                sizes="128px"
                                            />
                                        </div>
                                    </div>

                                    {/* Identity */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                                {researcher.fullname}
                                            </h1>
                                            <Badge color="info" className="text-xs font-semibold uppercase tracking-wide">
                                                Researcher
                                            </Badge>
                                            <Badge color="gray" className="text-xs">
                                                {lab.shortName}
                                            </Badge>
                                        </div>

                                        {researcher.profile?.academicTitle && (
                                            <p className="mt-2 text-base sm:text-lg text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <AcademicCapIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                {researcher.profile.academicTitle}
                                            </p>
                                        )}

                                        {/* CTA row */}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {researcher.profile?.publicEmail && (
                                                <Button
                                                    size="sm"
                                                    color="blue"
                                                    className="inline-flex items-center gap-2"
                                                    onClick={() => window.open(`mailto:${researcher.profile?.publicEmail}`)}
                                                >
                                                    <EnvelopeIcon className="w-4 h-4" />
                                                    Email
                                                </Button>
                                            )}

                                            {researcher.profile?.googleScholarUrl && (
                                                <Button
                                                    size="sm"
                                                    color="gray"
                                                    className="inline-flex items-center gap-2"
                                                    onClick={() => window.open(researcher.profile!.googleScholarUrl, '_blank')}
                                                >
                                                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                                    Google Scholar
                                                </Button>
                                            )}

                                            {researcher.profile?.orcid && (
                                                <Button
                                                    size="sm"
                                                    color="gray"
                                                    className="inline-flex items-center gap-2"
                                                    onClick={() => window.open(researcher.profile!.orcid, '_blank')}
                                                >
                                                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                                    ORCID
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick stats */}
                                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <Stat label="Publications" value={researcherPublications.length} />
                                    <Stat
                                        label="Years in lab"
                                        value={researcher.profile?.joinDate
                                            ? Math.max(1, Math.floor((new Date().getTime() - researcher.profile.joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365)))
                                            : 2
                                        }
                                    />
                                    <Stat label="Research areas" value={(researcher.profile?.researchInterests?.split(',').length ?? 3)} />
                                </div>
                            </div>
                        </div>

                        {/* About / Research Interests */}
                        {researcher.profile?.researchInterests && (
                            <Card className="bg-white dark:bg-gray-800">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <LightBulbIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    Research Interests
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {researcher.profile.researchInterests}
                                </p>
                            </Card>
                        )}

                        {/* Publications Timeline */}
                        {researcherPublications.length > 0 && (
                            <Card className="bg-white dark:bg-gray-800">
                                <div className="flex items-center justify-between gap-3 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        Publications
                                    </h2>
                                    <Badge color="blue" className="text-sm px-3 py-1">
                                        {researcherPublications.length}
                                    </Badge>
                                </div>

                                <Timeline>
                                    {researcherPublications.map((pub) => {
                                        const authors = getPublicationAuthors(pub, labId);
                                        const doiShort = pub.doi?.split('/').pop() ?? pub.doi;

                                        return (
                                            <TimelineItem key={pub.id}>
                                                <TimelinePoint icon={pub.type === 'JOURNAL' ? DocumentTextIcon : CalendarIcon} />
                                                <TimelineContent>
                                                    <TimelineTitle>
                                                        <div className="flex items-start justify-between gap-3 mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                    <Badge color={pub.type === 'JOURNAL' ? 'info' : 'purple'} className="text-[11px] uppercase tracking-wide">
                                                                        {pub.type === 'JOURNAL' ? 'Journal' : 'Conference'}
                                                                    </Badge>
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {pub.venue} • {pub.year}
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
                                                                    {pub.title}
                                                                </h3>
                                                                {authors.length > 0 && (
                                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                                        {formatPublicationAuthors(authors)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2 shrink-0">
                                                                <Button
                                                                    size="xs"
                                                                    color="gray"
                                                                    onClick={() => copyToClipboard(formatCitation(pub, labId))}
                                                                >
                                                                    Cite
                                                                </Button>
                                                                <Button
                                                                    size="xs"
                                                                    color="blue"
                                                                    onClick={() => window.open(pub.url, '_blank')}
                                                                    className="inline-flex items-center gap-1"
                                                                >
                                                                    View
                                                                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </TimelineTitle>
                                                    <TimelineBody>
                                                        <div className="mt-3 space-y-3">
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Abstract</h4>
                                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                                    {pub.abstract}
                                                                </p>
                                                            </div>

                                                            {pub.doi && (
                                                                <div>
                                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">DOI</h4>
                                                                    <div className="flex items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400">
                                                                        <span className="truncate">{pub.doi}</span>
                                                                        <button
                                                                            type="button"
                                                                            className="px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                                                            onClick={() => copyToClipboard(pub.doi!)}
                                                                            title="Copy DOI"
                                                                        >
                                                                            Copy DOI ({doiShort})
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TimelineBody>
                                                </TimelineContent>
                                            </TimelineItem>
                                        );
                                    })}
                                </Timeline>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div>
                        <Timeline>
                            {/* Academic Contact */}
                            <TimelineItem>
                                <TimelinePoint icon={EnvelopeIcon} />
                                <TimelineContent>
                                    <TimelineTitle className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                        Academic Contact
                                    </TimelineTitle>
                                    <TimelineBody>
                                        <div className="space-y-4">
                                            {researcher.profile?.publicEmail && (
                                                <div className="flex items-start gap-3">
                                                    <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                        <a
                                                            href={`mailto:${researcher.profile.publicEmail}`}
                                                            className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
                                                        >
                                                            {researcher.profile.publicEmail}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {researcher.profile?.publicPhone && (
                                                <div className="flex items-start gap-3">
                                                    <PhoneIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                                        <a
                                                            href={`tel:${researcher.profile.publicPhone}`}
                                                            className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                        >
                                                            {researcher.profile.publicPhone}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </TimelineBody>
                                </TimelineContent>
                            </TimelineItem>

                            {/* Professional Links */}
                            {(researcher.profile?.researchGateUrl ||
                                researcher.profile?.googleScholarUrl ||
                                researcher.profile?.orcid ||
                                researcher.profile?.linkedinUrl) && (
                                    <TimelineItem>
                                        <TimelinePoint icon={LinkIcon} />
                                        <TimelineContent>
                                            <TimelineTitle className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                                Professional Links
                                            </TimelineTitle>
                                            <TimelineBody>
                                                <div className="space-y-2">
                                                    {researcher.profile?.researchGateUrl && (
                                                        <a
                                                            href={researcher.profile.researchGateUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                                        >
                                                            <BookOpenIcon className="w-4 h-4" />
                                                            <span className="text-sm">ResearchGate</span>
                                                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 ml-auto" />
                                                        </a>
                                                    )}

                                                    {researcher.profile?.googleScholarUrl && (
                                                        <a
                                                            href={researcher.profile.googleScholarUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                                        >
                                                            <AcademicCapIcon className="w-4 h-4" />
                                                            <span className="text-sm">Google Scholar</span>
                                                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 ml-auto" />
                                                        </a>
                                                    )}

                                                    {researcher.profile?.orcid && (
                                                        <a
                                                            href={researcher.profile.orcid}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                                        >
                                                            <IdentificationIcon className="w-4 h-4" />
                                                            <span className="text-sm">ORCID</span>
                                                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 ml-auto" />
                                                        </a>
                                                    )}

                                                    {researcher.profile?.linkedinUrl && (
                                                        <a
                                                            href={researcher.profile.linkedinUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                                        >
                                                            <UserGroupIcon className="w-4 h-4" />
                                                            <span className="text-sm">LinkedIn</span>
                                                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 ml-auto" />
                                                        </a>
                                                    )}
                                                </div>
                                            </TimelineBody>
                                        </TimelineContent>
                                    </TimelineItem>
                                )}

                            {/* Lab Information */}
                            <TimelineItem>
                                <TimelinePoint icon={CalendarIcon} />
                                <TimelineContent>
                                    <TimelineTitle className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                        Lab Information
                                    </TimelineTitle>
                                    <TimelineBody>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Lab</p>
                                                <Link
                                                    href={`/labs/${lab.id}`}
                                                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                                                >
                                                    {lab.shortName} - {lab.name}
                                                </Link>
                                            </div>
                                            {researcher.profile?.joinDate && (
                                                <div className="flex items-center gap-3">
                                                    <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                                                        <p className="text-gray-900 dark:text-white">
                                                            {researcher.profile.joinDate.toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </TimelineBody>
                                </TimelineContent>
                            </TimelineItem>

                            {/* Availability / Collaboration CTA */}
                            <TimelineItem>
                                <TimelinePoint icon={EnvelopeIcon} />
                                <TimelineContent>
                                    <TimelineTitle className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                        Collaboration & Research Opportunities
                                    </TimelineTitle>
                                    <TimelineBody>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                            Interested in collaboration or discussing research opportunities? Feel free to reach out.
                                        </p>
                                        {researcher.profile?.publicEmail && (
                                            <Button
                                                color="blue"
                                                className="w-full"
                                                onClick={() => window.open(`mailto:${researcher.profile?.publicEmail}?subject=Research Collaboration Inquiry`)}
                                            >
                                                <EnvelopeIcon className="w-4 h-4 mr-2" />
                                                Contact for Collaboration
                                            </Button>
                                        )}
                                    </TimelineBody>
                                </TimelineContent>
                            </TimelineItem>
                        </Timeline>
                    </div>
                </div>
            </div>
        </div>
    );
}

