import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview"
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton"
import { Suspense } from "react"

export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardOverview />
        </Suspense>
    )
}
