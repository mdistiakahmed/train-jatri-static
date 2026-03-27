import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/topbar/Topbar";
import Footer from "@/components/footer/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import AdSense from "@/components/AdSense";
import GoogleAd from "@/components/google-ads/GoogleAd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Train Jatri | Bangladesh Railway Schedule & Train Routes",
  description:
    "Train Jatri provides accurate Bangladesh Railway train schedules, routes, and station information. Easily find train timings, departure details, and plan your journey across Bangladesh.",
  keywords: [
    "Bangladesh Railway",
    "train schedule",
    "train tickets",
    "Bangladesh trains",
    "railway information",
    "Dhaka train",
    "Chittagong train",
    "Sylhet train",
    "Khulna train",
    "train jatri",
    "Bangladesh railway schedule",
    "Bangladesh train ticket",
    "railway schedule Bangladesh",
  ],
  openGraph: {
    title: "Train Jatri | Bangladesh Railway Schedule & Train Routes",
    description:
      "Train Jatri provides accurate Bangladesh Railway train schedules, routes, and station information. Easily find train timings, departure details, and plan your journey across Bangladesh.",
    images: "/logo.png",
    url: "https://www.trainjatri.com",
    siteName: "Train Jatri",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Train Jatri | Bangladesh Railway Schedule & Train Routes",
    description:
      "Train Jatri provides accurate Bangladesh Railway train schedules, routes, and station information. Easily find train timings, departure details, and plan your journey across Bangladesh.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdSense />
      </head>
      <GoogleAnalytics gaId="G-HV8MP6T8X7" />
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Topbar />

        <div
          className={`flex justify-between bg-[url('/snowflakes.png')] bg-center`}
        >
          <div className="hidden md:block w-1/6 pt-36 ">
            {/* <GoogleAdWithSuspense>
                <ins
                  className="adsbygoogle"
                  style={{ display: "block" }}
                  data-ad-client="ca-pub-9851111861096184"
                  data-ad-slot="2756248511"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                ></ins>
              </GoogleAdWithSuspense> */}
          </div>
          <main className="flex-1">
            <p className="whitespace-nowrap text-end py-4 text-xs italic mr-4">Last Updated: 13th February, 2026</p>
            <div
              className="overflow-hidden w-full min-h-[430px] max-h-[430px] flex items-center justify-center"
            >
                <GoogleAd />
            </div>
            {children}
          </main>
          <div className="hidden md:block w-1/6 pt-36 pl-8">
              {/* <GoogleAdWithSuspense>
                <ins
                  className="adsbygoogle"
                  style={{ display: "block" }}
                  data-ad-client="ca-pub-9851111861096184"
                  data-ad-slot="6224720234"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                ></ins>
              </GoogleAdWithSuspense> */}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
