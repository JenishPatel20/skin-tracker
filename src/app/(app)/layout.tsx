import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col pb-24">
      <main className="flex-1 max-w-lg mx-auto w-full">{children}</main>
      <BottomNav />
    </div>
  );
}
