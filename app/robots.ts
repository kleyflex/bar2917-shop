import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

// Индексация сайта
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/users', '/order-history', '/order', '/auth', '/thanks']
        },
        sitemap: `${SITE_URL}/sitemap.xml`
    };
}
