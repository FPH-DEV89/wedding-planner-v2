"use client"

import { Plus, Trash, Pencil, Phone, Mail, User, Info } from "lucide-react"
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { VendorForm } from "./vendor-form"
import { deleteVendor } from "../actions"
import { Vendor } from "../schema"

interface VendorClientProps {
    initialData: Vendor[]
}

export const VendorClient = ({ initialData }: VendorClientProps) => {
    const [open, setOpen] = useState(false)
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

    const onEdit = (vendor: Vendor) => {
        setEditingVendor(vendor)
        setOpen(true)
    }

    const onDelete = async (id: string) => {
        if (!window.confirm("Supprimer ce prestataire ?")) return
        try {
            const response = await deleteVendor(id)
            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success(response.success)
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression.")
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "BOOKED":
                return <Badge className="bg-emerald-500">Réservé</Badge>
            case "CONTACTED":
                return <Badge className="bg-amber-500 text-black">Contacté</Badge>
            default:
                return <Badge variant="secondary">En recherche</Badge>
        }
    }

    const totalBudget = initialData.reduce((acc, v) => acc + v.price, 0)
    const totalPaid = initialData.reduce((acc, v) => acc + v.paidAmount, 0)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Prestataires</h2>
                    <p className="text-sm text-zinc-400">
                        Gérez vos contacts et vos contrats.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val)
                    if (!val) setEditingVendor(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-pink-600 hover:bg-pink-700">
                            <Plus className="mr-2 h-4 w-4" /> Prestataire
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>
                                {editingVendor ? "Modifier le prestataire" : "Ajouter un prestataire"}
                            </DialogTitle>
                        </DialogHeader>
                        <VendorForm
                            initialData={editingVendor as any}
                            onSuccess={() => setOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Budget Prestataires</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{totalBudget.toLocaleString()} €</div>
                        <p className="text-xs text-zinc-500 mt-1">Total estimé pour {initialData.length} prestataires</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Payé (Acomptes)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">{totalPaid.toLocaleString()} €</div>
                        <p className="text-xs text-zinc-500 mt-1">{((totalPaid / totalBudget || 0) * 100).toFixed(0)}% du budget prestataires</p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-800 bg-zinc-900">
                            <TableHead className="text-zinc-400">Nom / Catégorie</TableHead>
                            <TableHead className="text-zinc-400">Contact</TableHead>
                            <TableHead className="text-zinc-400">Statut</TableHead>
                            <TableHead className="text-zinc-400">Prix</TableHead>
                            <TableHead className="text-zinc-400">Payé</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                    Aucun prestataire trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.map((vendor) => (
                                <TableRow key={vendor.id} className="border-zinc-800 hover:bg-white/5 text-zinc-300">
                                    <TableCell>
                                        <div className="font-semibold text-white">{vendor.name}</div>
                                        <div className="text-xs text-zinc-500">{vendor.category}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-xs">
                                            {vendor.contactName && <div className="flex items-center gap-1"><User className="h-3 w-3" /> {vendor.contactName}</div>}
                                            {vendor.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {vendor.phone}</div>}
                                            {vendor.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3 text-zinc-600" /> {vendor.email}</div>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                                    <TableCell className="font-medium text-zinc-200">{vendor.price.toLocaleString()} €</TableCell>
                                    <TableCell>
                                        <div className="text-emerald-500 font-medium">{vendor.paidAmount.toLocaleString()} €</div>
                                        {vendor.price > vendor.paidAmount && (
                                            <div className="text-[10px] text-orange-500">Reste: {(vendor.price - vendor.paidAmount).toLocaleString()} €</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(vendor)}
                                                className="text-zinc-400 hover:text-white"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(vendor.id)}
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
