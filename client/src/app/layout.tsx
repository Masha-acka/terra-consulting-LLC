import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Terra Consulting LLC | Premium Property Listings in Kenya",
  description: "Discover premium land, houses, and commercial properties across Kenya. Terra Consulting LLC - Your trusted partner in real estate.",
  keywords: ["Kenya real estate", "land for sale Kenya", "houses in Nairobi", "property listings", "Terra Consulting"],
  openGraph: {
    title: "Terra Consulting LLC | Premium Property Listings in Kenya",
    description: "Discover premium land, houses, and commercial properties across Kenya.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' } }} />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <WhatsAppFloat />
        </AuthProvider>
      </body>
    </html>
  );
}

