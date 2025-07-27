import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import ModernCyberpunkNavbar from "@/components/Navbar"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GATE Tracker Pro",
  description: "Advanced GATE preparation tracker with analytics and gamification",
  generator: 'v0.dev',
  verification: {
    google: 'JdEoYvq_UkKpKgYKxMVX30tdY4ck2Y0TLoLTRW3EdeY'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>

    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3806295349516544"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3806295349516544"
          crossOrigin="anonymous"></script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TL4SFSY3SS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TL4SFSY3SS');
        `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider  attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
            
              <ModernCyberpunkNavbar />
          {children}
        </ThemeProvider>
        
        
      </body>
    </html>
     </ClerkProvider>

  )
}