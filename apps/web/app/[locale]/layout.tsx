import { AnalyticsScript } from "@analytics";
import { Toaster } from "@ui/components/toaster";
import { cn } from "@ui/lib";
import type { Metadata } from "next";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { getMessagesForLocale } from "../../i18n";

import { ApiClientProvider } from "@shared/components/ApiClientProvider";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import "./loader.css";

export const metadata: Metadata = {
  title: {
    absolute: "Gallery Wall",
    default: "KIOSK",
    template: "%s | Gallery Wall",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = useLocale();

  if (params.locale !== locale) {
    notFound();
  }

  const messages = await getMessagesForLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased overscroll-none overflow-hidden"
        )}
      >
        <NextTopLoader color="var(--colors-primary)" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class">
            <ApiClientProvider>{children}</ApiClientProvider>
          </ThemeProvider>
          <Toaster />
        </NextIntlClientProvider>
        <AnalyticsScript />
      </body>
    </html>
  );
}
