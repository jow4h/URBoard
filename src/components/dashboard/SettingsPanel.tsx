"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, Search, Globe, Image as ImageIcon } from "lucide-react";
import { useSettings, SearchEngine } from "@/context/SettingsContext";
import { Language } from "@/lib/translations";

const languages: { name: string; value: Language }[] = [
    { name: "Türkçe", value: "tr" },
    { name: "English", value: "en" },
    { name: "Русский", value: "ru" },
    { name: "Deutsch", value: "de" },
];

const wallpapers = [
    { name: "Default", value: "default", icon: "⬛" },
    { name: "Sci-Fi", value: "scifi", icon: "🚀" },
    { name: "Nature", value: "nature", icon: "🌲" },
    { name: "Abstract", value: "abstract", icon: "🎨" },
];

const colors = [
    { name: "Neon Red", value: "#ff0033" },
    { name: "Cyber Blue", value: "#00f2ff" },
    { name: "Emerald", value: "#10b981" },
    { name: "Royal Purple", value: "#8b5cf6" },
    { name: "Amber Gold", value: "#f59e0b" },
    { name: "Hot Pink", value: "#ec4899" },
    { name: "Ghost Orange", value: "#ff6b00" },
    { name: "Lime Bolt", value: "#a3ff12" },
    { name: "Pure White", value: "#ffffff" },
];

export default function SettingsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { settings, updateSettings, t, isExtension, updateAvailable } = useSettings();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-white/10 bg-black/80 backdrop-blur-2xl flex flex-col"
                    >
                        <div className="p-8 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tighter uppercase italic">{t("settings")}</h2>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {updateAvailable && (
                            <div className="bg-accent/10 border-b border-accent/20 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-accent/20 rounded-lg text-accent animate-pulse">
                                        <Globe size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-white mb-1">{t("updateAvailableTitle")}</h3>
                                        <p className="text-xs text-white/60 mb-3">{t("updateAvailableDesc")} (v{updateAvailable})</p>
                                        <a
                                            href="https://ur-board.vercel.app/"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block w-full py-2 text-center bg-accent text-[var(--accent-contrast)] text-xs font-bold uppercase rounded-lg hover:bg-accent/80 transition-colors"
                                        >
                                            {t("downloadUpdate")}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                            {/* Theme Settings */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-accent">
                                    <Palette size={18} />
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{t("appearance")}</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-5 gap-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => updateSettings({ accentColor: color.value })}
                                                className={`aspect-square rounded-full border-2 transition-all flex items-center justify-center ${settings.accentColor === color.value
                                                    ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                    : "border-transparent hover:scale-110"
                                                    }`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            >
                                                {settings.accentColor === color.value && <div className="w-2 h-2 rounded-full bg-black/50" />}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 relative">
                                                <input
                                                    type="color"
                                                    value={settings.accentColor}
                                                    onChange={(e) => updateSettings({ accentColor: e.target.value })}
                                                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0 opacity-0"
                                                />
                                                <div
                                                    className="w-full h-full"
                                                    style={{ backgroundColor: settings.accentColor }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-xs uppercase font-bold text-white/40 block mb-1">{t("customColor")}</span>
                                                <span className="text-sm font-light text-white font-mono">{settings.accentColor}</span>
                                            </div>
                                            <input
                                                type="color"
                                                value={settings.accentColor}
                                                onChange={(e) => updateSettings({ accentColor: e.target.value })}
                                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="h-px bg-white/5" />

                            {/* Language Settings */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-accent">
                                    <Globe size={18} />
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{t("language")}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.value}
                                            onClick={() => updateSettings({ language: lang.value })}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${settings.language === lang.value
                                                ? "border-accent bg-accent/10"
                                                : "border-white/5 bg-white/5 hover:border-white/20"
                                                }`}
                                        >
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{lang.name}</span>
                                            {settings.language === lang.value && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {isExtension && (
                                <>
                                    <div className="h-px bg-white/5" />

                                    {/* Wallpaper Settings */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 text-accent">
                                            <ImageIcon size={18} />
                                            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{t("wallpaper")}</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {wallpapers.map((wp) => (
                                                <button
                                                    key={wp.value}
                                                    onClick={() => updateSettings({ wallpaper: wp.value as typeof settings.wallpaper })}
                                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${settings.wallpaper === wp.value
                                                        ? "border-accent bg-accent/10"
                                                        : "border-white/5 bg-white/5 hover:border-white/20"
                                                        }`}
                                                >
                                                    <span className="text-xl">{wp.icon}</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{wp.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="h-px bg-white/5" />

                                    {/* Search Engine Settings */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 text-accent">
                                            <Search size={18} />
                                            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{t("searchEngine")}</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(["google", "brave", "duckduckgo"] as SearchEngine[]).map((engine) => (
                                                <button
                                                    key={engine}
                                                    onClick={() => updateSettings({ searchEngine: engine })}
                                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${settings.searchEngine === engine
                                                        ? "border-accent bg-accent/10"
                                                        : "border-white/5 bg-white/5 hover:border-white/20"
                                                        }`}
                                                >
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{engine}</span>
                                                    {settings.searchEngine === engine && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                </>
                            )}
                        </div>

                        <div className="p-8 border-t border-white/5">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-accent text-[var(--accent-contrast)] font-bold rounded-2xl neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {t("saveAndClose")}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
