"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    Receipt,
    CheckSquare,
    Truck,
} from "lucide-react"

const mobileRoutes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "Invités",
        icon: Users,
        href: "/guests",
    },
    {
        label: "Budget",
        icon: Receipt,
        href: "/budget",
    },
    {
        label: "Prestataires",
        icon: Truck,
        href: "/vendors",
    },
    {
        label: "Tâches",
        icon: CheckSquare,
        href: "/tasks",
    },
]

export const BottomNav = () => {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-lg border-t border-[#e9ded0] px-4 py-2 shadow-lg">
            <div className="flex items-center justify-around">
                {mobileRoutes.map((route) => {
                    const isActive = pathname === route.href
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200",
                                isActive
                                    ? "text-[#c96d4b] font-bold scale-105"
                                    : "text-[#8c7d75] hover:text-[#c96d4b]"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-xl transition-colors",
                                isActive ? "bg-[#c96d4b]/10" : ""
                            )}>
                                <route.icon className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] tracking-tight mt-0.5">{route.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
