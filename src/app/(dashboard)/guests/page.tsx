import { getGuests } from "@/features/guests/actions"
import { GuestClient } from "@/features/guests/components/guest-client"

export default async function GuestsPage() {
    const response = await getGuests()
    const initialData = response.data || []

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <GuestClient initialData={initialData} />
            </div>
        </div>
    )
}
