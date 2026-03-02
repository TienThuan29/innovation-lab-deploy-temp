"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Card,
    Badge,
    Button,
    TextInput,
    Select,
} from "flowbite-react";
import { mockLabs } from "@/mocks/labs";
import {
    mockInfrastructures,
    mockInfrastructureTypes,
} from "@/mocks/infrastructures";
import { Infrastructure, InfrastructureStatus } from "@/types/infrastructure";
import Header from "@/components/header";
import {
    MagnifyingGlassIcon,
    EnvelopeIcon,
    LinkIcon,
    CheckCircleIcon,
    XCircleIcon,
    BuildingOfficeIcon,
    WrenchScrewdriverIcon,
    XMarkIcon,
    ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

const statusConfig: Record<
    InfrastructureStatus,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { label: string; color: "success" | "warning" | "failure"; icon: any }
> = {
    AVAILABLE: {
        label: "Available",
        color: "success",
        icon: CheckCircleIcon,
    },
    MAINTENANCE: {
        label: "Maintenance",
        color: "warning",
        icon: WrenchScrewdriverIcon,
    },
    UNAVAILABLE: {
        label: "Unavailable",
        color: "failure",
        icon: XCircleIcon,
    },
};

export default function InfrastructuresPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [selectedLab, setSelectedLab] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"relevant" | "newest" | "name">("relevant");
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeLabId, setActiveLabId] = useState<string | null>(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Detect scroll for sticky shadow
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Filter and sort infrastructures
    const filteredInfrastructures = useMemo(() => {
        let filtered = mockInfrastructures;

        // Filter by lab
        if (selectedLab !== "all") {
            filtered = filtered.filter((infra) => infra.labId === selectedLab);
        }

        // Filter by status
        if (selectedStatus !== "all") {
            filtered = filtered.filter(
                (infra) => infra.status === selectedStatus
            );
        }

        // Filter by type
        if (selectedType !== "all") {
            filtered = filtered.filter((infra) => infra.typeId === selectedType);
        }

        // Filter by search query (using debounced value)
        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            filtered = filtered.filter((infra) => {
                const type = mockInfrastructureTypes.find(
                    (t) => t.id === infra.typeId
                );
                const lab = mockLabs.find((l) => l.id === infra.labId);
                return (
                    infra.description.toLowerCase().includes(query) ||
                    infra.specifications.toLowerCase().includes(query) ||
                    type?.name.toLowerCase().includes(query) ||
                    lab?.name.toLowerCase().includes(query) ||
                    infra.contactPerson.toLowerCase().includes(query)
                );
            });
        }

        // Sort
        filtered = [...filtered].sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            } else if (sortBy === "name") {
                const typeA = mockInfrastructureTypes.find((t) => t.id === a.typeId);
                const typeB = mockInfrastructureTypes.find((t) => t.id === b.typeId);
                return (typeA?.name || "").localeCompare(typeB?.name || "");
            }
            // relevant: keep original order (or could implement relevance scoring)
            return 0;
        });

        return filtered;
    }, [debouncedSearchQuery, selectedLab, selectedStatus, selectedType, sortBy]);

    // Group by lab
    const infrastructuresByLab = useMemo(() => {
        const grouped: Record<string, Infrastructure[]> = {};
        filteredInfrastructures.forEach((infra) => {
            if (!grouped[infra.labId]) {
                grouped[infra.labId] = [];
            }
            grouped[infra.labId].push(infra);
        });
        return grouped;
    }, [filteredInfrastructures]);

    // Scroll spy to highlight active lab section
    useEffect(() => {
        const handleScroll = () => {
            const labs = mockLabs.filter((lab) => infrastructuresByLab[lab.id]);
            const scrollPosition = window.scrollY + 150; // Offset for sticky header

            for (let i = labs.length - 1; i >= 0; i--) {
                const lab = labs[i];
                const element = document.getElementById(`lab-${lab.id}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + window.scrollY;
                    if (scrollPosition >= elementTop) {
                        setActiveLabId(lab.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener("scroll", handleScroll);
    }, [infrastructuresByLab]);

    const totalInfrastructures = mockInfrastructures.length;
    const availableCount = mockInfrastructures.filter(
        (i) => i.status === "AVAILABLE"
    ).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
                {/* Cover Image Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop"
                        alt="Laboratory Infrastructure"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-blue-900/90 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95"></div>
                </div>

                {/* Content */}
                <div className="container relative z-10 mx-auto max-w-7xl px-4">
                    <div className="text-center">
                        <h1 className="mb-4 text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
                            Laboratory Infrastructure
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-blue-100 drop-shadow-md md:text-xl">
                            Explore the cutting-edge infrastructure and resources available
                            across our innovation laboratories
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                            <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-white drop-shadow-md">
                                    {totalInfrastructures}
                                </div>
                                <div className="text-sm text-blue-100 drop-shadow-sm">Total Resources</div>
                            </div>
                            <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-white drop-shadow-md">
                                    {availableCount}
                                </div>
                                <div className="text-sm text-blue-100 drop-shadow-sm">Available Now</div>
                            </div>
                            <div className="rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
                                <div className="text-2xl font-bold text-white drop-shadow-md">
                                    {mockLabs.length}
                                </div>
                                <div className="text-sm text-blue-100 drop-shadow-sm">Active Labs</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div
                className={`top-20 z-40 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50/50 backdrop-blur-sm transition-shadow duration-200 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800/50 ${isScrolled ? "shadow-lg" : ""
                    }`}
            >
                <div className="container mx-auto max-w-7xl px-4 py-6">
                    {/* Search Bar - Prominent */}
                    <div className="mb-6">
                        <div className="relative">
                            <TextInput
                                id="search"
                                icon={MagnifyingGlassIcon}
                                placeholder="Search infrastructure by name, description, or lab..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full rounded-xl border-2 border-gray-200 bg-white shadow-md transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-500 dark:hover:border-gray-600 ${searchQuery.trim() ? "pr-20" : ""
                                    }`}
                            />
                            {/* Clear button when typing */}
                            {searchQuery.trim() && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/40 text-gray-600 dark:text-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm hover:shadow"
                                    aria-label="Clear search"
                                >
                                    <XMarkIcon className="h-3.5 w-3.5" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                        {/* Lab Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Lab
                            </label>
                            <Select
                                value={selectedLab}
                                onChange={(e) => setSelectedLab(e.target.value)}
                                className="w-full rounded-lg border-2 border-gray-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-500 dark:hover:border-gray-600"
                            >
                                <option value="all">All Labs</option>
                                {mockLabs.map((lab) => (
                                    <option key={lab.id} value={lab.id}>
                                        {lab.shortName}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Status
                            </label>
                            <Select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full rounded-lg border-2 border-gray-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-500 dark:hover:border-gray-600"
                            >
                                <option value="all">All Status</option>
                                <option value="AVAILABLE">Available</option>
                                <option value="MAINTENANCE">Maintenance</option>
                                <option value="UNAVAILABLE">Unavailable</option>
                            </Select>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Infrastructure Type
                            </label>
                            <Select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full rounded-lg border-2 border-gray-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-500 dark:hover:border-gray-600"
                            >
                                <option value="all">All Types</option>
                                {mockInfrastructureTypes
                                    .filter((type) => type.isEnable)
                                    .map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                            </Select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Sort By
                            </label>
                            <Select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value as "relevant" | "newest" | "name")
                                }
                                className="w-full rounded-lg border-2 border-gray-200 bg-white shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-500 dark:hover:border-gray-600"
                            >
                                <option value="relevant">Relevant</option>
                                <option value="newest">Newest</option>
                                <option value="name">Name A–Z</option>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filters & Results */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        {/* Active Filters */}
                        {(selectedLab !== "all" ||
                            selectedStatus !== "all" ||
                            selectedType !== "all" ||
                            searchQuery.trim()) && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Active filters:
                                    </span>

                                    {searchQuery.trim() && (
                                        <Badge
                                            color="blue"
                                            className="px-3 py-1.5 text-xs font-medium"
                                        >
                                            Search: {searchQuery}
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery("")}
                                                className="ml-2 hover:text-blue-800 dark:hover:text-blue-200"
                                                aria-label="Remove search filter"
                                            >
                                                <XMarkIcon className="h-3.5 w-3.5" />
                                            </button>
                                        </Badge>
                                    )}

                                    {selectedLab !== "all" && (
                                        <Badge
                                            color="blue"
                                            className="px-3 py-1.5 text-xs font-medium"
                                        >
                                            Lab:{" "}
                                            {mockLabs.find((l) => l.id === selectedLab)?.shortName ||
                                                selectedLab}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedLab("all")}
                                                className="ml-2 hover:text-blue-800 dark:hover:text-blue-200"
                                                aria-label="Remove lab filter"
                                            >
                                                <XMarkIcon className="h-3.5 w-3.5" />
                                            </button>
                                        </Badge>
                                    )}

                                    {selectedStatus !== "all" && (
                                        <Badge
                                            color="blue"
                                            className="px-3 py-1.5 text-xs font-medium"
                                        >
                                            Status:{" "}
                                            {statusConfig[selectedStatus as InfrastructureStatus].label}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedStatus("all")}
                                                className="ml-2 hover:text-blue-800 dark:hover:text-blue-200"
                                                aria-label="Remove status filter"
                                            >
                                                <XMarkIcon className="h-3.5 w-3.5" />
                                            </button>
                                        </Badge>
                                    )}

                                    {selectedType !== "all" && (
                                        <Badge
                                            color="blue"
                                            className="px-3 py-1.5 text-xs font-medium"
                                        >
                                            Type:{" "}
                                            {mockInfrastructureTypes.find((t) => t.id === selectedType)
                                                ?.name || selectedType}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedType("all")}
                                                className="ml-2 hover:text-blue-800 dark:hover:text-blue-200"
                                                aria-label="Remove type filter"
                                            >
                                                <XMarkIcon className="h-3.5 w-3.5" />
                                            </button>
                                        </Badge>
                                    )}

                                    <Button
                                        size="xs"
                                        color="gray"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedLab("all");
                                            setSelectedStatus("all");
                                            setSelectedType("all");
                                            setSortBy("relevant");
                                        }}
                                        className="text-xs"
                                    >
                                        Clear all
                                    </Button>
                                </div>
                            )}

                        {/* Results Count */}
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                                {filteredInfrastructures.length}
                            </span>{" "}
                            of{" "}
                            <span className="text-gray-900 dark:text-white">
                                {totalInfrastructures}
                            </span>{" "}
                            resources
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto max-w-7xl px-4 py-12">
                {Object.keys(infrastructuresByLab).length === 0 ? (
                    <Card className="bg-white dark:bg-gray-800">
                        <div className="py-12 text-center">
                            <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                                No infrastructure found
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Try adjusting your filters or search query.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                                        Laboratories List
                                    </h3>
                                    <nav className="space-y-1">
                                        {mockLabs
                                            .filter((lab) => infrastructuresByLab[lab.id])
                                            .map((lab, index) => {
                                                const labInfrastructures =
                                                    infrastructuresByLab[lab.id] || [];
                                                const isActive = activeLabId === lab.id;
                                                return (
                                                    <button
                                                        key={lab.id}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const element = document.getElementById(
                                                                `lab-${lab.id}`
                                                            );
                                                            if (element) {
                                                                const offset = 120; // Account for sticky header
                                                                const elementPosition =
                                                                    element.getBoundingClientRect()
                                                                        .top;
                                                                const offsetPosition =
                                                                    elementPosition +
                                                                    window.pageYOffset -
                                                                    offset;

                                                                window.scrollTo({
                                                                    top: offsetPosition,
                                                                    behavior: "smooth",
                                                                });
                                                            }
                                                        }}
                                                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 flex items-center gap-2 group ${isActive
                                                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                                                            : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                                                            }`}
                                                    >
                                                        <span className={`text-xs font-medium ${isActive
                                                            ? "text-blue-700 dark:text-blue-300"
                                                            : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                                            }`}>
                                                            {index + 1}.
                                                        </span>
                                                        <span className="flex-1">{lab.name}</span>
                                                        <span className={`text-xs ${isActive
                                                            ? "text-blue-600 dark:text-blue-400"
                                                            : "text-gray-500 dark:text-gray-400"
                                                            }`}>
                                                            ({labInfrastructures.length})
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                    </nav>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            <div className="space-y-12">
                                {mockLabs
                                    .filter((lab) => infrastructuresByLab[lab.id])
                                    .map((lab) => {
                                        const labInfrastructures =
                                            infrastructuresByLab[lab.id] || [];
                                        return (
                                            <LabInfrastructureSection
                                                key={lab.id}
                                                lab={lab}
                                                infrastructures={labInfrastructures}
                                            />
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function LabInfrastructureSection({
    lab,
    infrastructures,
}: {
    lab: (typeof mockLabs)[0];
    infrastructures: Infrastructure[];
}) {
    return (
        <div id={`lab-${lab.id}`} className="scroll-mt-24 space-y-6">
            {/* Lab Header */}
            <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
                    <Image
                        src={lab.coverImageUrl}
                        alt={lab.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                    />
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {lab.name}
                    </h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        {lab.shortName} • {infrastructures.length} infrastructure
                        {infrastructures.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link href={`/labs/${lab.id}`}>
                    <Button outline color="blue" className="inline-flex items-center gap-2">
                        View Lab
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            {/* Infrastructure Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {infrastructures.map((infra) => (
                    <InfrastructureCard key={infra.id} infrastructure={infra} />
                ))}
            </div>
        </div>
    );
}

function InfrastructureCard({ infrastructure }: { infrastructure: Infrastructure }) {
    const type = mockInfrastructureTypes.find(
        (t) => t.id === infrastructure.typeId
    );
    const statusInfo = statusConfig[infrastructure.status];
    const StatusIcon = statusInfo.icon;

    return (
        <Card className="group relative h-full overflow-hidden bg-white transition-all hover:shadow-xl dark:bg-gray-800">
            {/* Status Badge */}
            <div className="absolute right-4 top-4 z-10">
                <Badge
                    color={statusInfo.color}
                    icon={StatusIcon}
                    className="shadow-lg"
                >
                    {statusInfo.label}
                </Badge>
            </div>

            {/* Image */}
            <div className="relative -mx-6 -mt-6 h-48 overflow-hidden">
                <Image
                    src={infrastructure.coverImageUrl}
                    alt={type?.name || "Infrastructure"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                    <Badge color="blue" className="bg-blue-600/90 text-white">
                        {type?.name || "Infrastructure"}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {type?.name || "Infrastructure"}
                    </h3>
                    {/* <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {infrastructure.description}
                    </p> */}
                </div>

                {/* Specifications Preview */}
                {infrastructure.specifications && (
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Key Specifications
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                            {infrastructure.specifications}
                        </p>
                    </div>
                )}

                {/* Contact Information */}
                <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span className="truncate">{infrastructure.contactPerson}</span>
                    </div>
                    <a
                        href={`mailto:${infrastructure.contactEmail}`}
                        className="flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <EnvelopeIcon className="h-4 w-4" />
                        <span className="truncate">{infrastructure.contactEmail}</span>
                    </a>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {infrastructure.referenceUrl && (
                        <Button
                            as={Link}
                            href={infrastructure.referenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            outline
                            color="blue"
                            size="sm"
                            className="flex-1 text-xs"
                        >
                            <LinkIcon className="mr-1.5 h-3.5 w-3.5" />
                            Learn More
                        </Button>
                    )}
                    <Button
                        as={Link}
                        href={`mailto:${infrastructure.contactEmail}?subject=Inquiry about ${type?.name || "Infrastructure"}`}
                        outline
                        color="gray"
                        size="sm"
                        className="flex-1 text-xs"
                    >
                        <EnvelopeIcon className="mr-1.5 h-3.5 w-3.5" />
                        Contact
                    </Button>
                </div>
            </div>
        </Card>
    );
}

