import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// --- Particle Background Component ---
const ParticleBackground = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 150 }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
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

// --- Hero Section Component ---
const HeroSection = ({ isExploded }: { isExploded: boolean }) => (
    <motion.div
        className="absolute z-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{
            opacity: isExploded ? 1 : 0,
            scale: isExploded ? 1 : 0.9,
            y: isExploded ? 0 : 20
        }}
        transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
    >
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isExploded ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm font-medium backdrop-blur-sm"
        >
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Awwwards-winning sequence
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">SavvyHub</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Experience the next generation of web interfaces. The most beautiful, perfectly crafted, and seamlessly animated UI components designed to convert.
        </p>
        <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Get Started Free
            </button>
            <button className="px-6 py-3 rounded-lg border border-zinc-700 text-white font-semibold hover:bg-zinc-800 transition-colors backdrop-blur-sm">
                View Gallery
            </button>
        </div>
    </motion.div>
);

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
    const NUM_IMAGES = 80;
    const RADIUS = 280;

    useEffect(() => {
        // Trigger explosion after 3 seconds
        const timer = setTimeout(() => {
            setIsExploded(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const positions = useMemo(() => getSphericalPositions(NUM_IMAGES), []);

    // Using picsum photos for reliable random images
    const images = useMemo(() => {
        return Array.from({ length: NUM_IMAGES }).map((_, i) => `https://picsum.photos/seed/${i + 150}/200/200`);
    }, []);

    const scaleVariants = {
        hidden: { scale: 0 },
        visible: {
            scale: 1,
            transition: { type: "spring", bounce: 0.4, duration: 1.5 }
        },
        explode: {
            scale: 1.1,
            transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1] } // custom cubic-bezier for smooth out
        }
    };

    return (
        <div className="relative w-full h-full min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 font-sans selection:bg-blue-500/30">
            <ParticleBackground />

            <HeroSection isExploded={isExploded} />

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
                                <motion.img
                                    src={images[i]}
                                    alt={`Globe image ${i}`}
                                    className="w-14 h-14 md:w-16 md:h-16 object-cover rounded shadow-2xl"
                                    style={{
                                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
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
                                />
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
