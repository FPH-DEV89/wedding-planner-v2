import prisma from "@/lib/prisma"
import {
    Users,
    CreditCard,
    Heart,
    Clock,
    Sparkles,
    Calendar,
    CheckCircle2,
    ArrowUpRight,
    TrendingUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BudgetChart } from "./budget-chart"
import { getSettings } from "@/features/settings/actions"
import { cn } from "@/lib/utils"

import { QuickActionsBar } from "./quick-actions-bar"

const SHARED_USER_ID = "cm7d4v8x20000jps8p6y5p1r0"

export const DashboardOverview = async () => {
    const userId = SHARED_USER_ID

    const settingsResponse = await getSettings()
    const settings = settingsResponse.data || {}
    const weddingDate = settings.wedding_date ? new Date(settings.wedding_date) : new Date("2026-09-12")

    const guestLists = await prisma.guestList.findMany({
        where: { userId },
        select: { id: true, name: true }
    })

    const guestCounts = await prisma.guest.count({
        where: { userId }
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

    const totalTasks = await prisma.task.count({
        where: { userId }
    })

    const completedTasks = await prisma.task.count({
        where: { userId, status: "COMPLETED" }
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
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

    // Dynamic Smart Advisor Logic
    let advisorAdvice = {
        title: "Dernière ligne droite !",
        message: "Finalisez les détails du planning de la journée et confirmez la présence des derniers invités.",
        badge: "Conseil Prioritaire"
    }

    if (diffDays > 180) {
        advisorAdvice = {
            title: "Réservation des Prestataires Clés",
            message: "C'est le moment idéal pour réserver le lieu, le traiteur et le photographe pour sécuriser vos dates.",
            badge: "Étape Initiale"
        }
    } else if (diffDays > 95) {
        advisorAdvice = {
            title: "Envoi des Faire-Part & Tenues",
            message: "Envoyez vos invitations et commencez vos essayages de tenues officielles.",
            badge: "Conseil Saison"
        }
    } else if (diffDays > 30) {
        advisorAdvice = {
            title: "Relance des RSVPs & Plan de Table",
            message: "Rassemblez les réponses de tous les invités pour entamer le plan de table définitif.",
            badge: "Haute Priorité"
        }
    }

    const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const budgetPaidPercent = totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0

    const stats = [
        {
            title: "Invités Confirmés",
            value: `${confirmedGuests} / ${guestCounts}`,
            description: guestCounts > 0 ? `${Math.round((confirmedGuests / guestCounts) * 100)}% de présence` : "Aucun invité",
            icon: Users,
            color: "bg-[#c96d4b]",
            href: "/guests"
        },
        {
            title: "Budget Financé",
            value: `${totalPaid.toLocaleString('fr-FR')} €`,
            description: `${budgetPaidPercent}% réglé sur ${totalBudget.toLocaleString('fr-FR')} €`,
            icon: CreditCard,
            color: "bg-[#d97757]",
            href: "/budget"
        },
        {
            title: "Progression Tâches",
            value: `${completedTasks} / ${totalTasks}`,
            description: `${taskProgressPercent}% des étapes accomplies`,
            icon: CheckCircle2,
            color: "bg-[#e8a589]",
            href: "/tasks"
        },
        {
            title: "Compte à Rebours",
            value: `${diffDays} Jours`,
            description: `Grand jour le ${weddingDate.toLocaleDateString('fr-FR')}`,
            icon: Heart,
            color: "bg-[#c96d4b]",
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
        <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto">
            {/* HERO BANNER & SMART ADVISOR */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fcf9f6] via-[#f7f0ea] to-[#efe3d9] border border-[#e9ded0] p-6 md:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c96d4b]/10 text-[#c96d4b] text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Votre Espace Mariage</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#3a2a22] tracking-tight">
                            Le Grand Jour Approche ✨
                        </h1>
                        <p className="text-[#6c5a52] text-sm md:text-base font-medium">
                            Plus que <strong className="text-[#c96d4b] font-bold">{diffDays} jours</strong> avant de célébrer votre union ! Voici le récapitulatif en temps réel.
                        </p>
                    </div>

                    {/* SMART ADVISOR WIDGET */}
                    <div className="bg-white/80 backdrop-blur-md border border-[#e9ded0] p-5 rounded-2xl shadow-sm flex flex-col gap-2 max-w-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c96d4b] bg-[#c96d4b]/10 px-2.5 py-0.5 rounded-full">
                                {advisorAdvice.badge}
                            </span>
                            <Sparkles className="h-4 w-4 text-[#c96d4b]" />
                        </div>
                        <h3 className="font-serif font-bold text-sm text-[#3a2a22]">
                            {advisorAdvice.title}
                        </h3>
                        <p className="text-xs text-[#6c5a52] leading-relaxed">
                            {advisorAdvice.message}
                        </p>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS BAR */}
            <QuickActionsBar guestLists={guestLists} />

            {/* METRICS GRID */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Link key={stat.title} href={stat.href}>
                        <Card className="hover:shadow-md hover:border-[#c96d4b]/40 transition-all duration-300 border-[#e9ded0] rounded-2xl overflow-hidden group cursor-pointer bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-bold text-[#7c6d66] uppercase tracking-wider">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-xl text-white ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-serif font-bold text-[#3a2a22] flex items-center justify-between">
                                    <span>{stat.value}</span>
                                    <ArrowUpRight className="h-4 w-4 text-[#8c7d75] group-hover:text-[#c96d4b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </div>
                                <p className="text-xs text-[#7c6d66] mt-1 font-medium">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* BUDGET & UPCOMING EVENTS */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 rounded-2xl border-[#e9ded0] bg-white shadow-sm overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-[#c96d4b]" />
                            <CardTitle className="font-serif text-xl text-[#3a2a22] font-bold">Aperçu du Budget</CardTitle>
                        </div>
                        <Link href="/budget" className="text-xs font-bold text-[#c96d4b] hover:underline flex items-center gap-1">
                            Gérer le budget <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="h-[280px] w-full">
                            <BudgetChart paid={totalPaid} total={totalBudget} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 rounded-2xl border-[#e9ded0] bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-[#c96d4b]" />
                            <CardTitle className="font-serif text-xl text-[#3a2a22] font-bold">Évènements à venir</CardTitle>
                        </div>
                        <Link href="/tasks" className="text-xs font-bold text-[#c96d4b] hover:underline">
                            Voir tout
                        </Link>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {upcomingEvents.length === 0 ? (
                                <div className="h-44 flex flex-col items-center justify-center bg-[#fcf9f6] rounded-xl border border-dashed border-[#e9ded0] text-center p-6">
                                    <Clock className="h-8 w-8 text-[#c96d4b]/40 mb-2" />
                                    <p className="text-xs font-medium text-[#7c6d66] italic">Aucune tâche ou événement urgent à venir.</p>
                                </div>
                            ) : (
                                upcomingEvents.map((event) => {
                                    const eventDiffTime = event.dueDate ? event.dueDate.getTime() - now.getTime() : 0
                                    const eventDiffDays = Math.ceil(eventDiffTime / (1000 * 60 * 60 * 24))
                                    const isSoon = eventDiffDays <= 7

                                    return (
                                        <Link key={event.id} href={event.type === "TIMELINE" ? "/timeline" : "/tasks"}>
                                            <div className={cn(
                                                "flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 group hover:shadow-sm",
                                                isSoon
                                                    ? "bg-[#fcf5f2] border-[#e8a589]/40 hover:border-[#c96d4b]"
                                                    : "bg-[#fcf9f6] border-[#e9ded0] hover:border-[#c96d4b]/40"
                                            )}>
                                                <div className={cn(
                                                    "h-10 w-10 rounded-lg flex items-center justify-center font-bold font-serif text-xs shadow-xs shrink-0",
                                                    isSoon ? "bg-[#c96d4b] text-white" : "bg-[#c96d4b]/10 text-[#c96d4b]"
                                                )}>
                                                    {eventDiffDays > 0 ? `${eventDiffDays}j` : "!"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-[#3a2a22] group-hover:text-[#c96d4b] transition-colors truncate">
                                                        {event.title}
                                                    </p>
                                                    <p className="text-[11px] text-[#7c6d66] font-medium">
                                                        {eventDiffDays === 0
                                                            ? "Aujourd'hui"
                                                            : eventDiffDays === 1
                                                                ? "Demain"
                                                                : `Dans ${eventDiffDays} jours`}
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
