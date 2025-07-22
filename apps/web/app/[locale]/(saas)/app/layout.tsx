import { UserContextProvider } from "@saas/auth/lib/user-context";
import type { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Layout({ children }: PropsWithChildren) {

  return (
    <UserContextProvider
      initialUser={null}
    >
      <div className="bg-muted">
        <main className="h-screen w-full items-baseline justify-center overflow-auto bg-black">
          {children}
        </main>
      </div>
    </UserContextProvider>
  );
}
