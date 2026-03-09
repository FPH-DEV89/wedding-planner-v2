import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, BackgroundSyncPlugin, NetworkOnly } from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: WorkerGlobalScope;

const bgSyncPlugin = new BackgroundSyncPlugin("offlineQueue", {
    maxRetentionTime: 24 * 60, // 24 hours
});

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        {
            matcher({ request }) {
                return ["POST", "PUT", "DELETE"].includes(request.method);
            },
            handler: new NetworkOnly({
                plugins: [bgSyncPlugin],
            }),
        },
        ...defaultCache,
    ],
    fallbacks: {
        entries: [
            {
                url: "/~offline",
                matcher({ request }) {
                    return request.destination === "document";
                },
            },
        ],
    },
});

serwist.addEventListeners();
