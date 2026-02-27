import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const GuestSkeleton = () => {
    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div>
                    <Skeleton className="h-10 w-48 rounded-xl" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                    <Skeleton className="h-10 w-40 rounded-xl" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-3xl" />
                ))}
            </div>

            <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <div className="rounded-3xl border border-border h-96 w-full relative overflow-hidden">
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
