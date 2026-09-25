import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akhil — DevOps Engineer & Cloud Infrastructure Engineer",
  description:
    "DevOps and Cloud Infrastructure Engineer with 10+ years of experience in cloud platforms, Linux, automation, CI/CD, infrastructure and production systems.",
  keywords: [
    "DevOps",
    "Cloud Infrastructure",
    "AWS",
    "Azure",
    "Terraform",
    "Kubernetes",
    "Docker",
    "CI/CD",
    "Linux",
    "Production Systems",
  ],
  authors: [{ name: "Akhil K Anil" }],
  creator: "Akhil K Anil",
  openGraph: {
    title: "Akhil — DevOps Engineer & Cloud Infrastructure Engineer",
    description: "10+ Years building and automating resilient infrastructure that keeps applications alive.",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
        {children}
      </body>
    </html>
  );
}
