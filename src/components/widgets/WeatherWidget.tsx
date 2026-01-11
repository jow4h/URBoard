"use client";

import { Cloud, Droplets, Wind, Loader2, MapPin, Check, Thermometer } from "lucide-react";
import WidgetWrapper from "@/components/dashboard/WidgetWrapper";
import { useSettings } from "@/context/SettingsContext";
import useSWR, { useSWRConfig } from "swr";
import { getWeatherData } from "@/lib/api/weather";
import { useState } from "react";

interface WeatherWidgetProps {
    isSettingsOpen?: boolean;
    onSettingsClose?: () => void;
}

function WeatherSettings({ settings, onSave, onUpdate, t }: {
    settings: any,
    onSave: (city: string) => void,
    onUpdate: (updates: any) => void,
    t: (key: any) => string
}) {
    const [cityInput, setCityInput] = useState(settings.weatherCity || "");

    const themes = [
        { id: "glass", name: t("glass") },
        { id: "minimal", name: t("minimal") },
        { id: "vibrant", name: t("vibrant") },
        { id: "retro", name: t("retro") },
    ];

    return (
        <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 text-accent">
                <MapPin size={18} />
                <h4 className="text-xs font-bold uppercase tracking-widest">{settings.weatherCity ? t("weather") : t("setCity")}</h4>
            </div>

            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-bold pl-1">{t("cityPlaceholder")}</label>
                    <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSave(cityInput)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-accent/50 transition-colors text-white"
                        placeholder="London, Tokyo..."
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-bold pl-1">{t("weatherTheme")}</label>
                    <div className="grid grid-cols-2 gap-2">
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => onUpdate({ weatherTheme: theme.id })}
                                className={`flex items-center justify-center p-3 rounded-xl border transition-all ${settings.weatherTheme === theme.id ? 'bg-accent/20 border-accent text-white' : 'bg-white/5 border-white/5 text-white/40'}`}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest">{theme.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => onSave(cityInput)}
                    className="w-full py-2 bg-accent text-[var(--accent-contrast)] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all mt-4"
                >
                    <Check size={14} /> {t("save")}
                </button>
            </div>
        </div>
    );
}

export default function WeatherWidget({ isSettingsOpen, onSettingsClose }: WeatherWidgetProps) {
    const { settings, updateSettings, t } = useSettings();
    const { mutate } = useSWRConfig();

    const { data, isLoading } = useSWR(
        settings.weatherCity ? `weather-${settings.weatherCity}` : null,
        async () => await getWeatherData(settings.weatherCity),
        {
            refreshInterval: 1800000,
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const handleSave = (city: string) => {
        if (!city.trim()) return;
        if (city !== settings.weatherCity) {
            updateSettings({ weatherCity: city });
            mutate(`weather-${city}`);
        }
        onSettingsClose?.();
    };

    const renderContent = () => {
        if (isSettingsOpen) {
            return (
                <WeatherSettings
                    settings={settings}
                    onSave={handleSave}
                    onUpdate={updateSettings}
                    t={t}
                />
            );
        }

        // Loading state
        if (isLoading && !data) {
            return (
                <div className="flex items-center justify-center h-full">
                    <Loader2 size={24} className="text-white/20 animate-spin" />
                </div>
            );
        }

        // No city set
        if (!settings.weatherCity) {
            return (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30 text-center px-4">
                    <MapPin size={32} className="text-accent" />
                    <span className="text-[10px] uppercase font-black tracking-widest">
                        {t("setCity")}
                    </span>
                </div>
            );
        }

        // No data
        if (!data || !data.main) {
            return (
                <div className="flex flex-col items-center justify-center h-full opacity-30">
                    <Cloud size={32} />
                    <span className="text-[10px] uppercase mt-2 font-bold">{t("loading")}</span>
                </div>
            );
        }

        // Minimal theme
        if (settings.weatherTheme === "minimal") {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="text-7xl font-light tracking-tighter text-white drop-shadow-2xl">
                        {Math.round(data.main.temp)}°
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black mt-2">
                        {data.name || settings.weatherCity}
                    </span>
                </div>
            );
        }

        if (settings.weatherTheme === "vibrant") {
            const getVibrantStyles = (code: number) => {
                // Open-Meteo Codes
                if (code >= 51 && code <= 67) return "text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]"; // Rain
                if (code >= 71 && code <= 86) return "text-cyan-200 drop-shadow-[0_0_15px_rgba(165,243,252,0.5)]"; // Snow
                if (code >= 45 && code <= 48) return "text-gray-400 drop-shadow-[0_0_15px_rgba(156,163,175,0.5)]"; // Fog
                if (code === 0 || code === 1) return "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"; // Clear
                if (code >= 95) return "text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]"; // Storm
                return "text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"; // Clouds/Overcast
            };

            return (
                <div className="flex flex-col h-full justify-between p-2">
                    <div className="flex items-center justify-center flex-1">
                        <div className="flex flex-col items-center">
                            <Cloud size={64} className={getVibrantStyles(data.weather?.[0]?.code || 0)} strokeWidth={1} />
                            <span className="text-6xl font-black text-white mt-4 tracking-tighter">
                                {Math.round(data.main.temp)}°
                            </span>
                            <span className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-2">{data.name || settings.weatherCity}</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (settings.weatherTheme === "retro") {
            return (
                <div className="flex flex-col h-full items-center justify-center p-6 border-4 border-white/20 font-mono">
                    <div className="text-6xl font-bold bg-white text-black px-4 py-2 mb-6 shadow-[8px_8px_0_rgba(255,255,255,0.2)]">
                        {Math.round(data.main.temp)}C
                    </div>
                    <div className="text-sm uppercase font-black text-white tracking-[0.2em] text-center">
                        {data.name || settings.weatherCity}
                    </div>
                    <div className="text-[10px] uppercase text-white/50 mt-8 space-y-1 font-bold">
                        <div>HUMIDITY: {data.main.humidity}%</div>
                        <div>WIND: {Math.round(data.wind?.speed || 0)} KMH</div>
                    </div>
                </div>
            );
        }

        // Default Glass theme display
        return (
            <div className="flex flex-col h-full justify-between p-2">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                        <span className="text-6xl font-black tracking-tighter text-white leading-none">
                            {Math.round(data.main.temp)}°
                        </span>
                        <div className="flex items-center gap-1.5 mt-2 opacity-60">
                            <MapPin size={10} className="text-accent" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                                {data.name || settings.weatherCity}
                            </span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                        <Cloud size={48} className="text-white relative z-10" />
                    </div>
                </div>

                <div className="space-y-2 mt-4">
                    <div className="w-full h-px bg-white/5" />

                    <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                            <div className="flex items-center gap-2">
                                <Thermometer size={14} className="text-orange-400" />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    {t("feelsLike")}
                                </span>
                            </div>
                            <span className="text-sm font-black text-white">{Math.round(data.main.feels_like)}°</span>
                        </div>

                        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/5 justify-between">
                            <Droplets size={14} className="text-blue-400" />
                            <span className="text-xs font-bold text-white">{data.main.humidity}%</span>
                        </div>

                        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/5 justify-between">
                            <Wind size={14} className="text-green-400" />
                            <span className="text-xs font-bold text-white">{Math.round(data.wind?.speed || 0)} <span className="text-[8px] opacity-50">km/h</span></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <WidgetWrapper
            title={t("weather")}
            icon={<Cloud size={18} />}
        >
            <div className="h-full flex flex-col">
                {renderContent()}
            </div>
        </WidgetWrapper>
    );
}
