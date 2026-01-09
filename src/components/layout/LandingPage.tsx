"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Component, MousePointer2, ChevronDown, Github } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface LandingPageProps {
    onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
    const { t } = useSettings();



    const features = [
        {
            icon: Component,
            title: t("featureCustomizable"),
            desc: t("featureCustomizableDesc"),
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: ShieldCheck,
            title: t("featurePrivacy"),
            desc: t("featurePrivacyDesc"),
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            icon: Zap,
            title: t("featureFast"),
            desc: t("featureFastDesc"),
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        }
    ];

    return (
        <div className="h-screen overflow-y-auto custom-scrollbar bg-[#020202] text-white selection:bg-accent selection:text-white">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--accent-rgb),0.1),transparent_70%)]" />

                <div className="relative z-10 text-center max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] uppercase font-black tracking-[0.3em] mb-8"
                    >
                        <Zap size={12} fill="currentColor" /> {t("welcome").split(",")[0]} v1.0
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 leading-[0.9] flex flex-wrap justify-center gap-x-6 gap-y-2"
                    >
                        <span className="relative">
                            <span className="text-white/20 line-through decoration-2 decoration-white/20">YO</span>
                            <span className="text-accent">UR</span>
                        </span>
                        <span className="relative">
                            <span className="text-white/20 line-through decoration-2 decoration-white/20">DASH</span>
                            <span className="text-accent">BOARD</span>
                        </span>
                    </motion.h1>



                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-2xl text-white/40 max-w-2xl mx-auto mb-12 font-medium tracking-tight"
                    >
                        {t("promoSubtitle")} {t("promoTitle").toLowerCase()}.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row gap-6 justify-center items-center w-full max-w-4xl mx-auto"
                    >
                        <a
                            href="https://github.com/jow4h/URBoard/releases/download/latest/urboard-chrome.zip"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:flex-1 min-h-[100px] px-8 py-6 bg-accent text-[var(--accent-contrast)] font-black rounded-3xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-accent/20 group border-2 border-accent/20"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl tracking-tight uppercase">{t("ctaDownloadChrome")}</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            <span className="text-[11px] uppercase tracking-[0.1em] opacity-80 mt-2 font-bold text-center leading-none">{t("ctaDownloadDesc")}</span>
                        </a>

                        <a
                            href="https://github.com/jow4h/URBoard/releases/download/latest/urboard-firefox.xpi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:flex-1 min-h-[100px] px-8 py-6 bg-white/5 text-white font-black rounded-3xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl border-2 border-white/10 group hover:border-white/20 hover:bg-white/[0.08]"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl tracking-tight uppercase">{t("ctaDownloadFirefox")}</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            <span className="text-[11px] uppercase tracking-[0.1em] opacity-40 mt-2 font-bold text-center leading-none group-hover:opacity-60 transition-opacity">{t("ctaDownloadDescFirefox")}</span>
                        </a>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">{t("howItWorks")}</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white/20"
                    >
                        <ChevronDown size={24} />
                    </motion.div>
                </div>
            </section>

            {/* Installation Steps Section */}
            <section className="py-24 px-6 relative bg-white/[0.02]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">{t("howToInstall")}</h2>
                        <p className="text-white/40 font-medium">{t("installSubtext")}</p>
                    </div>

                    <div className="grid gap-6">
                        {[
                            { step: "01", text: t("step1") },
                            { step: "02", text: t("step2") },
                            { step: "03", text: t("step3") },
                            { step: "04", text: t("step4") }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                                <span className="text-3xl font-black text-accent/20 group-hover:text-accent transition-colors">{item.step}</span>
                                <p className="text-lg font-medium text-white/60 group-hover:text-white transition-colors">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6 relative border-t border-white/5 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all cursor-default"
                            >
                                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={28} className={feature.color} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-white/40 leading-relaxed font-medium">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div>
                        <div className="text-3xl font-black tracking-tighter mb-2">UR<span className="text-accent">BOARD</span></div>
                        <div className="text-white/20 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            © 2026 Crafted with ❤️ by <a href="https://github.com/jow4h" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors underline decoration-accent/30 decoration-2 underline-offset-4">jow4h</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <a href="https://github.com/jow4h" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                            <Github size={24} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
