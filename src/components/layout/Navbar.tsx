"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Rocket } from "lucide-react";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import Clock from "@/components/dashboard/Clock";
import { useSettings } from "@/context/SettingsContext";

interface NavbarProps {
    showClock?: boolean;
}

export default function Navbar({ showClock = true }: NavbarProps) {
    const { t } = useSettings();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 group cursor-pointer"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-accent/20 blur-lg rounded-full animate-pulse-glow" />
                        <Rocket className="text-accent relative z-10 group-hover:rotate-12 transition-transform duration-300" size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-white uppercase">
                        UR<span className="text-accent">BOARD</span>
                    </span>
                </motion.div>

                {showClock && (
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <Clock />
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                            title={t("settings")}
                        >
                            <Settings size={20} />
                        </button>
                    </motion.div>
                </div>
            </div>

            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </nav>
    );
}
