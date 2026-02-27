import { getTasks } from "@/features/tasks/actions"
import { TimelineClient } from "@/features/tasks/components/timeline-client"
import { TimelineSkeleton } from "@/features/tasks/components/timeline-skeleton"
import { Suspense } from "react"

async function TimelineContent() {
    const tasksResponse = await getTasks()
    const tasks = tasksResponse.data || []
    return <TimelineClient initialData={tasks} />
}

export default function TimelinePage() {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Suspense fallback={<TimelineSkeleton />}>
                    <TimelineContent />
                </Suspense>
            </div>
        </div>
    )
}
