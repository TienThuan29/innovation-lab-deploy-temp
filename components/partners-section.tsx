"use client";

import Image from "next/image";
import Link from "next/link";
import { mockPartners } from "@/mocks/partners";

export function PartnersSectionV1() {
  // Partner images - professional technology and business collaboration photos
  const partnerImages = [
    "https://fptsoftware.com/-/media/project/fpt-software/global/common/fptsoftware_building_d.png?modified=20230518152255", // FPT Software - Team collaboration, technology workspace
    "https://maisonoffice.vn/wp-content/uploads/2023/12/1-kham-pha-tru-so-viettel.jpg", // Viettel - Telecommunications, modern tech infrastructure
    "https://media.vneconomy.vn/images/upload/2025/04/04/anh-1.png", // VNG - Digital innovation, creative tech workspace
  ];

  return (
    <section className="bg-white px-4 py-16 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            Major Strategic Partners
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
            Collaborating with leading companies to drive innovation and
            research excellence
          </p>
        </div>

        {/* Partners Grid */}
        <div className="space-y-16">
          {mockPartners.map((partner, index) => (
            <div
              key={partner.id}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8 lg:gap-12`}
            >
              {/* Text Content */}
              <div className="w-full flex-1">
                <h3 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
                  {partner.name}
                </h3>
                <p className="mb-6 text-lg leading-relaxed text-gray-700 md:text-xl dark:text-gray-300">
                  {partner.description}
                </p>
                <Link
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center text-lg font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Learn more
                  <svg
                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>

              {/* Image */}
              <div className="relative h-[300px] w-full flex-1 overflow-hidden rounded-lg shadow-xl md:h-[400px] lg:h-[450px]">
                <Image
                  src={partnerImages[index] || partnerImages[0]}
                  alt={`${partner.name} collaboration`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PartnersSectionV2() {
  const partnerLogos = [
    {
      name: "FPT",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/FPT_logo_2010.svg/2560px-FPT_logo_2010.svg.png",
    },
    {
      name: "Viettel",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Viettel_logo_2021.svg/960px-Viettel_logo_2021.svg.png",
    },
    {
      name: "VNG",
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/VNG_Corp._logo.svg/1200px-VNG_Corp._logo.svg.png",
    },
  ];

  return (
    <section className="mb-10 bg-white px-4 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            Major Strategic Partners
          </h2>
        </div>
        <div className="flex grid-cols-2 flex-row flex-wrap justify-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {partnerLogos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
            >
              <Image
                src={logo.src}
                alt={`${logo.name} logo`}
                width={180}
                height={90}
                className="object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
