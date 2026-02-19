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
import { Badge } from "@/components/ui/badge"

import { GuestForm } from "./guest-form"
import { deleteGuest } from "../actions"

interface GuestClientProps {
    initialData: any[]
}

export const GuestClient = ({ initialData }: GuestClientProps) => {
    const [open, setOpen] = useState(false)

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

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Invités</h2>
                    <p className="text-sm text-zinc-400">
                        Gérez la liste de vos invités et leurs préférences.
                    </p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-pink-600 hover:bg-pink-700">
                            <Plus className="mr-2 h-4 w-4" /> Ajouter
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Ajouter un invité</DialogTitle>
                        </DialogHeader>
                        <GuestForm />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-8 rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-800">
                            <TableHead className="text-zinc-400">Nom</TableHead>
                            <TableHead className="text-zinc-400">Rôle</TableHead>
                            <TableHead className="text-zinc-400">Statut</TableHead>
                            <TableHead className="text-zinc-400">Table</TableHead>
                            <TableHead className="text-zinc-400">Régime</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                    Aucun invité trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.map((guest) => (
                                <TableRow key={guest.id} className="border-zinc-800 hover:bg-white/5 text-zinc-300">
                                    <TableCell className="font-medium">{guest.name}</TableCell>
                                    <TableCell>{guest.role || "-"}</TableCell>
                                    <TableCell>{getStatusBadge(guest.status)}</TableCell>
                                    <TableCell>{guest.table || "-"}</TableCell>
                                    <TableCell className="max-w-[150px] truncate">
                                        {guest.dietaryRequirements || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(guest.id)}
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
