'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button } from 'flowbite-react';
import { mockLabs } from '@/mocks/labs';
import { getUsersByLab } from '@/mocks/users';
import { getResearchTiersByLab } from '@/mocks/research-tiers';
import { getResearchGuidesByLab } from '@/mocks/research-guides';
import { getActivitiesByLab } from '@/mocks/activities';
import { ResearchTier } from '@/types/research-tier';
import { ResearchGuide } from '@/types/research-guide';
import Header from '@/components/header';
import LabHeader from '@/app/labs/components/lab-header';
import {
    AcademicCapIcon,
    ArrowLeftIcon,
    CalendarIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { ResearchTierTimelineItem } from '../../components/research-tier-tab';
import { ResearchGuidesSection } from '../../components/research-guide-tab';
import { ActivitiesTab } from '../../components/activities-tab';

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function RBLHubPage({ params }: PageProps) {
    const { id } = use(params);
    const lab = mockLabs.find(l => l.id === id);
    const director = getUsersByLab(id).find(user => user.role === 'DIRECTOR');
    const researchTiers = getResearchTiersByLab(id);
    const researchGuides = getResearchGuidesByLab(id);
    const publishedGuides = researchGuides.filter(guide => guide.status === 'PUBLISHED');
    const activities = getActivitiesByLab(id);
    const [activeTab, setActiveTab] = useState<'tiers' | 'activities' | 'guides'>('tiers');

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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <LabHeader lab={lab} director={director} />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Back to lab and Navigation Tabs */}
                <div className="mb-8 flex items-center justify-between gap-20">
                    <Link href={`/labs/${id}`}>
                        <Button outline color="blue" className="inline-flex items-center gap-2">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Lab
                        </Button>
                    </Link>
                    <div className="flex-1 border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8" aria-label="RBL Hub Navigation">
                            <button
                                onClick={() => setActiveTab('tiers')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'tiers'
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <AcademicCapIcon className="w-5 h-5" />
                                    <span>Research Tiers</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('guides')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'guides'
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <DocumentTextIcon className="w-5 h-5" />
                                    <span>Research Guides</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('activities')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${activeTab === 'activities'
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5" />
                                    <span>Activities</span>
                                </div>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'tiers' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                        <AcademicCapIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                        Research Tiers
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Explore the different research levels and career progression paths in our lab
                                    </p>
                                </div>
                            </div>

                            {researchTiers.length > 0 ? (
                                <div className="relative space-y-6">
                                    {/* center line */}
                                    <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

                                    {researchTiers.map((tier, idx) => (
                                        <ResearchTierTimelineItem key={tier.id} tier={tier} index={idx} />
                                    ))}
                                </div>
                            ) : (
                                <Card className="bg-white dark:bg-gray-800">
                                    <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">
                                        No research tiers available at this time.
                                    </p>
                                </Card>
                            )}
                        </div>
                    )}

                    {activeTab === 'guides' && (
                        <ResearchGuidesSection guides={publishedGuides} labId={id} />
                    )}

                    {activeTab === 'activities' && (
                        <ActivitiesTab activities={activities} />
                    )}
                </div>
            </div>
        </div>
    );
}

