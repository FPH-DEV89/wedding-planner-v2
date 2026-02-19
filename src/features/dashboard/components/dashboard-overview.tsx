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

    const vendors = await prisma.vendor.findMany({
        where: { userId: MOCK_USER_ID }
    })

    const purchases = await prisma.purchase.findMany({
        where: { userId: MOCK_USER_ID }
    })

    const totalVendors = vendors.reduce((acc: number, v: { price: number }) => acc + v.price, 0)
    const paidVendors = vendors.reduce((acc: number, v: { paidAmount: number }) => acc + v.paidAmount, 0)

    const totalPurchases = purchases.reduce((acc: number, p: { price: number, quantity: number }) => acc + (p.price * p.quantity), 0)
    const paidPurchases = purchases.reduce((acc: number, p: { isPaid: boolean, price: number, quantity: number }) => acc + (p.isPaid ? (p.price * p.quantity) : 0), 0)

    const totalBudget = totalVendors + totalPurchases
    const totalPaid = paidVendors + paidPurchases
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
            description: "Prestataires + Achats",
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
                    <CardContent className="pl-2">
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground italic bg-muted/20 rounded-2xl border border-dashed border-border m-4">
                            Graphique du budget (Bientôt disponible en Terracotta)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 rounded-3xl border-[#e9ded0] bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-serif text-2xl text-[#c96d4b] font-bold">Évènements à venir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/10 border border-secondary/20 group hover:bg-secondary/20 transition-colors">
                                <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold font-serif">
                                    15
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Dégustation Traiteur</p>
                                    <p className="text-xs text-muted-foreground italic">Prévu dans 15 jours</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 group hover:bg-primary/10 transition-colors">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-serif">
                                    30
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Essayage Robe / Costume</p>
                                    <p className="text-xs text-muted-foreground italic">Prévu dans 30 jours</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
