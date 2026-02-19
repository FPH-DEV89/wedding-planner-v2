"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    Receipt,
    CheckSquare,
    Calendar,
    Settings,
    Heart,
    Store,
    Truck
} from "lucide-react"

const routes = [
    {
        label: "Tableau de Bord",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        label: "Mes Invités",
        icon: Users,
        href: "/guests",
    },
    {
        label: "Budget & Finances",
        icon: Receipt,
        href: "/budget",
    },
    {
        label: "Prestataires",
        icon: Truck,
        href: "/vendors",
    },
    {
        label: "Achats & Boutique",
        icon: Store,
        href: "/purchases",
    },
    {
        label: "Liste de Tâches",
        icon: CheckSquare,
        href: "/tasks",
    },
    {
        label: "Planning / Timeline",
        icon: Calendar,
        href: "/timeline",
    },
    {
        label: "Paramètres",
        icon: Settings,
        href: "/settings",
    },
]

export const Sidebar = () => {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-8 flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
            <div className="px-6 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center mb-16 pl-2 group">
                    <div className="relative w-10 h-10 mr-4 flex items-center justify-center bg-primary/10 rounded-2xl group-hover:rotate-12 transition-transform">
                        <Heart className="text-primary fill-primary h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-serif font-extrabold leading-none text-primary">
                            Amour
                        </h1>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-1">
                            Wedding Planner
                        </span>
                    </div>
                </Link>
                <div className="space-y-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-4 w-full justify-start font-bold cursor-pointer rounded-2xl transition-all duration-300",
                                pathname === route.href
                                    ? "text-primary bg-primary/10 shadow-sm"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn(
                                    "h-5 w-5 mr-3 transition-colors",
                                    pathname === route.href ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                )} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-6 py-4 border-t border-sidebar-border/50">
                <div className="p-4 rounded-3xl bg-secondary/10 border border-secondary/20">
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Compte à rebours</p>
                    <p className="text-xs text-muted-foreground mt-1 font-serif">12 Septembre 2026</p>
                </div>
            </div>
        </div>
    )
}
