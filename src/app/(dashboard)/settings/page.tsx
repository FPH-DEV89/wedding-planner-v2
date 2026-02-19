import { Settings2 } from "lucide-react"
import { auth } from "@/lib/auth"
import { SettingsForm } from "@/features/settings/components/settings-form"
import prisma from "@/lib/prisma"

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export default async function SettingsPage() {
    const session = await auth()
    const userId = session?.user?.id || MOCK_USER_ID

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-serif font-bold tracking-tight text-[#c96d4b]">Paramètres</h2>
                        <p className="text-sm text-[#7c6d66] font-medium mt-1">
                            Gérez les détails de votre profil et de votre mariage.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                    <div className="bg-[#fdfaf7] border border-[#e9ded0] rounded-3xl p-6 flex flex-col space-y-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#e9ded0]">
                                <Settings2 className="h-6 w-6 text-[#c96d4b]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif font-bold text-[#3a2a22]">Profil</h3>
                                <p className="text-xs text-[#7c6d66]">Informations personnelles</p>
                            </div>
                        </div>

                        <SettingsForm initialName={user?.name || ""} />
                    </div>

                    {/* Placeholder for future settings */}
                    <div className="bg-white/50 border border-dashed border-[#e9ded0] rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                        <p className="text-sm font-serif font-bold text-[#7c6d66]">Plus d'options bientôt...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
