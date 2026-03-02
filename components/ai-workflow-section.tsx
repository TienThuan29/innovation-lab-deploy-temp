'use client';

import { Button } from 'flowbite-react';
import Link from 'next/link';
import { Card } from 'flowbite-react';

export default function AIWorkflowSection() {
    const workflowSteps = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            title: 'Literature Scan',
            description: 'Summary + topic map',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            title: 'Hypothesis & Design',
            description: 'Experiment design suggestions',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Experiment Automation',
            description: 'Run & log automatically',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: 'Evaluation',
            description: 'Compare baseline, ablation',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'Report & Reproducibility',
            description: 'Create report + checklist',
        },
    ];

    return (
        <section className="py-16 px-4 bg-white dark:bg-gray-900">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                    {/* Left Side - Message + CTA (60%) */}
                    <div className="lg:col-span-3">
                        <div className="space-y-5">
                            {/* Headline */}
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                                    AI-First Research Workflow
                                </h2>
                                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium">
                                    Accelerate research, reduce costs.
                                </p>
                            </div>

                            {/* Subtext */}
                            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                                Standardize research processes with AI agents supporting from literature → experiment → report, reducing duplication and optimizing resources.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    as={Link}
                                    href="/workflow"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    View workflow
                                </Button>
                                <Button
                                    as={Link}
                                    href="/contact"
                                    outline
                                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Contact for collaboration
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Workflow Pipeline (40%) */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                                Workflow Pipeline
                            </h3>
                            <div className="space-y-5">
                                {workflowSteps.map((step, index) => (
                                    <div key={index} className="flex items-start gap-3 relative">
                                        {/* Vertical Line */}
                                        {index < workflowSteps.length - 1 && (
                                            <div className="absolute left-2.5 top-8 w-px h-full bg-gray-200 dark:bg-gray-700"></div>
                                        )}
                                        {/* Icon Circle */}
                                        <div className="relative z-10 shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                                            {step.icon}
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 pt-0.5">
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-0.5 text-sm">
                                                {step.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}

