import { getVendors } from "@/features/vendors/actions"
import { VendorClient } from "@/features/vendors/components/vendor-client"

export default async function VendorsPage() {
    const { data: vendors = [] } = await getVendors()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <VendorClient initialData={vendors as any} />
        </div>
    )
}
