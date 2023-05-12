import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter, IBM_Plex_Sans } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-primary"
});
const inter = Inter({ subsets: ["latin"], variable: "--font-secondary" });

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className={`${inter.variable} ${ibmPlexSans.variable}`}>
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  );
}
