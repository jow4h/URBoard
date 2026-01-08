"use client";

import { useState } from "react";
import { Plus, Link2, X, List, Grid, Check, Settings2 } from "lucide-react";
import WidgetWrapper from "@/components/dashboard/WidgetWrapper";
import { useSettings, ShortcutLink } from "@/context/SettingsContext";

interface LinksWidgetProps {
    isSettingsOpen?: boolean;
    onSettingsClose?: () => void;
}

function LinksSettings({ settings, onUpdate, t }: {
    settings: any,
    onUpdate: (updates: any) => void,
    t: (key: any) => string
}) {
    return (
        <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 text-accent">
                <Link2 size={18} />
                <h4 className="text-xs font-bold uppercase tracking-widest">{t("links")}</h4>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold pl-1">{t("appearance")}</label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onUpdate({ linksViewMode: "list" })}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${settings.linksViewMode === 'list' ? 'bg-accent/20 border-accent text-white' : 'bg-white/5 border-white/5 text-white/40'}`}
                    >
                        <List size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t("viewList")}</span>
                    </button>
                    <button
                        onClick={() => onUpdate({ linksViewMode: "grid" })}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${settings.linksViewMode === 'grid' ? 'bg-accent/20 border-accent text-white' : 'bg-white/5 border-white/5 text-white/40'}`}
                    >
                        <Grid size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t("viewGrid")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LinksWidget({ isSettingsOpen, onSettingsClose }: LinksWidgetProps) {
    const { settings, updateSettings, t } = useSettings();
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState("");
    const [newUrl, setNewUrl] = useState("");

    const addLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newUrl) return;

        let formattedUrl = newUrl;
        if (!newUrl.startsWith("http")) {
            formattedUrl = `https://${newUrl}`;
        }

        const newLink: ShortcutLink = {
            id: Date.now().toString(),
            name: newName,
            url: formattedUrl,
        };

        updateSettings({
            userLinks: [...settings.userLinks, newLink],
        });

        setNewName("");
        setNewUrl("");
        setIsAdding(false);
    };

    const removeLink = (id: string) => {
        updateSettings({
            userLinks: settings.userLinks.filter((link) => link.id !== id),
        });
    };

    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return "";
        }
    };

    const renderContent = () => {
        if (isSettingsOpen) {
            return (
                <LinksSettings
                    settings={settings}
                    onUpdate={updateSettings}
                    t={t}
                />
            );
        }

        if (isAdding) {
            return (
                <div className="h-full flex flex-col justify-center p-5 animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                        <Plus size={14} className="text-accent" strokeWidth={3} />
                        {t("addShortcut")}
                    </h4>
                    <form onSubmit={addLink} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-white/40 uppercase font-black pl-1 tracking-widest">{t("name")}</label>
                            <input
                                autoFocus
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors"
                                placeholder="GitHub, YouTube..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-white/40 uppercase font-black pl-1 tracking-widest">{t("url")}</label>
                            <input
                                type="text"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="pt-4 grid grid-cols-2 gap-3">
                            <button type="submit" className="py-3 bg-accent text-[var(--accent-contrast)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.5)] active:scale-95">
                                <Check size={14} strokeWidth={3} /> {t("add")}
                            </button>
                            <button type="button" onClick={() => setIsAdding(false)} className="py-3 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                                {t("cancel")}
                            </button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className="h-full relative flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-1 pb-14">
                    {settings.linksViewMode === 'list' ? (
                        <div className="space-y-2">
                            {settings.userLinks.map((link) => (
                                <div key={link.id} className="group relative flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent/20 hover:bg-accent/5 transition-all">
                                    <a href={link.url} className="flex items-center gap-3 flex-1">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 p-1.5 flex items-center justify-center">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={getFaviconUrl(link.url)} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-xs text-white/80 group-hover:text-white transition-colors truncate">{link.name}</span>
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeLink(link.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-white/20 hover:text-red-500 transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {settings.userLinks.length === 0 && !isAdding && (
                                <div className="flex flex-col items-center justify-center py-8 text-white/20">
                                    <Link2 size={24} className="mb-2" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">{t("noShortcuts")}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-3">
                            {settings.userLinks.map((link) => (
                                <div key={link.id} className="group relative flex flex-col items-center justify-center aspect-square rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer">
                                    <a href={link.url} className="flex flex-col items-center gap-2 w-full h-full justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={getFaviconUrl(link.url)} alt={link.name} className="w-1/2 h-1/2 object-contain group-hover:scale-110 transition-transform" />
                                        <span className="text-[8px] uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors truncate w-[80%] text-center">{link.name}</span>
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeLink(link.id);
                                        }}
                                        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 shadow-lg transition-all scale-75 group-hover:scale-100"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 pointer-events-none flex justify-center">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="pointer-events-auto shadow-lg bg-white/10 hover:bg-accent hover:text-white backdrop-blur-md border border-white/10 text-white/60 rounded-full p-3 transition-all transform hover:scale-110 active:scale-95"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <WidgetWrapper title={t("links")} icon={<Link2 size={18} />}>
            {renderContent()}
        </WidgetWrapper>
    );
}
