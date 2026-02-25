'use client';

// @ts-nocheck
// Mock React hooks

// Mock NextJS Link component
const Link = ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>;

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">SmartAccounting AI</h1>
            <div className="space-x-4">
              <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link href="/companies" className="hover:text-blue-200">Companies</Link>
              <Link href="/products" className="hover:text-blue-200">Products</Link>
              <Link href="/reports" className="hover:text-blue-200">Reports</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}