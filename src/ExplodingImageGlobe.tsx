
import { useMemo, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, type PanInfo } from 'framer-motion';

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

// --- Unsplash Diverse Images ---
const unsplashIds = [
    "1501854140801-50d01698940b", // nature
    "1447069387593-a5de0862481e", // architecture
    "1469474968028-56623f02e42e", // city
    "1441974231531-c6227dbb6b9e", // forest
    "1506744626772-2771335a92a4", // ocean
    "1475924156734-497878411200", // space
    "1518837695005-2083093ee35b", // abstract
    "1493246507139-91e8fad9978e", // mountain
    "1519681395980-4bd0de423c94", // colorful
    "1531297172-8700d5a3ece1", // minimal
    "1507238691740-14c0122462e1", // dual screens
    "1522202176988-66273c2fd55f", // code
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
    const RADIUS = 450; // Increased radius to spread cards out

    const positions = useMemo(() => getSphericalPositions(NUM_CARDS), []);

    const globeVariants = {
        hidden: {
            y: 0,
            scale: 0,
            opacity: 0
        },
        visible: {
            y: 0,
            scale: 1,
            opacity: 1,
            transition: { type: "spring" as const, bounce: 0.3, duration: 2 }
        }
    };

    // --- State & Timeline ---
    const [phase, setPhase] = useState<'idle' | 'forming' | 'exploding'>('idle');
    const [focusedImage, setFocusedImage] = useState<string | null>(null);

    // 3D Rotation State
    const rotationX = useMotionValue(0);
    const rotationY = useMotionValue(0);
    const springX = useSpring(rotationX, { stiffness: 100, damping: 20 });
    const springY = useSpring(rotationY, { stiffness: 100, damping: 20 });

    const handlePan = (_e: any, info: PanInfo) => {
        rotationY.set(rotationY.get() + info.delta.x * 0.5);
        rotationX.set(rotationX.get() - info.delta.y * 0.5);
    };

    useEffect(() => {
        // Just form the globe, no explosion or hero cut
        const formTimeout = setTimeout(() => setPhase('forming'), 1000);
        return () => clearTimeout(formTimeout);
    }, []);

    const handleImageClick = (hiResUrl: string) => {
        if (phase !== 'forming') return;
        setPhase('exploding');
        // Wait for the cards to fly past the camera before showing the image
        setTimeout(() => {
            setFocusedImage(hiResUrl);
        }, 1200);
    };

    return (
        <div className="relative w-full h-full min-h-screen flex items-center justify-center overflow-hidden bg-[#f5f5f5] font-sans">
            <ParticleBackground />

            {/* Initial Center Marker (□ ○ +) */}
            {phase === 'idle' && (
                <motion.div
                    className="absolute z-0 flex items-center justify-center gap-1.5 text-zinc-400 text-[10px]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                >
                    <div className="w-1.5 h-1.5 border border-zinc-400"></div>
                    <div className="w-1.5 h-1.5 border border-zinc-400 rounded-full"></div>
                    <div>+</div>
                </motion.div>
            )}

            {/* Globe Container with perspective */}
            {(phase === 'forming' || phase === 'exploding') && (
                <motion.div
                    className={`absolute inset-0 flex items-center justify-center z-10 ${phase === 'forming' ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
                    style={{ perspective: '1200px' }}
                    onPan={phase === 'forming' ? handlePan : undefined}
                >
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={globeVariants}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="relative flex items-center justify-center w-full h-full"
                    >
                        {/* Manual rotation layer */}
                        <motion.div
                            style={{
                                transformStyle: 'preserve-3d',
                                rotateX: springX,
                                rotateY: springY,
                                width: 0,
                                height: 0
                            }}
                            className="flex items-center justify-center"
                        >
                            {positions.map((pos, i) => {
                                const photoId = unsplashIds[i % unsplashIds.length];
                                const imgUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=200&h=140`;
                                const hiResUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=1200&h=800`;

                                return (
                                    <div
                                        key={i}
                                        className="absolute flex items-center justify-center pointer-events-none"
                                        style={{
                                            transform: `rotateY(${pos.rotateY}rad) rotateX(${pos.rotateX}rad)`,
                                            transformStyle: 'preserve-3d'
                                        }}
                                    >
                                        <motion.div
                                            className="w-16 h-12 sm:w-20 sm:h-14 bg-zinc-900 rounded shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] border border-zinc-800 overflow-hidden flex flex-col relative cursor-pointer pointer-events-auto"
                                            style={{
                                                transformStyle: 'preserve-3d'
                                            }}
                                            onClick={() => handleImageClick(hiResUrl)}
                                            initial={{
                                                z: 0,
                                                opacity: 0,
                                                scale: 0.5
                                            }}
                                            animate={
                                                phase === 'exploding'
                                                    ? {
                                                        z: 2000,
                                                        opacity: 0,
                                                        scale: 3,
                                                        transition: {
                                                            duration: 1.5,
                                                            ease: "easeIn",
                                                        }
                                                    }
                                                    : {
                                                        z: RADIUS,
                                                        opacity: 1,
                                                        scale: 1,
                                                        transition: {
                                                            opacity: { duration: 1, delay: i * 0.02, ease: "easeOut" },
                                                            z: { type: "spring", stiffness: 70, damping: 12, delay: i * 0.02 },
                                                            scale: { duration: 1, delay: i * 0.02, ease: "easeOut" }
                                                        }
                                                    }
                                            }
                                            whileHover={phase === 'forming' ? { scale: 1.1, z: RADIUS + 20 } : {}}
                                        >
                                            {/* Header area */}
                                            <div className="h-1.5 sm:h-2 bg-zinc-800/50 w-full flex items-center px-1 gap-0.5 border-b border-zinc-800 shrink-0">
                                                <div className="w-1 h-1 rounded-full bg-red-500/80"></div>
                                                <div className="w-1 h-1 rounded-full bg-yellow-500/80"></div>
                                                <div className="w-1 h-1 rounded-full bg-green-500/80"></div>
                                            </div>
                                            {/* Content area: image + mock UI elements */}
                                            <div className="flex-1 flex flex-col p-1 sm:p-1.5 gap-1 bg-zinc-900 pointer-events-none">
                                                {/* Top bar skeleton */}
                                                <div className="flex gap-1 items-center">
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-zinc-800 shrink-0"></div>
                                                    <div className="flex-1 space-y-0.5">
                                                        <div className="h-[2px] sm:h-1 bg-zinc-700/50 rounded w-full"></div>
                                                        <div className="h-[2px] sm:h-1 bg-zinc-800/50 rounded w-2/3"></div>
                                                    </div>
                                                </div>
                                                {/* Unsplash Image Area */}
                                                <div className="flex-1 bg-zinc-800 rounded-sm overflow-hidden relative group">
                                                    <img
                                                        src={imgUrl}
                                                        alt={`Globe image ${i}`}
                                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                                                        referrerPolicy="no-referrer"
                                                        draggable={false}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                )
                            })}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}

            {/* Focused Image View */}
            <AnimatePresence>
                {focusedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-12 cursor-pointer"
                        onClick={() => {
                            setFocusedImage(null);
                            setPhase('forming');
                        }}
                    >
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            src={focusedImage}
                            alt="Focused view"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                            referrerPolicy="no-referrer"
                        />
                        <button
                            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors"
                            onClick={() => {
                                setFocusedImage(null);
                                setPhase('forming');
                            }}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
