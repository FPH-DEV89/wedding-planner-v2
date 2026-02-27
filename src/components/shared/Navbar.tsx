import { MobileSidebar } from "./MobileSidebar"
import prisma from "@/lib/prisma"
import { UserButton } from "./UserButton"
import { getSettings } from "@/features/settings/actions"

export const Navbar = async () => {
    const userId = "cm7d4v8x20000jps8p6y5p1r0"

    const settingsResponse = await getSettings()
    const settings = settingsResponse.data || {}

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    const displayName = settings.wedding_names || user?.name || "Florian & Vanessa"
    const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "FV"

    return (
        <div className="flex items-center p-6 bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
            <MobileSidebar />
            <div className="flex w-full justify-end items-center gap-4">
                <UserButton initials={initials} displayName={displayName} />
            </div>
        </div>
    )
}
