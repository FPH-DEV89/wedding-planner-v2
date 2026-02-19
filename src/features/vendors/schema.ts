import { z } from "zod"

export const VendorSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    category: z.string().min(1, "La catégorie est requise"),
    contactName: z.string().optional().nullable(),
    email: z.string().email("Email invalide").optional().nullable().or(z.literal("")),
    phone: z.string().optional().nullable(),
    status: z.enum(["RESEARCH", "CONTACTED", "BOOKED"]).default("RESEARCH"),
    price: z.coerce.number().min(0),
    paidAmount: z.coerce.number().min(0),
    notes: z.string().optional().nullable(),
})

export type VendorFormValues = z.infer<typeof VendorSchema>

export interface Vendor {
    id: string
    name: string
    category: string
    contactName?: string | null
    email?: string | null
    phone?: string | null
    status: string
    price: number
    paidAmount: number
    notes?: string | null
    createdAt: Date
}
