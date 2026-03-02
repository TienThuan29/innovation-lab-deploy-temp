'use client';

import React from 'react';
import Image from 'next/image';

export default function AuthWallpaper() {
    return (
        <div className="hidden lg:flex lg:w-1/2 relative">
            <Image
                src="/login-wallpaper.jpg"
                alt="Login wallpaper"
                fill
                className="object-cover"
                priority
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

            {/* Slogan at the top */}
            <div className="absolute top-12 left-8 right-8 z-10">
                <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Innovate. Create. Transform.
                </h2>
                <p className="text-lg text-white/90 italic">
                    Join the future of innovation and make your ideas reality!
                </p>
            </div>

            {/* Support contact info at the bottom */}
            <div className="absolute bottom-8 left-8 z-10">
                <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-md backdrop-saturate-150 rounded-2xl border border-white/20 dark:border-white/10 px-5 py-4 shadow-2xl shadow-black/20 w-fit">
                    <div className="space-y-2">
                        <p className="text-white font-semibold mb-2 text-sm">Need help?</p>
                        <div className="space-y-1.5 text-white/90">
                            <p className="flex items-center text-sm">
                                <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                support@innovationlabs.com
                            </p>
                            <p className="flex items-center text-sm">
                                <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +1 (555) 123-4567
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

