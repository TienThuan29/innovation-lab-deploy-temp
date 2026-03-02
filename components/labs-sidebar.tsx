"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { mockLabs } from "@/mocks/labs";

export default function LabsSidebar() {
  const [activeLabId, setActiveLabId] = useState<string | null>(null);

  const scrollToLab = (labId: string) => {
    const element = document.getElementById(labId);
    if (element) {
      const offset = 100; // Offset for header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveLabId(labId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header + some padding

      for (let i = mockLabs.length - 1; i >= 0; i--) {
        const lab = mockLabs[i];
        const element = document.getElementById(lab.id);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            setActiveLabId(lab.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside className="sticky top-24 hidden h-fit w-64 shrink-0 lg:block">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 p-2 dark:from-blue-500 dark:to-purple-500">
            <Image
              src="/flowbite.svg"
              alt="Innovation Labs Logo"
              width={20}
              height={20}
              className="h-5 w-5"
              priority
            />
          </span>
          <span>The Innovation Laboratories List</span>
        </h3>
        <nav className="space-y-1">
          {mockLabs.map((lab, index) => {
            const isActive = activeLabId === lab.id;
            return (
              <button
                key={lab.id}
                onClick={() => scrollToLab(lab.id)}
                className={`group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isActive
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400"
                  }`}
                >
                  {index + 1}.
                </span>
                <span className="flex-1">{lab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
