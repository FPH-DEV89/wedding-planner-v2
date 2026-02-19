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

interface TimelineClientProps {
    initialData: Task[]
}

export const TimelineClient = ({ initialData }: TimelineClientProps) => {
    const [open, setOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    // Sort tasks by due date
    const sortedTasks = [...initialData].sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    const onEdit = (task: Task) => {
        setEditingTask(task)
        setOpen(true)
    }

    const onDelete = async (id: string) => {
        if (!window.confirm("Supprimer cet événement ?")) return
        try {
            const response = await deleteTask(id)
            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success("Événement supprimé")
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression.")
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
                    <h2 className="text-3xl font-bold tracking-tight text-white">Timeline du Mariage</h2>
                    <p className="text-sm text-zinc-400">
                        Le déroulé chronologique de votre grand jour.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val)
                    if (!val) setEditingTask(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-pink-600 hover:bg-pink-700">
                            <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTask ? "Modifier l'événement" : "Ajouter à la timeline"}
                            </DialogTitle>
                        </DialogHeader>
                        <TaskForm
                            initialData={editingTask}
                            onSuccess={() => setOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent mt-12">
                {sortedTasks.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                        Votre timeline est vide. Ajoutez les moments clés de votre journée !
                    </div>
                ) : (
                    sortedTasks.map((task, index) => (
                        <div key={task.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Dot */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition group-hover:border-pink-500/50">
                                {getStatusIcon(task.status)}
                            </div>
                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded border border-zinc-800 bg-zinc-900/50 shadow transition group-hover:border-zinc-700">
                                <div className="flex items-center justify-between mb-1">
                                    <time className="text-xs font-bold text-pink-500 uppercase tracking-wider">
                                        {task.dueDate ? format(new Date(task.dueDate), "HH:mm", { locale: fr }) : "Horaire à définir"}
                                    </time>
                                    <div className="flex gap-2">
                                        <button onClick={() => onEdit(task)} className="text-zinc-500 hover:text-white transition">
                                            <Pencil className="h-3 w-3" />
                                        </button>
                                        <button onClick={() => onDelete(task.id)} className="text-zinc-500 hover:text-red-500 transition">
                                            <Trash className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-white">{task.title}</h3>
                                {task.description && (
                                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{task.description}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
