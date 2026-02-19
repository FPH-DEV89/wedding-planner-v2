import { z } from "zod"

export const PurchaseSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    price: z.coerce.number().min(0),
    isPaid: z.boolean().default(false),
    link: z.string().url("URL invalide").optional().nullable().or(z.literal("")),
})

export type PurchaseFormValues = z.infer<typeof PurchaseSchema>

export interface Purchase {
    id: string
    name: string
    price: number
    isPaid: boolean
    link?: string | null
    createdAt: Date
}
