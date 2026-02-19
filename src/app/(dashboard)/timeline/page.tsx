import { getTasks } from "@/features/tasks/actions"
import { TaskClient } from "@/features/tasks/components/task-client"

export default async function TimelinePage() {
    const tasksResponse = await getTasks()
    const tasks = tasksResponse.data || []

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <TaskClient initialData={tasks} />
            </div>
        </div>
    )
}
