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

import { Card, CardContent } from "@/components/ui/card"
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
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-serif font-bold tracking-tight text-primary">Budget Global</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Vue d'ensemble de vos finances pour le mariage.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="p-6 border-border/60 rounded-3xl bg-card/50 shadow-sm">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Total Budget</p>
                    <p className="text-3xl font-serif font-bold text-foreground mt-2">{grandTotal.toLocaleString()} €</p>
                    <div className="flex gap-3 mt-4 text-[11px] text-muted-foreground italic border-t border-border pt-4">
                        <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-primary" /> Vendeurs: {totalVendors}€</span>
                        <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-secondary" /> Achats: {totalPurchases}€</span>
                    </div>
                </Card>
                <Card className="p-6 border-border/60 rounded-3xl bg-card/50 shadow-sm">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Total Payé</p>
                    <p className="text-3xl font-serif font-bold text-secondary mt-2">{grandPaid.toLocaleString()} €</p>
                    <div className="mt-4 border-t border-border pt-4">
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-secondary h-full transition-all duration-1000"
                                style={{ width: `${(grandPaid / (grandTotal || 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-border/60 rounded-3xl bg-card/50 shadow-sm">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Reste à payer</p>
                    <p className="text-3xl font-serif font-bold text-primary mt-2">{grandRemaining.toLocaleString()} €</p>
                </Card>
            </div>

            <Tabs defaultValue="vendors" className="mt-10">
                <TabsList className="bg-muted/50 border border-border/60 p-1 rounded-2xl">
                    <TabsTrigger value="vendors" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all px-6">
                        <Truck className="h-4 w-4 mr-2" /> Prestataires
                    </TabsTrigger>
                    <TabsTrigger value="purchases" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all px-6">
                        <Store className="h-4 w-4 mr-2" /> Achats
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="vendors" className="mt-6">
                    <div className="rounded-3xl border border-border/60 overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm text-foreground">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-border/60">
                                    <TableHead className="font-serif text-foreground">Prestataire</TableHead>
                                    <TableHead className="font-serif text-foreground">Prix</TableHead>
                                    <TableHead className="font-serif text-foreground">Payé</TableHead>
                                    <TableHead className="font-serif text-foreground">Reste</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                                            Aucun prestataire ajouté.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vendors.map((vendor) => (
                                        <TableRow key={vendor.id} className="border-border/60 hover:bg-muted/20 transition-colors">
                                            <TableCell className="font-medium">{vendor.name}</TableCell>
                                            <TableCell className="font-serif">{vendor.price.toLocaleString()} €</TableCell>
                                            <TableCell className="text-secondary font-medium">{vendor.paidAmount.toLocaleString()} €</TableCell>
                                            <TableCell className="text-primary font-bold">{(vendor.price - vendor.paidAmount).toLocaleString()} €</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="purchases" className="mt-6">
                    <div className="rounded-3xl border border-border/60 overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm text-foreground">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-border/60">
                                    <TableHead className="font-serif text-foreground">Achat</TableHead>
                                    <TableHead className="font-serif text-foreground">Quantité</TableHead>
                                    <TableHead className="font-serif text-foreground">Total</TableHead>
                                    <TableHead className="font-serif text-foreground">Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchases.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                                            Aucun achat enregistré.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    purchases.map((purchase) => (
                                        <TableRow key={purchase.id} className="border-border/60 hover:bg-muted/20 transition-colors">
                                            <TableCell className="font-medium">{purchase.type}</TableCell>
                                            <TableCell>{purchase.quantity}</TableCell>
                                            <TableCell className="font-serif">{(purchase.price * purchase.quantity).toLocaleString()} €</TableCell>
                                            <TableCell>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${purchase.isPaid ? 'bg-secondary/20 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                                    {purchase.isPaid ? "Payé" : "À payer"}
                                                </span>
                                            </TableCell>
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
