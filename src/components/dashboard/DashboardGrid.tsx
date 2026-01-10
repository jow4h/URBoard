"use client";

import { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import WeatherWidget from "@/components/widgets/WeatherWidget";
import LinksWidget from "@/components/widgets/LinksWidget";
import TodoWidget from "@/components/widgets/TodoWidget";
import PomodoroWidget from "@/components/widgets/PomodoroWidget";
import SpotifyWidget from "@/components/widgets/SpotifyWidget";
import SearchWidget from "@/components/widgets/SearchWidget";
import NotesWidget from "@/components/widgets/NotesWidget";
import ClockWidget from "@/components/widgets/ClockWidget";
import { X as CloseIcon, Settings as SettingsIcon, Plus as PlusIcon } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { motion } from "framer-motion";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Default layouts are now handled via SettingsContext


export default function DashboardGrid() {
    const { settings, updateSettings, t, toggleWidget } = useSettings();
    const [activeSettingsWidget, setActiveSettingsWidget] = useState<string | null>(null);

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
                onResizeStart={() => document.body.style.userSelect = 'none'}
                onResizeStop={() => document.body.style.userSelect = ''}
                onDragStart={() => document.body.style.userSelect = 'none'}
                onDragStop={() => document.body.style.userSelect = ''}
                draggableHandle=".widget-handle"
                margin={[24, 24]}
                isResizable={!settings.isLocked}
                isDraggable={!settings.isLocked}
                resizeHandles={['se', 'nw', 'sw', 'ne']}
            >
                {/* CSS to style standard RGL handles as premium glowing orbs */}
                <style jsx global>{`
                    .react-grid-layout .react-resizable-handle {
                        width: 24px !important;
                        height: 24px !important;
                        background: transparent !important;
                        border: none !important;
                        position: absolute !important;
                        opacity: 0;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        z-index: 100 !important;
                        cursor: pointer !important;
                    }
                    /* Show handles on hover */
                    .react-grid-layout .group:hover .react-resizable-handle {
                        opacity: 1;
                    }
                    /* Handle interactions */
                    .react-grid-layout .react-resizable-handle:hover {
                        transform: scale(1.2);
                    }
                    .react-grid-layout .react-resizable-handle::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 12px;
                        height: 12px;
                        background-color: rgb(var(--accent-rgb));
                        border-radius: 50%;
                        box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.6), 0 0 20px rgba(var(--accent-rgb), 0.3);
                        border: 2px solid white;
                        transition: all 0.2s ease;
                    }
                    .react-grid-layout .react-resizable-handle:hover::after {
                        width: 16px;
                        height: 16px;
                        box-shadow: 0 0 15px rgba(var(--accent-rgb), 0.8), 0 0 30px rgba(var(--accent-rgb), 0.5);
                    }
                    
                    /* Positioning */
                    .react-grid-layout .react-resizable-handle-se { bottom: -6px !important; right: -6px !important; cursor: nwse-resize; }
                    .react-grid-layout .react-resizable-handle-sw { bottom: -6px !important; left: -6px !important; cursor: nesw-resize; }
                    .react-grid-layout .react-resizable-handle-nw { top: -6px !important; left: -6px !important; cursor: nwse-resize; }
                    .react-grid-layout .react-resizable-handle-ne { top: -6px !important; right: -6px !important; cursor: nesw-resize; }
                `}</style>

                {settings.activeWidgets.includes("clock") && (
                    <div key="clock" data-grid={{ x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 2 }} className="cursor-default group relative">
                        {!settings.isLocked && (
                            <>
                                <div className="absolute top-3 right-3 z-[60] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setActiveSettingsWidget(activeSettingsWidget === "clock" ? null : "clock")}
                                        className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${activeSettingsWidget === "clock" ? "bg-accent text-[var(--accent-contrast)]" : "bg-black/40 text-white/60 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <SettingsIcon size={14} />
                                    </button>
                                    <button
                                        onClick={() => toggleWidget("clock")}
                                        className="p-1.5 bg-black/40 hover:bg-accent hover:text-[var(--accent-contrast)] text-white/60 rounded-lg backdrop-blur-md transition-all"
                                    >
                                        <CloseIcon size={14} />
                                    </button>
                                </div>
                                <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                                </div>
                            </>
                        )}
                        <ClockWidget isSettingsOpen={activeSettingsWidget === "clock"} onSettingsClose={() => setActiveSettingsWidget(null)} />
                    </div>
                )}

                {settings.activeWidgets.includes("weather") && (
                    <div key="weather" data-grid={{ x: 4, y: 0, w: 4, h: 4, minW: 2, minH: 2 }} className="cursor-default group relative">
                        {!settings.isLocked && (
                            <>
                                <div className="absolute top-3 right-3 z-[60] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setActiveSettingsWidget(activeSettingsWidget === "weather" ? null : "weather")}
                                        className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${activeSettingsWidget === "weather" ? "bg-accent text-[var(--accent-contrast)]" : "bg-black/40 text-white/60 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <SettingsIcon size={14} />
                                    </button>
                                    <button
                                        onClick={() => toggleWidget("weather")}
                                        className="p-1.5 bg-black/40 hover:bg-accent hover:text-[var(--accent-contrast)] text-white/60 rounded-lg backdrop-blur-md transition-all"
                                    >
                                        <CloseIcon size={14} />
                                    </button>
                                </div>
                                <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                                </div>
                            </>
                        )}
                        <WeatherWidget isSettingsOpen={activeSettingsWidget === "weather"} onSettingsClose={() => setActiveSettingsWidget(null)} />
                    </div>
                )}

                {settings.activeWidgets.includes("links") && (
                    <div key="links" data-grid={{ x: 8, y: 0, w: 4, h: 4, minW: 2, minH: 2 }} className="cursor-default group relative">
                        {!settings.isLocked && (
                            <>
                                <div className="absolute top-3 right-3 z-[60] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setActiveSettingsWidget(activeSettingsWidget === "links" ? null : "links")}
                                        className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${activeSettingsWidget === "links" ? "bg-accent text-[var(--accent-contrast)]" : "bg-black/40 text-white/60 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <SettingsIcon size={14} />
                                    </button>
                                    <button
                                        onClick={() => toggleWidget("links")}
                                        className="p-1.5 bg-black/40 hover:bg-accent hover:text-[var(--accent-contrast)] text-white/60 rounded-lg backdrop-blur-md transition-all"
                                    >
                                        <CloseIcon size={14} />
                                    </button>
                                </div>
                                <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                                </div>
                            </>
                        )}
                        <LinksWidget isSettingsOpen={activeSettingsWidget === "links"} onSettingsClose={() => setActiveSettingsWidget(null)} />
                    </div>
                )}

                {settings.activeWidgets.includes("spotify") && (
                    <div key="spotify" data-grid={{ x: 0, y: 4, w: 4, h: 4, minW: 2, minH: 2 }} className="cursor-default group relative">
                        {!settings.isLocked && (
                            <>
                                <div className="absolute top-3 right-3 z-[60] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setActiveSettingsWidget(activeSettingsWidget === "spotify" ? null : "spotify")}
                                        className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${activeSettingsWidget === "spotify" ? "bg-accent text-[var(--accent-contrast)]" : "bg-black/40 text-white/60 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        <SettingsIcon size={14} />
                                    </button>
                                    <button
                                        onClick={() => toggleWidget("spotify")}
                                        className="p-1.5 bg-black/40 hover:bg-accent hover:text-[var(--accent-contrast)] text-white/60 rounded-lg backdrop-blur-md transition-all"
                                    >
                                        <CloseIcon size={14} />
                                    </button>
                                </div>
                                <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                                </div>
                            </>
                        )}
                        <SpotifyWidget isSettingsOpen={activeSettingsWidget === "spotify"} onSettingsClose={() => setActiveSettingsWidget(null)} />
                    </div>
                )}

                {settings.activeWidgets.includes("todo") && (
                    <div key="todo" data-grid={{ x: 4, y: 4, w: 4, h: 6, minW: 2, minH: 2 }} className="cursor-default group relative">
                        {!settings.isLocked && (
                            <>
                                <div className="absolute top-3 right-3 z-[60] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggleWidget("todo")}
                                        className="p-1.5 bg-black/40 hover:bg-accent hover:text-[var(--accent-contrast)] text-white/60 rounded-lg backdrop-blur-md transition-all"
                                    >
                                        <CloseIcon size={14} />
                                    </button>
                                </div>
                                <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                                </div>
                            </>
                        )}
                        <TodoWidget />
                    </div>
                )}

                {settings.activeWidgets.includes("pomodoro") && (
                    <div key="pomodoro" data-grid={{ x: 8, y: 4, w: 4, h: 6, minW: 2, minH: 2 }} className="cursor-default group relative">
                        {!settings.isLocked && (
                            <>
                                <div className="absolute top-3 right-3 z-[60] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggleWidget("pomodoro")}
                                        className="p-1.5 bg-black/40 hover:bg-accent hover:text-[var(--accent-contrast)] text-white/60 rounded-lg backdrop-blur-md transition-all"
                                    >
                                        <CloseIcon size={14} />
                                    </button>
                                </div>
                                <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                                </div>
                            </>
                        )}
                        <PomodoroWidget />
                    </div>
                )}

                {settings.activeWidgets.includes("notes") && (
                    <div key="notes" data-grid={{ x: 0, y: 8, w: 4, h: 6, minW: 2, minH: 2 }} className="cursor-default group relative">
                        {!settings.isLocked && (
                            <>
                                <div className="absolute top-3 right-3 z-[60] opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggleWidget("notes")}
                                        className="p-1.5 bg-black/40 hover:bg-accent hover:text-[var(--accent-contrast)] text-white/60 rounded-lg backdrop-blur-md transition-all"
                                    >
                                        <CloseIcon size={14} />
                                    </button>
                                </div>
                                <div className="widget-handle absolute top-0 left-0 right-0 z-50 h-8 cursor-grab flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-1 rounded-full bg-white/20 mt-2" />
                                </div>
                            </>
                        )}
                        <NotesWidget />
                    </div>
                )}
            </ResponsiveGridLayout>

            {/* Welcome / Onboarding Hint - Only visible when no widgets are active */}
            {settings.activeWidgets.length === 0 && (
                <div className="flex-1 min-h-[60vh] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center text-center max-w-lg shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center mb-8 relative">
                            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse" />
                            <PlusIcon className="w-10 h-10 text-accent relative z-10" />
                        </div>

                        <h2 className="text-4xl font-black italic tracking-tighter mb-4 uppercase">
                            {t("welcome")}
                        </h2>

                        <p className="text-white/60 text-xl leading-relaxed mb-8">
                            {t("onboardingHint")}
                        </p>

                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/40">
                            <SettingsIcon size={14} />
                            {t("edit")} {t("clickToStart")}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
