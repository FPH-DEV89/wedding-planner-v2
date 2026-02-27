import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import {
    Users,
    CreditCard,
    Heart,
    Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BudgetChart } from "./budget-chart"
import { getSettings } from "@/features/settings/actions"
import { cn } from "@/lib/utils"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export const DashboardOverview = async () => {
    const userId = SHARED_USER_ID

    const settingsResponse = await getSettings()
    const settings = settingsResponse.data || {}
    const weddingDate = settings.wedding_date ? new Date(settings.wedding_date) : new Date("2026-09-12")

    const guestCounts = await prisma.guest.count({
        where: { userId }
    })

    const guestLists = await prisma.guestList.findMany({
        where: { userId },
        include: {
            _count: {
                select: { guests: true }
            }
        }
    })

    const confirmedGuests = await prisma.guest.count({
        where: {
            userId,
            category: {
                contains: "Confirmé",
                mode: 'insensitive'
            }
        }
    })

    const vendors = await prisma.vendor.findMany({
        where: { userId }
    })

    const purchases = await prisma.purchase.findMany({
        where: { userId }
    })

    const totalVendors = vendors.reduce((acc: number, v: { price: number }) => acc + v.price, 0)
    const paidVendors = vendors.reduce((acc: number, v: { paidAmount: number }) => acc + v.paidAmount, 0)

    const totalPurchases = purchases.reduce((acc: number, p: { price: number, quantity: number }) => acc + (p.price * p.quantity), 0)
    const paidPurchases = purchases.reduce((acc: number, p: { isPaid: boolean, price: number, quantity: number }) => acc + (p.isPaid ? (p.price * p.quantity) : 0), 0)

    const totalBudget = totalVendors + totalPurchases
    const totalPaid = paidVendors + paidPurchases
    const remaining = totalBudget - totalPaid

    const now = new Date()
    const diffTime = weddingDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const stats = [
        {
            title: "Invités",
            value: `${guestCounts}`,
            description: guestLists.map((l: any) => `${l.name}: ${l._count.guests}`).join(", "),
            icon: Users,
            color: "text-[#c96d4b]",
            href: "/guests"
        },
        {
            title: "Budget Total",
            value: `${totalBudget.toLocaleString('fr-FR')} €`,
            description: "Prestataires + Achats",
            icon: CreditCard,
            color: "text-[#c96d4b]",
            href: "/budget"
        },
        {
            title: "Restant à financer",
            value: `${remaining.toLocaleString('fr-FR')} €`,
            description: "Sur un total de " + totalBudget.toLocaleString('fr-FR') + " €",
            icon: Clock,
            color: "text-[#c96d4b]",
            href: "/budget"
        },
        {
            title: "Jours restants",
            value: `${diffDays}`,
            description: `Avant le ${weddingDate.toLocaleDateString('fr-FR')}`,
            icon: Heart,
            color: "text-[#c96d4b]",
            href: "/settings"
        }
    ]

    const upcomingEvents = await prisma.task.findMany({
        where: {
            userId,
            status: { not: "COMPLETED" },
            dueDate: { gte: now }
        },
        orderBy: {
            dueDate: 'asc'
        },
        take: 3
    })

    return (
        <div className="flex-1 space-y-10 p-8 pt-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-serif font-bold tracking-tight text-[#c96d4b]">Tableau de Bord</h2>
                <p className="text-[#7c6d66] font-medium">
                    Heureux de vous revoir ! Voici l'état de vos préparatifs pour le grand jour.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Link key={stat.title} href={stat.href}>
                        <Card className="hover:shadow-lg hover:shadow-[#c96d4b]/5 transition-all duration-300 border-[#e9ded0] rounded-3xl overflow-hidden group cursor-pointer bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-bold text-[#7c6d66] uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                                <div className="p-2 rounded-full bg-[#f3ece4] group-hover:bg-[#c96d4b]/10 transition-colors">
                                    <stat.icon className={`h-4 w-4 text-[#c96d4b] group-hover:scale-110 transition-transform`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-serif font-bold text-[#3a2a22]">{stat.value}</div>
                                <p className="text-xs text-[#7c6d66] mt-1 font-medium">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <Card className="col-span-4 rounded-3xl border-[#e9ded0] bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-serif text-2xl text-[#c96d4b] font-bold">Aperçu du Budget</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[300px] w-full">
                            <BudgetChart paid={totalPaid} total={totalBudget} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 rounded-3xl border-[#e9ded0] bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-serif text-2xl text-[#c96d4b] font-bold">Évènements à venir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {upcomingEvents.length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center bg-primary/5 rounded-2xl border border-dashed border-primary/20 text-center p-6">
                                    <Clock className="h-8 w-8 text-primary/40 mb-2" />
                                    <p className="text-sm font-medium text-muted-foreground italic">Aucun évènement prévu prochainement.</p>
                                </div>
                            ) : (
                                upcomingEvents.map((event, index) => {
                                    const eventDiffTime = event.dueDate ? event.dueDate.getTime() - now.getTime() : 0
                                    const eventDiffDays = Math.ceil(eventDiffTime / (1000 * 60 * 60 * 24))
                                    const isSoon = eventDiffDays <= 7

                                    return (
                                        <Link key={event.id} href={event.type === "TIMELINE" ? "/timeline" : "/tasks"}>
                                            <div className={cn(
                                                "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group hover:shadow-md mb-4 last:mb-0",
                                                isSoon
                                                    ? "bg-secondary/10 border-secondary/20 hover:bg-secondary/20"
                                                    : "bg-primary/5 border-primary/10 hover:bg-primary/10"
                                            )}>
                                                <div className={cn(
                                                    "h-12 w-12 rounded-full flex items-center justify-center font-bold font-serif shadow-sm",
                                                    isSoon ? "bg-secondary/20 text-secondary" : "bg-primary/10 text-primary"
                                                )}>
                                                    {eventDiffDays > 0 ? eventDiffDays : "!"}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                                        {event.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground italic">
                                                        {eventDiffDays === 0
                                                            ? "Aujourd'hui"
                                                            : eventDiffDays === 1
                                                                ? "Demain"
                                                                : `Prévu dans ${eventDiffDays} jours`}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
