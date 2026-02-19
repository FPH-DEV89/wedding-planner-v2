"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { TaskSchema, TaskFormValues } from "../schema"
import { createTask, updateTask } from "../actions"

interface TaskFormProps {
    initialData?: {
        id: string
        title: string
        description?: string | null
        dueDate?: Date | null
        status: "TODO" | "IN_PROGRESS" | "DONE"
        priority: "LOW" | "MEDIUM" | "HIGH"
    } | null
    onSuccess: () => void
    labels?: {
        title?: string
        titlePlaceholder?: string
        description?: string
        date?: string
        submit?: string
    }
}

export const TaskForm = ({ initialData, onSuccess, labels }: TaskFormProps) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<TaskFormValues & { time?: string }>({
        resolver: zodResolver(TaskSchema) as any,
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
            status: initialData?.status || "TODO",
            priority: initialData?.priority || "MEDIUM",
            time: initialData?.dueDate ? format(new Date(initialData.dueDate), "HH:mm") : "12:00",
        },
    })

    const onSubmit = async (values: TaskFormValues & { time?: string }) => {
        try {
            setLoading(true)

            // Merge date and time
            let finalDate = values.dueDate;
            if (finalDate && values.time) {
                const [hours, minutes] = values.time.split(":").map(Number);
                finalDate = new Date(finalDate);
                finalDate.setHours(hours);
                finalDate.setMinutes(minutes);
            }

            const payload = {
                ...values,
                dueDate: finalDate
            };

            delete (payload as any).time;

            let response

            if (initialData) {
                response = await updateTask(initialData.id, payload)
            } else {
                response = await createTask(payload)
            }

            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success(response.success)
                form.reset()
                onSuccess()
            }
        } catch (error) {
            toast.error("Un problème est survenu.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{labels?.title || "Titre de la tâche"}</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder={labels?.titlePlaceholder || "Réserver le traiteur..."} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{labels?.description || "Description (optionnel)"}</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Détails, contacts..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>{labels?.date || "Date"}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal border-border/40 bg-white rounded-xl text-foreground focus:ring-[#c96d4b]/20 transition-all",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: fr })
                                                ) : (
                                                    <span>Choisir une date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white border-border/40 rounded-2xl shadow-xl" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date(new Date().setHours(0, 0, 0, 0))
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Heure {labels?.submit && "(Timeline)"}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="time"
                                        disabled={loading}
                                        {...field}
                                        className="border-border/40 bg-white rounded-xl text-foreground focus:ring-[#c96d4b]/20 transition-all"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Statut</FormLabel>
                                <Select
                                    disabled={loading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="border-border/40 bg-white rounded-xl focus:ring-[#c96d4b]/20 transition-all text-foreground">
                                            <SelectValue placeholder="Statut" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white border-border/40 rounded-xl shadow-lg">
                                        <SelectItem value="TODO">À faire</SelectItem>
                                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                                        <SelectItem value="DONE">Terminé</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priorité</FormLabel>
                                <Select
                                    disabled={loading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="border-border/40 bg-white rounded-xl focus:ring-[#c96d4b]/20 transition-all text-foreground">
                                            <SelectValue placeholder="Priorité" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white border-border/40 rounded-xl shadow-lg">
                                        <SelectItem value="LOW">Basse</SelectItem>
                                        <SelectItem value="MEDIUM">Moyenne</SelectItem>
                                        <SelectItem value="HIGH">Haute</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    disabled={loading}
                    className="ml-auto w-full bg-[#c96d4b] hover:bg-[#b05a3a] text-white font-bold h-12 rounded-2xl shadow-lg transition-all hover:shadow-[#c96d4b]/20 active:scale-95"
                    type="submit"
                >
                    {initialData ? "Enregistrer les modifications" : (labels?.submit || "Ajouter la tâche")}
                </Button>
            </form>
        </Form>
    )
}
