"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MoveRight } from "lucide-react";
import { useSettings, SearchEngine } from "@/context/SettingsContext";
import { motion } from "framer-motion";

const SEARCH_CONFIG: Record<SearchEngine, { name: string; url: string; color: string }> = {
    google: {
        name: "Google",
        url: "https://www.google.com/search?q=",
        color: "#4285F4",
    },

    brave: {
        name: "Brave",
        url: "https://search.brave.com/search?q=",
        color: "#FB542B",
    },
    duckduckgo: {
        name: "DuckDuckGo",
        url: "https://duckduckgo.com/?q=",
        color: "#DE5833",
    },
};

export default function SearchWidget() {
    const { settings, t, isExtension } = useSettings();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const currentEngine = SEARCH_CONFIG[settings.searchEngine] || SEARCH_CONFIG.google;

    const inputRef = useRef<HTMLInputElement>(null);

    // Global keyboard listener for "Type-to-Search"
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Ignore if already focusing an input, textarea or contenteditable
            const active = document.activeElement;
            const isInput = active?.tagName === 'INPUT' ||
                active?.tagName === 'TEXTAREA' ||
                (active as HTMLElement)?.isContentEditable;

            if (isInput) return;

            // Ignore modifier keys
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            // Only trigger for single characters (avoid F1, Shift, etc)
            if (e.key.length !== 1) return;

            // Focus search input
            inputRef.current?.focus();
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    // Debounce fetch
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.trim().length > 1) {
                try {
                    const baseUrl = isExtension ? 'https://ur-board.vercel.app' : '';
                    const res = await fetch(`${baseUrl}/api/suggestions?q=${encodeURIComponent(query)}&engine=${settings.searchEngine}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch suggestions", error);
                }
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, settings.searchEngine, isExtension]);

    const handleSearch = (e?: React.FormEvent, searchQuery: string = query) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;
        window.open(`${currentEngine.url}${encodeURIComponent(searchQuery)}`, "_blank");
        setQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
        } else if (e.key === "Enter") {
            if (selectedIndex > -1 && suggestions[selectedIndex]) {
                e.preventDefault();
                handleSearch(undefined, suggestions[selectedIndex]);
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 relative z-50">
            <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSearch}
                className="relative group search-container"
            >
                <div className="absolute inset-0 bg-accent/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

                <div className={`relative flex items-center bg-black/40 backdrop-blur-2xl border border-white/10 p-2 transition-all duration-300 group-focus-within:border-accent/50 group-hover:border-white/20 ${suggestions.length > 0 && showSuggestions ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'}`}>
                    <div className="pl-4 pr-3 text-white/40 group-focus-within:text-accent transition-colors">
                        <Search size={20} />
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={`${currentEngine.name} ${t("searchPlaceholder")}`}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                            setSelectedIndex(-1);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none text-white text-lg font-light py-3 placeholder:text-white/20"
                    />

                    <button
                        type="submit"
                        className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-accent/20 hover:text-accent transition-all duration-300 group-focus-within:bg-accent group-focus-within:text-[var(--accent-contrast)]"
                    >
                        <MoveRight size={20} />
                    </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border border-white/10 border-t-0 rounded-b-2xl overflow-hidden shadow-2xl">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSearch(undefined, suggestion)}
                                className={`w-full text-left px-12 py-3 text-white/80 hover:bg-accent/20 hover:text-white transition-colors flex items-center gap-3 ${index === selectedIndex ? "bg-accent/20 text-white" : ""}`}
                            >
                                <Search size={14} className="opacity-50" />
                                <span dangerouslySetInnerHTML={{
                                    __html: suggestion.replace(new RegExp(`(${query})`, "gi"), "<span class='font-bold text-accent'>$1</span>")
                                }} />
                            </button>
                        ))}
                    </div>
                )}

                <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none ${suggestions.length > 0 && showSuggestions ? 'hidden' : ''}`}>
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-accent/40" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent/60">
                        {currentEngine.name}
                    </span>
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-accent/40" />
                </div>
            </motion.form>
        </div>
    );
}
