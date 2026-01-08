"use client";

import { useState, useEffect } from "react";
import { ListTodo, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import WidgetWrapper from "@/components/dashboard/WidgetWrapper";
import { useSettings } from "@/context/SettingsContext";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export default function TodoWidget() {
    const { t } = useSettings();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    // Load todos
    useEffect(() => {
        const saved = localStorage.getItem("urboard-todos");
        if (saved) {
            try {
                setTodos(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse todos", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save todos
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("urboard-todos", JSON.stringify(todos));
    }, [todos, isLoaded]);

    const addTodo = () => {
        if (!inputValue.trim()) return;
        const newTodo: Todo = {
            id: Date.now(),
            text: inputValue,
            completed: false,
        };
        setTodos([...todos, newTodo]);
        setInputValue("");
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <WidgetWrapper title={t("todo")} icon={<ListTodo size={18} />}>
            <div className="flex flex-col h-full gap-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                        placeholder={t("add") + "..."}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-accent/40 transition-colors text-white"
                    />
                    <button
                        onClick={addTodo}
                        className="bg-accent/20 hover:bg-accent text-accent hover:text-white rounded-xl p-2 transition-all border border-accent/20"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {todos.map((todo) => (
                        <div
                            key={todo.id}
                            className="group flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3 transition-all border border-white/5 hover:border-accent/20 hover:bg-accent/5"
                        >
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className="flex items-center gap-3 text-left overflow-hidden"
                            >
                                {todo.completed ? (
                                    <CheckCircle2 size={18} className="text-accent shrink-0" />
                                ) : (
                                    <Circle size={18} className="text-white/20 shrink-0" />
                                )}
                                <span className={`text-xs truncate font-medium ${todo.completed ? 'text-white/20 line-through' : 'text-white/80'}`}>
                                    {todo.text}
                                </span>
                            </button>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-all shrink-0"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    {todos.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-white/10 text-xs italic uppercase tracking-[0.2em] font-bold">
                            {t("noTodos")}
                        </div>
                    )}
                </div>
            </div>
        </WidgetWrapper>
    );
}
