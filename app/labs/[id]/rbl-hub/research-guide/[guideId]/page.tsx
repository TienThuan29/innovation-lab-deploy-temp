'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge, Button, Card } from 'flowbite-react';
import { mockLabs } from '@/mocks/labs';
import { getUsersByLab } from '@/mocks/users';
import { mockResearchGuides } from '@/mocks/research-guides';
import Header from '@/components/header';
import {
    ArrowLeftIcon,
    CalendarIcon,
    DocumentTextIcon,
    ListBulletIcon,
} from '@heroicons/react/24/outline';
import React, { useMemo } from 'react';

type PageProps = {
    params: Promise<{ id: string; guideId: string }>;
};

type HeaderItem = {
    level: number;
    text: string;
    id: string;
};

// Extract headers from markdown content
function extractHeaders(content: string): HeaderItem[] {
    const lines = content.split('\n');
    const headers: HeaderItem[] = [];

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('# ')) {
            const text = trimmed.substring(2);
            headers.push({
                level: 1,
                text,
                id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            });
        } else if (trimmed.startsWith('## ')) {
            const text = trimmed.substring(3);
            headers.push({
                level: 2,
                text,
                id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            });
        } else if (trimmed.startsWith('### ')) {
            const text = trimmed.substring(4);
            headers.push({
                level: 3,
                text,
                id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            });
        } else if (trimmed.startsWith('#### ')) {
            const text = trimmed.substring(5);
            headers.push({
                level: 4,
                text,
                id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            });
        }
    });

    return headers;
}

// Table of Contents Component
function TableOfContents({ headers }: { headers: HeaderItem[] }) {
    if (headers.length === 0) return null;

    const scrollToHeader = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <ListBulletIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Table of Contents</h2>
            </div>
            <nav className="space-y-1">
                {headers.map((header, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToHeader(header.id)}
                        className={`cursor-pointer block w-full text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 ${header.level === 1
                            ? 'text-sm font-semibold text-gray-900 dark:text-white pl-0'
                            : header.level === 2
                                ? 'text-sm text-gray-700 dark:text-gray-300 pl-4'
                                : header.level === 3
                                    ? 'text-xs text-gray-600 dark:text-gray-400 pl-8'
                                    : 'text-xs text-gray-500 dark:text-gray-500 pl-12'
                            }`}
                    >
                        {header.text}
                    </button>
                ))}
            </nav>
        </div>
    );
}

// Simple markdown renderer component
function MarkdownRenderer({ content }: { content: string }) {
    // Split content into lines for processing
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let currentParagraph: string[] = [];
    let inList = false;
    let listItems: string[] = [];
    let listOrdered = false;

    const flushParagraph = () => {
        if (currentParagraph.length > 0) {
            const text = currentParagraph.join(' ');
            if (text.trim()) {
                elements.push(
                    <p key={`p-${elements.length}`} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        {renderInlineMarkdown(text)}
                    </p>
                );
            }
            currentParagraph = [];
        }
    };

    const flushList = () => {
        if (listItems.length > 0) {
            const ListTag = listOrdered ? 'ol' : 'ul';
            elements.push(
                <ListTag
                    key={`list-${elements.length}`}
                    className={`${listOrdered ? 'list-decimal' : 'list-disc'} list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300 ml-4`}
                >
                    {listItems.map((item, idx) => (
                        <li key={idx} className="mb-1">
                            {renderInlineMarkdown(item.trim())}
                        </li>
                    ))}
                </ListTag>
            );
            listItems = [];
            inList = false;
        }
    };

    const renderInlineMarkdown = (text: string): (string | React.ReactElement)[] => {
        const parts: (string | React.ReactElement)[] = [];
        let currentIndex = 0;

        // Handle bold **text**
        const boldRegex = /\*\*(.+?)\*\*/g;
        let match;
        const boldMatches: Array<{ start: number; end: number; text: string }> = [];
        while ((match = boldRegex.exec(text)) !== null) {
            boldMatches.push({
                start: match.index,
                end: match.index + match[0].length,
                text: match[1],
            });
        }

        // Handle images ![alt](url)
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        const imageMatches: Array<{ start: number; end: number; alt: string; url: string }> = [];
        while ((match = imageRegex.exec(text)) !== null) {
            imageMatches.push({
                start: match.index,
                end: match.index + match[0].length,
                alt: match[1],
                url: match[2],
            });
        }

        // Combine and sort all matches
        const allMatches = [
            ...boldMatches.map(m => ({ ...m, type: 'bold' as const })),
            ...imageMatches.map(m => ({ ...m, type: 'image' as const })),
        ].sort((a, b) => a.start - b.start);

        allMatches.forEach((match, idx) => {
            // Add text before match
            if (match.start > currentIndex) {
                const beforeText = text.substring(currentIndex, match.start);
                if (beforeText) parts.push(beforeText);
            }

            // Add match
            if (match.type === 'bold') {
                parts.push(
                    <strong key={`bold-${idx}`} className="font-semibold text-gray-900 dark:text-white">
                        {match.text}
                    </strong>
                );
            } else if (match.type === 'image') {
                parts.push(
                    <Image
                        key={`img-${idx}`}
                        src={match.url}
                        alt={match.alt}
                        width={600}
                        height={400}
                        className="rounded-lg my-4 max-w-2xl mx-auto h-auto"
                        unoptimized
                    />
                );
            }

            currentIndex = match.end;
        });

        // Add remaining text
        if (currentIndex < text.length) {
            parts.push(text.substring(currentIndex));
        }

        return parts.length > 0 ? parts : [text];
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Handle headers
        if (trimmed.startsWith('# ')) {
            flushParagraph();
            flushList();
            const text = trimmed.substring(2);
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            elements.push(
                <h1
                    id={id}
                    key={`h1-${index}`}
                    className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4 scroll-mt-20"
                >
                    {text}
                </h1>
            );
            return;
        }
        if (trimmed.startsWith('## ')) {
            flushParagraph();
            flushList();
            const text = trimmed.substring(3);
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            elements.push(
                <h2
                    id={id}
                    key={`h2-${index}`}
                    className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3 scroll-mt-20"
                >
                    {text}
                </h2>
            );
            return;
        }
        if (trimmed.startsWith('### ')) {
            flushParagraph();
            flushList();
            const text = trimmed.substring(4);
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            elements.push(
                <h3
                    id={id}
                    key={`h3-${index}`}
                    className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2 scroll-mt-20"
                >
                    {text}
                </h3>
            );
            return;
        }
        if (trimmed.startsWith('#### ')) {
            flushParagraph();
            flushList();
            const text = trimmed.substring(5);
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            elements.push(
                <h4
                    id={id}
                    key={`h4-${index}`}
                    className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2 scroll-mt-20"
                >
                    {text}
                </h4>
            );
            return;
        }

        // Handle list items
        if (trimmed.match(/^[-*]\s/)) {
            flushParagraph();
            if (!inList) {
                listOrdered = false;
                inList = true;
            }
            listItems.push(trimmed.substring(2));
            return;
        }
        if (trimmed.match(/^\d+\.\s/)) {
            flushParagraph();
            if (!inList) {
                listOrdered = true;
                inList = true;
            }
            listItems.push(trimmed.replace(/^\d+\.\s/, ''));
            return;
        }

        // Handle images on their own line
        const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
            flushParagraph();
            flushList();
            elements.push(
                <Image
                    key={`img-${index}`}
                    src={imageMatch[2]}
                    alt={imageMatch[1]}
                    width={600}
                    height={400}
                    className="rounded-lg my-4 max-w-2xl mx-auto h-auto"
                    unoptimized
                />
            );
            return;
        }

        // Regular paragraph
        if (trimmed) {
            flushList();
            currentParagraph.push(trimmed);
        } else {
            flushParagraph();
            flushList();
        }
    });

    flushParagraph();
    flushList();

    return <div className="markdown-content">{elements.length > 0 ? elements : <p className="text-gray-500 dark:text-gray-400">No content available.</p>}</div>;
}

export default function ResearchGuideDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const searchParams = useSearchParams();

    // Get IDs from route params
    const labId = resolvedParams.id;
    const guideIdFromRoute = resolvedParams.guideId;
    const guideIdFromQuery = searchParams.get('guide');
    const guideId = guideIdFromRoute || guideIdFromQuery;

    // Find the guide
    const guide = guideId ? mockResearchGuides.find(g => g.id === guideId && g.labId === labId) : undefined;

    const lab = labId ? mockLabs.find(l => l.id === labId) : undefined;
    const director = labId ? getUsersByLab(labId).find(user => user.role === 'DIRECTOR') : undefined;

    // Extract headers for table of contents
    const headers = useMemo(() => {
        return guide ? extractHeaders(guide.content) : [];
    }, [guide]);

    if (!lab) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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

    if (!guide) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header />
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <div className="text-center py-12">
                        <DocumentTextIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Guide Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">The research guide you&apos;re looking for doesn&apos;t exist.</p>
                        <Link href={`/labs/${labId}/rbl-hub`}>
                            <Button color="blue" className="inline-flex items-center gap-2 cursor-pointer">
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back to RBL Hub
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-gray-900">
            <Header />

            <div className="container mx-auto max-w-7xl px-4 py-8 mt-24">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href={`/labs/${labId}/rbl-hub`}>
                        <Button outline color="blue" className="inline-flex items-center gap-2 cursor-pointer">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to RBL Hub
                        </Button>
                    </Link>
                </div>

                {/* Guide Header */}
                <div className="bg-white dark:bg-gray-800 mb-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <Badge
                                    color={guide.status === 'PUBLISHED' ? 'success' : 'gray'}
                                    className="text-xs"
                                >
                                    {guide.status}
                                </Badge>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>
                                        Updated {guide.updatedDate.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                {guide.title}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                {guide.summary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content and Table of Contents */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Markdown Content */}
                    <div className="flex-1 w-full lg:max-w-5xl">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <div className="p-6">
                                <MarkdownRenderer content={guide.content} />
                            </div>
                        </div>
                    </div>

                    {/* Table of Contents - Right Sidebar */}
                    {headers.length > 0 && (
                        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <TableOfContents headers={headers} />
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}

