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
        if (!window.confirm("Supprimer cet achat ?")) return
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
                    <h2 className="text-3xl font-bold tracking-tight text-white">Achats</h2>
                    <p className="text-sm text-zinc-400">
                        Suivez vos petits achats et accessoires.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val)
                    if (!val) setEditingPurchase(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-pink-600 hover:bg-pink-700">
                            <Plus className="mr-2 h-4 w-4" /> Achat
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>
                                {editingPurchase ? "Modifier l'achat" : "Ajouter un achat"}
                            </DialogTitle>
                        </DialogHeader>
                        <PurchaseForm
                            initialData={editingPurchase}
                            onSuccess={() => setOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Budget Achats</p>
                    <p className="text-2xl font-bold text-white">{totalBudget.toLocaleString()} €</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Payé</p>
                    <p className="text-2xl font-bold text-emerald-500">{totalPaid.toLocaleString()} €</p>
                </div>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-800">
                            <TableHead className="text-zinc-400">Type</TableHead>
                            <TableHead className="text-zinc-400">Quantité</TableHead>
                            <TableHead className="text-zinc-400">Prix unit.</TableHead>
                            <TableHead className="text-zinc-400">Total</TableHead>
                            <TableHead className="text-zinc-400">Statut</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                    Aucun achat trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.map((purchase) => (
                                <TableRow key={purchase.id} className="border-zinc-800 hover:bg-white/5 text-zinc-300">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">{purchase.type}</span>
                                            {purchase.link && (
                                                <a
                                                    href={purchase.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-zinc-500 hover:text-white transition"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{purchase.quantity}</TableCell>
                                    <TableCell className="text-zinc-400">{purchase.price.toLocaleString()} €</TableCell>
                                    <TableCell className="text-zinc-200 font-semibold">{(purchase.price * purchase.quantity).toLocaleString()} €</TableCell>
                                    <TableCell>
                                        {purchase.isPaid ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Payé</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">À payer</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(purchase)}
                                                className="text-zinc-400 hover:text-white"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(purchase.id)}
                                                className="text-zinc-400 hover:text-red-500"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
