import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ContentFilters from "./components/ContentFilters";
import BottomNavigation from "./components/BottomNavigation";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header title="trade prememium" />
      <main className="flex-1 pb-20">
        <HeroSection />
        <ContentFilters />
      </main>
      <BottomNavigation />
    </div>
  );
}