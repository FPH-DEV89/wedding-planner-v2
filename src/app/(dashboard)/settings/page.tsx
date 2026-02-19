"use client"

import { Settings2 } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white">Paramètres</h2>
                        <p className="text-sm text-zinc-400">
                            Gérez les détails de votre mariage et vos préférences.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 h-64 opacity-50">
                        <Settings2 className="h-12 w-12 text-zinc-700" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">Configuration du Mariage</h3>
                            <p className="text-sm text-zinc-500">Date, lieu et informations générales.</p>
                        </div>
                        <p className="text-xs text-zinc-600 italic">Bientôt disponible</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
