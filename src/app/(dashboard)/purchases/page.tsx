import { getPurchases } from "@/features/purchases/actions"
import { PurchaseClient } from "@/features/purchases/components/purchase-client"

export const dynamic = "force-dynamic"

export default async function PurchasesPage() {
    const { data: purchases = [] } = await getPurchases()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <PurchaseClient initialData={purchases as any} />
        </div>
    )
}
