import { getGuests } from "@/features/guests/actions"
import { getGuestLists } from "@/features/guest-lists/actions"
import { GuestClient } from "@/features/guests/components/guest-client"

export default async function GuestsPage() {
    const guestsResponse = await getGuests()
    const listsResponse = await getGuestLists()

    const initialData = guestsResponse.data || []
    const guestLists = listsResponse.data || []

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <GuestClient
                    initialData={initialData}
                    guestLists={guestLists}
                />
            </div>
        </div>
    )
}
