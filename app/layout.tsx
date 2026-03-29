import type { Metadata } from "next";
import { Providers } from "./providers";
import { Layout } from "@/components/layout/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Just Make Logo",
  description: "간단하고 빠르게 로고를 만들어보세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
