import { Inter as FontSans } from "next/font/google"
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster"

import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Shopify App",
  description: "Nextjs 14 shopify app",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/_favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
