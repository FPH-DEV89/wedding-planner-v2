import { getVendors } from "@/features/vendors/actions"
import { getPurchases } from "@/features/purchases/actions"
import { BudgetClient } from "@/features/budget/components/budget-client"
import { BudgetSkeleton } from "@/features/budget/components/budget-skeleton"
import { Suspense } from "react"

async function BudgetContent() {
    const { data: vendors = [] } = await getVendors()
    const { data: purchases = [] } = await getPurchases()

    return (
        <BudgetClient
            vendors={vendors as any}
            purchases={purchases as any}
        />
    )
}

export default function BudgetPage() {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Suspense fallback={<BudgetSkeleton />}>
                    <BudgetContent />
                </Suspense>
            </div>
        </div>
    )
}
