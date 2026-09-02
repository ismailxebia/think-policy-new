import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const iowanOldStyle = localFont({
  src: "../../public/Bitstream_Iowan_Old_Style_BT.ttf",
  variable: "--font-iowan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Building a more inclusive climate governance that works for everyone in Jakarta | Think Policy",
  description: "Climate change does not affect everyone equally. Low-income communities, informal workers, women, older people, and persons with disabilities often face the greatest risks while having the least influence over climate decision-making.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${iowanOldStyle.variable}`}>
      <body className="antialiased min-h-screen bg-white text-[#18181B] selection:bg-[#E5E7EB] selection:text-[#18181B]">
        {children}
      </body>
    </html>
  );
}
