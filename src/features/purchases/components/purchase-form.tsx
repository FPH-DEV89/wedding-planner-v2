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
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

import { PurchaseSchema, PurchaseFormValues } from "../schema"
import { createPurchase, updatePurchase } from "../actions"

interface PurchaseFormProps {
    initialData?: {
        id: string
        type: string
        price: number
        quantity: number
        isPaid: boolean
        link?: string | null
    } | null
    onSuccess: () => void
}

export const PurchaseForm = ({ initialData, onSuccess }: PurchaseFormProps) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<PurchaseFormValues>({
        resolver: zodResolver(PurchaseSchema) as any,
        defaultValues: {
            type: initialData?.type || "",
            price: initialData?.price || 0,
            quantity: initialData?.quantity || 1,
            isPaid: initialData?.isPaid || false,
            link: initialData?.link || "",
        },
    })

    const onSubmit = async (values: PurchaseFormValues) => {
        try {
            setLoading(true)
            let response

            if (initialData) {
                response = await updatePurchase(initialData.id, values)
            } else {
                response = await createPurchase(values)
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
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type d'achat</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Alliances, Déco table, Confettis..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantité</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prix unitaire (€)</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lien (optionnel)</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="https://amazon.fr/..." {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isPaid"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Payé</FormLabel>
                                <FormDescription className="text-zinc-500">
                                    Cochez si cet achat a déjà été réglé.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={loading}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button disabled={loading} className="ml-auto w-full bg-pink-600 hover:bg-pink-700" type="submit">
                    {initialData ? "Enregistrer les modifications" : "Ajouter l'achat"}
                </Button>
            </form>
        </Form>
    )
}
