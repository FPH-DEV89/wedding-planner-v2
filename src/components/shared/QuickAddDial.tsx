"use client"

import { useState } from "react"
import { Plus, Users, Receipt, CheckSquare, X } from "lucide-react"
import Link from "next/link"

export const QuickAddDial = () => {
    const [isOpen, setIsOpen] = useState(false)

    const actions = [
        {
            label: "Nouvel invité",
            icon: Users,
            href: "/guests",
            color: "bg-[#c96d4b] text-white"
        },
        {
            label: "Nouvelle dépense",
            icon: Receipt,
            href: "/budget",
            color: "bg-[#d97757] text-white"
        },
        {
            label: "Nouvelle tâche",
            icon: CheckSquare,
            href: "/tasks",
            color: "bg-[#e8a589] text-white"
        }
    ]

    return (
        <div className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3">
            {isOpen && (
                <div className="flex flex-col items-end gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
                    {actions.map((action, idx) => (
                        <Link
                            key={idx}
                            href={action.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 group"
                        >
                            <span className="text-xs font-bold text-[#5c4a42] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-[#e9ded0] group-hover:scale-105 transition-transform">
                                {action.label}
                            </span>
                            <div className={`p-3 rounded-full shadow-lg ${action.color} group-hover:scale-110 transition-transform`}>
                                <action.icon className="h-5 w-5" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-xl transition-all duration-300 ${
                    isOpen 
                        ? "bg-[#5c4a42] text-white rotate-45" 
                        : "bg-[#c96d4b] hover:bg-[#b85c3a] text-white hover:scale-105"
                }`}
                aria-label="Actions rapides"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </button>
        </div>
    )
}
