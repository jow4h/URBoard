"use client";

import { Cloud, Droplets, Wind, AlertCircle, Loader2, MapPin, Check, X } from "lucide-react";
import WidgetWrapper from "@/components/dashboard/WidgetWrapper";
import { useSettings } from "@/context/SettingsContext";
import useSWR from "swr";
import { getWeatherData } from "@/lib/api/weather";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherWidgetProps {
    isSettingsOpen?: boolean;
    onSettingsClose?: () => void;
}

export default function WeatherWidget({ isSettingsOpen, onSettingsClose }: WeatherWidgetProps) {
    const { settings, updateSettings, t } = useSettings();
    const [cityInput, setCityInput] = useState(settings.weatherCity);

    const handleSave = () => {
        if (!cityInput.trim()) return;
        updateSettings({ weatherCity: cityInput });
        onSettingsClose?.();
    };

    const { data, error, isLoading } = useSWR(
        settings.weatherCity ? `weather-${settings.weatherCity}` : null,
        async () => {
            return await getWeatherData(settings.weatherCity);
        },
        {
            refreshInterval: 1800000,
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    return (
        <WidgetWrapper title={t("weather")} icon={<Cloud size={18} />}>
            <div className="flex flex-col h-full relative">
                <AnimatePresence>
                    {isSettingsOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl rounded-2xl p-5 flex flex-col justify-center gap-3 border border-white/10"
                        >
                            <input
                                type="text"
                                value={cityInput}
                                onChange={(e) => setCityInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-center placeholder:text-white/20 text-white"
                                placeholder={t("cityPlaceholder")}
                                autoFocus
                            />

                            <button
                                onClick={() => updateSettings({ weatherMinimalMode: !settings.weatherMinimalMode })}
                                className={`w-full py-3 px-4 rounded-xl flex items-center justify-between transition-all border ${settings.weatherMinimalMode ? 'bg-white/10 border-white/10' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                            >
                                <span className="text-xs font-bold uppercase tracking-widest text-white/60">{t("minimalMode")}</span>
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${settings.weatherMinimalMode ? 'bg-accent border-accent text-white' : 'border-white/20'}`}>
                                    {settings.weatherMinimalMode && <Check size={12} />}
                                </div>
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-3 bg-accent text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all uppercase"
                                >
                                    <Check size={16} /> {t("save")}
                                </button>
                                <button
                                    onClick={onSettingsClose}
                                    className="px-4 py-3 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all uppercase"
                                >
                                    {t("cancel")}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col items-center justify-center h-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 size={24} className="text-white/20 animate-spin" />
                        </div>
                    ) : !settings.weatherCity ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30 text-center px-4">
                            <MapPin size={32} className="text-accent" />
                            <span className="text-[10px] uppercase tracking-widest font-bold leading-relaxed">
                                {t("setCity")}
                            </span>
                        </div>
                    ) : !data || !data.main ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-30">
                            <Cloud size={32} />
                            <span className="text-[10px] uppercase mt-2">{t("loading")}</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full">
                            {settings.weatherMinimalMode ? (
                                /* Minimal Mode */
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <span className="text-6xl font-light tracking-tighter text-white">{Math.round(data.main.temp)}°</span>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                        {data.name || settings.weatherCity}
                                    </span>
                                </div>
                            ) : (
                                /* Full Mode */
                                <>
                                    <div className="flex items-center gap-4">
                                        <Cloud size={48} className="text-white fill-white/10" />
                                        <div className="flex flex-col">
                                            <span className="text-4xl font-light tracking-tighter">{Math.round(data.main.temp)}°C</span>
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest truncate max-w-[100px]">
                                                {data.name || settings.weatherCity}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-3 w-full">
                                        <div className="flex items-center gap-2 rounded-xl bg-white/5 p-3 border border-white/5">
                                            <Droplets size={14} className="text-accent/60" />
                                            <span className="text-[10px] text-white/60 font-medium">{data.main.humidity}%</span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-xl bg-white/5 p-3 border border-white/5">
                                            <Wind size={14} className="text-accent/60" />
                                            <span className="text-[10px] text-white/60 font-medium">{data.wind?.speed}km/h</span>
                                        </div>
                                        <div className="col-span-2 flex items-center gap-2 rounded-xl bg-white/5 p-3 border border-white/5">
                                            <AlertCircle size={14} className="text-accent/60" />
                                            <span className="text-[10px] text-white/60 font-medium">
                                                {t("feelsLike")}: {data.main.feels_like ? Math.round(data.main.feels_like) : Math.round(data.main.temp)}°
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">
                                        {data.weather?.[0]?.description ?? t("cloudy")}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </WidgetWrapper>
    );
}
