import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xeno CRM",
  description: "AI-native marketing CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-white">
        {/* Navbar */}
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-bold text-white text-lg">Xeno CRM</span>
              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">AI</span>
            </Link>
            <div className="flex items-center gap-1">
              {[
                { href: '/', label: 'Dashboard', icon: '🏠' },
                { href: '/customers', label: 'Customers', icon: '👥' },
                { href: '/campaigns', label: 'Campaigns', icon: '📢' },
                { href: '/ai', label: 'AI Assistant', icon: '🤖' },
                { href: '/analytics', label: 'Analytics', icon: '📊' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all text-sm"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}