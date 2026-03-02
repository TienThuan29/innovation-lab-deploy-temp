'use client';

import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CarouselComponent() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
            alt: 'AI Neural Network and Deep Learning',
            header: 'Award Winning Laboratory Center',
            content: 'Leading research and development in cutting-edge technologies. We foster innovation through collaboration, research, and practical applications.',
            buttonText: 'Explore More',
            buttonLink: '/about',
        },
        {
            src: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&q=80',
            alt: 'Expert Doctors & Lab Assistants',
            header: 'Expert Doctors & Lab Assistants',
            content: 'Leading research and development in cutting-edge technologies. We foster innovation through collaboration, research, and practical applications.',
            buttonText: 'Explore More',
            buttonLink: '/about',
        },
        {
            src: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80',
            alt: 'Data Science and Machine Learning Innovation',
            header: 'Innovation Labs Research Center',
            content: 'Leading research and development in cutting-edge technologies. We foster innovation through collaboration, research, and practical applications.',
            buttonText: 'Explore More',
            buttonLink: '/about',
        },
    ];

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div id="default-carousel" className="relative w-full" data-carousel="slide">
            {/* Carousel wrapper */}
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        data-carousel-item
                    >
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            className="object-cover"
                        />
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/40"></div>
                        {/* Text content overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="container mx-auto px-4">
                                <div className="max-w-3xl">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-7 drop-shadow-lg">
                                        {slide.header}
                                    </h1>
                                    <p className="text-base sm:text-lg md:text-xl text-white mb-6 drop-shadow-md">
                                        {slide.content}
                                    </p>
                                    <Button
                                        as={Link}
                                        href={slide.buttonLink}
                                        size="xl"
                                        className="py-3 px-6 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {slide.buttonText}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full ${index === currentSlide
                            ? 'bg-white'
                            : 'bg-white/50 hover:bg-white/75'
                            }`}
                        aria-current={index === currentSlide}
                        aria-label={`Slide ${index + 1}`}
                        data-carousel-slide-to={index}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>

            {/* Slider controls - Previous */}
            <button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-prev
                onClick={goToPrevious}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg
                        className="w-5 h-5 text-white rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m15 19-7-7 7-7"
                        />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>

            {/* Slider controls - Next */}
            <button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-next
                onClick={goToNext}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg
                        className="w-5 h-5 text-white rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m9 5 7 7-7 7"
                        />
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>
        </div>
    );
}
