// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import LenisProvider from '../app/component/LennisProvider';

export const metadata = {
  title: 'GRAPHIXPERT — Portfolio',
  description: 'Graphic designer portfolio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050506] text-slate-100 antialiased">
        <LenisProvider>
          <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-end gap-2">
                  <span className="text-white font-extrabold text-xl leading-none">GRAPHIX</span>
                  <span className="text-cyan-400 font-extrabold text-xl leading-none glow-cyan">XPERT</span>
                </Link>
              </div>

              <nav className="hidden md:flex items-center gap-4 text-sm text-slate-300">
                <Link href="/packaging" className="px-3 py-2 hover:text-white transition">Packaging</Link>
                <Link href="/thumbnails" className="px-3 py-2 hover:text-white transition">Thumbnails</Link>
                <Link href="/social" className="px-3 py-2 hover:text-white transition">Social</Link>
                <Link href="/infographics" className="px-3 py-2 hover:text-white transition">Infographics</Link>
                <Link href="/videos" className="px-3 py-2 hover:text-white transition">Videos</Link>
                <Link href="/flyers" className="px-3 py-2 hover:text-white transition">Flyers</Link>
                <Link href="/admin" className="ml-4 px-3 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400 transition">Admin</Link>
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
