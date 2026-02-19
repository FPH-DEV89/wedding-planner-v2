import prisma from "@/lib/prisma"
import {
    Users,
    CreditCard,
    Heart,
    Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export const DashboardOverview = async () => {
    const guestCount = await prisma.guest.count({
        where: { userId: MOCK_USER_ID }
    })

    const confirmedGuests = await prisma.guest.count({
        where: { userId: MOCK_USER_ID, status: "CONFIRMED" }
    })

    const budgetItems = await prisma.budgetItem.findMany({
        where: { userId: MOCK_USER_ID }
    })

    const totalBudget = budgetItems.reduce((acc: number, item: any) => acc + item.amount, 0)
    const totalPaid = budgetItems.reduce((acc: number, item: any) => acc + item.paidAmount, 0)
    const remaining = totalBudget - totalPaid

    const stats = [
        {
            title: "Invités",
            value: `${confirmedGuests} / ${guestCount}`,
            description: "Confirmés / Total",
            icon: Users,
            color: "text-sky-500"
        },
        {
            title: "Budget Total",
            value: `${totalBudget.toLocaleString('fr-FR')} €`,
            description: "Montant total prévu",
            icon: CreditCard,
            color: "text-emerald-500"
        },
        {
            title: "Reste à payer",
            value: `${remaining.toLocaleString('fr-FR')} €`,
            description: "Montant restant",
            icon: Clock,
            color: "text-orange-500"
        },
        {
            title: "Jours restants",
            value: "142", // Mock value for now
            description: "Avant le grand jour",
            icon: Heart,
            color: "text-pink-500"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
            {stats.map((stat) => (
                <Card key={stat.title} className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <p className="text-xs text-zinc-500">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
