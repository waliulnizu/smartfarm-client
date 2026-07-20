import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimalTypeProvider } from "@/context/AnimalTypeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "@/lib/providers";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartKhamar AI",
  description: "AI-powered livestock & poultry farm management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <AnimalTypeProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </AnimalTypeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
