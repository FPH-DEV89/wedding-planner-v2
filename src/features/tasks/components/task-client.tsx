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

    // Only show "TASK" type tasks
    const todoTasks = initialData.filter(task => task.type === "TASK")

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
                return <Badge className="bg-red-50 text-red-600 border-red-100 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">Haute</Badge>
            case "MEDIUM":
                return <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">Moyenne</Badge>
            default:
                return <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">Basse</Badge>
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE":
                return <CheckCircle2 className="h-6 w-6 text-secondary fill-secondary/10" />
            case "IN_PROGRESS":
                return <Clock className="h-6 w-6 text-primary animate-pulse" />
            default:
                return <Circle className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-serif font-extrabold tracking-tight text-[#c96d4b]">Liste des Tâches</h2>
                    <p className="text-sm text-[#7c6d66] mt-1 font-medium">
                        {todoTasks.filter(t => t.status !== "DONE").length} missions à accomplir pour le jour J.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val)
                    if (!val) setEditingTask(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#c96d4b] hover:bg-[#b05a3a] text-white rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95">
                            <Plus className="mr-2 h-4 w-4" /> Nouvelle tâche
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-background rounded-3xl border-border/40 shadow-2xl p-0 overflow-hidden">
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif font-bold text-primary">
                                    {editingTask ? "Modifier la tâche" : "Ajouter une tâche"}
                                </DialogTitle>
                            </DialogHeader>
                        </div>
                        <div className="p-6">
                            <TaskForm
                                initialData={editingTask}
                                onSuccess={() => setOpen(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-3 mt-6">
                {todoTasks.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border-2 border-dashed border-border/40 rounded-3xl font-serif italic text-lg bg-white/40 backdrop-blur-sm">
                        Votre liste de tâches est vide pour le moment.
                    </div>
                ) : (
                    todoTasks.map((task) => (
                        <Card key={task.id} className={cn(
                            "bg-white border-[#e9ded0] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden",
                            task.status === "DONE" && "opacity-60 bg-[#f3ece4]"
                        )}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
                                <div className="flex items-center gap-5">
                                    <button
                                        onClick={() => onStatusChange(task.id, task.status)}
                                        className="transition-transform active:scale-90"
                                    >
                                        {getStatusIcon(task.status)}
                                    </button>
                                    <div>
                                        <CardTitle className={cn(
                                            "text-lg font-serif font-bold text-[#3a2a22] transition-all",
                                            task.status === "DONE" && "line-through text-[#7c6d66] italic font-normal"
                                        )}>
                                            {task.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-4 mt-1.5">
                                            {task.dueDate && (
                                                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#7c6d66] bg-[#f3ece4] px-2 py-0.5 rounded-md">
                                                    <Clock className="mr-1.5 h-3 w-3 text-[#c96d4b]" />
                                                    {format(new Date(task.dueDate), "d MMM yyyy", { locale: fr })}
                                                </div>
                                            )}
                                            {getPriorityBadge(task.priority)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(task)}
                                        className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(task.id)}
                                        className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                        <Trash className="h-5 w-5" />
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
