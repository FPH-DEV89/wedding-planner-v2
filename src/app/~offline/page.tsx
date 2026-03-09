import { WifiOff, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-rose-50/30 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-rose-100 max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-rose-100 rounded-full blur-xl opacity-50"></div>
                        <div className="h-24 w-24 bg-white rounded-full border border-rose-100 flex items-center justify-center relative z-10">
                            <WifiOff className="h-10 w-10 text-rose-300" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-full border border-rose-100 flex items-center justify-center z-20">
                            <HeartHandshake className="h-5 w-5 text-navy-600" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="font-playfair text-3xl font-bold text-slate-800">
                        Connexion Perdue
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Il semblerait que vous soyez hors ligne. Les données s'actualiseront automatiquement dès le retour de votre connexion.
                    </p>
                </div>

                <div className="pt-4">
                    <Button
                        asChild
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full h-12"
                    >
                        <Link href="/">
                            Réessayer d'accéder au Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
