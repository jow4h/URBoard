"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import LandingPage from "@/components/layout/LandingPage";
import WelcomeModal from "@/components/dashboard/WelcomeModal";
import { useSettings } from "@/context/SettingsContext";

import { useSearchParams } from "next/navigation";

const WALLPAPER_MAP = {
  scifi: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
  nature: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=2000",
  abstract: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=2000",
  default: "",
};

import { Suspense } from "react";

function HomeContent() {
  const { settings, isLoaded, t } = useSettings();
  const searchParams = useSearchParams();
  const [internalShowDashboard, setInternalShowDashboard] = useState(false);

  // Check if opened from extension
  const isExtension = searchParams.get("source") === "extension";

  // Revised logic: Only show dashboard if Extension, Demo, or explicit Onboarding.
  // Returning web visitors see the Promo page.
  const showDashboard = isExtension || (isLoaded && settings.isOnboarded && internalShowDashboard) || internalShowDashboard;

  if (!isLoaded) return <div className="min-h-screen bg-black" />;

  // If not in dashboard mode, show landing page
  if (!showDashboard) {
    return (
      <main className="relative h-screen bg-background text-foreground overflow-hidden">
        {/* Background Effects for Landing Page */}
        <div className="fixed inset-0 bg-[#020202]" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(var(--accent-rgb),0.15),transparent_70%)]" />
        <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="relative z-10 h-full">
          <Navbar showClock={false} />
          <LandingPage
            onGetStarted={() => setInternalShowDashboard(true)}
          />
        </div>
      </main>
    );
  }

  // Dashboard View
  const wallpaperUrl = WALLPAPER_MAP[settings.wallpaper as keyof typeof WALLPAPER_MAP];

  return (
    <main className="h-screen relative overflow-hidden bg-background">

      {/* Dynamic Wallpaper */}
      {wallpaperUrl && (
        <div
          className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out scale-105"
          style={{
            backgroundImage: `url(${wallpaperUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Multi-layer overlay for maximum premium feel */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
      )}

      <div className="relative z-10 h-full flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-24 pb-12 px-6">
          <DashboardGrid />
        </div>
        <WelcomeModal />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
