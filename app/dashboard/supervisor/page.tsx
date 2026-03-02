import { redirect } from 'next/navigation';
import { mockLabs } from "@/mocks/labs";

export default function SupervisorDashboardRedirect() {
    if (mockLabs.length > 0) {
        redirect(`/dashboard/supervisor/${mockLabs[0].id}`);
    }
    return <div>No labs configuration found.</div>;
}
