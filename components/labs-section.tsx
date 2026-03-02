'use client';

import { Button, Card } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { mockLabs } from '@/mocks/labs';
import { getUsersByLab } from '@/mocks/users';

export default function LabsSection() {
    // Get director for each lab
    const labsWithDirectors = mockLabs.map(lab => {
        const users = getUsersByLab(lab.id);
        const director = users.find(user => user.role === 'DIRECTOR');
        return {
            lab,
            director: director || null,
        };
    });

    return (
        <section className="py-10 px-4 bg-gray-50 dark:bg-gray-800">
            <div>
                {/* Section Header */}
                <div className="mb-4">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            The Innovation Laboratories
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Explore our cutting-edge research laboratories, each led by distinguished directors and focused on innovative solutions
                        </p>
                    </div>
                </div>

                {/* Labs Tree View with Center Vertical Bars */}
                <div className="relative py-8">
                    {/* Center Vertical Bars (Tree Trunk) - Two bars side by side */}
                    <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-3 hidden md:flex justify-center gap-1 z-0">
                        <div className="w-1 h-full bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 rounded-full shadow-lg"></div>
                        <div className="w-1 h-full bg-gradient-to-b from-blue-400 via-blue-300 to-blue-400 dark:from-blue-500 dark:via-blue-400 dark:to-blue-500 rounded-full shadow-lg"></div>
                    </div>

                    {/* Labs Cards - Intertwined */}
                    <div className="relative space-y-12">
                        {labsWithDirectors.map(({ lab, director }, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <div key={lab.id} id={lab.id} className="relative scroll-mt-24">
                                    {/* Horizontal connector line to center (desktop only) */}
                                    <div
                                        className={`absolute top-1/2 transform -translate-y-1/2 h-0.5 hidden md:block z-10 ${isEven
                                            ? 'left-[calc(50%+0.75rem)] right-0 bg-gradient-to-r from-blue-400 to-blue-300 dark:from-blue-500 dark:to-blue-400'
                                            : 'left-0 right-[calc(50%+0.75rem)] bg-gradient-to-l from-blue-400 to-blue-300 dark:from-blue-500 dark:to-blue-400'
                                            }`}
                                    ></div>

                                    {/* Connection dot at center */}
                                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-blue-500 dark:bg-blue-600 rounded-full border-4 border-white dark:border-gray-800 z-20 hidden md:block shadow-lg"></div>

                                    {/* Card positioned left or right */}
                                    <div
                                        className={`relative ${isEven
                                            ? 'md:pr-[calc(50%+3rem)]'
                                            : 'md:pl-[calc(50%+3rem)]'
                                            }`}
                                    >
                                        <Card className="hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:scale-[1.01]">
                                            <div className={`flex flex-col md:flex-row gap-4 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                                                {/* Director Info Section - Compact */}
                                                {director ? (
                                                    <div className={`md:w-64 flex-shrink-0 border-t md:border-t-0 ${isEven ? 'md:border-r md:pr-4' : 'md:border-l md:pl-4'} border-gray-200 dark:border-gray-700 pt-3 md:pt-0`}>
                                                        <div className="flex items-start gap-3">
                                                            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-blue-500 dark:ring-blue-400">
                                                                <Image
                                                                    src={director.avartarUrl}
                                                                    alt={director.fullname}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="56px"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0 pt-1">
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold uppercase tracking-wide">
                                                                    Director
                                                                </p>
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5 leading-tight">
                                                                    {director.fullname}
                                                                </p>
                                                                {director.profile?.researchInterests && (
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug mb-2">
                                                                        {director.profile.researchInterests}
                                                                    </p>
                                                                )}
                                                                <Link href={`/labs/${lab.id}`}>
                                                                    <Button
                                                                        size="xs"
                                                                        color="light"
                                                                        className="text-xs px-2 py-1 h-auto font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                                                                    >
                                                                        Explore more →
                                                                    </Button>
                                                                </Link>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={`md:w-64 flex-shrink-0 border-t md:border-t-0 ${isEven ? 'md:border-r md:pr-4' : 'md:border-l md:pl-4'} border-gray-200 dark:border-gray-700 pt-3 md:pt-0`}>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                                            Director not available
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Lab Info Section - Compact */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                            {lab.shortName}
                                                        </h3>
                                                        <span
                                                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${lab.status === 'ACTIVE'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                                }`}
                                                        >
                                                            {lab.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2.5">
                                                        {lab.name}
                                                    </p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                                                        {lab.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {lab.techStacks.slice(0, 8).map((tech, techIndex) => (
                                                            <span
                                                                key={techIndex}
                                                                className="px-2 py-0.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {lab.techStacks.length > 8 && (
                                                            <span className="px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                                +{lab.techStacks.length - 8}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
