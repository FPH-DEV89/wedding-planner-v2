import { Sidebar } from "@/components/shared/Sidebar"
import { Navbar } from "@/components/shared/Navbar"
import { BottomNav } from "@/components/shared/BottomNav"
import { QuickAddDial } from "@/components/shared/QuickAddDial"
import { AiChatWidget } from "@/components/ai/ai-chat-widget"

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 pb-20 md:pb-0">
                <Navbar />
                {children}
            </main>
            <BottomNav />
            <QuickAddDial />
            <AiChatWidget />
        </div>
    )
}

export default DashboardLayout


