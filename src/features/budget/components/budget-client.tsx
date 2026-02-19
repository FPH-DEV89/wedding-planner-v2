"use client"

import { Trash, Truck, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Vendor } from "@/features/vendors/schema"
import { Purchase } from "@/features/purchases/schema"

interface BudgetClientProps {
    vendors: Vendor[]
    purchases: Purchase[]
}

export const BudgetClient = ({ vendors, purchases }: BudgetClientProps) => {
    // Calculations
    const totalVendors = vendors.reduce((acc, v) => acc + v.price, 0)
    const paidVendors = vendors.reduce((acc, v) => acc + v.paidAmount, 0)

    const totalPurchases = purchases.reduce((acc, p) => acc + (p.price * p.quantity), 0)
    const paidPurchases = purchases.reduce((acc, p) => acc + (p.isPaid ? (p.price * p.quantity) : 0), 0)

    const grandTotal = totalVendors + totalPurchases
    const grandPaid = paidVendors + paidPurchases
    const grandRemaining = grandTotal - grandPaid

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Budget Global</h2>
                    <p className="text-sm text-zinc-400">
                        Vue d'ensemble de vos finances pour le mariage.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Total Budget</p>
                    <p className="text-2xl font-bold text-white">{grandTotal.toLocaleString()} €</p>
                    <div className="flex gap-2 mt-2 text-[10px] text-zinc-500">
                        <span>Vendeurs: {totalVendors}€</span>
                        <span>Achats: {totalPurchases}€</span>
                    </div>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Total Payé</p>
                    <p className="text-2xl font-bold text-emerald-500">{grandPaid.toLocaleString()} €</p>
                </div>
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400">Reste à payer</p>
                    <p className="text-2xl font-bold text-orange-500">{grandRemaining.toLocaleString()} €</p>
                </div>
            </div>

            <Tabs defaultValue="vendors" className="mt-8">
                <TabsList className="bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="vendors" className="data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-white">
                        <Truck className="h-4 w-4 mr-2" /> Prestataires
                    </TabsTrigger>
                    <TabsTrigger value="purchases" className="data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-white">
                        <Store className="h-4 w-4 mr-2" /> Achats
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="vendors" className="mt-4">
                    <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-zinc-800">
                                    <TableHead className="text-zinc-400">Prestataire</TableHead>
                                    <TableHead className="text-zinc-400">Prix</TableHead>
                                    <TableHead className="text-zinc-400">Acompte/Payé</TableHead>
                                    <TableHead className="text-zinc-400">Reste</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                                            Aucun prestataire ajouté.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vendors.map((vendor) => (
                                        <TableRow key={vendor.id} className="border-zinc-800 hover:bg-white/5 text-zinc-300">
                                            <TableCell className="font-medium text-white">{vendor.name}</TableCell>
                                            <TableCell>{vendor.price.toLocaleString()} €</TableCell>
                                            <TableCell className="text-emerald-500">{vendor.paidAmount.toLocaleString()} €</TableCell>
                                            <TableCell className="text-orange-500">{(vendor.price - vendor.paidAmount).toLocaleString()} €</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="vendors" className="mt-4">
                    <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-zinc-800">
                                    <TableHead className="text-zinc-400">Prestataire</TableHead>
                                    <TableHead className="text-zinc-400">Prix</TableHead>
                                    <TableHead className="text-zinc-400">Acompte/Payé</TableHead>
                                    <TableHead className="text-zinc-400">Reste</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                                            Aucun prestataire ajouté.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vendors.map((vendor) => (
                                        <TableRow key={vendor.id} className="border-zinc-800 hover:bg-white/5 text-zinc-300">
                                            <TableCell className="font-medium text-white">{vendor.name}</TableCell>
                                            <TableCell>{vendor.price.toLocaleString()} €</TableCell>
                                            <TableCell className="text-emerald-500">{vendor.paidAmount.toLocaleString()} €</TableCell>
                                            <TableCell className="text-orange-500">{(vendor.price - vendor.paidAmount).toLocaleString()} €</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="purchases" className="mt-4">
                    <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-zinc-800">
                                    <TableHead className="text-zinc-400">Achat</TableHead>
                                    <TableHead className="text-zinc-400">Quantité</TableHead>
                                    <TableHead className="text-zinc-400">Total</TableHead>
                                    <TableHead className="text-zinc-400">Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchases.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                                            Aucun achat enregistré.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    purchases.map((purchase) => (
                                        <TableRow key={purchase.id} className="border-zinc-800 hover:bg-white/5 text-zinc-300">
                                            <TableCell className="font-medium text-white">{purchase.type}</TableCell>
                                            <TableCell>{purchase.quantity}</TableCell>
                                            <TableCell>{(purchase.price * purchase.quantity).toLocaleString()} €</TableCell>
                                            <TableCell>{purchase.isPaid ? "Payé" : "À payer"}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
