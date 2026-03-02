'use client';

import React from 'react';
import { Button, DarkThemeToggle, Label, TextInput } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import AuthWallpaper from '@/components/auth-wallpaper';
import FlyingObjectsBackground from '@/components/flying-objects-background';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle forgot password logic here
        console.log('Password reset request:', { email });
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side - Wallpaper */}
            <AuthWallpaper />

            {/* Right side - Forgot Password Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900 relative overflow-hidden">
                {/* Animated background with flying objects */}
                <FlyingObjectsBackground />

                {/* Top navigation bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    {/* Back to home */}
                    <Link
                        href="/"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="text-sm font-medium">Back to home</span>
                    </Link>
                    {/* Dark theme toggle */}
                    <DarkThemeToggle />
                </div>

                <div className="w-full max-w-lg space-y-8 relative z-10">
                    <div>
                        <div className="flex items-center justify-center mb-6">
                            <Image
                                src="/flowbite-react.svg"
                                alt="Flowbite React Logo"
                                width={100}
                                height={100}
                                priority
                            />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center">
                            Forgot Password?
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                            No worries! Enter your email address and we&apos;ll send you a link to reset your password.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <TextInput
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20"
                            >
                                Send Reset Link
                            </Button>
                        </div>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Remember your password?{' '}
                            <Link
                                href="/login"
                                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

