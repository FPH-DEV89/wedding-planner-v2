"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { subscribeUser } from "@/app/actions/push";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PushSubscription } from "web-push";

export function PushSubscriber() {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<globalThis.PushSubscription | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);
            checkSubscription();
        }
    }, []);

    async function checkSubscription() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.getSubscription();
            setSubscription(sub);
        } catch (e) {
            console.error("Error checking subscription", e);
        }
    }

    async function subscribeToPush() {
        setLoading(true);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                toast.error("Vous devez autoriser les notifications dans votre navigateur.");
                setLoading(false);
                return;
            }

            const registration = await navigator.serviceWorker.ready;

            // Unsubscribe existing if any, to refresh keys
            const existing = await registration.pushManager.getSubscription();
            if (existing) await existing.unsubscribe();

            const newSub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            });

            setSubscription(newSub);

            // Sending to our server
            const p256dh = newSub.getKey("p256dh");
            const auth = newSub.getKey("auth");

            if (!p256dh || !auth) throw new Error("Clés de cryptage manquantes.");

            // Cast to the web-push type format requested by our server action
            const serializedSub = {
                endpoint: newSub.endpoint,
                keys: {
                    p256dh: btoa(String.fromCharCode(...new Uint8Array(p256dh))),
                    auth: btoa(String.fromCharCode(...new Uint8Array(auth)))
                }
            };

            await subscribeUser(serializedSub as any);
            toast.success("Abonnement réussi pour les notifications Push !");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Erreur lors de l'abonnement Push.");
        } finally {
            setLoading(false);
        }
    }

    if (!isSupported) return null;

    return (
        <Button
            variant={subscription ? "outline" : "default"}
            onClick={subscribeToPush}
            disabled={loading || !!subscription}
            className={`rounded-full transition-all duration-300 ${!subscription ? "bg-rose-500 hover:bg-rose-600 shadow-sm" : "border-rose-100 text-rose-500"}`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : subscription ? (
                <Bell className="w-4 h-4 mr-2" />
            ) : (
                <BellOff className="w-4 h-4 mr-2" />
            )}
            {subscription ? "Notifications Activées" : "Activer les Alertes PWA"}
        </Button>
    );
}
