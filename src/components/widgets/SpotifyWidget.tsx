"use client";

import { Disc, Music2, ExternalLink, Loader2, Key, Check, Music } from "lucide-react";
import WidgetWrapper from "@/components/dashboard/WidgetWrapper";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { useState } from "react";

interface SpotifyWidgetProps {
    isSettingsOpen?: boolean;
    onSettingsClose?: () => void;
}

function SpotifySettings({ initialValues, onSave, t }: {
    initialValues: { clientId: string, clientSecret: string, refreshToken: string },
    onSave: (values: typeof initialValues) => void,
    t: (key: any) => string
}) {
    const [inputs, setInputs] = useState(initialValues);

    return (
        <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 text-accent">
                <Key size={18} />
                <h4 className="text-xs font-bold uppercase tracking-widest">{initialValues.clientId ? "Spotify" : t("spotifySetup")}</h4>
            </div>
            <div className="space-y-3">
                <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-bold pl-1">{t("spotifyClientId")}</label>
                    <input
                        type="text"
                        value={inputs.clientId}
                        onChange={(e) => setInputs({ ...inputs, clientId: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-accent/50 transition-colors"
                        placeholder="..."
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-bold pl-1">{t("spotifyClientSecret")}</label>
                    <input
                        type="password"
                        value={inputs.clientSecret}
                        onChange={(e) => setInputs({ ...inputs, clientSecret: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-accent/50 transition-colors"
                        placeholder="..."
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-bold pl-1">{t("spotifyRefreshToken")}</label>
                    <input
                        type="password"
                        value={inputs.refreshToken}
                        onChange={(e) => setInputs({ ...inputs, refreshToken: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-accent/50 transition-colors"
                        placeholder="..."
                    />
                </div>
                <button
                    onClick={() => onSave(inputs)}
                    className="w-full py-2 bg-accent text-[var(--accent-contrast)] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all mt-4"
                >
                    <Check size={14} /> {t("save")}
                </button>
            </div>
        </div>
    );
}

export default function SpotifyWidget({ isSettingsOpen, onSettingsClose }: SpotifyWidgetProps) {
    const { settings, updateSettings, t } = useSettings();

    const handleSave = (values: { clientId: string, clientSecret: string, refreshToken: string }) => {
        updateSettings({
            spotifyClientId: values.clientId,
            spotifyClientSecret: values.clientSecret,
            spotifyRefreshToken: values.refreshToken,
        });
        onSettingsClose?.();
    };

    const fetcher = async (url: string) => {
        const headers: Record<string, string> = {};
        if (settings.spotifyClientId) headers["x-spotify-client-id"] = settings.spotifyClientId;
        if (settings.spotifyClientSecret) headers["x-spotify-client-secret"] = settings.spotifyClientSecret;
        if (settings.spotifyRefreshToken) headers["x-spotify-refresh-token"] = settings.spotifyRefreshToken;

        const res = await fetch(url, { headers });
        return res.json();
    };

    const { data, error, isLoading } = useSWR(
        ["/api/spotify/now-playing", settings.spotifyClientId, settings.spotifyRefreshToken],
        ([url]) => fetcher(url),
        {
            refreshInterval: 10000, // 10 seconds
        }
    );

    const renderContent = () => {
        if (isSettingsOpen) {
            return (
                <SpotifySettings
                    initialValues={{
                        clientId: settings.spotifyClientId,
                        clientSecret: settings.spotifyClientSecret,
                        refreshToken: settings.spotifyRefreshToken,
                    }}
                    onSave={handleSave}
                    t={t}
                />
            );
        }

        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <Loader2 size={24} className="text-white/20 animate-spin" />
                </div>
            );
        }

        if (error || !data || !data.isPlaying) {
            const isMissingKeys = !settings.spotifyClientId || !settings.spotifyClientSecret || !settings.spotifyRefreshToken;

            return (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
                    <Music2 size={32} className="text-white/20" />
                    <span className="text-[10px] uppercase tracking-widest text-center font-bold px-4">
                        {isMissingKeys ? t("spotifySetup") : t("spotifyNotPlaying")}
                    </span>
                    <p className="text-[8px] text-center max-w-[140px] leading-relaxed px-4">
                        {isMissingKeys
                            ? t("spotifyConnect")
                            : t("spotifyNotPlaying") + "..."}
                    </p>
                </div>
            );
        }

        const progressPercentage = (data.progressMs / data.durationMs) * 100;

        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white/5 group">
                        {data.albumImageUrl ? (
                            <img
                                src={data.albumImageUrl}
                                alt={data.album || "Album Art"}
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-accent animate-spin-slow opacity-20">
                                <Disc size={40} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent pointer-events-none" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <h4 className="text-sm font-semibold truncate text-white leading-tight">
                                {data.title}
                            </h4>
                            <a href={data.songUrl} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors">
                                <ExternalLink size={12} />
                            </a>
                        </div>
                        <p className="text-xs text-white/40 truncate mt-0.5">{data.artist}</p>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-accent neon-glow"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-white/20 uppercase tracking-widest font-bold">
                        <span>{Math.floor(data.progressMs / 60000)}:{String(Math.floor((data.progressMs % 60000) / 1000)).padStart(2, '0')}</span>
                        <span>{Math.floor(data.durationMs / 60000)}:{String(Math.floor((data.durationMs % 60000) / 1000)).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <WidgetWrapper title={t("spotify")} icon={<Music size={18} />}>
            {renderContent()}
        </WidgetWrapper>
    );
}
