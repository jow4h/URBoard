"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, MapPin, Search, ChevronRight, ChevronLeft, Check, Sparkles, Wand2 } from "lucide-react";
import { useSettings, SearchEngine } from "@/context/SettingsContext";

const colors = [
    { name: "Neon Red", value: "#ff0033" },
    { name: "Cyber Blue", value: "#00f2ff" },
    { name: "Emerald", value: "#10b981" },
    { name: "Royal Purple", value: "#8b5cf6" },
    { name: "Amber Gold", value: "#f59e0b" },
    { name: "Hot Pink", value: "#ec4899" },
    { name: "Ghost Orange", value: "#ff6b00" },
    { name: "Lime Bolt", value: "#a3ff12" },
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
    const { settings, updateSettings, t } = useSettings();
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    const nextStep = () => setStep(s => Math.min(s + 1, totalSteps + 1));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleFinish = () => {
        updateSettings({ isOnboarded: true });
        onComplete();
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Welcome & Theme
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                                {t("themeSelection")}
                            </h2>
                            <p className="text-white/40 text-lg font-medium">{t("themeSubtext")}</p>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => updateSettings({ accentColor: color.value })}
                                    className={`aspect-square rounded-2xl border-4 transition-all flex items-center justify-center relative group ${settings.accentColor === color.value
                                        ? "border-white scale-110 shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]"
                                        : "border-transparent hover:scale-105"
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                >
                                    {settings.accentColor === color.value && (
                                        <div className="w-4 h-4 rounded-full bg-white mix-blend-difference" />
                                    )}
                                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 relative z-10">
                                <div className="w-12 h-12 rounded-xl border border-white/20 relative overflow-hidden flex-shrink-0">
                                    <input
                                        type="color"
                                        value={settings.accentColor}
                                        onChange={(e) => updateSettings({ accentColor: e.target.value })}
                                        className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer p-0 border-0 opacity-0"
                                    />
                                    <div className="w-full h-full" style={{ backgroundColor: settings.accentColor }} />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">{t("customColor")}</span>
                                    <span className="text-sm font-mono text-white/80">{settings.accentColor}</span>
                                </div>
                                <Wand2 className="text-white/20 group-hover:text-accent transition-colors" size={20} />
                            </div>
                        </div>
                    </motion.div>
                );

            case 2: // Weather
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                                {t("whereDoYouLive")}
                            </h2>
                            <p className="text-white/40 text-lg font-medium">{t("citySubtext")}</p>
                        </div>

                        <div className="relative group mt-12">
                            <div className="absolute inset-0 bg-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-accent">
                                    <MapPin size={24} />
                                </div>
                                <input
                                    type="text"
                                    value={settings.weatherCity}
                                    onChange={(e) => updateSettings({ weatherCity: e.target.value })}
                                    placeholder={t("cityInputPlaceholder")}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-3xl pl-16 pr-8 py-6 text-xl font-bold placeholder:text-white/10 focus:outline-none focus:border-accent/40 transition-all shadow-2xl"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-6 rounded-2xl bg-accent/5 border border-accent/10 text-accent/60 text-sm italic">
                            <Sparkles size={18} />
                            <span>{settings.weatherMinimalMode ? t("minimalMode") : "Full weather data will be synced automatically."}</span>
                        </div>
                    </motion.div>
                );

            case 3: // Search Engine
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                                {t("searchEngineSelection")}
                            </h2>
                            <p className="text-white/40 text-lg font-medium">{t("searchEngineSubtext")}</p>
                        </div>

                        <div className="grid gap-4 mt-8">
                            {(["google", "brave", "duckduckgo"] as SearchEngine[]).map((engine) => (
                                <button
                                    key={engine}
                                    onClick={() => updateSettings({ searchEngine: engine })}
                                    className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all group ${settings.searchEngine === engine
                                        ? "border-accent bg-accent/10 shadow-[0_0_40px_rgba(var(--accent-rgb),0.1)]"
                                        : "border-white/5 bg-white/5 hover:border-white/20"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${settings.searchEngine === engine ? "bg-accent text-[var(--accent-contrast)]" : "bg-white/10 text-white/40"}`}>
                                            <Search size={24} />
                                        </div>
                                        <span className="text-xl font-black uppercase tracking-widest">{engine}</span>
                                    </div>
                                    {settings.searchEngine === engine && (
                                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[var(--accent-contrast)] shadow-lg shadow-accent/40">
                                            <Check size={20} strokeWidth={4} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );

            case 4: // Wallpaper Selection
                const wallpapers = [
                    { id: "default", label: t("wallpaperDefault"), url: "" },
                    { id: "scifi", label: t("wallpaperScifi"), url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" },
                    { id: "nature", label: t("wallpaperNature"), url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=2000" },
                    { id: "abstract", label: t("wallpaperAbstract"), url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=2000" },
                    { id: "custom", label: t("wallpaperCustom"), url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000" },
                ];
                return (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                                {t("wallpaper")}
                            </h2>
                            <p className="text-white/40 text-lg font-medium">{t("themeSubtext")}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {wallpapers.map((wp) => (
                                <button
                                    key={wp.id}
                                    onClick={() => updateSettings({ wallpaper: wp.id as any })}
                                    className={`relative group h-24 rounded-2xl border-2 overflow-hidden transition-all ${settings.wallpaper === wp.id
                                        ? "border-accent shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)] scale-[1.02]"
                                        : "border-white/5 grayscale hover:grayscale-0 hover:border-white/20"
                                        }`}
                                >
                                    {wp.url ? (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${wp.url})` }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-black" />
                                    )}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity ${settings.wallpaper === wp.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-white">{wp.label}</span>
                                        {settings.wallpaper === wp.id && (
                                            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[var(--accent-contrast)]">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {settings.wallpaper === "custom" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-accent">
                                        <Wand2 size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={settings.customWallpaperUrl}
                                        onChange={(e) => updateSettings({ customWallpaperUrl: e.target.value })}
                                        placeholder={t("customUrl")}
                                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-16 pr-6 py-4 text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-accent/40 transition-all shadow-xl"
                                        autoFocus
                                    />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                );

            case 5: // Completion
                return (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center space-y-8"
                    >
                        <div className="w-32 h-32 rounded-[2.5rem] bg-accent/20 flex items-center justify-center mx-auto relative group">
                            <div className="absolute inset-0 bg-accent/20 blur-3xl animate-pulse" />
                            <Check className="w-16 h-16 text-accent relative z-10" strokeWidth={3} />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                                {t("readyGo").split("!")[0]}!
                            </h2>
                            <p className="text-white/40 text-xl font-medium">{t("readyGo").split("!")[1] || "All systems normalized. Dashboard initialized."}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 mt-12 max-w-sm mx-auto">
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.accentColor }} />
                                <span className="text-[8px] uppercase font-black text-white/20 tracking-widest">Theme</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <MapPin size={10} className="text-white/20" />
                                <span className="text-[8px] uppercase font-black text-white/20 tracking-widest">{settings.weatherCity || "Global"}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Search size={10} className="text-white/20" />
                                <span className="text-[8px] uppercase font-black text-white/20 tracking-widest">{settings.searchEngine}</span>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020202]">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
                    style={{ backgroundColor: settings.accentColor }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="w-full max-w-2xl relative z-10 flex flex-col h-[700px]">
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? "w-8 bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" : "w-4 bg-white/10"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40">Step 0{step} / 05</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between pt-12 mt-12 border-t border-white/5">
                    <button
                        onClick={prevStep}
                        className={`group flex items-center gap-3 px-6 py-3 rounded-2xl hover:bg-white/5 transition-all ${step === 1 ? "opacity-0 pointer-events-none" : ""
                            }`}
                    >
                        <ChevronLeft size={20} className="text-white/40 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                        <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{t("back")}</span>
                    </button>

                    <button
                        onClick={step === 5 ? handleFinish : nextStep}
                        className="group flex items-center gap-4 px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 text-xs uppercase tracking-widest group-hover:text-[var(--accent-contrast)] transition-colors">
                            {step === 5 ? t("readyGo").split("!")[0] : t("continue")}
                        </span>
                        <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform group-hover:text-[var(--accent-contrast)]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
