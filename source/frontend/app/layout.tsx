'use client'

import './globals.css'
import Link from 'next/link'
import { User, Home, Bell } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <html lang="en">
      <body className="relative min-h-screen bg-white">
        {children}

        {/* Bottom Navbar */}
        {pathname !== '/' &&
          pathname !== '/login' &&
          pathname !== '/signup' &&
          pathname !== '/forgot-password' && (
            <nav className="fixed bottom-0 left-0 w-full bg-[#fefbf5] border-t border-gray-200 py-2 px-8 flex justify-between items-center z-50 shadow-inner">
              <Link href="/notifications" className="flex items-center justify-center transition-colors duration-200">
                <span className={`rounded-full p-2 ${isActive('/notifications') ? 'bg-[rgba(253,170,240,0.25)] text-[#cc6aa5]' : ' text-black hover:bg-[#fdd4f7]'}`}>
                  <Bell className="w-7 h-7" strokeWidth={2.5} />
                </span>
              </Link>

              <Link href="/home" className="flex items-center justify-center transition-colors duration-200">
                <span className={`rounded-full p-2 ${isActive('/home') ? 'bg-[rgba(255,204,102,0.25)] text-[#cc8400]' : ' text-black hover:bg-[#ffcc66]'}`}>
                  <Home className="w-7 h-7" strokeWidth={2.5} />
                </span>
              </Link>

              <Link href="/profile" className="flex items-center justify-center transition-colors duration-200">
                <span className={`rounded-full p-2 ${isActive('/profile') ? 'bg-[rgba(102,213,255,0.25)] text-[#0088dd]' : 'text-black hover:bg-[#66d5ff]'}`}>
                  <User className="w-7 h-7" strokeWidth={2.5} />
                </span>
              </Link>
            </nav>

          )}
      </body>
    </html>
  )
}
