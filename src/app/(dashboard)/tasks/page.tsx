import { getTasks } from "@/features/tasks/actions"
import { TaskClient } from "@/features/tasks/components/task-client"

export default async function TasksPage() {
    const response = await getTasks()
    const initialData = response.data || []

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <TaskClient initialData={initialData} />
            </div>
        </div>
    )
}
