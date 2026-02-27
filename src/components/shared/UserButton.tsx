"use client"

import { LogOut, User, Settings } from "lucide-react"
import { signOut } from "next-auth/react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserButtonProps {
    initials: string
    displayName: string
}

export const UserButton = ({ initials, displayName }: UserButtonProps) => {
    return (
        <div className="flex items-center gap-4 group">
            <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-foreground">{displayName}</p>
                <p className="text-[10px] text-muted-foreground italic">Espace Mariés</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#c96d4b]/10 border border-[#c96d4b]/20 flex items-center justify-center text-[#c96d4b] font-serif font-bold shadow-sm">
                {initials}
            </div>
        </div>
    )
}
