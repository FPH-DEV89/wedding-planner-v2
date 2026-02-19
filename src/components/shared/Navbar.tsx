import { MobileSidebar } from "./MobileSidebar"

export const Navbar = () => {
    return (
        <div className="flex items-center p-6 bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
            <MobileSidebar />
            <div className="flex w-full justify-end items-center gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-foreground">F. Philippe</p>
                    <p className="text-[10px] text-muted-foreground italic">Organisateur</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif font-bold shadow-sm">
                    FP
                </div>
            </div>
        </div>
    )
}
