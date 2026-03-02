"use client";

import { use, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  Badge,
  Button,
  Timeline,
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTitle,
  TextInput,
  Pagination,
} from "flowbite-react";
import { mockLabs } from "@/mocks/labs";
import { getUsersByLab } from "@/mocks/users";
import { User } from "@/types/user";
import Header from "@/components/header";
import LabHeader from "@/app/labs/components/lab-header";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowTopRightOnSquareIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  CodeBracketIcon,
  StarIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function LabDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const lab = mockLabs.find((l) => l.id === id);
  const users = getUsersByLab(id);
  const director = users.find((user) => user.role === "DIRECTOR");
  const researchers = users.filter((user) => user.role === "RESEARCHER");
  const lecturers = users.filter((user) => user.role === "LECTURER");

  if (!lab) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Lab Not Found
            </h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              The lab you&apos;re looking for doesn&apos;t exist.
            </p>
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Tabs */}

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Timeline>
              {/* Mission Section */}
              <TimelineItem>
                <TimelinePoint icon={LightBulbIcon} />
                <TimelineContent>
                  <TimelineTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Mission
                  </TimelineTitle>
                  <TimelineBody className="leading-relaxed text-gray-700 dark:text-gray-300">
                    {lab.mission}
                  </TimelineBody>
                </TimelineContent>
              </TimelineItem>

              {/* Scope Section */}
              <TimelineItem>
                <TimelinePoint icon={MagnifyingGlassIcon} />
                <TimelineContent>
                  <TimelineTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Research Scope
                  </TimelineTitle>
                  <TimelineBody className="leading-relaxed text-gray-700 dark:text-gray-300">
                    {lab.scope}
                  </TimelineBody>
                </TimelineContent>
              </TimelineItem>

              {/* Tech Stacks Section */}
              <TimelineItem>
                <TimelinePoint icon={CodeBracketIcon} />
                <TimelineContent>
                  <TimelineTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Technology Stack
                  </TimelineTitle>
                  <TimelineBody>
                    <div className="flex flex-wrap gap-2">
                      {lab.techStacks.map((tech, index) => (
                        <Badge
                          key={index}
                          color="blue"
                          className="px-3 py-1 text-sm"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </TimelineBody>
                </TimelineContent>
              </TimelineItem>

              {/* Showcases Section */}
              <TimelineItem>
                <TimelinePoint icon={StarIcon} />
                <TimelineContent>
                  <TimelineTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Showcases
                  </TimelineTitle>
                  <TimelineBody>
                    <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                      Explore our innovative projects, research outcomes, and
                      notable achievements that demonstrate the impact of our
                      laboratory&apos;s work.
                    </p>
                    <Link href={`/labs/${lab.id}/showcases`}>
                      <Button
                        outline
                        color="blue"
                        className="inline-flex cursor-pointer items-center gap-2"
                      >
                        View Showcases
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TimelineBody>
                </TimelineContent>
              </TimelineItem>

              {/* Join lab section */}
              <TimelineItem>
                <TimelinePoint icon={UserPlusIcon} />
                <TimelineContent>
                  <TimelineTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    Join Lab
                  </TimelineTitle>
                  <TimelineBody>
                    <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                      Interested in joining our research team? Submit your
                      application to become part of our innovative laboratory
                      and contribute to cutting-edge research projects.
                    </p>
                    <Link href={`/join-lab-application?labId=${lab.id}`}>
                      <Button
                        outline
                        color="blue"
                        className="inline-flex cursor-pointer items-center gap-2"
                      >
                        Submit join lab application
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TimelineBody>
                </TimelineContent>
              </TimelineItem>


            </Timeline>

            {/* Researchers Section */}
            <div className="mt-8">
              <Card className="bg-white dark:bg-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Researchers ({researchers.length})
                </h3>
                {researchers.length > 0 ? (
                  <ResearchersRoster researchers={researchers} />
                ) : (
                  <p className="text-gray-500 italic dark:text-gray-400">
                    No researchers available at this time.
                  </p>
                )}
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="bg-white dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <a
                      href={`mailto:${lab.contactEmail}`}
                      className="text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                    >
                      {lab.contactEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <a
                      href={`tel:${lab.contactPhone}`}
                      className="text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                    >
                      {lab.contactPhone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Address
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {lab.address}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Lab Information */}
            <Card className="bg-white dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Lab Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Established
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {lab.createdDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last Updated
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {lab.updatedDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Team Summary */}
            <Card className="bg-white dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Team Summary
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Directors
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {users.filter((u) => u.role === "DIRECTOR").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Lecturers
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {lecturers.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Researchers
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {researchers.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Students
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {users.filter((u) => u.role === "STUDENT").length}
                  </span>
                </div>
                <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {users.length}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Roster components
function ResearchersRoster({ researchers }: { researchers: User[] }) {
  const [activeId, setActiveId] = useState<string>(researchers[0]?.id ?? "");
  const [q, setQ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return researchers;
    return researchers.filter((r) => {
      const name = r.fullname?.toLowerCase() ?? "";
      const title = r.profile?.academicTitle?.toLowerCase() ?? "";
      const interests = r.profile?.researchInterests?.toLowerCase() ?? "";
      return (
        name.includes(query) ||
        title.includes(query) ||
        interests.includes(query)
      );
    });
  }, [q, researchers]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [q]);

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResearchers = filtered.slice(startIndex, endIndex);

  const featured =
    filtered.find((r) => r.id === activeId) ?? filtered[0] ?? researchers[0];

  return (
    <div className="space-y-2">
      {/* Featured stays */}
      {featured && <FeaturedResearcher researcher={featured} />}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center [&_button]:cursor-pointer">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
          />
        </div>
      )}

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <TextInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, title, or interests..."
          />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filtered.length}
          </span>{" "}
          / {researchers.length}
          {filtered.length > itemsPerPage && (
            <span className="ml-2">
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </div>
      </div>

      {/* Grid roster list (3 cards per row) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedResearchers.map((r) => (
          <RosterRow
            key={r.id}
            researcher={r}
            active={r.id === featured?.id}
            onSelect={() => setActiveId(r.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Featured card (light spotlight, prominent but not colorful)
function FeaturedResearcher({ researcher }: { researcher: User }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* accent line + glow */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500/70 via-white/30 to-blue-500/70" />
      <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full shadow-lg ring-4 ring-blue-500/20 sm:h-20 sm:w-20">
            <Image
              src={researcher.avartarUrl}
              alt={researcher.fullname}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="truncate text-lg font-bold text-gray-900 sm:text-xl dark:text-white">
                {researcher.fullname}
              </h4>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                Researcher
              </span>
            </div>

            {researcher.profile?.academicTitle && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {researcher.profile.academicTitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          {researcher.profile?.publicEmail && (
            <a
              href={`mailto:${researcher.profile.publicEmail}`}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-blue-700"
            >
              <EnvelopeIcon className="h-4 w-4" />
              Contact
            </a>
          )}

          <Link
            href={`/labs/${researcher.labId}/${researcher.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-900 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            View profile
          </Link>
        </div>
      </div>

      {researcher.profile?.researchInterests && (
        <p className="relative mt-4 line-clamp-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {researcher.profile.researchInterests}
        </p>
      )}

      {/* external links row */}
      <div className="relative mt-4 flex flex-wrap gap-2">
        {researcher.profile?.researchGateUrl && (
          <a
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            href={researcher.profile.researchGateUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            ResearchGate
          </a>
        )}
        {researcher.profile?.googleScholarUrl && (
          <a
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            href={researcher.profile.googleScholarUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Scholar
          </a>
        )}
        {researcher.profile?.linkedinUrl && (
          <a
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            href={researcher.profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}

// Roster row component (card layout)
function RosterRow({
  researcher,
  active,
  onSelect,
}: {
  researcher: User;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={[
        "rounded-xl border bg-white p-4 transition dark:bg-gray-900",
        active
          ? "border-blue-300 shadow-md dark:border-blue-700"
          : "border-gray-200 hover:shadow-sm dark:border-gray-700",
      ].join(" ")}
    >
      {/* Card content */}
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full cursor-pointer flex-col items-center gap-3 text-center"
      >
        <div
          className={[
            "relative h-16 w-16 overflow-hidden rounded-full",
            active ? "ring-2 ring-blue-500" : "ring-2 ring-transparent",
          ].join(" ")}
        >
          <Image
            src={researcher.avartarUrl}
            alt={researcher.fullname}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        <div className="w-full">
          <div className="mb-1 flex flex-wrap items-center justify-center gap-2">
            <div className="font-semibold text-gray-900 dark:text-white">
              {researcher.fullname}
            </div>
          </div>
          <span className="mb-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] tracking-wide text-gray-700 uppercase dark:bg-gray-800 dark:text-gray-200">
            Researcher
          </span>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {researcher.profile?.academicTitle ?? "—"}
          </div>
        </div>
      </button>

      <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
        <Link
          href={`/labs/${researcher.labId}/${researcher.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          <span>View profile</span>
        </Link>
      </div>
    </div>
  );
}
