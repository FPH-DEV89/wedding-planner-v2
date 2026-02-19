"use client"

import { Plus, Camera, Utensils, GlassWater, Music, Heart, Car, Milestone, Pencil, Trash } from "lucide-react"
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

    const getEventIcon = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes("photos") || t.includes("photographe")) return <Camera className="h-6 w-6" />;
        if (t.includes("dîner") || t.includes("repas") || t.includes("manger") || t.includes("buffet")) return <Utensils className="h-6 w-6" />;
        if (t.includes("cocktail") || t.includes("vin") || t.includes("boire") || t.includes("toast")) return <GlassWater className="h-6 w-6" />;
        if (t.includes("danse") || t.includes("musique") || t.includes("soirée") || t.includes("bal")) return <Music className="h-6 w-6" />;
        if (t.includes("cérémonie") || t.includes("église") || t.includes("mairie")) return <Heart className="h-6 w-6" />;
        if (t.includes("départ") || t.includes("voiture") || t.includes("fin")) return <Car className="h-6 w-6" />;
        return <Milestone className="h-6 w-6" />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header section with wedding feel */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-block p-3 rounded-full bg-pink-500/10 mb-4">
                    <Heart className="h-8 w-8 text-pink-500 fill-pink-500/20" />
                </div>
                <h1 className="text-5xl font-serif text-white tracking-tight italic">
                    Notre Jour J
                </h1>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto my-4" />
                <p className="text-zinc-400 text-lg uppercase tracking-[0.2em] font-light">
                    Le déroulé de la journée
                </p>

                <div className="pt-8">
                    <Dialog open={open} onOpenChange={(val) => {
                        setOpen(val)
                        if (!val) setEditingTask(null)
                    }}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="border-zinc-800 hover:bg-white hover:text-black transition-all rounded-full px-8">
                                <Plus className="mr-2 h-4 w-4" /> Ajouter un moment fort
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white p-6 shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif italic mb-4">
                                    {editingTask ? "Modifier le moment" : "Nouvel événement"}
                                </DialogTitle>
                            </DialogHeader>
                            <TaskForm
                                initialData={editingTask}
                                onSuccess={() => setOpen(false)}
                                labels={{
                                    title: "Nom de l'événement",
                                    titlePlaceholder: "Cérémonie, Photos de groupe...",
                                    date: "Date",
                                    submit: "Ajouter au programme"
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Timeline Line */}
            <div className="relative space-y-0 before:absolute before:inset-0 before:left-1/2 before:-translate-x-px before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
                {sortedTasks.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 italic bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
                        Votre programme est en cours de création...
                    </div>
                ) : (
                    sortedTasks.map((task, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={task.id} className="relative flex items-center justify-between md:justify-normal group py-8">
                                {/* Content Wrapper */}
                                <div className={cn(
                                    "w-[calc(50%-2rem)] flex flex-col",
                                    isEven ? "md:mr-auto text-right md:pr-12" : "md:ml-auto md:pl-12 order-2"
                                )}>
                                    <div className="space-y-2">
                                        <div className={cn(
                                            "flex items-center gap-3",
                                            isEven ? "justify-end" : "justify-start"
                                        )}>
                                            <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:border-pink-500/50 group-hover:text-pink-500 transition-all shadow-xl">
                                                {getEventIcon(task.title)}
                                            </div>
                                            {!isEven && (
                                                <time className="text-xl font-light text-white tracking-widest">
                                                    {task.dueDate ? format(new Date(task.dueDate), "HH:mm") : "--:--"}
                                                </time>
                                            )}
                                            {isEven && (
                                                <time className="text-xl font-light text-white tracking-widest">
                                                    {task.dueDate ? format(new Date(task.dueDate), "HH:mm") : "--:--"}
                                                </time>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-serif text-white group-hover:text-pink-500 transition-colors">
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className="text-sm text-zinc-500 font-light leading-relaxed">
                                                {task.description}
                                            </p>
                                        )}
                                        <div className={cn(
                                            "flex gap-3 pt-2 opacity-0 group-hover:opacity-100 transition-opacity",
                                            isEven ? "justify-end" : "justify-start"
                                        )}>
                                            <button onClick={() => onEdit(task)} className="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white">
                                                Modifier
                                            </button>
                                            <button onClick={() => onDelete(task.id)} className="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-red-500">
                                                Retirer
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Center Dot */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-zinc-800 border-[3px] border-zinc-950 z-10 group-hover:bg-pink-500 group-hover:scale-125 transition-all shadow-[0_0_15px_rgba(236,72,153,0)] group-hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                            </div>
                        )
                    })
                )}
            </div>

            <div className="text-center pt-20">
                <p className="text-zinc-600 font-serif italic text-sm">
                    "Et l'aventure continue..."
                </p>
            </div>
        </div>
    )
}
