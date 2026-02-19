import { MobileSidebar } from "./MobileSidebar"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const Navbar = async () => {
    const session = await auth()

    let user = null
    if (session?.user?.email) {
        user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })
    }

    const displayName = user?.name || "Invité"
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="flex items-center p-6 bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
            <MobileSidebar />
            <div className="flex w-full justify-end items-center gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-foreground">{displayName}</p>
                    <p className="text-[10px] text-muted-foreground italic">Organisateur</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#c96d4b]/10 border border-[#c96d4b]/20 flex items-center justify-center text-[#c96d4b] font-serif font-bold shadow-sm">
                    {initials}
                </div>
            </div>
        </div>
    )
}
