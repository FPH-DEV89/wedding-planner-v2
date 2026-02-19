"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useState } from "react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateUser } from "../actions"

const SettingsSchema = z.object({
    name: z.string().min(2, {
        message: "Le nom doit contenir au moins 2 caractères.",
    }),
})

type SettingsFormValues = z.infer<typeof SettingsSchema>

interface SettingsFormProps {
    initialName?: string
}

export const SettingsForm = ({ initialName }: SettingsFormProps) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: initialName || "",
        },
    })

    const onSubmit = async (values: SettingsFormValues) => {
        try {
            setLoading(true)
            const response = await updateUser(values) as { error?: string; success?: string }

            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success(response.success)
            }
        } catch (error) {
            toast.error("Une erreur est survenue.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-serif font-bold text-[#3a2a22]">Nom de l'organisateur</FormLabel>
                            <FormDescription className="text-[#7c6d66]">
                                Ce nom sera affiché en haut à droite de l'application.
                            </FormDescription>
                            <FormControl>
                                <Input disabled={loading} placeholder="Votre nom" {...field} className="bg-white border-border/40 rounded-xl focus:ring-[#c96d4b]/20 transition-all font-medium text-[#3a2a22]" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    disabled={loading}
                    className="w-full bg-[#c96d4b] hover:bg-[#b05a3a] text-white font-bold h-12 rounded-2xl shadow-lg transition-all hover:shadow-[#c96d4b]/20 active:scale-95"
                    type="submit"
                >
                    Enregistrer les modifications
                </Button>
            </form>
        </Form>
    )
}
