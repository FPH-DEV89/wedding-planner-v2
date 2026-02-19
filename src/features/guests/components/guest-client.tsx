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

interface Guest {
    id: string
    name: string
    role?: string | null
    status: string
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return <Badge className="bg-emerald-500">Confirmé</Badge>
            case "REJECTED":
                return <Badge variant="destructive">Absent</Badge>
            default:
                return <Badge variant="secondary">En attente</Badge>
        }
    }

    const onDeleteList = async (id: string, name: string) => {
        if (!window.confirm(`Supprimer la liste "${name}" et tous ses invités ?`)) return

        const response = await deleteGuestList(id)
        if (response.error) {
            toast.error(response.error)
        } else {
            toast.success(response.success)
            if (selectedListId === id) setSelectedListId("all")
        }
    }

    return (
        <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Invités</h2>
                    <p className="text-sm text-zinc-400">
                        {guestLists.length} listes d'invités actives.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={onAddList}
                        className="border-zinc-800 text-zinc-400 hover:text-white"
                    >
                        <Settings2 className="mr-2 h-4 w-4" /> Gérer les listes
                    </Button>
                    <Dialog open={open} onOpenChange={(val) => {
                        setOpen(val)
                        if (!val) setEditingGuest(null)
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-pink-600 hover:bg-pink-700">
                                <Plus className="mr-2 h-4 w-4" /> Ajouter
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
                            <DialogHeader>
                                <DialogTitle>
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

            <Tabs defaultValue="all" className="mt-8" onValueChange={setSelectedListId}>
                <TabsList className="bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    {guestLists.map((list) => (
                        <TabsTrigger key={list.id} value={list.id} className="group flex items-center gap-2">
                            {list.name}
                            <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded-full">
                                {list._count?.guests || 0}
                            </span>
                            <Trash
                                className="h-3 w-3 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteList(list.id, list.name)
                                }}
                            />
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="mt-4 rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-800">
                            <TableHead className="text-zinc-400">Nom</TableHead>
                            <TableHead className="text-zinc-400">Rôle</TableHead>
                            <TableHead className="text-zinc-400">Statut</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                                    Aucun invité dans cette liste.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((guest) => (
                                <TableRow key={guest.id} className="border-zinc-800 hover:bg-white/5 text-zinc-300">
                                    <TableCell className="font-medium">{guest.name}</TableCell>
                                    <TableCell>{guest.role || "-"}</TableCell>
                                    <TableCell>{getStatusBadge(guest.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(guest)}
                                                className="text-zinc-400 hover:text-white"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(guest.id)}
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
        </>
    )
}
