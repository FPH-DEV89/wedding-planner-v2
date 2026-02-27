"use client"

import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/shared/Sidebar"
import { useEffect, useState } from "react"

export const MobileSidebar = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <Sheet>
            <SheetTrigger>
                <div className="md:hidden pr-4 hover:opacity-75 transition">
                    <Menu />
                </div>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-none bg-[#fdfaf7] w-72">
                <SheetHeader className="sr-only">
                    <SheetTitle>Menu de Navigation</SheetTitle>
                    <SheetDescription>Accédez aux différentes sections de votre wedding planner</SheetDescription>
                </SheetHeader>
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}
