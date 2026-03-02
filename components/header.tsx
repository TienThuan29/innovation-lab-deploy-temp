"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  DarkThemeToggle,
  Button,
  Dropdown,
  Avatar,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
} from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearStoredSession,
  getStoredSession,
  type SessionData,
} from "@/utils/session";
import { useToast } from "@/hooks/useToast";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { showSuccess } = useToast();
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    setSession(getStoredSession());

    const handleStorage = () => {
      setSession(getStoredSession());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    clearStoredSession();
    setSession(null);
    showSuccess("Logged out");
    router.push("/login");
  };

  // Filter dashboard link - only show if logged in and not a student
  const canAccessDashboard = session && session.role !== "STUDENT";
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About us" },
    // { href: "/join-lab-application", label: "Join Lab Application" },
    ...(canAccessDashboard ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    { href: "/faqs", label: "FAQs" },
    // { href: "/post", label: "Post" },
    // { href: "/dashboard", label: "Dashboard" },
    // { href: "/faqs", label: "FAQs" },
    // { href: "/assignment", label: "Assignment" },
    // { href: "/activity", label: "Activity" },
    // { href: "/guide", label: "Guide" },
    // { href: "/research-tier", label: "Research Tier" },
    { href: "/infrastructures", label: "Infrastructures" },
  ];

  return (
    <div className="fixed top-4 right-0 left-0 z-50 w-full px-4">
      <div className="relative mx-auto max-w-7xl overflow-visible rounded-full border border-white/30 bg-white/70 shadow-2xl shadow-black/10 backdrop-blur-2xl backdrop-saturate-150 dark:border-gray-600/40 dark:bg-gray-800/70 dark:shadow-black/40">
        {/* Glass overlay gradient - different for light and dark mode */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/20 to-transparent dark:from-gray-700/30 dark:to-transparent"></div>
        <Navbar fluid className="relative bg-transparent px-6 py-3">
          <NavbarBrand as={Link} href="/" className="mr-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 p-2 dark:from-blue-500 dark:to-purple-500">
                <Image
                  src="/flowbite.svg"
                  alt="Innovation Labs Logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="self-center text-lg font-bold whitespace-nowrap text-gray-900 dark:text-white">
                  Innovation Labs
                </span>
              </div>
            </div>
          </NavbarBrand>
          <NavbarCollapse className="mt-0!">
            {navLinks.map((link) => (
              <NavbarLink
                key={link.href}
                as={Link}
                href={link.href}
                active={pathname === link.href}
                className={`rounded-full transition-all duration-200 ${pathname === link.href
                    ? "bg-blue-600 px-10 py-4 font-bold text-white"
                    : "px-4 py-2 font-bold text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                  }`}
              >
                {link.label}
              </NavbarLink>
            ))}
            <div className="mt-4 border-t border-gray-200/50 pt-4 lg:hidden dark:border-gray-700/50">
              <DarkThemeToggle />
            </div>
          </NavbarCollapse>
          <div className="flex items-center gap-3">
            <DarkThemeToggle className="hidden lg:flex" />
            <NavbarToggle className="lg:hidden" />
            {session ? (
              <Dropdown
                inline
                label={
                  <div className="flex items-center gap-2">
                    <Avatar
                      rounded
                      img={session.avartarUrl}
                      placeholderInitials={
                        session.fullname?.[0]?.toUpperCase() ?? "U"
                      }
                      alt="User avatar"
                    />
                    <div className="hidden flex-col text-left sm:flex">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {session.fullname}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {session.role}
                      </span>
                    </div>
                  </div>
                }
              >
                <DropdownHeader>
                  <span className="block text-sm">{session.fullname}</span>
                  <span className="block truncate text-sm font-medium">
                    {session.email}
                  </span>
                </DropdownHeader>
                <DropdownItem as={Link} href="/profile">
                  User profile
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </Dropdown>
            ) : (
              <Button
                className="hidden cursor-pointer rounded-full border-0 from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-purple-700 sm:flex dark:shadow-blue-500/20"
                as={Link}
                href="/login"
              >
                Sign in
              </Button>
            )}
          </div>
        </Navbar>
      </div>
    </div>
  );
}
