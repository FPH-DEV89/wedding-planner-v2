"use client"

import { motion } from "framer-motion"

interface BudgetChartProps {
    paid: number
    total: number
}

export const BudgetChart = ({ paid, total }: BudgetChartProps) => {
    const percentage = total > 0 ? Math.min((paid / total) * 100, 100) : 0
    const circumference = 2 * Math.PI * 80 // r=80

    return (
        <div className="relative flex items-center justify-center w-full h-full p-4">
            <svg viewBox="0 0 200 200" className="w-full h-full max-w-[240px] transform -rotate-90">
                {/* Background Circle */}
                <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="transparent"
                    stroke="#f3ece4"
                    strokeWidth="12"
                    className="transition-all duration-500"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="transparent"
                    stroke="#c96d4b"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-serif font-bold text-[#3a2a22]">
                    {Math.round(percentage)}%
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#7c6d66] font-bold mt-1">
                    Payé
                </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between px-2">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-[#7c6d66] font-bold">Investi</span>
                    <span className="text-sm font-bold text-secondary">{paid.toLocaleString()} €</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase text-[#7c6d66] font-bold">Total</span>
                    <span className="text-sm font-bold text-[#3a2a22]">{total.toLocaleString()} €</span>
                </div>
            </div>
        </div>
    )
}
