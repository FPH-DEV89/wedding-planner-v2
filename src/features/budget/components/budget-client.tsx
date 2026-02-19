"use client"

import { Plus, Trash, Pencil, LayoutDashboard, Truck, Store } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { BudgetForm } from "./budget-form"
import { deleteBudgetItem } from "../actions"
import { Vendor } from "@/features/vendors/schema"
import { Purchase } from "@/features/purchases/schema"

interface BudgetItem {
    id: string
    name: string
    category: string
    amount: number
    paidAmount: number
}

interface BudgetClientProps {
    initialData: BudgetItem[]
    vendors: Vendor[]
    purchases: Purchase[]
}

export const BudgetClient = ({ initialData, vendors, purchases }: BudgetClientProps) => {
    const [open, setOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)

    const onEdit = (item: BudgetItem) => {
        setEditingItem(item)
        setOpen(true)
    }

    const onDelete = async (id: string) => {
        if (!window.confirm("Supprimer cette dépense ?")) return
        try {
            const response = await deleteBudgetItem(id)
            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success(response.success)
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression.")
        }
    }

    // Calculations
    const totalItems = initialData.reduce((acc, item) => acc + item.amount, 0)
    const paidItems = initialData.reduce((acc, item) => acc + item.paidAmount, 0)

    const totalVendors = vendors.reduce((acc, v) => acc + v.price, 0)
    const paidVendors = vendors.reduce((acc, v) => acc + v.paidAmount, 0)

    const totalPurchases = purchases.reduce((acc, p) => acc + p.price, 0)
    const paidPurchases = purchases.reduce((acc, p) => acc + (p.isPaid ? p.price : 0), 0)

    const grandTotal = totalItems + totalVendors + totalPurchases
    const grandPaid = paidItems + paidVendors + paidPurchases
    const grandRemaining = grandTotal - grandPaid

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Budget Global</h2>
                    <p className="text-sm text-zinc-400">
                        Vue d'ensemble de vos finances pour le mariage.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val)
                    if (!val) setEditingItem(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" /> Dépense
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? "Modifier la dépense" : "Ajouter une dépense"}
                            </DialogTitle>
                        </DialogHeader>
                        <BudgetForm
                            initialData={editingItem}
                            onSuccess={() => setOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Total Budget</p>
                    <p className="text-2xl font-bold text-white">{grandTotal.toLocaleString()} €</p>
                    <div className="flex gap-2 mt-2 text-[10px] text-zinc-500">
                        <span>Items: {totalItems}€</span>
                        <span>Vendeurs: {totalVendors}€</span>
                        <span>Achats: {totalPurchases}€</span>
                    </div>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Total Payé</p>
                    <p className="text-2xl font-bold text-emerald-500">{grandPaid.toLocaleString()} €</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Reste à payer</p>
                    <p className="text-2xl font-bold text-orange-500">{grandRemaining.toLocaleString()} €</p>
                </div>
            </div>

            <Tabs defaultValue="items" className="mt-8">
                <TabsList className="bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="items" className="data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-white">
                        <LayoutDashboard className="h-4 w-4 mr-2" /> Dépenses
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="mt-4">
                    <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-zinc-800">
                                    <TableHead className="text-zinc-400">Description</TableHead>
                                    <TableHead className="text-zinc-400">Catégorie</TableHead>
                                    <TableHead className="text-zinc-400">Montant</TableHead>
                                    <TableHead className="text-zinc-400">Payé</TableHead>
                                    <TableHead className="text-zinc-400">Reste</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                            Aucune dépense trouvée.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    initialData.map((item) => (
                                        <TableRow key={item.id} className="border-zinc-800 hover:bg-white/5 text-zinc-300">
                                            <TableCell className="font-medium text-white">{item.name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{item.amount.toLocaleString()} €</TableCell>
                                            <TableCell className="text-emerald-500">{item.paidAmount.toLocaleString()} €</TableCell>
                                            <TableCell className="text-orange-500">{(item.amount - item.paidAmount).toLocaleString()} €</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onEdit(item)}
                                                        className="text-zinc-400 hover:text-white"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onDelete(item.id)}
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
                </TabsContent>
            </Tabs>
        </div>
    )
}
