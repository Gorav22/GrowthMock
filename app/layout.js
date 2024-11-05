import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ThemeProvider.tsx"
import { Icon } from "lucide-react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GrowthMock",
  description: "Created BY Gorav Jindal",
  Icon: "https://raw.githubusercontent.com/Gorav22/images/refs/heads/main/logo.png?token=GHSAT0AAAAAACUDVF34DAWRLW25F3FWWHHSZZJ3RWQ"
};

export default function RootLayout({ children }) {
  return (
    
    <ClerkProvider >
      <html lang="en">
        <body className={inter.className}>
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="white"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}
