import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BackendProvider } from '../context/MockBackendContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Speedride',
  description: 'Ride hailing platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BackendProvider>
          {children}
        </BackendProvider>
      </body>
    </html>
  );
}