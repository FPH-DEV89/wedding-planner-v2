"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useState } from "react"

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

import { GuestSchema, GuestFormValues } from "../schema"
import { createGuest, updateGuest } from "../actions"

interface GuestFormProps {
    initialData?: {
        id: string
        name: string
        relation?: string | null
        category?: string | null
        listId?: string | null
    } | null
    guestLists: {
        id: string
        name: string
    }[]
    onSuccess: () => void
}

export const GuestForm = ({ initialData, guestLists, onSuccess }: GuestFormProps) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<GuestFormValues>({
        resolver: zodResolver(GuestSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            relation: initialData?.relation || "",
            category: initialData?.category || "",
            listId: initialData?.listId || guestLists[0]?.id || "",
        },
    })

    const onSubmit = async (values: GuestFormValues) => {
        try {
            setLoading(true)
            let response

            if (initialData) {
                response = await updateGuest(initialData.id, values)
            } else {
                response = await createGuest(values)
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
                    name="listId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Liste d'invités</FormLabel>
                            <Select
                                disabled={loading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="bg-white border-border/40 rounded-xl focus:ring-[#c96d4b]/20 transition-all">
                                        <SelectValue placeholder="Choisir une liste" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white border-border/40 rounded-xl">
                                    {guestLists.map((list) => (
                                        <SelectItem key={list.id} value={list.id}>
                                            {list.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Jean Dupont" {...field} className="bg-white border-border/40 rounded-xl focus:ring-[#c96d4b]/20 transition-all" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="relation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Relation</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Famille, Ami..." {...field} className="bg-white border-border/40 rounded-xl focus:ring-[#c96d4b]/20 transition-all" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Catégorie</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Confirmé, VIP, En attente..." {...field} className="bg-white border-border/40 rounded-xl focus:ring-[#c96d4b]/20 transition-all" />
                                </FormControl>
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
                    {initialData ? "Enregistrer les modifications" : "Ajouter l'invité"}
                </Button>
            </form>
        </Form>
    )
}
