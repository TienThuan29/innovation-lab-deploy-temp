"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import UserTable from "@/app/dashboard/components/user-table";
import { mockResearchers } from "@/mocks/users";
import { getStoredSession } from "@/utils/session";

export default function ResearcherPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [session, setSession] =
    useState<ReturnType<typeof getStoredSession>>(null);

  useEffect(() => {
    const currentSession = getStoredSession();
    setSession(currentSession);

    const isSuperDirector = currentSession?.role === "SUPER_DIRECTOR";
    const isDirector = currentSession?.role === "DIRECTOR";

    // Only SUPER_DIRECTOR and DIRECTOR can access this page
    if (!isSuperDirector && !isDirector) {
      router.push("/dashboard");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  // Filter researchers by lab for DIRECTOR
  const filteredResearchers = useMemo(() => {
    if (!session) return [];

    const isDirector = session.role === "DIRECTOR";
    const userLabId = session.labId;

    if (isDirector && userLabId) {
      return mockResearchers.filter(
        (researcher) => researcher.labId === userLabId,
      );
    }

    return mockResearchers;
  }, [session]);

  const isDirector = session?.role === "DIRECTOR";
  const isSuperDirector = session?.role === "SUPER_DIRECTOR";

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="mt-8">
      <UserTable
        users={filteredResearchers}
        title="Researcher Management"
        showActions={isDirector || isSuperDirector}
        showCreateButton={isDirector || isSuperDirector}
        fixedLabId={isDirector ? session?.labId : undefined}
      />
    </div>
  );
}
