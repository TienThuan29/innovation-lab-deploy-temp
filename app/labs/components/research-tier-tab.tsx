import { Card, Badge } from 'flowbite-react';
import { CheckCircleIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ResearchTier } from '@/types/research-tier';

export function ResearchTierTimelineItem({ tier, index }: { tier: ResearchTier; index: number }) {
    return (
        <div className="relative pl-12">
            {/* dot */}
            <div className="absolute left-[14px] top-6 h-4 w-4 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/40" />

            <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow rounded-2xl">
                {/* top accent */}
                <div className="relative overflow-hidden rounded-xl">
                    <div className="absolute inset-x-0 top-0 h-1" />
                    <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl" />

                    <div className="relative">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        Tier {index + 1}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {tier.name}
                                    </h3>
                                    <Badge color="info" className="text-xs">
                                        {tier.minYear}-{tier.maxYear} {tier.minYear === tier.maxYear ? 'Year' : 'Years'}
                                    </Badge>
                                </div>

                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {tier.description}
                                </p>
                            </div>
                        </div>

                        {/* requirements and benefits */}
                        <div className="mt-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        Requirements
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {tier.conditions}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <AcademicCapIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        Benefits
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {tier.benefits}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* footer */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4" />
                                    <span>
                                        Updated {tier.updatedDate.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>

                                {/* optional CTA */}
                                <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-100 dark:border-blue-800">
                                    Recommended path
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}