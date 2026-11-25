import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "../redux/ReduxProvider";

export const metadata: Metadata = {
  title: "ZHAEVAAH | Luxury Diamond & Gold Jewellery",
  description: "Exquisite handcrafted gold and diamond jewellery designed for timeless elegance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#1c1208] font-poppins">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
