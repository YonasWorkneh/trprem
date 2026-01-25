import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";
import MarketsContent from "@/app/components/market/MarketsContent";

export default function MarketsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <MarketsContent />
      </main>
      <BottomNavigation />
    </div>
  );
}
