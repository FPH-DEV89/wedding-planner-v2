"use client"

import { Plus, CheckCircle2, Circle, Clock, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { updateTaskStatus, deleteTask } from "../actions"
import { Task } from "../schema"
import { TaskForm } from "./task-form"

interface TaskClientProps {
    initialData: Task[]
}

export const TaskClient = ({ initialData }: TaskClientProps) => {
    const [open, setOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    const onEdit = (task: Task) => {
        setEditingTask(task)
        setOpen(true)
    }

    const onDelete = async (id: string) => {
        if (!window.confirm("Supprimer cette tâche ?")) return
        try {
            const response = await deleteTask(id)
            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success(response.success)
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression.")
        }
    }

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
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Haute</Badge>
            case "MEDIUM":
                return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Moyenne</Badge>
            default:
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Basse</Badge>
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
                        {initialData.filter(t => t.status !== "DONE").length} tâches restantes.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val)
                    if (!val) setEditingTask(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                            <Plus className="mr-2 h-4 w-4" /> Nouvelle tâche
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTask ? "Modifier la tâche" : "Ajouter une tâche"}
                            </DialogTitle>
                        </DialogHeader>
                        <TaskForm
                            initialData={editingTask}
                            onSuccess={() => setOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 mt-8">
                {initialData.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                        Aucune tâche planifiée.
                    </div>
                ) : (
                    initialData.map((task) => (
                        <Card key={task.id} className={cn(
                            "bg-zinc-900 border-zinc-800 group hover:border-zinc-700 transition",
                            task.status === "DONE" && "opacity-60"
                        )}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => onStatusChange(task.id, task.status)}>
                                        {getStatusIcon(task.status)}
                                    </button>
                                    <div>
                                        <CardTitle className={cn(
                                            "text-white text-base",
                                            task.status === "DONE" && "line-through text-zinc-500"
                                        )}>
                                            {task.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-3 mt-1">
                                            {task.dueDate && (
                                                <div className="flex items-center text-xs text-zinc-500">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {format(new Date(task.dueDate), "d MMM yyyy", { locale: fr })}
                                                </div>
                                            )}
                                            {getPriorityBadge(task.priority)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(task)}
                                        className="text-zinc-400 hover:text-white"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(task.id)}
                                        className="text-zinc-400 hover:text-red-500"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
