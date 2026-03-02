"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  DarkThemeToggle,
  Dropdown,
  Avatar,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import {
  getStoredSession,
  clearStoredSession,
  type SessionData,
} from "@/utils/session";
import { useToast } from "@/hooks/useToast";

export default function Sidebar() {
  const pathname = usePathname();
  const [labsOpen, setLabsOpen] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);
  const router = useRouter();
  const { showSuccess } = useToast();
  const isSuperDirector = pathname?.startsWith("/superdirector");
  const isSessionSuperDirector = session?.role === "SUPER_DIRECTOR";

  useEffect(() => {
    setSession(getStoredSession());
    const handleStorage = () => setSession(getStoredSession());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    clearStoredSession();
    setSession(null);
    showSuccess("Logged out");
    router.push("/login");
  };


  const itemBase =
    "group flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-md mx-2";

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <aside
      id="sidebar"
      className="fixed top-0 left-0 z-40 h-screen w-72 -translate-x-full border-r border-gray-100 bg-white transition-transform sm:translate-x-0 dark:border-gray-800 dark:bg-gray-900"
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col overflow-y-auto py-6">
        {/* Title Area matching header, linked to home */}
        <Link href="/" className="mb-8 block space-y-2 px-6">
          <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-300">
            Dashboard
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 p-2 dark:from-blue-500 dark:to-purple-500">
              <Image
                src="/flowbite.svg"
                alt="Innovation Labs Logo"
                width={24}
                height={24}
                className="h-6 w-6"
                priority
              />
            </span>
            <h1 className="text-xl leading-tight font-bold text-gray-900 dark:text-white">
              The Innovation
              <br />
              Laboratories
            </h1>
          </div>
        </Link>

        <ul className="flex-1 space-y-1">
          {/* Conditional Rendering based on Path */}
          {isSuperDirector ? (
            // Super Director (Lab View) - Show Labs List from Mock Data
            <>
              <div className="px-3">
                <button
                  onClick={() => setLabsOpen(!labsOpen)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  Research & Development
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${labsOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${labsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {mockLabs.map((lab, index) => (
                    <li key={lab.id}>
                      <Link
                        href={`/dashboard/supervisor/${lab.id}`}
                        className={`${itemBase} ${isActive(`/dashboard/supervisor/${lab.id}`)
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                          }`}
                      >
                        <div className="mr-2 w-6 text-center font-semibold">
                          {index + 1}.
                        </div>
                        <span>{lab.shortName || lab.name}</span>
                      </Link>
                    </li>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Normal Dashboard Tabs
            <>
              {/* Director Management - Only for SUPER_DIRECTOR */}
              {isSessionSuperDirector ? (
                <li>
                  <Link
                    href="/dashboard/director"
                    className={`${itemBase} ${
                      isActive("/dashboard/director")
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    }`}
                  >
                    <div className="mr-2 w-6 text-center font-semibold">1.</div>
                    <span>Director Management</span>
                  </Link>
                </li>
              ) : null}

              {/* Lecturer Management - For SUPER_DIRECTOR and DIRECTOR */}
              {(isSessionSuperDirector || session?.role === "DIRECTOR") && (
                <li>
                  <Link
                    href="/dashboard/lecturer"
                    className={`${itemBase} ${
                      isActive("/dashboard/lecturer")
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    }`}
                  >
                    <div className="mr-2 w-6 text-center font-semibold">2.</div>
                    <span>Lecturer Management</span>
                  </Link>
                </li>
              )}

              {/* Researcher Management - For SUPER_DIRECTOR and DIRECTOR */}
              {(isSessionSuperDirector || session?.role === "DIRECTOR") && (
                <li>
                  <Link
                    href="/dashboard/researcher"
                    className={`${itemBase} ${
                      isActive("/dashboard/researcher")
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    }`}
                  >
                    <div className="mr-2 w-6 text-center font-semibold">3.</div>
                    <span>Researcher Management</span>
                  </Link>
                </li>
              )}

              {/* Lab Management - Only for SUPER_DIRECTOR */}
              {isSessionSuperDirector ? (
                <li>
                  <Link
                    href="/dashboard/lab-management"
                    className={`${itemBase} ${
                      isActive("/dashboard/lab-management")
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    }`}
                  >
                    <div className="mr-2 w-6 text-center font-semibold">4.</div>
                    <span>Lab Management</span>
                  </Link>
                </li>
              ) : null}
              <li>
                <Link
                  href="/dashboard/activity"
                  className={`${itemBase} ${
                    isActive("/dashboard/activity")
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <div className="mr-2 w-6 text-center font-semibold">5.</div>
                  <span>Activity</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/assignment"
                  className={`${itemBase} ${
                    isActive("/dashboard/assignment")
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <div className="mr-2 w-6 text-center font-semibold">6.</div>
                  <span>Assignment</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/guide"
                  className={`${itemBase} ${
                    isActive("/dashboard/guide")
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <div className="mr-2 w-6 text-center font-semibold">7.</div>
                  <span>Guide</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/research-tier"
                  className={`${itemBase} ${
                    isActive("/dashboard/research-tier")
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <div className="mr-2 w-6 text-center font-semibold">8.</div>
                  <span>Research Tier</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/post"
                  className={`${itemBase} ${
                    isActive("/dashboard/post")
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <div className="mr-2 w-6 text-center font-semibold">9.</div>
                  <span>Post</span>
                </Link>
              </li>

              {/* Labs Section - Only for SUPER_DIRECTOR */}
              {isSessionSuperDirector && (
                <div className="px-3 pt-2">
                  <button
                    onClick={() => setLabsOpen(!labsOpen)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    Labs
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${labsOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div
                    className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${labsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    {labs.map((lab, index) => (
                      <li key={lab.href}>
                        <Link
                          href={lab.href}
                          className={`${itemBase} ${
                            isActive(lab.href)
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                          }`}
                        >
                          <div className="mr-2 w-6 text-center font-semibold">
                            {index + 1}.
                          </div>
                          <span>{lab.label}</span>
                        </Link>
                      </li>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </ul>

        {/* User Profile Section at Bottom */}
        <div className="mt-auto border-t border-gray-100 p-4 dark:border-gray-800">
          {session ? (
            <div className="flex items-center gap-3">
              <Dropdown
                inline
                label={
                  <div className="flex cursor-pointer items-center gap-3">
                    <Avatar
                      rounded
                      img={session.avartarUrl}
                      placeholderInitials={
                        session.fullname?.[0]?.toUpperCase() ?? "U"
                      }
                      alt="User avatar"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {session.fullname}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {session.role}
                      </p>
                    </div>
                  </div>
                }
              >
                <DropdownHeader>
                  <span className="block text-sm font-medium">
                    {session.fullname}
                  </span>
                  <span className="block truncate text-sm">
                    {session.email}
                  </span>
                </DropdownHeader>
                <DropdownItem as={Link} href="/profile">
                  User profile
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </Dropdown>
              <DarkThemeToggle />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Not signed in
              </span>
              <div className="flex items-center gap-2">
                <DarkThemeToggle />
                <Link
                  href="/login"
                  className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
