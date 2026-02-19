import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview"

export default function DashboardPage() {
    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Tableau de Bord</h2>
            <p className="text-zinc-400">Bienvenue dans votre outil de planification de mariage.</p>

            <DashboardOverview />
        </div>
    )
}
