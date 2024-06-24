import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Titan Search Challenge',
  description: 'Search for doctors and clinics in the US from the NPI registry',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={montserrat.className}>
    <main
      className="pt-16 pb-8 md:pt-20 md:pb-10 px-4 sm:px-8 md:px-12 xl:px-0 min-h-screen w-full max-w-[1200px] mx-auto">
      <Link href="/" className="block mx-auto w-full max-w-[500px] mb-10">
        <Image
          src="/titan_logo.png"
          alt="Titan Intake Logo"
          className="h-auto w-full"
          width={500}
          height={67}
          priority
        />
      </Link>

      {children}
    </main>
    </body>
    </html>
  );
}
