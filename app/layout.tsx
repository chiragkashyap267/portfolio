// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import LenisProvider from "../app/component/LennisProvider";

export const metadata = {
  title: "GRAPHIXPERT — Portfolio",
  description: "Graphic designer portfolio",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050506] text-slate-100 antialiased">
        <LenisProvider>
          <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Logo */}
              <div className="flex items-center justify-between gap-6">
                <Link href="/" className="flex items-end gap-2">
                  <div className="inline-flex items-baseline justify-center lg:justify-start gap-1 italic font-semibold text-lg sm:text-xl tracking-wide">
                <span className="text-white">Graphi</span>
                <span className="text-cyan-400">XPERT</span>
              </div>

                </Link>
              </div>

              {/* NAV: always visible, wraps on mobile so all tabs can be seen */}
              <nav className="w-full sm:w-auto">
                <div className="flex flex-wrap md:flex-nowrap md:justify-end gap-1.5 sm:gap-3 text-[0.7rem] xs:text-xs sm:text-sm text-slate-300">
                   <Link href="/mockups" className="px-3 py-2 hover:text-white transition">Mockups</Link>
                  
                  <Link
                    href="/packaging"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded hover:text-white hover:bg-white/5 transition whitespace-nowrap"
                  >
                    Packaging
                  </Link>
                  <Link
                    href="/thumbnails"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded hover:text-white hover:bg-white/5 transition whitespace-nowrap"
                  >
                    Thumbnails
                  </Link>
                  <Link
                    href="/social"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded hover:text-white hover:bg-white/5 transition whitespace-nowrap"
                  >
                    Social
                  </Link>
                  <Link
                    href="/infographics"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded hover:text-white hover:bg-white/5 transition whitespace-nowrap"
                  >
                    Infographics
                  </Link>
                  <Link
                    href="/videos"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded hover:text-white hover:bg-white/5 transition whitespace-nowrap"
                  >
                    Videos
                  </Link>
                  <Link
                    href="/flyers"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded hover:text-white hover:bg-white/5 transition whitespace-nowrap"
                  >
                    Flyers
                  </Link>
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 sm:py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400 transition whitespace-nowrap"
                  >
                    Admin
                  </Link>
                  
                </div>
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="mt-16 py-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 text-sm text-slate-500">
              © {new Date().getFullYear()} Chirag Kashyap — GRAPHIXPERT
            </div>
          </footer>
        </LenisProvider>
      </body>
    </html>
  );
}
