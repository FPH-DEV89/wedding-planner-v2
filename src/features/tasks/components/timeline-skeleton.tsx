import { Skeleton } from "@/components/ui/skeleton"

export const TimelineSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div className="text-center space-y-4 mb-20">
                <div className="flex justify-center">
                    <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                <Skeleton className="h-16 w-64 mx-auto rounded-xl" />
                <Skeleton className="h-4 w-40 mx-auto rounded-lg" />
                <div className="pt-8">
                    <Skeleton className="h-12 w-48 mx-auto rounded-full" />
                </div>
            </div>

            <div className="relative space-y-0 before:absolute before:inset-0 before:left-1/2 before:-translate-x-px before:h-full before:w-[2px] before:bg-border/40">
                {[1, 2, 3, 4].map((i) => {
                    const isEven = i % 2 === 0;
                    return (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal py-10">
                            <div className={`w-[calc(50%-2.5rem)] space-y-3 ${isEven ? 'md:mr-auto text-right md:pr-12' : 'md:ml-auto md:pl-12 order-2'}`}>
                                <div className={`flex items-center gap-4 ${isEven ? 'justify-end' : 'justify-start'}`}>
                                    <Skeleton className="h-14 w-14 rounded-2xl" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                                <Skeleton className="h-8 w-40 mb-2 ml-auto mr-0" />
                                <Skeleton className="h-4 w-64 ml-auto mr-0" />
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-border/60 z-10" />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
