"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, ShoppingBag, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { GuestForm } from "@/features/guests/components/guest-form"
import { PurchaseForm } from "@/features/purchases/components/purchase-form"
import { TaskForm } from "@/features/tasks/components/task-form"

interface QuickActionsBarProps {
    guestLists: {
        id: string
        name: string
    }[]
}

export const QuickActionsBar = ({ guestLists }: QuickActionsBarProps) => {
    const router = useRouter()
    const [openGuestModal, setOpenGuestModal] = useState(false)
    const [openPurchaseModal, setOpenPurchaseModal] = useState(false)
    const [openTaskModal, setOpenTaskModal] = useState(false)

    const handleSuccess = () => {
        setOpenGuestModal(false)
        setOpenPurchaseModal(false)
        setOpenTaskModal(false)
        router.refresh()
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-3 bg-white p-3 md:p-4 rounded-2xl border border-[#e9ded0] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7c6d66] mr-1 hidden sm:inline-block">
                    Actions rapides :
                </span>
                
                <Button
                    onClick={() => setOpenGuestModal(true)}
                    variant="outline"
                    className="flex-1 sm:flex-none border-[#e8a589]/40 hover:border-[#c96d4b] text-[#3a2a22] hover:text-[#c96d4b] bg-[#fcf9f6] hover:bg-[#fcf5f2] rounded-xl font-bold text-xs h-10 transition-all gap-2"
                >
                    <UserPlus className="h-4 w-4 text-[#c96d4b]" />
                    <span>Invité</span>
                </Button>

                <Button
                    onClick={() => setOpenPurchaseModal(true)}
                    variant="outline"
                    className="flex-1 sm:flex-none border-[#e8a589]/40 hover:border-[#c96d4b] text-[#3a2a22] hover:text-[#c96d4b] bg-[#fcf9f6] hover:bg-[#fcf5f2] rounded-xl font-bold text-xs h-10 transition-all gap-2"
                >
                    <ShoppingBag className="h-4 w-4 text-[#d97757]" />
                    <span>Dépense</span>
                </Button>

                <Button
                    onClick={() => setOpenTaskModal(true)}
                    variant="outline"
                    className="flex-1 sm:flex-none border-[#e8a589]/40 hover:border-[#c96d4b] text-[#3a2a22] hover:text-[#c96d4b] bg-[#fcf9f6] hover:bg-[#fcf5f2] rounded-xl font-bold text-xs h-10 transition-all gap-2"
                >
                    <CheckSquare className="h-4 w-4 text-[#e8a589]" />
                    <span>Tâche</span>
                </Button>
            </div>

            {/* MODALE INVITÉ */}
            <Dialog open={openGuestModal} onOpenChange={setOpenGuestModal}>
                <DialogContent className="sm:max-w-[425px] bg-white border border-[#e9ded0] rounded-3xl p-6">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="font-serif font-bold text-2xl text-[#3a2a22]">
                            Ajouter un Invité Éclair 💌
                        </DialogTitle>
                    </DialogHeader>
                    <GuestForm guestLists={guestLists} onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>

            {/* MODALE DÉPENSE */}
            <Dialog open={openPurchaseModal} onOpenChange={setOpenPurchaseModal}>
                <DialogContent className="sm:max-w-[425px] bg-white border border-[#e9ded0] rounded-3xl p-6">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="font-serif font-bold text-2xl text-[#3a2a22]">
                            Ajouter une Dépense 🧾
                        </DialogTitle>
                    </DialogHeader>
                    <PurchaseForm onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>

            {/* MODALE TÂCHE */}
            <Dialog open={openTaskModal} onOpenChange={setOpenTaskModal}>
                <DialogContent className="sm:max-w-[425px] bg-white border border-[#e9ded0] rounded-3xl p-6">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="font-serif font-bold text-2xl text-[#3a2a22]">
                            Créer une Tâche ✨
                        </DialogTitle>
                    </DialogHeader>
                    <TaskForm onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>
        </>
    )
}
