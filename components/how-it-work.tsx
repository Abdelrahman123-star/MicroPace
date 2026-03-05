import { motion, useScroll, useTransform } from 'framer-motion';
import { ImageWithFallback } from './ImageWithFallback';
import { useRef } from 'react';


export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

    const steps = [
        {
            number: "01",
            title: "Choose Your Sprint",
            description: "Select from hundreds of skill-based sprints across different learning paths.",
            image: "https://images.unsplash.com/photo-1758612898304-1a6bb546ac44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2N1c2VkJTIwc3R1ZGVudCUyMGxlYXJuaW5nJTIwbGFwdG9wfGVufDF8fHx8MTc3MjU3Nzg5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        },
        {
            number: "02",
            title: "Learn the Concept",
            description: "Absorb bite-sized lessons designed for quick understanding and retention.",
            image: "https://images.unsplash.com/photo-1644337540803-2b2fb3cebf12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29ya3NwYWNlJTIwZGVza3xlbnwxfHx8fDE3NzI0ODQzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        },
        {
            number: "03",
            title: "Complete the Challenge",
            description: "Test your knowledge with interactive questions and instant feedback.",
            image: "https://images.unsplash.com/photo-1759884247407-782965434bf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0aXZpdHklMjBkYWlseSUyMHJvdXRpbmV8ZW58MXx8fHwxNzcyNTc3ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        },
        {
            number: "04",
            title: "Earn Rewards & Level Up",
            description: "Collect XP, unlock achievements, and track your progress in real-time.",
            image: "https://images.unsplash.com/photo-1771924368572-2ba8c7f6c79d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY2VsZWJyYXRpb24lMjBzdWNjZXNzfGVufDF8fHx8MTc3MjU3MDMwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        }
    ];

    return (
        <section ref={containerRef} className="relative py-32 px-4 md:px-26 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-block px-4 py-2 rounded-full bg-black/5 mb-6"
                    >
                        <span className="text-sm font-semibold text-black/70">HOW IT WORKS</span>
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-bold text-black mb-6">
                        Your learning journey
                        <br />
                        <span className="bg-gradient-to-r from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] bg-clip-text text-transparent">
                            in four simple steps
                        </span>
                    </h2>
                </motion.div>

                <div className="space-y-32">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                        >
                            {/* Content */}
                            <div className="flex-1 space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <div className="text-8xl font-bold bg-gradient-to-br from-[hsl(217,91%,60%)] via-[hsl(199,89%,48%)] to-[hsl(217,91%,60%)] bg-clip-text text-transparent mb-4">
                                        {step.number}
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-bold text-black mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                                        {step.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Image with parallax */}
                            <motion.div
                                style={{ y: index % 2 === 0 ? y1 : y2 }}
                                className="flex-1"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative rounded-3xl overflow-hidden shadow-2xl"
                                >
                                    <ImageWithFallback
                                        src={step.image}
                                        alt={step.title}
                                        className="w-full h-[400px] object-cover"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}