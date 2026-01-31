import { WalletProvider } from "@/contexts/wallet-context";

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-background">{children}</div>
    </WalletProvider>
  );
}
