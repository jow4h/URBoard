"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Rocket, Edit2, Plus, Clock, AlignCenter, Link2, Music, CheckSquare, Timer, StickyNote } from "lucide-react";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import { useSettings } from "@/context/SettingsContext";

export default function Navbar({ showClock = true, showActions = true }: { showClock?: boolean, showActions?: boolean }) {
    const { settings, updateSettings, t, toggleWidget } = useSettings();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [addMenuOpen, setAddMenuOpen] = useState(false);

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


                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {showActions && !settings.isLocked && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.5, x: 20 }}
                                className="relative z-50"
                            >
                                <button
                                    onClick={() => setAddMenuOpen(!addMenuOpen)}
                                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${addMenuOpen
                                        ? "bg-white text-black shadow-white/20"
                                        : "bg-accent/20 text-accent border border-accent/20 hover:bg-accent hover:text-[var(--accent-contrast)]"
                                        }`}
                                >
                                    <Plus size={16} className={addMenuOpen ? "rotate-45 transition-transform" : "transition-transform"} />
                                    <span className="uppercase tracking-wider text-xs">{t("addWidget")}</span>
                                </button>

                                <AnimatePresence>
                                    {addMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-12 right-0 w-64 bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1"
                                        >
                                            {[
                                                { id: "clock", label: t("clock"), icon: Clock },
                                                { id: "weather", label: t("weather"), icon: AlignCenter },
                                                { id: "links", label: t("links"), icon: Link2 },
                                                { id: "spotify", label: t("spotify"), icon: Music },
                                                { id: "todo", label: t("todo"), icon: CheckSquare },
                                                { id: "pomodoro", label: t("pomodoro"), icon: Timer },
                                                { id: "notes", label: t("notes"), icon: StickyNote },
                                            ].map((w) => {
                                                const isActive = settings.activeWidgets.includes(w.id);
                                                return (
                                                    <button
                                                        key={w.id}
                                                        onClick={() => toggleWidget(w.id)}
                                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${isActive
                                                            ? "bg-accent text-[var(--accent-contrast)] shadow-lg shadow-accent/20"
                                                            : "hover:bg-white/5 text-white/40 hover:text-white"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <w.icon size={16} strokeWidth={2.5} />
                                                            <span className="text-xs font-bold uppercase tracking-widest">{w.label}</span>
                                                        </div>
                                                        {isActive && <div className="w-1.5 h-1.5 bg-[var(--accent-contrast)] rounded-full" />}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-1 rounded-2xl border border-white/5"
                    >
                        {/* Edit Mode Toggle */}
                        {showActions && (
                            <>
                                <button
                                    onClick={() => updateSettings({ isLocked: !settings.isLocked })}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${!settings.isLocked
                                        ? "bg-accent text-[var(--accent-contrast)] shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <Edit2 size={14} />
                                    {settings.isLocked ? t("edit") : t("done")}
                                </button>

                                <div className="w-px h-4 bg-white/10" />
                            </>
                        )}

                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className={`p-2 rounded-xl transition-all ${isSettingsOpen
                                ? "bg-white text-black"
                                : "text-white/40 hover:text-white hover:bg-white/5"
                                }`}
                            title={t("settings")}
                        >
                            <Settings size={18} />
                        </button>
                    </motion.div>
                </div>
            </div>

            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </nav>
    );
}
