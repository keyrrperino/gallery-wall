import { UserContextProvider } from "@saas/auth/lib/user-context";
import { Footer } from "@saas/shared/components/Footer";
import type { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Layout({ children }: PropsWithChildren) {

  return (
    <UserContextProvider
      initialUser={null}
    >
      <div className="min-h-screen bg-muted">
        <main className="bg-muted">{children}</main>
        <Footer />
      </div>
    </UserContextProvider>
  );
}
