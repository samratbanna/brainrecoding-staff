import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from "./providers";
import { QueryClientProviderContainer } from "./queryClientProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Brain Recoding',
  description: `Brain Recoding - An IIT Alumni Venture \n\n Super Memory - Rapid Recall System पूरी किताब पेज नंबर सहित याद करें मात्र 24 Hours में`,
  openGraph: {
    images: 'assets/franchise.jpg',
  },
}


export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css" />
        <link rel="icon" href="assets/logo.jpg"/>
      </head>
      <body>
      <QueryClientProviderContainer>
        <Providers>
          {children}
        </Providers>
      </QueryClientProviderContainer>
      </body>
    </html>
  );
}
