import { getGuests } from "@/features/guests/actions"
import { getGuestLists } from "@/features/guest-lists/actions"
import { GuestClient } from "@/features/guests/components/guest-client"
import { GuestSkeleton } from "@/features/guests/components/guest-skeleton"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

async function GuestContent() {
    const guestsResponse = await getGuests()
    const listsResponse = await getGuestLists()

    const initialData = guestsResponse.data || []
    const guestLists = listsResponse.data || []

    return (
        <GuestClient
            initialData={initialData}
            guestLists={guestLists}
        />
    )
}

export default function GuestsPage() {
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Suspense fallback={<GuestSkeleton />}>
                    <GuestContent />
                </Suspense>
            </div>
        </div>
    )
}
