"use client";

import { useState, useEffect } from "react";
import { StickyNote, Plus, Trash2 } from "lucide-react";
import WidgetWrapper from "@/components/dashboard/WidgetWrapper";
import { useSettings } from "@/context/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
    id: string;
    text: string;
    color: string;
}

const COLORS = [
    "from-blue-500/20 to-cyan-500/20 shadow-blue-500/10",
    "from-purple-500/20 to-pink-500/20 shadow-purple-500/10",
    "from-emerald-500/20 to-teal-500/20 shadow-emerald-500/10",
    "from-orange-500/20 to-yellow-500/20 shadow-orange-500/10",
    "from-rose-500/20 to-red-500/20 shadow-rose-500/10",
];

export default function NotesWidget() {
    const { t } = useSettings();
    const [notes, setNotes] = useState<Note[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    // Load notes
    useEffect(() => {
        const saved = localStorage.getItem("urboard-notes");
        if (saved) {
            try {
                setNotes(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse notes", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save notes
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("urboard-notes", JSON.stringify(notes));
    }, [notes, isLoaded]);

    const addNote = () => {
        if (!inputValue.trim()) return;
        const newNote: Note = {
            id: Date.now().toString(),
            text: inputValue,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
        setNotes([newNote, ...notes]);
        setInputValue("");
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    return (
        <WidgetWrapper title={t("notes")} icon={<StickyNote size={18} />}>
            <div className="flex flex-col h-full gap-4">
                <div className="flex flex-col gap-2">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addNote())}
                        placeholder={t("notePlaceholder")}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-accent/40 transition-colors text-white resize-none custom-scrollbar"
                    />
                    <button
                        onClick={addNote}
                        className="w-full bg-accent/20 hover:bg-accent text-accent hover:text-[var(--accent-contrast)] rounded-xl py-2 flex items-center justify-center gap-2 transition-all border border-accent/20 text-xs font-bold uppercase tracking-wider"
                    >
                        <Plus size={16} /> {t("addNote")}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {notes.map((note) => (
                            <motion.div
                                key={note.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                className={`group relative p-4 rounded-2xl bg-gradient-to-br ${note.color} border border-white/10 shadow-lg backdrop-blur-sm hover:border-white/20 transition-all`}
                            >
                                <p className="text-xs text-white/90 font-medium leading-relaxed pr-6 whitespace-pre-wrap break-words overflow-hidden">
                                    {note.text}
                                </p>
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {notes.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-white/10 text-xs italic uppercase tracking-[0.2em] font-bold text-center">
                            {t("noNotes")}
                        </div>
                    )}
                </div>
            </div>
        </WidgetWrapper>
    );
}
