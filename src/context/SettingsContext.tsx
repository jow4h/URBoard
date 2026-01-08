"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, TranslationKey } from "@/lib/translations";

export interface ShortcutLink {
    id: string;
    name: string;
    url: string;
    icon?: string;
}

export type SearchEngine = "google" | "brave" | "duckduckgo";

interface Settings {
    accentColor: string;
    weatherCity: string;
    weatherMinimalMode: boolean;
    spotifyClientId: string;
    spotifyClientSecret: string;
    spotifyRefreshToken: string;
    userLinks: ShortcutLink[];
    searchEngine: SearchEngine;
    isOnboarded: boolean;
    activeWidgets: string[];
    isLocked: boolean;
    linksViewMode: "list" | "grid";
    language: Language;
    wallpaper: "default" | "scifi" | "nature" | "abstract";
    layouts?: Record<string, any[]>;
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
    isLoaded: boolean;
    isExtension: boolean;
    updateAvailable: string | null;
    t: (key: TranslationKey) => string;
}

const defaultLinks: ShortcutLink[] = [];

const defaultSettings: Settings = {
    accentColor: "#ff0033",
    weatherCity: "",
    weatherMinimalMode: false,
    spotifyClientId: "",
    spotifyClientSecret: "",
    spotifyRefreshToken: "",
    userLinks: defaultLinks,
    searchEngine: "google",
    isOnboarded: false,
    activeWidgets: [],
    isLocked: false,
    linksViewMode: "list",
    language: "tr", // Will be auto-detected in useEffect
    wallpaper: "default",
    layouts: {
        lg: [
            { i: "weather", x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 2 },
            { i: "links", x: 4, y: 0, w: 4, h: 4, minW: 2, minH: 2 },
            { i: "spotify", x: 8, y: 0, w: 4, h: 4, minW: 2, minH: 2 },
            { i: "todo", x: 0, y: 4, w: 4, h: 6, minW: 2, minH: 2 },
            { i: "pomodoro", x: 4, y: 4, w: 4, h: 6, minW: 2, minH: 2 },
        ],
        md: [
            { i: "weather", x: 0, y: 0, w: 5, h: 4, minW: 2, minH: 2 },
            { i: "links", x: 5, y: 0, w: 5, h: 4, minW: 2, minH: 2 },
            { i: "spotify", x: 0, y: 4, w: 5, h: 4, minW: 2, minH: 2 },
            { i: "todo", x: 5, y: 4, w: 5, h: 6, minW: 2, minH: 2 },
            { i: "pomodoro", x: 0, y: 8, w: 5, h: 6, minW: 2, minH: 2 },
        ],
        sm: [
            { i: "weather", x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
            { i: "links", x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
            { i: "spotify", x: 0, y: 4, w: 3, h: 4, minW: 2, minH: 2 },
            { i: "todo", x: 3, y: 4, w: 3, h: 6, minW: 2, minH: 2 },
            { i: "pomodoro", x: 0, y: 8, w: 3, h: 6, minW: 2, minH: 2 },
        ],
        xs: [
            { i: "weather", x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 2 },
            { i: "links", x: 2, y: 0, w: 2, h: 4, minW: 2, minH: 2 },
            { i: "spotify", x: 0, y: 4, w: 2, h: 4, minW: 2, minH: 2 },
            { i: "todo", x: 2, y: 4, w: 2, h: 6, minW: 2, minH: 2 },
            { i: "pomodoro", x: 0, y: 10, w: 2, h: 6, minW: 2, minH: 2 },
        ],
        xxs: [
            { i: "weather", x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 2 },
            { i: "links", x: 0, y: 4, w: 2, h: 4, minW: 2, minH: 2 },
            { i: "spotify", x: 0, y: 8, w: 2, h: 4, minW: 2, minH: 2 },
            { i: "todo", x: 0, y: 12, w: 2, h: 6, minW: 2, minH: 2 },
            { i: "pomodoro", x: 0, y: 18, w: 2, h: 6, minW: 2, minH: 2 },
        ],
    },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isExtension, setIsExtension] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState<string | null>(null);

    // 0. Detect Extension Mode and Check for Updates
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const isExt = params.get("source") === "extension";
        setIsExtension(isExt);

        if (isExt) {
            // Check for updates
            fetch("https://ur-board.vercel.app/version.json")
                .then(res => res.json())
                .then(data => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const manifest = (window as any).chrome?.runtime?.getManifest();
                        if (manifest && manifest.version !== data.version) {
                            setUpdateAvailable(data.version);
                        }
                    } catch (e) {
                        console.error("Update check failed", e);
                    }
                })
                .catch(err => console.error("Failed to fetch version info", err));
        }
    }, []);

    // 1. Load settings: Local Only
    useEffect(() => {
        const loadSettings = () => {
            const saved = localStorage.getItem("urboard-settings");
            let currentSettings = defaultSettings;

            if (saved) {
                try {
                    currentSettings = { ...defaultSettings, ...JSON.parse(saved) };
                } catch (e) {
                    console.error("Local settings parse error", e);
                }
            } else {
                // Auto-detect language on first run if no settings saved
                const systemLang = navigator.language.split("-")[0] as Language;
                if (["tr", "en", "ru", "de"].includes(systemLang)) {
                    currentSettings.language = systemLang;
                } else {
                    currentSettings.language = "en";
                }
            }

            setSettings(currentSettings);

            // Migration: Global Resize Fix for ALL widgets
            if (currentSettings.layouts?.lg) {
                let needsUpdate = false;
                const newLayouts = { ...currentSettings.layouts };

                Object.keys(newLayouts).forEach(bp => {
                    newLayouts[bp] = newLayouts[bp].map(w => {
                        if (w.minW > 2 || w.minH > 2) {
                            needsUpdate = true;
                            return { ...w, minW: 2, minH: 2 };
                        }
                        return w;
                    });
                });

                if (needsUpdate) {
                    const updatedSettings = { ...currentSettings, layouts: newLayouts };
                    setSettings(updatedSettings);
                    localStorage.setItem("urboard-settings", JSON.stringify(updatedSettings));
                }
            }

            setIsLoaded(true);
        };

        loadSettings();
    }, []);

    // 2. Save settings to Local Only
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("urboard-settings", JSON.stringify(settings));
    }, [settings, isLoaded]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    useEffect(() => {
        document.documentElement.style.setProperty("--color-accent", settings.accentColor);

        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) return { r: 255, g: 0, b: 51 };
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            };
        };

        const rgb = hexToRgb(settings.accentColor);
        document.documentElement.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);

        // Calculate contrast color (YIQ)
        const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        const contrastColor = yiq >= 128 ? "rgba(0, 0, 0, 0.9)" : "#ffffff";
        document.documentElement.style.setProperty("--accent-contrast", contrastColor);
    }, [settings.accentColor]);

    const t = (key: TranslationKey) => {
        return translations[settings.language]?.[key] || translations.en[key] || key;
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isLoaded, isExtension, updateAvailable, t }}>
            {children}
        </SettingsContext.Provider>
    );
};

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
