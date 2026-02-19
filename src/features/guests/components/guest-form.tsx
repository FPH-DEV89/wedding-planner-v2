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
        role?: string | null
        status: string
        table?: string | null
        dietaryRequirements?: string | null
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
            role: initialData?.role || "",
            status: (initialData?.status as any) || "PENDING",
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
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir une liste" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
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
                            <FormLabel>Nom Complet</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Jean Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rôle</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Famille, Ami..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un statut" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="PENDING">En attente</SelectItem>
                                        <SelectItem value="CONFIRMED">Confirmé</SelectItem>
                                        <SelectItem value="REJECTED">Absent</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} className="ml-auto w-full bg-pink-600 hover:bg-pink-700" type="submit">
                    {initialData ? "Enregistrer les modifications" : "Ajouter l'invité"}
                </Button>
            </form>
        </Form>
    )
}
