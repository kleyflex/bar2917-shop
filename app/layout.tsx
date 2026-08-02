import type { Metadata, Viewport } from 'next';
import { PropsWithChildren } from 'react';
import './globalStyles/adaptation.css';
import './globalStyles/cart-popup.css';
import './globalStyles/contacts.css';
import './globalStyles/delivery-info.css';
import './globalStyles/footer.css';
import './globalStyles/globals.css';
import './globalStyles/header.css';
import './globalStyles/mobile-menu.css';
import './globalStyles/normalize.css';
import './globalStyles/sidebar.css';
import Providers from "./providers/Providers";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bar2917 — суши-бар: роллы, суши, сеты',
    template: '%s | Bar2917'
  },
  description: 'Лучший суши-бар — Bar2917. Свежие и вкусные роллы, суши, сеты. Быстрая доставка.',
  keywords: ['суши', 'роллы', 'доставка суши', 'японская кухня', 'бар2917', 'bar2917', 'сеты роллов'],
  authors: [{ name: 'kleyfiex' }],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: 'website',
    siteName: 'Bar2917',
    locale: 'ru_RU'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children
}: PropsWithChildren<unknown>) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          {children}
        </Providers>
        <div id="modal"></div>
      </body>
    </html>
  )
}
