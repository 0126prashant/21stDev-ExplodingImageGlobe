import React, { useMemo } from 'react';
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

// --- Unsplash Images ---
const unsplashIds = [
    "1522202176988-66273c2fd55f", // code
    "1498050108023-c5249f4df085", // monitor code
    "1504384308090-c894fdcc538d", // desk view
    "1505909182942-e2f09aee3e89", // abstract tech
    "1517694712202-14dd9538aa97", // code screen focus
    "1461749280684-dccba630e2f6", // laptop plant
    "1550745165-9bc0b252726f", // retro vibes
    "1454165804606-c3d57bc86b40", // desk flatlay
    "1480694313141-fce5e697ee25", // mobile app
    "1499951360447-b19be8fe80f5", // web design layout
    "1555421689-d68471e189f2", // laptop home
    "1522542550221-31fd19575a2d", // colorful iMac
    "1516321497487-e288fb19713f", // hands typing
];

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
    const NUM_CARDS = 80;
    const RADIUS = 360; // radius adapted for card bounds

    const positions = useMemo(() => getSphericalPositions(NUM_CARDS), []);

    const globeVariants = {
        hidden: {
            y: 150,
            scale: 0.5,
            opacity: 0
        },
        visible: {
            y: 0,
            scale: 1,
            opacity: 1,
            transition: { type: "spring" as const, bounce: 0.3, duration: 2 }
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
                    animate="visible"
                    variants={globeVariants}
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
                                    src={`https://images.unsplash.com/photo-${unsplashIds[i % unsplashIds.length]}?auto=format&fit=crop&q=80&w=200&h=140`}
                                    alt={`Globe image ${i}`}
                                    className="w-20 h-14 sm:w-28 sm:h-20 object-cover bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-zinc-200"
                                    referrerPolicy="no-referrer"
                                    style={{
                                        transformStyle: 'preserve-3d'
                                    }}
                                    initial={{
                                        z: 0,
                                        opacity: 0,
                                        scale: 0.5
                                    }}
                                    animate={{
                                        z: RADIUS,
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    transition={{
                                        opacity: {
                                            duration: 1,
                                            delay: i * 0.02,
                                            ease: "easeOut"
                                        },
                                        z: {
                                            type: "spring",
                                            stiffness: 70,
                                            damping: 12,
                                            delay: i * 0.02
                                        },
                                        scale: {
                                            duration: 1,
                                            delay: i * 0.02,
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
