import { getVendors } from "@/features/vendors/actions"
import { VendorClient } from "@/features/vendors/components/vendor-client"
import { VendorSkeleton } from "@/features/vendors/components/vendor-skeleton"
import { Suspense } from "react"

async function VendorContent() {
    const { data: vendors = [] } = await getVendors()
    return <VendorClient initialData={vendors as any} />
}

export default function VendorsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Suspense fallback={<VendorSkeleton />}>
                <VendorContent />
            </Suspense>
        </div>
    )
}
