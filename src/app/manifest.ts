import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Wedding Planner',
        short_name: 'WP App',
        description: 'L\'outil ultime pour planifier votre mariage parfait.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#f4f4f5',
        icons: [
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
