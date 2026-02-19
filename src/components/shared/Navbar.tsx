import { MobileSidebar } from "./MobileSidebar"

export const Navbar = () => {
    return (
        <div className="flex items-center p-4">
            <MobileSidebar />
            <div className="flex w-full justify-end">
                <div className="w-8 h-8 rounded-full bg-zinc-800" /> {/* User Avatar Placeholder */}
            </div>
        </div>
    )
}
