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
import { ConfirmModal } from "@/components/modals/confirm-modal"

interface TimelineClientProps {
    initialData: Task[]
}

export const TimelineClient = ({ initialData }: TimelineClientProps) => {
    const [open, setOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    // Only show "TIMELINE" type tasks
    const timelineTasks = initialData.filter(task => task.type === "TIMELINE")

    // Sort tasks by due date
    const sortedTasks = [...timelineTasks].sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

    const onEdit = (task: Task) => {
        setEditingTask(task)
        setOpen(true)
    }

    const onDelete = async (id: string) => {
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
            <div className="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="inline-block p-4 rounded-full bg-primary/10 mb-4 shadow-inner">
                    <Heart className="h-10 w-10 text-primary fill-primary/20" />
                </div>
                <h1 className="text-6xl font-serif text-[#c96d4b] tracking-tight font-extrabold italic">
                    Notre Jour J
                </h1>
                <div className="flex items-center justify-center gap-4 py-2">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
                    <p className="text-muted-foreground text-sm uppercase tracking-[0.3em] font-bold">
                        Le précieux programme
                    </p>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
                </div>

                <div className="pt-8">
                    <Dialog open={open} onOpenChange={(val) => {
                        setOpen(val)
                        if (!val) setEditingTask(null)
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#c96d4b] hover:bg-[#b05a3a] text-white rounded-full px-10 h-12 shadow-lg hover:shadow-[#c96d4b]/20 transition-all hover:scale-105 active:scale-95">
                                <Plus className="mr-2 h-4 w-4" /> Ajouter un moment fort
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-background rounded-3xl border-border/40 shadow-2xl p-0 overflow-hidden">
                            <div className="p-6 pb-0">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-serif font-bold text-[#c96d4b]">
                                        {editingTask ? "Modifier le moment" : "Nouvel événement"}
                                    </DialogTitle>
                                </DialogHeader>
                            </div>
                            <div className="p-6">
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
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Timeline Line */}
            <div className="relative space-y-0 before:absolute before:inset-0 before:left-1/2 before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-border/60 before:to-transparent">
                {sortedTasks.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground italic bg-white/40 backdrop-blur-sm rounded-3xl border-2 border-dashed border-border/40 font-serif text-xl">
                        Votre programme est en cours de création...
                    </div>
                ) : (
                    sortedTasks.map((task, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={task.id} className="relative flex items-center justify-between md:justify-normal group py-10">
                                {/* Content Wrapper */}
                                <div className={cn(
                                    "w-[calc(50%-2.5rem)] flex flex-col",
                                    isEven ? "md:mr-auto text-right md:pr-12" : "md:ml-auto md:pl-12 order-2"
                                )}>
                                    <div className="space-y-3">
                                        <div className={cn(
                                            "flex items-center gap-4",
                                            isEven ? "justify-end" : "justify-start"
                                        )}>
                                            <div className="p-4 rounded-2xl bg-white border border-[#e9ded0] text-[#c96d4b] shadow-sm group-hover:bg-[#c96d4b] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                                {getEventIcon(task.title)}
                                            </div>
                                            <div className={cn(
                                                "flex flex-col gap-0",
                                                isEven ? "items-end text-right" : "items-start text-left"
                                            )}>
                                                {task.dueDate && (
                                                    <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-0.5">
                                                        {format(new Date(task.dueDate), "d MMMM", { locale: fr })}
                                                    </span>
                                                )}
                                                <time className="text-2xl font-serif font-extrabold text-[#3a2a22] tracking-widest leading-none">
                                                    {task.dueDate ? format(new Date(task.dueDate), "HH:mm") : "--:--"}
                                                </time>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-serif font-extrabold text-[#3a2a22] group-hover:text-[#c96d4b] transition-colors">
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-2 max-w-sm ml-auto mr-0">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className={cn(
                                            "flex gap-4 pt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0",
                                            isEven ? "justify-end" : "justify-start"
                                        )}>
                                            <button onClick={() => onEdit(task)} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5">
                                                Modifier
                                            </button>
                                            <ConfirmModal
                                                title="Supprimer l'événement ?"
                                                description="Ce moment fort sera définitivement retiré de votre programme."
                                                onConfirm={() => onDelete(task.id)}
                                            >
                                                <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors border-b border-transparent hover:border-destructive pb-0.5">
                                                    Retirer
                                                </button>
                                            </ConfirmModal>
                                        </div>
                                    </div>
                                </div>

                                {/* Center Dot */}
                                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#7c6d66]/20 z-10 group-hover:bg-[#c96d4b] group-hover:border-[#c96d4b] group-hover:scale-125 transition-all duration-300 shadow-sm" />
                            </div>
                        )
                    })
                )}
            </div>

            <div className="text-center pt-24 pb-12">
                <div className="h-px w-40 bg-gradient-to-r from-transparent via-border to-transparent mx-auto mb-8" />
                <p className="text-primary font-serif italic text-xl tracking-wide">
                    "Et c'est ainsi que commence votre toujours..."
                </p>
            </div>
        </div>
    )
}
