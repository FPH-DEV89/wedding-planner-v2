import prisma from "@/lib/prisma"
import {
    Users,
    CreditCard,
    Heart,
    Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const MOCK_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"
const WEDDING_DATE = new RegExp("2026-09-12T00:00:00Z") // Target date
const WEDDING_DATE_OBJ = new Date("2026-09-12")

export const DashboardOverview = async () => {
    const guestCounts = await prisma.guest.count({
        where: { userId: MOCK_USER_ID }
    })

    const guestLists = await prisma.guestList.findMany({
        where: { userId: MOCK_USER_ID },
        include: {
            _count: {
                select: { guests: true }
            }
        }
    })

    const confirmedGuests = await prisma.guest.count({
        where: {
            userId: MOCK_USER_ID,
            category: {
                contains: "Confirmé",
                mode: 'insensitive'
            }
        }
    })

    const budgetItems = await prisma.budgetItem.findMany({
        where: { userId: MOCK_USER_ID }
    })

    const vendors = await prisma.vendor.findMany({
        where: { userId: MOCK_USER_ID }
    })

    const purchases = await prisma.purchase.findMany({
        where: { userId: MOCK_USER_ID }
    })

    const totalBudgetItems = budgetItems.reduce((acc: number, item: { amount: number }) => acc + item.amount, 0)
    const paidBudgetItems = budgetItems.reduce((acc: number, item: { paidAmount: number }) => acc + item.paidAmount, 0)

    const totalVendors = vendors.reduce((acc: number, v: { price: number }) => acc + v.price, 0)
    const paidVendors = vendors.reduce((acc: number, v: { paidAmount: number }) => acc + v.paidAmount, 0)

    const totalPurchases = purchases.reduce((acc: number, p: { price: number, quantity: number }) => acc + (p.price * p.quantity), 0)
    const paidPurchases = purchases.reduce((acc: number, p: { isPaid: boolean, price: number, quantity: number }) => acc + (p.isPaid ? (p.price * p.quantity) : 0), 0)

    const totalBudget = totalBudgetItems + totalVendors + totalPurchases
    const totalPaid = paidBudgetItems + paidVendors + paidPurchases
    const remaining = totalBudget - totalPaid

    const now = new Date()
    const diffTime = WEDDING_DATE_OBJ.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const stats = [
        {
            title: "Invités",
            value: `${guestCounts}`,
            description: guestLists.map((l: any) => `${l.name}: ${l._count.guests}`).join(", "),
            icon: Users,
            color: "text-sky-500",
            href: "/guests"
        },
        {
            title: "Budget Total",
            value: `${totalBudget.toLocaleString('fr-FR')} €`,
            description: "Dépenses + Prestataires + Achats",
            icon: CreditCard,
            color: "text-emerald-500",
            href: "/budget"
        },
        {
            title: "Restant à financer",
            value: `${remaining.toLocaleString('fr-FR')} €`,
            description: "Sur un total de " + totalBudget.toLocaleString('fr-FR') + " €",
            icon: Clock,
            color: "text-orange-500",
            href: "/budget"
        },
        {
            title: "Jours restants",
            value: `${diffDays}`,
            description: "Avant le 12/09/2026",
            icon: Heart,
            color: "text-pink-500",
            href: "/settings"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
            {stats.map((stat) => (
                <Link key={stat.title} href={stat.href}>
                    <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition cursor-pointer">
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
                </Link>
            ))}
        </div>
    )
}
