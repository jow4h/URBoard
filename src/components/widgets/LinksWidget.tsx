"use client";

import { useState } from "react";
import { Plus, Link2, X, List, Grid, Check } from "lucide-react";
import WidgetWrapper from "@/components/dashboard/WidgetWrapper";
import { useSettings, ShortcutLink } from "@/context/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";

interface LinksWidgetProps {
    isSettingsOpen?: boolean;
    onSettingsClose?: () => void;
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
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch {
            return "";
        }
    };

    return (
        <WidgetWrapper title={t("links")} icon={<Link2 size={18} />}>
            <div className="flex flex-col h-full relative">
                <AnimatePresence>
                    {isSettingsOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl rounded-2xl p-6 flex flex-col justify-center gap-4 border border-accent/20"
                        >
                            <h3 className="text-xs font-bold uppercase tracking-widest text-accent text-center mb-2">{t("viewList")}</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => updateSettings({ linksViewMode: "list" })}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${settings.linksViewMode === 'list' ? 'bg-accent/20 border-accent text-white' : 'bg-white/5 border-white/5 text-white/40'}`}
                                >
                                    <List size={18} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t("viewList")}</span>
                                </button>
                                <button
                                    onClick={() => updateSettings({ linksViewMode: "grid" })}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${settings.linksViewMode === 'grid' ? 'bg-accent/20 border-accent text-white' : 'bg-white/5 border-white/5 text-white/40'}`}
                                >
                                    <Grid size={18} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{t("viewGrid")}</span>
                                </button>
                            </div>
                            <button
                                onClick={onSettingsClose}
                                className="w-full py-3 bg-accent text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-xs uppercase"
                            >
                                <Check size={16} /> {t("saveAndClose")}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1">
                    {settings.linksViewMode === 'list' ? (
                        <div className="space-y-2">
                            {settings.userLinks.map((link) => (
                                <div key={link.id} className="group relative flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent/20 hover:bg-accent/5 transition-all">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 flex-1">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 p-1.5 flex items-center justify-center">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={getFaviconUrl(link.url)} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-xs text-white/80 group-hover:text-white transition-colors truncate">{link.name}</span>
                                    </a>
                                    <button onClick={() => removeLink(link.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-white/20 hover:text-red-500 transition-all">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/10 text-white/40 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all text-xs font-bold uppercase tracking-widest"
                            >
                                <Plus size={16} />
                                {t("add")}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-3">
                            {settings.userLinks.map((link) => (
                                <div key={link.id} className="group relative flex flex-col items-center justify-center aspect-square rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 w-full h-full justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={getFaviconUrl(link.url)} alt={link.name} className="w-1/2 h-1/2 object-contain group-hover:scale-110 transition-transform" />
                                        <span className="text-[8px] uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors truncate w-[80%] text-center">{link.name}</span>
                                    </a>
                                    <button onClick={() => removeLink(link.id)} className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 shadow-lg transition-all scale-75 group-hover:scale-100">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => setIsAdding(true)} className="flex items-center justify-center aspect-square rounded-2xl bg-white/5 border border-dashed border-white/10 hover:border-accent/40 hover:bg-black/40 transition-all text-white/20 hover:text-accent">
                                <Plus size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {isAdding && (
                    <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-xl rounded-2xl p-6 flex flex-col justify-center gap-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 text-center">{t("addShortcut")}</h4>
                        <form onSubmit={addLink} className="space-y-3">
                            <input
                                autoFocus
                                type="text"
                                placeholder={t("name")}
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                            />
                            <input
                                type="text"
                                placeholder={t("url")}
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                            />
                            <div className="flex gap-2 pt-2">
                                <button type="submit" className="flex-1 bg-accent py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:brightness-110 transition-all">{t("add")}</button>
                                <button type="button" onClick={() => setIsAdding(false)} className="px-4 bg-white/5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all">{t("cancel")}</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
}
