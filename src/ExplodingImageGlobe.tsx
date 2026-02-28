import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// --- Particle Background Component ---
const ParticleBackground = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 150 }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.3 + 0.1,
            duration: Math.random() * 20 + 10,
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-zinc-400 rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [p.opacity, p.opacity * 0.5, p.opacity],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

// --- CSS UI Cards ---
const generateCardStyles = (index: number) => {
    const type = index % 4;

    // Card base styles
    const base = "w-28 h-18 sm:w-32 sm:h-20 bg-white rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-zinc-200 p-2 sm:p-2.5 flex flex-col gap-1.5 sm:gap-2 overflow-hidden box-border";

    switch (type) {
        case 0:
            return (
                <div className={base}>
                    <div className="w-full h-3 sm:h-4 bg-zinc-200 rounded-sm"></div>
                    <div className="w-3/4 h-2 sm:h-2.5 bg-zinc-100 rounded-sm"></div>
                    <div className="w-1/2 h-2 sm:h-2.5 bg-zinc-100 rounded-sm"></div>
                    <div className="mt-auto flex gap-1.5">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-100"></div>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-100"></div>
                    </div>
                </div>
            );
        case 1:
            return (
                <div className={base}>
                    <div className="flex gap-2 items-center mb-1">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 shrink-0"></div>
                        <div className="w-10 sm:w-14 h-2 sm:h-2.5 bg-zinc-200 rounded-sm"></div>
                    </div>
                    <div className="w-full h-full bg-zinc-50 rounded-md flex gap-1.5 p-1.5">
                        <div className="w-1/3 h-full bg-zinc-200 rounded-sm"></div>
                        <div className="w-2/3 h-full flex flex-col gap-1">
                            <div className="w-full h-2 bg-zinc-100 rounded-sm"></div>
                            <div className="w-4/5 h-2 bg-zinc-100 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            );
        case 2:
            return (
                <div className={base}>
                    <div className="w-full flex justify-between items-center mb-0.5">
                        <div className="w-8 sm:w-10 h-2 sm:h-2.5 bg-zinc-200 rounded-sm"></div>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-zinc-200 rounded-sm"></div>
                    </div>
                    <div className="flex-1 w-full bg-indigo-50/50 rounded-md border border-indigo-100/50 p-1.5 flex flex-col justify-center">
                        <div className="w-full h-2 sm:h-2.5 bg-indigo-100 rounded-sm mb-1 sm:mb-1.5"></div>
                        <div className="w-2/3 h-2 sm:h-2.5 bg-indigo-100 rounded-sm"></div>
                    </div>
                </div>
            );
        case 3:
        default:
            return (
                <div className={base}>
                    <div className="flex gap-1 mb-0.5">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-zinc-200 rounded-sm"></div>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-zinc-200 rounded-sm"></div>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-zinc-200 rounded-sm"></div>
                    </div>
                    <div className="w-full h-2 sm:h-2.5 bg-zinc-100 rounded-sm mt-1"></div>
                    <div className="w-full h-2 sm:h-2.5 bg-zinc-100 rounded-sm"></div>
                    <div className="w-4/5 h-2 sm:h-2.5 bg-zinc-100 rounded-sm"></div>
                </div>
            );
    }
}

// --- Math Helper for Sphere ---
const getSphericalPositions = (samples: number) => {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

    for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
        const phiSpherical = Math.acos(y); // 0 to PI
        const theta = phi * i; // angle around Y axis

        points.push({
            rotateY: theta,
            rotateX: phiSpherical - Math.PI / 2
        });
    }
    return points;
};

// --- Main Component ---
export default function ExplodingImageGlobe() {
    const [isExploded, setIsExploded] = useState(false);
    const NUM_CARDS = 80;
    const RADIUS = 360; // radius adapted for card bounds

    useEffect(() => {
        // Trigger explosion after 3 seconds
        const timer = setTimeout(() => {
            setIsExploded(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const positions = useMemo(() => getSphericalPositions(NUM_CARDS), []);

    const scaleVariants = {
        hidden: { scale: 0 },
        visible: {
            scale: 1,
            transition: { type: "spring", bounce: 0.4, duration: 1.5 }
        },
        explode: {
            scale: 1,
            transition: { duration: 1.5 }
        }
    };

    return (
        <div className="relative w-full h-full min-h-screen flex items-center justify-center overflow-hidden bg-[#f5f5f5] font-sans">
            <ParticleBackground />

            {/* Globe Container with perspective */}
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                style={{ perspective: '1200px' }}
            >
                <motion.div
                    initial="hidden"
                    animate={isExploded ? "explode" : "visible"}
                    variants={scaleVariants}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative flex items-center justify-center"
                >
                    {/* Continuous rotation layer */}
                    <motion.div
                        animate={{ rotateY: 360, rotateX: 360 }}
                        transition={{
                            rotateY: { repeat: Infinity, duration: 40, ease: "linear" },
                            rotateX: { repeat: Infinity, duration: 45, ease: "linear" }
                        }}
                        style={{
                            transformStyle: 'preserve-3d',
                            width: 0,
                            height: 0
                        }}
                        className="flex items-center justify-center"
                    >
                        {positions.map((pos, i) => (
                            <div
                                key={i}
                                className="absolute flex items-center justify-center"
                                style={{
                                    transform: `rotateY(${pos.rotateY}rad) rotateX(${pos.rotateX}rad)`,
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                <motion.div
                                    initial={{
                                        z: RADIUS,
                                        opacity: 0,
                                        scale: 0
                                    }}
                                    animate={{
                                        z: isExploded ? RADIUS * 4 : RADIUS,
                                        opacity: isExploded ? 0 : 1,
                                        scale: isExploded ? 1.5 : 1
                                    }}
                                    transition={{
                                        opacity: {
                                            duration: isExploded ? 0.8 : 0.4,
                                            delay: isExploded ? Math.random() * 0.2 : i * 0.01 + 0.5,
                                            ease: "easeOut"
                                        },
                                        z: {
                                            duration: isExploded ? 1.2 : 0.8,
                                            delay: isExploded ? Math.random() * 0.1 : i * 0.01 + 0.5,
                                            ease: [0.19, 1, 0.22, 1] // smooth expo out
                                        },
                                        scale: {
                                            duration: isExploded ? 1.2 : 0.8,
                                            delay: isExploded ? Math.random() * 0.1 : i * 0.01 + 0.5,
                                            ease: "easeOut"
                                        }
                                    }}
                                    style={{
                                        transformStyle: 'preserve-3d'
                                    }}
                                >
                                    {generateCardStyles(i)}
                                </motion.div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
