import { UserContextProvider } from "@saas/auth/lib/user-context";
import type { PropsWithChildren } from "react";


export default async function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <UserContextProvider initialUser={null}>
      <div className="bg-cover bg-center bg-no-repeat bg-[#F7EBDF]">
        <main className="relative z-10 flex h-screen w-full items-baseline justify-center overflow-hidden bg-black/30">
          <div className="flex h-screen w-full items-baseline justify-center" style={{ width: `calc(100vh * ${1080 / 1920})` }}>
            {children}
          </div>
        </main>
      </div>
      <canvas id="printable" className="fixed z-[-1]" />
    </UserContextProvider>
  );
}
