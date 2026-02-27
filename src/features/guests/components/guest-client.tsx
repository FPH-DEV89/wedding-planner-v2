"use client"

import { Plus, Trash, Pencil, Settings2 } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { GuestForm } from "./guest-form"
import { deleteGuest } from "../actions"
import { createGuestList, deleteGuestList } from "@/features/guest-lists/actions"
import { StaggerContainer, StaggerItem } from "@/components/shared/staggered-motion"
import { motion } from "framer-motion"
import { ConfirmModal } from "@/components/modals/confirm-modal"

interface Guest {
    id: string
    name: string
    relation?: string | null
    category?: string | null
    listId?: string | null
}

interface GuestList {
    id: string
    name: string
    _count?: {
        guests: number
    }
}

interface GuestClientProps {
    initialData: Guest[]
    guestLists: GuestList[]
}

export const GuestClient = ({ initialData, guestLists }: GuestClientProps) => {
    const [open, setOpen] = useState(false)
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
    const [selectedListId, setSelectedListId] = useState<string>("all")

    const filteredData = selectedListId === "all"
        ? initialData
        : initialData.filter(guest => guest.listId === selectedListId)

    const onEdit = (guest: Guest) => {
        setEditingGuest(guest)
        setOpen(true)
    }

    const onAddList = async () => {
        const name = window.prompt("Nom de la nouvelle liste :")
        if (!name) return

        const response = await createGuestList({ name })
        if (response.error) {
            toast.error(response.error)
        } else {
            toast.success(response.success)
        }
    }

    const onDelete = async (id: string) => {
        try {
            const response = await deleteGuest(id)
            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success(response.success)
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression.")
        }
    }

    const onDeleteList = async (id: string, name: string) => {
        const response = await deleteGuestList(id)
        if (response.error) {
            toast.error(response.error)
        } else {
            toast.success(response.success)
            if (selectedListId === id) setSelectedListId("all")
        }
    }

    const guestStats = {
        adults: initialData.filter(g => g.category?.toLowerCase().includes("adulte")).length,
        teens: initialData.filter(g => g.category?.toLowerCase().includes("ado")).length,
        kids: initialData.filter(g => g.category?.toLowerCase().includes("enfant")).length,
        providers: initialData.filter(g => g.category?.toLowerCase().includes("presta") || g.category?.toLowerCase().includes("serveur")).length,
    }

    return (
        <>
            <div className="space-y-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-serif font-bold tracking-tight text-[#c96d4b]">Invités</h2>
                        <p className="text-sm text-[#7c6d66] mt-1">
                            {guestLists.length} listes d'invités actives pour votre mariage.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={onAddList}
                            className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl border border-border/40"
                        >
                            <Settings2 className="mr-2 h-4 w-4" /> Gérer les listes
                        </Button>
                        <Dialog open={open} onOpenChange={(val) => {
                            setOpen(val)
                            if (!val) setEditingGuest(null)
                        }}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#c96d4b] hover:bg-[#b05a3a] text-white font-bold rounded-xl px-6 shadow-md transition-all active:scale-95">
                                    <Plus className="mr-2 h-4 w-4" /> Ajouter un invité
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-background border-border/60 rounded-3xl shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-serif font-bold text-primary">
                                        {editingGuest ? "Modifier l'invité" : "Ajouter un invité"}
                                    </DialogTitle>
                                </DialogHeader>
                                <GuestForm
                                    initialData={editingGuest}
                                    guestLists={guestLists}
                                    onSuccess={() => setOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="group p-6 bg-white border border-[#e9ded0] rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <p className="text-[10px] text-[#7c6d66] uppercase font-bold tracking-widest">Adultes</p>
                        <p className="text-3xl font-serif font-bold text-[#3a2a22] mt-1 group-hover:text-[#c96d4b] transition-colors">{guestStats.adults}</p>
                    </div>
                    <div className="group p-6 bg-white border border-[#e9ded0] rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <p className="text-[10px] text-[#7c6d66] uppercase font-bold tracking-widest">Ados</p>
                        <p className="text-3xl font-serif font-bold text-[#3a2a22] mt-1 group-hover:text-[#c96d4b] transition-colors">{guestStats.teens}</p>
                    </div>
                    <div className="group p-6 bg-white border border-[#e9ded0] rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <p className="text-[10px] text-[#7c6d66] uppercase font-bold tracking-widest">Enfants</p>
                        <p className="text-3xl font-serif font-bold text-[#3a2a22] mt-1 group-hover:text-[#c96d4b] transition-colors">{guestStats.kids}</p>
                    </div>
                    <div className="group p-6 bg-[#fdfaf7] border border-[#8c9b84]/20 rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <p className="text-[10px] text-[#8c9b84] uppercase font-bold tracking-widest">Prestataires</p>
                        <p className="text-3xl font-serif font-bold text-[#8c9b84] mt-1">{guestStats.providers}</p>
                    </div>
                </div>

                <Tabs defaultValue="all" className="mt-10" onValueChange={setSelectedListId}>
                    <TabsList className="bg-muted/50 border border-border/60 p-1 rounded-2xl h-auto flex-wrap justify-start">
                        <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all px-6 py-2">
                            Tous
                        </TabsTrigger>
                        {guestLists.map((list) => (
                            <TabsTrigger key={list.id} value={list.id} className="group flex items-center gap-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all px-6 py-2">
                                {list.name}
                                <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                                    {list._count?.guests || 0}
                                </span>
                                <ConfirmModal
                                    title={`Supprimer la liste "${list.name}" ?`}
                                    description="Tous les invités de cette liste seront également supprimés."
                                    onConfirm={() => onDeleteList(list.id, list.name)}
                                >
                                    <div className="p-1 rounded-full hover:bg-white/20 transition-colors">
                                        <Trash className="h-3 w-3 text-muted-foreground group-data-[state=active]:text-white/70 hover:text-white" />
                                    </div>
                                </ConfirmModal>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <div className="mt-6 rounded-3xl border border-[#e9ded0] bg-white overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-[#f3ece4]">
                            <TableRow className="hover:bg-transparent border-[#e9ded0]">
                                <TableHead className="font-serif text-[#3a2a22] font-bold">Nom</TableHead>
                                <TableHead className="font-serif text-[#3a2a22] font-bold">Relation</TableHead>
                                <TableHead className="font-serif text-[#3a2a22] font-bold">Catégorie</TableHead>
                                <TableHead className="w-[120px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <StaggerContainer as={motion.tbody} className="[&_tr:last-child]:border-0">
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic bg-muted/5">
                                        Aucun invité dans cette liste.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((guest) => (
                                    <StaggerItem
                                        key={guest.id}
                                        as={motion.tr}
                                        className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                                    >
                                        <TableCell className="font-medium text-foreground">{guest.name}</TableCell>
                                        <TableCell className="text-muted-foreground italic text-sm">{guest.relation || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary font-medium rounded-lg px-2 py-0.5">
                                                {guest.category || "Standard"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEdit(guest)}
                                                    className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <ConfirmModal
                                                    title="Supprimer cet invité ?"
                                                    description="Cet invité sera retiré de votre liste de mariage."
                                                    onConfirm={() => onDelete(guest.id)}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
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
        </>
    )
}
