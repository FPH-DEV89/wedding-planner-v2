"use client"

import { Plus, Trash } from "lucide-react"
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

import { BudgetForm } from "./budget-form"
import { deleteBudgetItem } from "../actions"

interface BudgetClientProps {
    initialData: any[]
}

export const BudgetClient = ({ initialData }: BudgetClientProps) => {
    const [open, setOpen] = useState(false)

    const onDelete = async (id: string) => {
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

    const total = initialData.reduce((acc, item) => acc + item.amount, 0)
    const paid = initialData.reduce((acc, item) => acc + item.paidAmount, 0)

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Budget</h2>
                    <p className="text-sm text-zinc-400">
                        Suivez vos dépenses et les paiements effectués.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" /> Dépense
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Ajouter une dépense</DialogTitle>
                        </DialogHeader>
                        <BudgetForm />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Total Budget</p>
                    <p className="text-2xl font-bold text-white">{total.toLocaleString()} €</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Payé</p>
                    <p className="text-2xl font-bold text-emerald-500">{paid.toLocaleString()} €</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Reste à payer</p>
                    <p className="text-2xl font-bold text-orange-500">{(total - paid).toLocaleString()} €</p>
                </div>
            </div>

            <div className="mt-8 rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-800">
                            <TableHead className="text-zinc-400">Description</TableHead>
                            <TableHead className="text-zinc-400">Catégorie</TableHead>
                            <TableHead className="text-zinc-400">Montant</TableHead>
                            <TableHead className="text-zinc-400">Payé</TableHead>
                            <TableHead className="text-zinc-400">Reste</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
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
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.amount.toLocaleString()} €</TableCell>
                                    <TableCell className="text-emerald-500">{item.paidAmount.toLocaleString()} €</TableCell>
                                    <TableCell className="text-orange-500">{(item.amount - item.paidAmount).toLocaleString()} €</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(item.id)}
                                            className="text-zinc-400 hover:text-red-500"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
