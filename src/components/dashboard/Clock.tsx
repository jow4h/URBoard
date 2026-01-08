"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

export default function Clock() {
    const { settings } = useSettings();
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

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(currentLang, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(currentLang, {
            day: "numeric",
            month: "long",
            weekday: "short",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center"
        >
            <span className="text-2xl font-bold tracking-[0.2em] font-mono text-white tabular-nums drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]">
                {formatTime(time)}
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium">
                {formatDate(time)}
            </span>
        </motion.div>
    );
}
