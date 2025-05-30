import "@livekit/components-styles";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assana Wellness - Colorectal & Gut Wellness Clinic",
  description: "Holistic colorectal and gut health treatments with lifestyle modification in Chennai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.className}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            background: white !important;
            min-height: 100vh;
          }
          
          [data-lk-theme="default"] {
            --lk-bg: transparent !important;
            background-color: transparent !important;
            color-scheme: light !important;
          }
          
          body, html, main, .lk-room-container {
            background-color: transparent !important;
          }
          
          .lk-agent-control-bar button {
            background-color: #f87171 !important;
            color: white !important;
            border: 1px solid #f56565 !important;
            border-radius: 9999px !important;
            padding: 8px 16px !important;
            font-weight: 500 !important;
          }
          
          .lk-agent-control-bar button:hover {
            background-color: #f56565 !important;
          }
          
          .lk-disconnect-button {
            background-color: #ef4444 !important;
            color: white !important;
            border: 1px solid #dc2626 !important;
            border-radius: 9999px !important;
            padding: 8px 16px !important;
            font-weight: 500 !important;
          }
          
          .lk-disconnect-button:hover {
            background-color: #dc2626 !important;
          }
        `}} />
      </head>
      <body className="h-full bg-white">
        {children}
      </body>
    </html>
  );
}
