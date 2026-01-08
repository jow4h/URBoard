"use client";

import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import LinksWidget from "@/components/widgets/LinksWidget";
import TodoWidget from "@/components/widgets/TodoWidget";
import PomodoroWidget from "@/components/widgets/PomodoroWidget";
import SpotifyWidget from "@/components/widgets/SpotifyWidget";
import SearchWidget from "@/components/widgets/SearchWidget";
import { Plus, X as CloseIcon, MapPin, Music, CheckSquare, Timer, Link as LinkIcon, Settings as SettingsIcon, Lock, LockOpen } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Default layouts are now handled via SettingsContext


export default function DashboardGrid() {
    const { settings, updateSettings, t } = useSettings();
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [activeSettingsWidget, setActiveSettingsWidget] = useState<string | null>(null);

    const toggleWidget = (id: string) => {
        const isActive = settings.activeWidgets.includes(id);
        const next = isActive
            ? settings.activeWidgets.filter((w) => w !== id)
            : [...settings.activeWidgets, id];
        updateSettings({ activeWidgets: next });
    };

    const onLayoutChange = (_currentLayout: unknown, allLayouts: unknown) => {
        updateSettings({ layouts: allLayouts as Record<string, any[]> });
    };

    return (
        <div className="h-auto bg-transparent relative z-10 flex flex-col">
            <SearchWidget />
            <ResponsiveGridLayout
                className="layout"
                layouts={settings.layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={50}
                onLayoutChange={onLayoutChange}
                draggableHandle=".widget-handle"
                margin={[24, 24]}
                isResizable={!settings.isLocked}
                isDraggable={!settings.isLocked}
                resizeHandles={['se', 'nw']}
            >
                {/* CSS to style standard RGL handles as custom red dots */}
                <style jsx global>{`
                    .react-grid-layout .react-resizable-handle {
                        width: 20px !important;
                        height: 20px !important;
                        background: transparent !important;
                        border: none !important;
                        position: absolute !important;
                        opacity: 0;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        z-index: 100 !important;
                        box-shadow: none !important;
                    }
                    /* Show on hover with a smooth fade-in and scale */
                    .react-grid-layout .group:hover .react-resizable-handle {
                        opacity: 0.6;
                    }
                    .react-grid-layout .react-resizable-handle:hover {
                        opacity: 1 !important;
                        transform: scale(1.1);
                    }
                    /* SE Handle (Bottom Right) - Harmonious Bracket */
                    .react-grid-layout .react-resizable-handle-se {
                        bottom: 8px !important;
                        right: 8px !important;
                        cursor: nwse-resize;
                        border-bottom: 3.5px solid rgba(var(--accent-rgb), 1) !important;
                        border-right: 3.5px solid rgba(var(--accent-rgb), 1) !important;
                        border-bottom-right-radius: 14px !important;
                        filter: drop-shadow(0 0 5px rgba(var(--accent-rgb), 0.5));
                    }
                    /* NW Handle (Top Left) - Harmonious Bracket */
                    .react-grid-layout .react-resizable-handle-nw {
                        top: 8px !important;
                        left: 8px !important;
                        cursor: nwse-resize;
                        border-top: 3.5px solid rgba(var(--accent-rgb), 1) !important;
                        border-left: 3.5px solid rgba(var(--accent-rgb), 1) !important;
                        border-top-left-radius: 14px !important;
                        filter: drop-shadow(0 0 5px rgba(var(--accent-rgb), 0.5));
                    }
                `}</style>

                {settings.activeWidgets.includes("weather") && (
                    <div key="weather" data-grid={{ x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 2 }} className="cursor-default group">
                        <div className="absolute top-3 right-3 z-[60] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setActiveSettingsWidget(activeSettingsWidget === "weather" ? null : "weather")}
                                className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${activeSettingsWidget === "weather" ? "bg-accent text-white" : "bg-black/40 text-white/60 hover:bg-white/10 hover:text-white"}`}
                            >
                                <SettingsIcon size={14} />
                            </button>
                            <button
                                onClick={() => toggleWidget("weather")}
                                className="p-1.5 bg-black/40 hover:bg-accent/80 text-white/60 hover:text-white rounded-lg backdrop-blur-md transition-all"
                            >
                                <CloseIcon size={14} />
                            </button>
                        </div>
                        <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                        </div>
                        <WeatherWidget isSettingsOpen={activeSettingsWidget === "weather"} onSettingsClose={() => setActiveSettingsWidget(null)} />
                    </div>
                )}

                {settings.activeWidgets.includes("links") && (
                    <div key="links" data-grid={{ x: 4, y: 0, w: 4, h: 4, minW: 2, minH: 2 }} className="cursor-default group">
                        <div className="absolute top-3 right-3 z-[60] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setActiveSettingsWidget(activeSettingsWidget === "links" ? null : "links")}
                                className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${activeSettingsWidget === "links" ? "bg-accent text-white" : "bg-black/40 text-white/60 hover:bg-white/10 hover:text-white"}`}
                            >
                                <SettingsIcon size={14} />
                            </button>
                            <button
                                onClick={() => toggleWidget("links")}
                                className="p-1.5 bg-black/40 hover:bg-accent/80 text-white/60 hover:text-white rounded-lg backdrop-blur-md transition-all"
                            >
                                <CloseIcon size={14} />
                            </button>
                        </div>
                        <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                        </div>
                        <LinksWidget isSettingsOpen={activeSettingsWidget === "links"} onSettingsClose={() => setActiveSettingsWidget(null)} />
                    </div>
                )}

                {settings.activeWidgets.includes("spotify") && (
                    <div key="spotify" data-grid={{ x: 8, y: 0, w: 4, h: 4, minW: 2, minH: 2 }} className="cursor-default group">
                        <div className="absolute top-3 right-3 z-[60] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setActiveSettingsWidget(activeSettingsWidget === "spotify" ? null : "spotify")}
                                className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${activeSettingsWidget === "spotify" ? "bg-accent text-white" : "bg-black/40 text-white/60 hover:bg-white/10 hover:text-white"}`}
                            >
                                <SettingsIcon size={14} />
                            </button>
                            <button
                                onClick={() => toggleWidget("spotify")}
                                className="p-1.5 bg-black/40 hover:bg-accent/80 text-white/60 hover:text-white rounded-lg backdrop-blur-md transition-all"
                            >
                                <CloseIcon size={14} />
                            </button>
                        </div>
                        <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                        </div>
                        <SpotifyWidget isSettingsOpen={activeSettingsWidget === "spotify"} onSettingsClose={() => setActiveSettingsWidget(null)} />
                    </div>
                )}

                {settings.activeWidgets.includes("todo") && (
                    <div key="todo" data-grid={{ x: 0, y: 4, w: 4, h: 6, minW: 2, minH: 2 }} className="cursor-default group">
                        <div className="absolute top-3 right-3 z-[60] opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => toggleWidget("todo")}
                                className="p-1.5 bg-black/40 hover:bg-accent/80 text-white/60 hover:text-white rounded-lg backdrop-blur-md transition-all"
                            >
                                <CloseIcon size={14} />
                            </button>
                        </div>
                        <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                        </div>
                        <TodoWidget />
                    </div>
                )}

                {settings.activeWidgets.includes("pomodoro") && (
                    <div key="pomodoro" data-grid={{ x: 4, y: 4, w: 4, h: 6, minW: 2, minH: 2 }} className="cursor-default group">
                        <div className="absolute top-3 right-3 z-[60] opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => toggleWidget("pomodoro")}
                                className="p-1.5 bg-black/40 hover:bg-accent/80 text-white/60 hover:text-white rounded-lg backdrop-blur-md transition-all"
                            >
                                <CloseIcon size={14} />
                            </button>
                        </div>
                        <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                        </div>
                        <PomodoroWidget />
                    </div>
                )}
            </ResponsiveGridLayout>



            {/* Add Widget Floating Button */}
            <div className="fixed bottom-10 right-10 z-[100]">
                <AnimatePresence>
                    {settings.activeWidgets.length === 0 && !showAddMenu && (
                        <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none p-4">
                            <motion.div
                                key="onboarding-hint"
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
                                }}
                                className="bg-black/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 max-w-lg text-center shadow-2xl space-y-6"
                            >
                                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                    <Plus className="w-10 h-10 text-accent" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase italic">{t("welcome")}</h2>
                                    <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed">
                                        {t("onboardingHint")}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {showAddMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="absolute bottom-16 right-0 w-64 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-2xl space-y-2"
                        >
                            <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/20 px-2 py-1">{t("addWidget")}</h3>
                            {[
                                { id: "weather", label: t("weather"), icon: MapPin },
                                { id: "links", label: t("links"), icon: LinkIcon },
                                { id: "spotify", label: t("spotify"), icon: Music },
                                { id: "todo", label: t("todo"), icon: CheckSquare },
                                { id: "pomodoro", label: t("pomodoro"), icon: Timer },
                            ].map((w) => {
                                const isActive = settings.activeWidgets.includes(w.id);
                                return (
                                    <button
                                        key={w.id}
                                        onClick={() => toggleWidget(w.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${isActive
                                            ? "bg-accent/10 border border-accent/20 text-white"
                                            : "bg-white/5 border border-transparent text-white/40 hover:bg-white/10"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <w.icon size={16} className={isActive ? "text-accent" : "text-white/20"} />
                                            <span className="text-sm font-medium">{w.label}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => updateSettings({ isLocked: !settings.isLocked })}
                    className={`absolute bottom-0 right-16 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${settings.isLocked ? "bg-accent text-[var(--accent-contrast)]" : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    title={settings.isLocked ? t("locked") : t("unlock")}
                >
                    {settings.isLocked ? <Lock size={20} /> : <LockOpen size={20} />}
                </button>

                <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 neon-glow ${showAddMenu ? "bg-white text-black rotate-45" : "bg-accent text-[var(--accent-contrast)]"
                        }`}
                >
                    <Plus size={32} />
                </button>
            </div>
        </div>
    );
}
