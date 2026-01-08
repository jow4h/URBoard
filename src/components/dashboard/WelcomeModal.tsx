"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, User, MapPin, ChevronRight } from "lucide-react";
import { useSettings, SearchEngine } from "@/context/SettingsContext";

export default function WelcomeModal() {
    const { settings, updateSettings, isLoaded, t, isExtension } = useSettings();
    const [step, setStep] = useState(2);
    const [show, setShow] = useState(false);

    // Form states
    const [city, setCity] = useState("");
    const [engine, setEngine] = useState<SearchEngine>("google");

    const [wallpaper, setWallpaper] = useState<"default" | "scifi" | "nature" | "abstract">("default");

    useEffect(() => {
        // Show only if not onboarded
        if (isLoaded && !settings.isOnboarded && !show) {
            const timer = setTimeout(() => setShow(true), 100);
            return () => clearTimeout(timer);
        }
    }, [isLoaded, settings.isOnboarded, show]);

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleComplete = () => {
        updateSettings({
            isOnboarded: true,
            weatherCity: city || "",
            searchEngine: engine,
            wallpaper: wallpaper
        });
        setShow(false);
    };

    if (!show) return null;

    const totalSteps = isExtension ? 5 : 4;
    const stepsToShow = isExtension ? [2, 3, 4, 5] : [2, 3, 4];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                />

                {/* Modal */}
                <motion.div
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="relative w-full max-w-lg bg-black/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(var(--accent-rgb),0.2)]"
                >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />

                    <div className="relative p-10">
                        {/* Progress Bars */}
                        <div className="flex gap-2 mb-10">
                            {stepsToShow.map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? "bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" : "bg-white/5"
                                        }`}
                                />
                            ))}
                        </div>





                        {/* Step 2: Details */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-light text-white">{t("whereDoYouLive")}</h3>
                                    <p className="text-white/40 text-sm mt-2">{t("citySubtext")}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder={t("cityInputPlaceholder")}
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleNext()}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent/40 transition-all text-white"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full !mt-12 bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-widest transition-all hover:bg-white/90"
                                >
                                    {t("continue")}
                                </button>
                            </motion.div>
                        )}

                        {/* Step 3: Wallpaper Selection */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-light text-white">{t("themeSelection")}</h3>
                                    <p className="text-white/40 text-sm mt-2">{t("themeSubtext")}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {([
                                        { id: "default", label: t("wallpaperDefault"), color: "bg-zinc-900" },
                                        { id: "scifi", label: t("wallpaperScifi"), color: "bg-indigo-900" },
                                        { id: "nature", label: t("wallpaperNature"), color: "bg-emerald-900" },
                                        { id: "abstract", label: t("wallpaperAbstract"), color: "bg-rose-900" },
                                    ] as const).map((w) => (
                                        <button
                                            key={w.id}
                                            onClick={() => setWallpaper(w.id)}
                                            className={`relative p-4 rounded-2xl border transition-all overflow-hidden group ${wallpaper === w.id
                                                ? "border-accent/40 shadow-lg shadow-accent/5"
                                                : "border-white/10 hover:border-white/20"
                                                }`}
                                        >
                                            <div className={`absolute inset-0 opacity-20 ${w.color}`} />
                                            <span className={`relative z-10 text-sm font-medium ${wallpaper === w.id ? "text-accent" : "text-white/60 group-hover:text-white"}`}>
                                                {w.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-3 !mt-12">
                                    <button
                                        onClick={() => isExtension ? handleNext() : handleComplete()}
                                        className="w-full bg-accent text-[var(--accent-contrast)] py-4 rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02]"
                                    >
                                        {isExtension ? t("continue") : t("readyStart")}
                                    </button>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="text-white/20 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                                    >
                                        {t("back")}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Color Selection */}
                        {step === 4 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-light text-white">{t("pickColor")}</h3>
                                    <p className="text-white/40 text-sm mt-2">{t("themeSubtext")}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-4 gap-3">
                                        {[
                                            "#ff0033", "#00f2ff", "#10b981", "#8b5cf6",
                                            "#f59e0b", "#ec4899", "#ff6b00", "#a3ff12"
                                        ].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => updateSettings({ accentColor: color })}
                                                className={`aspect-square rounded-full border transition-all flex items-center justify-center ${settings.accentColor === color
                                                    ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                    : "border-transparent hover:scale-110"
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            >
                                                {settings.accentColor === color && <div className="w-2 h-2 rounded-full bg-black/50" />}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
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

                                <div className="flex flex-col gap-3 !mt-8">
                                    <button
                                        onClick={() => isExtension ? handleNext() : handleComplete()}
                                        className="w-full bg-accent text-[var(--accent-contrast)] py-4 rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02]"
                                    >
                                        {isExtension ? t("continue") : t("readyStart")}
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="text-white/20 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                                    >
                                        {t("back")}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Search Engine (Extension Only) */}
                        {step === 5 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-light text-white">{t("searchEngineSelection")}</h3>
                                    <p className="text-white/40 text-sm mt-2">{t("searchEngineSubtext")}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {([
                                        { id: "google", label: "Google" },
                                        { id: "brave", label: "Brave" },
                                        { id: "duckduckgo", label: "DuckDuckGo" },
                                    ] as const).map((e) => (
                                        <button
                                            key={e.id}
                                            onClick={() => setEngine(e.id)}
                                            className={`p-4 rounded-2xl border transition-all text-sm font-medium ${engine === e.id
                                                ? "bg-accent/20 border-accent/40 text-accent shadow-lg shadow-accent/5"
                                                : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                                                }`}
                                        >
                                            {e.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-3 !mt-12">
                                    <button
                                        onClick={handleComplete}
                                        className="w-full bg-accent text-[var(--accent-contrast)] py-4 rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02]"
                                    >
                                        {t("readyGo")}
                                    </button>
                                    <button
                                        onClick={() => setStep(4)}
                                        className="text-white/20 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                                    >
                                        {t("back")}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
