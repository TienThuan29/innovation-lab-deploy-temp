"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserTable from "@/app/dashboard/components/user-table";
import { mockDirectors } from "@/mocks/users";
import { getStoredSession } from "@/utils/session";

export default function DirectorPage() {
  const router = useRouter();
  const [isSuperDirector, setIsSuperDirector] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const session = getStoredSession();
    const isSuper = session?.role === "SUPER_DIRECTOR";

    // Only SUPER_DIRECTOR can access this page
    if (!isSuper) {
      router.push("/dashboard");
      return;
    }

    setIsSuperDirector(isSuper);
    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="mt-8">
      <UserTable
        users={mockDirectors}
        title="Director Management"
        showActions={isSuperDirector}
        showCreateButton={isSuperDirector}
      />
    </div>
  );
}
