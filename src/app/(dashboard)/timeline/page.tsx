import { Calendar } from "lucide-react"

export default function TimelinePage() {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white">Timeline</h2>
                        <p className="text-sm text-zinc-400">
                            Prévoyez les moments forts de votre journée.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center h-[50vh] border border-dashed border-zinc-800 rounded-lg text-zinc-500">
                    <Calendar className="h-12 w-12 mb-4 opacity-20" />
                    <p>La planification de la journée arrive très bientôt.</p>
                </div>
            </div>
        </div>
    )
}
