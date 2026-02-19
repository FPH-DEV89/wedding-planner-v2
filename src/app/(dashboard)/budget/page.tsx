import { getVendors } from "@/features/vendors/actions"
import { getPurchases } from "@/features/purchases/actions"
import { BudgetClient } from "@/features/budget/components/budget-client"

export default async function BudgetPage() {
    const { data: vendors = [] } = await getVendors()
    const { data: purchases = [] } = await getPurchases()

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BudgetClient
                    vendors={vendors as any}
                    purchases={purchases as any}
                />
            </div>
        </div>
    )
}
