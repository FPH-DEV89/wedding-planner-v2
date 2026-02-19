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

import { BudgetSchema, BudgetFormValues } from "../schema"
import { createBudgetItem } from "../actions"

const categories = [
    "Lieu",
    "Traiteur",
    "Photographe",
    "Musique",
    "Tenues",
    "Décoration",
    "Fleurs",
    "Papeterie",
    "Autre"
]

export const BudgetForm = () => {
    const [loading, setLoading] = useState(false)

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(BudgetSchema) as any,
        defaultValues: {
            name: "",
            category: "",
            amount: 0,
            paidAmount: 0,
        },
    })

    const onSubmit = async (values: BudgetFormValues) => {
        try {
            setLoading(true)
            const response = await createBudgetItem(values)

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
                            <FormLabel>Nom de la dépense</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Location salle, Vin d'honneur..." {...field} />
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
                            <Select
                                disabled={loading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir une catégorie" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Montant Total (€)</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="paidAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Déjà payé (€)</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled={loading} className="ml-auto w-full" type="submit">
                    Ajouter la dépense
                </Button>
            </form>
        </Form>
    )
}
