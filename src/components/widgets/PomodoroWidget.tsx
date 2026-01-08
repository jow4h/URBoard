"use client";

import { useState, useEffect } from "react";
import { Timer, Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import WidgetWrapper from "@/components/dashboard/WidgetWrapper";
import { useSettings } from "@/context/SettingsContext";

export default function PomodoroWidget() {
    const { t } = useSettings();
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"work" | "break">("work");

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            const nextMode = mode === "work" ? "break" : "work";
            setMode(nextMode);
            setTimeLeft(nextMode === "work" ? 25 * 60 : 5 * 60);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <WidgetWrapper title={t("pomodoro")} icon={<Timer size={18} />}>
            <div className="flex flex-col items-center justify-center h-full gap-6">
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button
                        onClick={() => { setMode("work"); setTimeLeft(25 * 60); setIsActive(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'work' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/40 hover:text-white'}`}
                    >
                        <Brain size={14} /> {t("focus")}
                    </button>
                    <button
                        onClick={() => { setMode("break"); setTimeLeft(5 * 60); setIsActive(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'break' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/40 hover:text-white'}`}
                    >
                        <Coffee size={14} /> {t("break")}
                    </button>
                </div>

                <div className="relative group">
                    <div className={`absolute inset-0 bg-accent/20 blur-3xl rounded-full transition-opacity duration-1000 ${isActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
                    <div className="relative text-6xl font-light tracking-tighter tabular-nums text-white">
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTimer}
                        className={`p-4 rounded-full transition-all ${isActive ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-accent text-white shadow-lg shadow-accent/30 scale-110'}`}
                    >
                        {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="p-4 rounded-full bg-white/5 text-white/40 hover:text-white transition-all"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>
        </WidgetWrapper>
    );
}
