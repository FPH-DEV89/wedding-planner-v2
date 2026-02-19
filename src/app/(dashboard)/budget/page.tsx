import { getBudgetItems } from "@/features/budget/actions"
import { BudgetClient } from "@/features/budget/components/budget-client"

export default async function BudgetPage() {
    const response = await getBudgetItems()
    const initialData = response.data || []

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BudgetClient initialData={initialData} />
            </div>
        </div>
    )
}
