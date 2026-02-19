import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const DashboardSkeleton = () => {
    return (
        <div className="flex-1 space-y-10 p-8 pt-6">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-64 rounded-xl" />
                <Skeleton className="h-4 w-96 rounded-lg" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-[#e9ded0] rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-32 mb-2" />
                            <Skeleton className="h-3 w-48" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <Card className="col-span-4 rounded-3xl border-[#e9ded0] bg-white h-[400px]">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full rounded-2xl" />
                    </CardContent>
                </Card>
                <Card className="col-span-3 rounded-3xl border-[#e9ded0] bg-white h-[400px]">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
