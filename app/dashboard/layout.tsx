"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredSession, type SessionData } from "@/utils/session";
import Sidebar from "@/app/dashboard/components/sidebar";
// import Footer from "@/components/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getStoredSession();

    // Check if user is logged in and not a student
    if (!session || session.role === "STUDENT") {
      router.push("/");
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-gray-50 p-4 sm:ml-72 dark:bg-gray-900">
        <div className="container mx-auto">{children}</div>
      </main>
    </>
  );
}
