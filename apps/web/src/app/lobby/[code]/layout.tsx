import { WalletProvider } from "@/contexts/wallet-context";
import { WalletHeader } from "@/components/wallet/wallet-header";

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-background">
        <WalletHeader />
        <main>{children}</main>
      </div>
    </WalletProvider>
  );
}
