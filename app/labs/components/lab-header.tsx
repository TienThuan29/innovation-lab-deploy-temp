'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge, Button } from 'flowbite-react';
import { Lab } from '@/types/lab';
import { User } from '@/types/user';
import { ArrowLeftIcon, ArrowRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

type LabHeaderProps = {
    lab: Lab;
    director?: User;
};

export default function LabHeader({ lab, director }: LabHeaderProps) {
    return (
        <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            {/* Cover Image Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={lab.coverImageUrl}
                    alt={lab.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-blue-900/90 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto max-w-7xl px-4">
                <Link href="/" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors backdrop-blur-sm bg-white/10 dark:bg-gray-900/20 rounded-full px-4 py-2 w-fit">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back to Home</span>
                </Link>

                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{lab.shortName}</h1>
                            <Badge
                                color={lab.status === 'ACTIVE' ? 'success' : 'gray'}
                                className="text-sm"
                            >
                                {lab.status}
                            </Badge>
                        </div>
                        <h2 className="text-2xl md:text-3xl text-blue-100 mb-4 drop-shadow-md">{lab.name}</h2>
                        <p className="text-lg text-blue-50 max-w-3xl leading-relaxed drop-shadow-sm mb-4">{lab.description}</p>
                        <Link href={`/labs/${lab.id}/rbl-hub`}>
                            <Button
                                outline
                                className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm cursor-pointer inline-flex items-center gap-2"
                            >
                                Research Base Learning Hub
                                <ArrowRightIcon className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Director */}
                    {director && (
                        <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-center md:items-end">
                            <div className="relative">
                                {/* Hexagonal Avatar with Glow */}
                                <div className="relative w-32 h-32 md:w-80 md:h-80  ">
                                    {/* Glow Effect */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(147, 197, 253, 0.4))',
                                            filter: 'blur(8px)',
                                            transform: 'scale(1.1)',
                                        }}
                                    ></div>
                                    {/* Hexagonal Frame */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 197, 253, 0.2))',
                                            border: '2px solid rgba(147, 197, 253, 0.5)',
                                        }}
                                    ></div>
                                    {/* Avatar Image */}
                                    <div
                                        className="relative w-full h-full"
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                        }}
                                    >
                                        <Image
                                            src={director.avartarUrl}
                                            alt={director.fullname}
                                            fill
                                            className="object-cover"
                                            sizes="160px"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Director Name and Title */}
                            <div className="mt-4 text-center w-full">
                                <p className="text-xs md:text-sm text-blue-100 dark:text-blue-200 mt-1 drop-shadow-sm">
                                    Director
                                </p>
                                <Link href={`/labs/${lab.id}/${director.id}`}>
                                    <h4 className="text-lg md:text-2xl font-bold text-white drop-shadow-md hover:text-blue-200 transition-colors cursor-pointer">
                                        {director.profile?.academicTitle ? `${director.profile.academicTitle} ` : ''}{director.fullname}
                                    </h4>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

