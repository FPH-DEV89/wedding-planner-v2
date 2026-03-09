"use server";

import webpush from "web-push";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

webpush.setVapidDetails(
    "mailto:contact@weddingplanner.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function subscribeUser(sub: webpush.PushSubscription) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Save the subscription to DB
    // @ts-ignore
    await prisma.pushSubscription.upsert({
        where: { endpoint: sub.endpoint },
        create: {
            endpoint: sub.endpoint,
            p256dh: sub.keys.p256dh,
            auth: sub.keys.auth,
            userId: session.user.id,
        },
        update: {
            p256dh: sub.keys.p256dh,
            auth: sub.keys.auth,
            userId: session.user.id,
        },
    });

    return { success: true };
}

export async function sendNotificationToUser(userId: string, title: string, body: string) {
    // @ts-ignore
    const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
    });

    if (subscriptions.length === 0) return { success: false, message: "No subscriptions" };

    const payload = JSON.stringify({ title, body, icon: "/icons/icon-192x192.png" });

    const notifications = subscriptions.map((sub: { endpoint: string; p256dh: string; auth: string }) => {
        const pushSub = {
            endpoint: sub.endpoint,
            keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
            },
        };
        return webpush.sendNotification(pushSub, payload).catch((err) => {
            console.error("Error sending push notification to endpoint:", sub.endpoint, err);
            // Optional: Delete expired subscriptions from the DB here
            if (err.statusCode === 410 || err.statusCode === 404) {
                // @ts-ignore
                return prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } });
            }
        });
    });

    await Promise.all(notifications);
    return { success: true };
}
