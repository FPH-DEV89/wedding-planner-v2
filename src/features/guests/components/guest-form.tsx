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
import { createGuest } from "../actions"

export const GuestForm = () => {
    const [loading, setLoading] = useState(false)

    const form = useForm<GuestFormValues>({
        resolver: zodResolver(GuestSchema) as any,
        defaultValues: {
            name: "",
            role: "",
            status: "PENDING",
            table: "",
            dietaryRequirements: "",
        },
    })

    const onSubmit = async (values: GuestFormValues) => {
        try {
            setLoading(true)
            const response = await createGuest(values)

            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success(response.success)
                form.reset()
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
                <FormField
                    control={form.control}
                    name="table"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Table</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Table 1, VIP..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dietaryRequirements"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Régime Alimentaire</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Vegan, Sans gluten..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading} className="ml-auto w-full" type="submit">
                    Ajouter l'invité
                </Button>
            </form>
        </Form>
    )
}
