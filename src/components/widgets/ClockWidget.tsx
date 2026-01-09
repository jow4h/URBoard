"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import WidgetWrapper from "@/components/dashboard/WidgetWrapper";
import { Clock as ClockIcon, Check } from "lucide-react";

function ClockSettings({ settings, onUpdate, t }: {
    settings: any,
    onUpdate: (style: any) => void,
    t: (key: any) => string
}) {
    return (
        <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 text-accent">
                <ClockIcon size={18} />
                <h4 className="text-xs font-bold uppercase tracking-widest">{t("clock")}</h4>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] text-white/40 uppercase font-bold pl-1">{t("appearance")}</label>
                <div className="grid grid-cols-1 gap-2">
                    {(["modern", "retro", "neon", "glitch"] as const).map((style) => (
                        <button
                            key={style}
                            onClick={() => onUpdate({ clockStyle: style })}
                            className={`w-full py-3 px-4 rounded-xl flex items-center justify-between transition-all border ${settings.clockStyle === style
                                ? "bg-accent/10 border-accent/40 text-white shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]"
                                : "bg-white/5 border-white/5 hover:bg-white/10 text-white/40 hover:text-white"
                                }`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">{t(style as any) || style}</span>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${settings.clockStyle === style ? 'bg-accent border-accent text-[var(--accent-contrast)]' : 'border-white/20'
                                }`}>
                                {settings.clockStyle === style && <Check size={10} strokeWidth={4} />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ClockWidget({ isSettingsOpen, onSettingsClose }: { isSettingsOpen?: boolean; onSettingsClose?: () => void }) {
    const { settings, updateSettings, t } = useSettings();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const langMap: Record<string, string> = {
        tr: "tr-TR",
        en: "en-US",
        ru: "ru-RU",
        de: "de-DE"
    };

    const currentLang = langMap[settings.language] || "en-US";

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(currentLang, {
            day: "numeric",
            month: "long",
            weekday: "long",
        });
    };

    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");

    const renderContent = () => {
        if (isSettingsOpen) {
            return (
                <ClockSettings
                    settings={settings}
                    onUpdate={updateSettings}
                    t={t}
                />
            );
        }

        return (
            <div className="h-full flex flex-col items-center justify-evenly p-2 w-full relative overflow-hidden">
                {(() => {
                    switch (settings.clockStyle) {
                        case "retro": // Flip clock style
                            return (
                                <div className="flex flex-col items-center justify-center gap-[4cqmin] w-full h-full">
                                    <span className="text-[3cqmin] uppercase font-black tracking-[0.3em] text-white/20 mb-1 whitespace-nowrap">
                                        {formatDate(time)}
                                    </span>
                                    <div className="flex items-center gap-[1.5cqmin] w-full justify-center">
                                        <div className="flex flex-col items-center gap-[1cqmin] flex-1 max-w-[20cqmin]">
                                            <div className="bg-[#0a0a0a] rounded-[1cqmin] border border-white/10 shadow-2xl p-[1cqmin] w-full text-center">
                                                <span className="text-[10cqmin] font-black text-white tabular-nums leading-none">{hours}</span>
                                            </div>
                                            <span className="text-[2cqmin] font-black tracking-[0.4em] text-white/20 uppercase">HRS</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-[1cqmin] flex-1 max-w-[20cqmin]">
                                            <div className="bg-[#0a0a0a] rounded-[1cqmin] border border-white/10 shadow-2xl p-[1cqmin] w-full text-center">
                                                <span className="text-[10cqmin] font-black text-white tabular-nums leading-none">{minutes}</span>
                                            </div>
                                            <span className="text-[2cqmin] font-black tracking-[0.4em] text-white/20 uppercase">MIN</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-[1cqmin] flex-1 max-w-[20cqmin]">
                                            <div className="bg-[#0a0a0a] rounded-[1cqmin] border border-white/10 shadow-2xl p-[1cqmin] w-full text-center">
                                                <span className="text-[10cqmin] font-black text-accent tabular-nums leading-none">{seconds}</span>
                                            </div>
                                            <span className="text-[2cqmin] font-black tracking-[0.4em] text-white/20 uppercase">SEC</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        case "neon": // Neon glow style
                            return (
                                <div className="flex flex-col items-center justify-center gap-2 h-full w-full">
                                    <div className="relative flex items-center justify-center">
                                        <span className="text-[22cqmin] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] leading-none">
                                            {hours}:{minutes}
                                        </span>
                                        <span className="absolute -bottom-1 -right-4 text-[6cqmin] font-black text-accent drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.8)] tabular-nums">
                                            {seconds}
                                        </span>
                                    </div>
                                    <div className="px-[3cqmin] py-[0.5cqmin] rounded-full border border-accent/20 bg-accent/5 shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)]">
                                        <span className="text-[3.5cqmin] uppercase font-bold tracking-[0.3em] text-accent whitespace-nowrap">
                                            {formatDate(time)}
                                        </span>
                                    </div>
                                </div>
                            );
                        case "glitch": // Cyberpunk glitch style
                            return (
                                <div className="flex flex-col items-center justify-center gap-2 h-full w-full relative">
                                    <div className="relative group">
                                        <span className="text-[22cqmin] font-black tracking-tighter text-white tabular-nums relative z-10 mix-blend-difference leading-none">
                                            {hours}:{minutes}
                                        </span>
                                        <span className="text-[22cqmin] font-black tracking-tighter text-red-500 tabular-nums absolute top-0 left-[0.2cqmin] opacity-70 animate-pulse z-0 leading-none">
                                            {hours}:{minutes}
                                        </span>
                                        <span className="text-[22cqmin] font-black tracking-tighter text-blue-500 tabular-nums absolute top-0 -left-[0.2cqmin] opacity-70 animate-pulse delay-75 z-0 leading-none">
                                            {hours}:{minutes}
                                        </span>
                                    </div>
                                    <span className="text-[3.5cqmin] font-mono text-accent uppercase tracking-widest bg-black/50 px-[2cqmin] py-[0.5cqmin] whitespace-nowrap">
                                        {formatDate(time)}
                                    </span>
                                </div>
                            );
                        case "modern":
                        default:
                            return (
                                <div className="flex flex-col items-center justify-center h-full w-full gap-[2cqmin]">
                                    <div className="relative group flex items-center justify-center w-full">
                                        <span className="text-[22cqmin] font-black tracking-tighter text-white tabular-nums relative z-10 leading-none">
                                            {hours}:{minutes}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center w-full">
                                        <span className="text-[3cqmin] uppercase font-black tracking-[0.3em] text-white/40 whitespace-nowrap mb-1">
                                            {formatDate(time)}
                                        </span>
                                        <div className="w-[85%] max-w-[220px] h-[1.5cqmin] bg-white/5 rounded-full mt-2 relative overflow-hidden backdrop-blur-sm shadow-inner">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-accent transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(var(--accent-rgb),0.8)] rounded-full"
                                                style={{ width: `${(parseInt(seconds) / 60) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                    }
                })()}
            </div>
        );
    };

    return (
        <WidgetWrapper
            title={t("clock")}
            icon={<ClockIcon size={14} />}
            className="@container"
        >
            {renderContent()}
        </WidgetWrapper>
    );
}
