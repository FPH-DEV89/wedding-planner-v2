"use client"

import { Plus, Trash, Pencil, ExternalLink, CheckCircle2, Circle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { PurchaseForm } from "./purchase-form"
import { deletePurchase } from "../actions"
import { Purchase } from "../schema"
import { StaggerContainer, StaggerItem } from "@/components/shared/staggered-motion"
import { motion } from "framer-motion"
import { ConfirmModal } from "@/components/modals/confirm-modal"

interface PurchaseClientProps {
    initialData: Purchase[]
}

export const PurchaseClient = ({ initialData }: PurchaseClientProps) => {
    const [open, setOpen] = useState(false)
    const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null)

    const onEdit = (purchase: Purchase) => {
        setEditingPurchase(purchase)
        setOpen(true)
    }

    const onDelete = async (id: string) => {
        try {
            const response = await deletePurchase(id)
            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success(response.success)
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression.")
        }
    }

    const totalBudget = initialData.reduce((acc, p) => acc + (p.price * p.quantity), 0)
    const totalPaid = initialData.reduce((acc, p) => acc + (p.isPaid ? (p.price * p.quantity) : 0), 0)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-serif font-extrabold tracking-tight text-[#c96d4b]">Achats & Boutique</h2>
                    <p className="text-sm text-[#7c6d66] mt-1">
                        Suivez vos petits achats et accessoires en toute simplicité.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val)
                    if (!val) setEditingPurchase(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#c96d4b] hover:bg-[#b05a3a] text-white rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95">
                            <Plus className="mr-2 h-4 w-4" /> Nouvel Achat
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-background rounded-3xl border-border/40 shadow-2xl p-0 overflow-hidden">
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif font-bold text-primary">
                                    {editingPurchase ? "Modifier l'achat" : "Ajouter un achat"}
                                </DialogTitle>
                            </DialogHeader>
                        </div>
                        <div className="p-6">
                            <PurchaseForm
                                initialData={editingPurchase}
                                onSuccess={() => setOpen(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#fdfaf7] border border-[#e9ded0] rounded-3xl shadow-sm group hover:shadow-md transition-all duration-300">
                    <p className="text-xs font-bold text-[#7c6d66] uppercase tracking-widest">Budget Achats 🏛️</p>
                    <p className="text-4xl font-serif font-extrabold text-[#3a2a22] mt-1">{totalBudget.toLocaleString()} €</p>
                </div>
                <div className="p-6 bg-[#fdfaf7] border border-[#e9ded0] rounded-3xl shadow-sm group hover:shadow-md transition-all duration-300">
                    <p className="text-xs font-bold text-[#7c6d66] uppercase tracking-widest">Payé 🏛️</p>
                    <p className="text-4xl font-serif font-extrabold text-[#8c9b84] mt-1">{totalPaid.toLocaleString()} €</p>
                </div>
            </div>

            <div className="rounded-3xl border border-[#e9ded0] bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-[#e9ded0] bg-[#f3ece4]">
                            <TableHead className="font-bold text-[#3a2a22]">Type</TableHead>
                            <TableHead className="font-bold text-[#3a2a22] text-center">Quantité</TableHead>
                            <TableHead className="font-bold text-[#3a2a22]">Prix unit.</TableHead>
                            <TableHead className="font-bold text-[#3a2a22] text-right border-r border-[#e9ded0] pr-6">Total</TableHead>
                            <TableHead className="font-bold text-[#3a2a22] pl-6">Statut</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <StaggerContainer as={motion.tbody} className="[&_tr:last-child]:border-0">
                        {initialData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-serif italic text-lg">
                                    Aucun achat trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.map((purchase) => (
                                <StaggerItem
                                    key={purchase.id}
                                    as={motion.tr}
                                    className="border-b border-border/40 hover:bg-white/60 transition-colors group"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">{purchase.type}</span>
                                            {purchase.link && (
                                                <a
                                                    href={purchase.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-muted-foreground">{purchase.quantity}</TableCell>
                                    <TableCell className="text-muted-foreground font-medium">{purchase.price.toLocaleString()} €</TableCell>
                                    <TableCell className="text-right font-serif font-extrabold text-foreground border-r border-border/20 pr-6 text-lg">
                                        {(purchase.price * purchase.quantity).toLocaleString()} €
                                    </TableCell>
                                    <TableCell className="pl-6">
                                        <div className="scale-90 origin-left">
                                            {purchase.isPaid ? (
                                                <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">Payé</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-muted text-muted-foreground font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">À payer</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(purchase)}
                                                className="h-8 w-8 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <ConfirmModal
                                                title="Supprimer cet achat ?"
                                                description="Cet article sera retiré de votre liste de boutique."
                                                onConfirm={() => onDelete(purchase.id)}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </ConfirmModal>
                                        </div>
                                    </TableCell>
                                </StaggerItem>
                            ))
                        )}
                    </StaggerContainer>
                </Table>
            </div>
        </div>
    )
}
