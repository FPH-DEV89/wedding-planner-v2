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
import { Textarea } from "@/components/ui/textarea"

import { VendorSchema, VendorFormValues } from "../schema"
import { createVendor, updateVendor } from "../actions"

interface VendorFormProps {
    initialData?: {
        id: string
        name: string
        category: string
        contactName?: string | null
        email?: string | null
        phone?: string | null
        status: "RESEARCH" | "CONTACTED" | "BOOKED"
        price: number
        paidAmount: number
        notes?: string | null
    } | null
    onSuccess: () => void
}

const categories = [
    "Lieu",
    "Traiteur",
    "Photographe",
    "Vidéaste",
    "DJ / Musique",
    "Fleurs",
    "Décoration",
    "Robe de mariée",
    "Costume",
    "Coiffure / Maquillage",
    "Autre"
]

export const VendorForm = ({ initialData, onSuccess }: VendorFormProps) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<VendorFormValues>({
        resolver: zodResolver(VendorSchema) as any,
        defaultValues: {
            name: initialData?.name || "",
            category: initialData?.category || "",
            contactName: initialData?.contactName || "",
            email: initialData?.email || "",
            phone: initialData?.phone || "",
            status: initialData?.status || "RESEARCH",
            price: initialData?.price || 0,
            paidAmount: initialData?.paidAmount || 0,
            notes: initialData?.notes || "",
        },
    })

    const onSubmit = async (values: VendorFormValues) => {
        try {
            setLoading(true)
            let response

            if (initialData) {
                response = await updateVendor(initialData.id, values)
            } else {
                response = await createVendor(values)
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom du prestataire</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Château de Versailles..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
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
                                        <SelectTrigger className="bg-white border-border/40 rounded-xl focus:ring-primary/20 transition-all">
                                            <SelectValue placeholder="Choisir" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white border-border/40 rounded-xl">
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
                                        <SelectTrigger className="bg-white border-border/40 rounded-xl focus:ring-[#c96d4b]/20 transition-all">
                                            <SelectValue placeholder="Statut" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white border-border/40 rounded-xl">
                                        <SelectItem value="RESEARCH">En recherche</SelectItem>
                                        <SelectItem value="CONTACTED">Contacté</SelectItem>
                                        <SelectItem value="BOOKED">Réservé</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom du contact</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Téléphone</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input disabled={loading} {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prix Estimé / Réel (€)</FormLabel>
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
                                <FormLabel>Acompte payé (€)</FormLabel>
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
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea disabled={loading} {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={loading}
                    className="ml-auto w-full bg-[#c96d4b] hover:bg-[#b05a3a] text-white font-bold h-12 rounded-2xl shadow-lg transition-all hover:shadow-[#c96d4b]/20 active:scale-95"
                    type="submit"
                >
                    {initialData ? "Enregistrer les modifications" : "Ajouter le prestataire"}
                </Button>
            </form>
        </Form>
    )
}
