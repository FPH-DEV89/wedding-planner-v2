import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export const BudgetSkeleton = () => {
    return (
        <div className="space-y-10 p-8 pt-6">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-64 rounded-xl" />
                <Skeleton className="h-4 w-96 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6 border-border/60 rounded-3xl bg-card/50">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-40 mb-4" />
                        <Skeleton className="h-px w-full mb-4" />
                        <Skeleton className="h-2 w-full rounded-full" />
                    </Card>
                ))}
            </div>

            <div className="mt-10 space-y-6">
                <Skeleton className="h-10 w-64 rounded-2xl" />
                <div className="rounded-3xl border border-border/60 h-96 w-full overflow-hidden">
                    <div className="bg-muted/30 h-12 w-full p-4 flex gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                    </div>
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
