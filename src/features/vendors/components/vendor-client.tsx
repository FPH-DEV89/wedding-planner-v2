"use client"

import { Plus, Trash, Pencil, Phone, Mail, User, Info, Receipt } from "lucide-react"
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
import { StaggerContainer, StaggerItem } from "@/components/shared/staggered-motion"
import { motion } from "framer-motion"

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
                return <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">Réservé</Badge>
            case "CONTACTED":
                return <Badge className="bg-primary/20 text-primary border-primary/30 font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">Contacté</Badge>
            default:
                return <Badge variant="secondary" className="bg-muted text-muted-foreground font-bold px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">En recherche</Badge>
        }
    }

    const totalBudget = initialData.reduce((acc, v) => acc + v.price, 0)
    const totalPaid = initialData.reduce((acc, v) => acc + v.paidAmount, 0)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-serif font-extrabold tracking-tight text-[#c96d4b]">Prestataires</h2>
                    <p className="text-sm text-[#7c6d66] mt-1">
                        Gérez vos contacts et vos contrats en toute sérénité.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val)
                    if (!val) setEditingVendor(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#c96d4b] hover:bg-[#b05a3a] text-white rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95">
                            <Plus className="mr-2 h-4 w-4" /> Nouveau Prestataire
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-background rounded-3xl border-border/40 shadow-2xl p-0 overflow-hidden">
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif font-bold text-primary">
                                    {editingVendor ? "Modifier le prestataire" : "Ajouter un prestataire"}
                                </DialogTitle>
                            </DialogHeader>
                        </div>
                        <div className="p-6">
                            <VendorForm
                                initialData={editingVendor as any}
                                onSuccess={() => setOpen(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border-[#e9ded0] rounded-3xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-[#7c6d66] uppercase tracking-widest flex items-center gap-2">
                            <Info className="h-4 w-4 text-[#c96d4b]" /> Budget Prestataires
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-serif font-extrabold text-[#3a2a22]">{totalBudget.toLocaleString()} €</div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#c96d4b]" />
                            <p className="text-xs text-[#7c6d66] font-medium">Total estimé pour {initialData.length} prestataires</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-[#e9ded0] rounded-3xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-[#7c6d66] uppercase tracking-widest flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-[#8c9b84]" /> Total Payé (Acomptes)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-serif font-extrabold text-[#8c9b84]">{totalPaid.toLocaleString()} €</div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-1.5 flex-1 bg-[#f3ece4] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#8c9b84] transition-all duration-500"
                                    style={{ width: `${Math.min((totalPaid / totalBudget || 0) * 100, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs font-bold text-[#8c9b84]">{((totalPaid / totalBudget || 0) * 100).toFixed(0)}%</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-3xl border border-[#e9ded0] bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-[#e9ded0] bg-[#f3ece4]">
                            <TableHead className="font-bold text-[#3a2a22]">Nom / Catégorie</TableHead>
                            <TableHead className="font-bold text-[#3a2a22]">Contact</TableHead>
                            <TableHead className="font-bold text-[#3a2a22]">Statut</TableHead>
                            <TableHead className="font-bold text-[#3a2a22] text-right border-r border-[#e9ded0] pr-6">Prix</TableHead>
                            <TableHead className="font-bold text-[#3a2a22] pl-6">Payé</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <StaggerContainer as={motion.tbody} className="[&_tr:last-child]:border-0">
                        {initialData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-serif italic text-lg">
                                    Aucun prestataire trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.map((vendor) => (
                                <StaggerItem
                                    key={vendor.id}
                                    as={motion.tr}
                                    className="border-b border-border/40 hover:bg-white/60 transition-colors group"
                                >
                                    <TableCell>
                                        <div className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">{vendor.name}</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{vendor.category}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5 text-xs font-medium">
                                            {vendor.contactName && <div className="flex items-center gap-2 text-foreground"><User className="h-3 w-3 text-primary" /> {vendor.contactName}</div>}
                                            {vendor.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3 w-3 text-primary/60" /> {vendor.phone}</div>}
                                            {vendor.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3 w-3 text-primary/60" /> {vendor.email}</div>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="scale-90 origin-left">
                                            {getStatusBadge(vendor.status)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-serif font-extrabold text-foreground border-r border-border/20 pr-6 text-lg">
                                        {vendor.price.toLocaleString()} €
                                    </TableCell>
                                    <TableCell className="pl-6">
                                        <div className="text-secondary font-serif font-extrabold text-lg">{vendor.paidAmount.toLocaleString()} €</div>
                                        {vendor.price > vendor.paidAmount && (
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                                                <div className="text-[10px] text-primary font-bold uppercase">Reste: {(vendor.price - vendor.paidAmount).toLocaleString()} €</div>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(vendor)}
                                                className="h-8 w-8 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(vendor.id)}
                                                className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
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
