"use client"

import { Plus, CheckCircle2, Circle, Clock } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { updateTaskStatus } from "../actions"
import { Task } from "../schema"

interface TaskClientProps {
    initialData: Task[]
}

export const TaskClient = ({ initialData }: TaskClientProps) => {
    const onStatusChange = async (id: string, currentStatus: string) => {
        let nextStatus: "TODO" | "IN_PROGRESS" | "DONE" = "TODO"
        if (currentStatus === "TODO") nextStatus = "IN_PROGRESS"
        else if (currentStatus === "IN_PROGRESS") nextStatus = "DONE"
        else nextStatus = "TODO"

        try {
            const response = await updateTaskStatus(id, nextStatus)
            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success(response.success)
            }
        } catch (error) {
            toast.error("Erreur.")
        }
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return <Badge variant="destructive">Haute</Badge>
            case "MEDIUM":
                return <Badge className="bg-orange-500">Moyenne</Badge>
            default:
                return <Badge variant="secondary">Basse</Badge>
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE":
                return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            case "IN_PROGRESS":
                return <Clock className="h-5 w-5 text-sky-500" />
            default:
                return <Circle className="h-5 w-5 text-zinc-500" />
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Tâches</h2>
                    <p className="text-sm text-zinc-400">
                        Suivez l'avancement des préparatifs.
                    </p>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle tâche
                </Button>
            </div>

            <div className="grid gap-4 mt-8">
                {initialData.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                        Aucune tâche planifiée.
                    </div>
                ) : (
                    initialData.map((task) => (
                        <Card key={task.id} className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => onStatusChange(task.id, task.status)}>
                                        {getStatusIcon(task.status)}
                                    </button>
                                    <div>
                                        <CardTitle className={task.status === "DONE" ? "line-through text-zinc-500" : "text-white"}>
                                            {task.title}
                                        </CardTitle>
                                        <CardDescription>{task.description}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getPriorityBadge(task.priority)}
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
