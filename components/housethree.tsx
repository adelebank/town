"use client";

import { useState, useEffect } from "react";
import { HomeIcon, Music, Stars, Skull, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import * as Tone from "tone";

interface MelodyNote {
  note: string;
  duration: string;
  time: string | number;
}

export default function HouseThreeComponent() 
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [fire, setFire] = useState<
    Array<{ id: number; style: React.CSSProperties }>
  >([]);
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [stars, setStars] = useState<
    Array<{ id: number; style: React.CSSProperties }>
  >([]);
  const [meteors, setMeteors] = useState<
    Array<{ id: number; style: React.CSSProperties }>
  >([]);
  const [orbitingObjects, setOrbitingObjects] = useState<
    Array<{ id: number; style: React.CSSProperties }>
  >([]);
  const [asteroids, setAsteroids] = useState<
    Array<{ id: number; style: React.CSSProperties }>
  >([]);
  const [planets, setPlanets] = useState<
    Array<{ id: number; style: React.CSSProperties; type: string }>
  >([]);
  const [spaceships, setSpaceships] = useState<
    Array<{
      id: number;
      style: React.CSSProperties;
      type: "rebel" | "empire";
      rotation: number;
    }>
  >([]);
  const [lasers, setLasers] = useState<
    Array<{
      id: number;
      style: React.CSSProperties;
      color: string;
    }>
  >([]);
  const [playerShip, setPlayerShip] = useState<{
    x: number;
    y: number;
    rotation: number;
    speed: number;
  }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    rotation: 0,
    speed: 5,
  });

  useEffect(() => {
    const newSynth = new Tone.PolySynth(Tone.FMSynth).toDestination();
    newSynth.set({
      harmonicity: 2,
      modulationIndex: 3.5,
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.8,
        release: 4,
      },
      modulation: {
        type: "square",
      },
      modulationEnvelope: {
        attack: 0.5,
        decay: 0,
        sustain: 1,
        release: 0.5,
      },
    });
    setSynth(newSynth);
    createStars();
    createOrbitingObjects();
    createAsteroids();
    createPlanets();
    createSpaceships();

    const meteorInterval = setInterval(createMeteor, 3000);
    const battleInterval = setInterval(() => {
      fireLasers();
    }, 2000);

    return () => {
      clearInterval(meteorInterval);
      if (synth) synth.dispose();
      Tone.Transport.stop();
      Tone.Transport.cancel();
      clearInterval(battleInterval);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          setPlayerShip((prev) => ({
            ...prev,
            rotation: prev.rotation - 5,
          }));
          break;
        case "ArrowRight":
          setPlayerShip((prev) => ({
            ...prev,
            rotation: prev.rotation + 5,
          }));
          break;
        case "ArrowUp":
          setPlayerShip((prev) => ({
            ...prev,
            x: prev.x + prev.speed * Math.sin((prev.rotation * Math.PI) / 180),
            y: prev.y - prev.speed * Math.cos((prev.rotation * Math.PI) / 180),
          }));
          break;
        case "ArrowDown":
          setPlayerShip((prev) => ({
            ...prev,
            x: prev.x - prev.speed * Math.sin((prev.rotation * Math.PI) / 180),
            y: prev.y + prev.speed * Math.cos((prev.rotation * Math.PI) / 180),
          }));
          break;
        case " ": // Spacebar
          firePlayerLaser();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerShip.rotation]);

  const handleBack = () => {
    router.back();
  };

  const handleMusicClick = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Start audio context first
      Tone.start();

      const melody: MelodyNote[] = [
        // Main Theme
        { note: "G4", duration: "8n", time: 0 },
        { note: "E4", duration: "8n", time: "8n" },
        { note: "C4", duration: "4n", time: "4n" },
        { note: "G4", duration: "4n", time: "2n" },
        { note: "E4", duration: "4n", time: "2n + 4n" },
        { note: "C5", duration: "4n", time: "1n" },
        // Bridge
        { note: "B4", duration: "8n", time: "1n + 4n" },
        { note: "A4", duration: "8n", time: "1n + 4n + 8n" },
        { note: "G4", duration: "4n", time: "1n + 2n" },
        { note: "E4", duration: "2n", time: "2n" },
        // Additional melody
        { note: "F4", duration: "8n", time: "3n" },
        { note: "D4", duration: "8n", time: "3n + 8n" },
        { note: "E4", duration: "4n", time: "3n + 4n" },
        { note: "C4", duration: "2n", time: "4n" },
        // Final flourish
        { note: "G5", duration: "8n", time: "5n" },
        { note: "E5", duration: "8n", time: "5n + 8n" },
        { note: "C5", duration: "2n", time: "5n + 4n" },
      ];

      if (synth) {
        // Create a new sequence for better timing
        const seq = new Tone.Part(
          ((time: number, value: MelodyNote) => {
            if (typeof value === "object" && "note" in value) {
              synth.triggerAttackRelease(value.note, value.duration, time);
            }
          }) as any,
          melody.map((note) => [note.time, note])
        ).start(0);

        // Start transport
        Tone.Transport.start();
      }
      createFire();
    } else {
      // Stop all audio
      Tone.Transport.stop();
      if (synth) {
        synth.releaseAll();
      }
      setFire([]);
    }
  };

  const createFire = () => {
    const newFire = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        bottom: `${Math.random() * 20}vh`,
        animation: `flicker ${Math.random() * 3 + 2}s infinite linear`,
        position: "fixed" as const,
      },
    }));
    setFire(newFire);
  };

  const createStars = () => {
    const newStars = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        animation: `twinkle ${Math.random() * 5 + 2}s infinite`,
        position: "fixed" as const,
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        backgroundColor: Math.random() > 0.5 ? "#fff" : "#90cdf4",
      },
    }));
    setStars(newStars);
  };

  const createMeteor = () => {
    const meteor = {
      id: Date.now(),
      style: {
        left: `${Math.random() * 100}vw`,
        top: "-10px",
        position: "fixed" as const,
        animation: `meteor ${Math.random() * 2 + 1}s linear forwards`,
      },
    };
    setMeteors((prev) => [...prev.slice(-5), meteor]);
  };

  const createOrbitingObjects = () => {
    const objects = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      style: {
        left: "50%",
        top: "50%",
        position: "fixed" as const,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        animation: `orbit ${Math.random() * 20 + 10}s infinite linear`,
        transformOrigin: `${Math.random() * 200 - 100}px ${
          Math.random() * 200 - 100
        }px`,
      },
    }));
    setOrbitingObjects(objects);
  };

  const createAsteroids = () => {
    const rocks = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        position: "fixed" as const,
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 10 + 5}px`,
        animation: `float ${Math.random() * 15 + 10}s infinite linear`,
        transform: `rotate(${Math.random() * 360}deg)`,
      },
    }));
    setAsteroids(rocks);
  };

  const createPlanets = () => {
    const planetTypes = ["mars", "jupiter", "saturn"];
    const newPlanets = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      type: planetTypes[i],
      style: {
        position: "fixed" as const,
        width: `${(i + 1) * 50}px`,
        height: `${(i + 1) * 50}px`,
        left: `${Math.random() * 70 + 15}vw`,
        top: `${Math.random() * 70 + 15}vh`,
        animation: `float ${Math.random() * 30 + 20}s infinite ease-in-out`,
      },
    }));
    setPlanets(newPlanets);
  };

  const createSpaceships = () => {
    const ships = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      type: i % 2 === 0 ? "rebel" : ("empire" as const),
      style: {
        position: "fixed" as const,
        left: `${Math.random() * 80 + 10}vw`,
        top: `${Math.random() * 80 + 10}vh`,
        width: "40px",
        height: "40px",
        transform: `rotate(${Math.random() * 360}deg)`,
        animation: `fly${i} ${Math.random() * 10 + 15}s infinite linear`,
      },
      rotation: Math.random() * 360,
    }));
  };

  const fireLasers = () => {
    spaceships.forEach((ship) => {
      const target = spaceships.find((s) => s.type !== ship.type);
      if (target) {
        const laser = {
          id: Date.now() + Math.random(),
          style: {
            position: "fixed" as const,
            left: ship.style.left,
            top: ship.style.top,
            width: "2px",
            height: "10px",
            transform: `rotate(${ship.rotation}deg)`,
            animation: "laserShot 1s linear forwards",
          },
          color: ship.type === "rebel" ? "#ff0000" : "#00ff00",
        };
        setLasers((prev) => [...prev, laser]);

        // Remove laser after animation
        setTimeout(() => {
          setLasers((prev) => prev.filter((l) => l.id !== laser.id));
        }, 1000);
      }
    });
  };

  const firePlayerLaser = () => {
    const laser = {
      id: Date.now() + Math.random(),
      style: {
        position: "fixed" as const,
        left: `${playerShip.x}px`,
        top: `${playerShip.y}px`,
        width: "3px",
        height: "15px",
        transform: `rotate(${playerShip.rotation}deg)`,
        animation: "playerLaserShot 0.5s linear forwards",
      },
      color: "#00ffff", // Cyan color for player lasers
    };
    setLasers((prev) => [...prev, laser]);

    // Remove laser after animation
    setTimeout(() => {
      setLasers((prev) => prev.filter((l) => l.id !== laser.id));
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/nebula-bg.jpg')",
          filter: "brightness(0.8)",
        }}
      />

      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-purple-900/30 to-black/40 z-1" />

      <div className="aurora z-2" />

      <style jsx global>{`
        @keyframes flicker {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-40px) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .title-glow {
          text-shadow: 0 0 10px #f472b6, 0 0 20px #f472b6, 0 0 30px #f9a8d4,
            0 0 40px #f9a8d4;
          animation: pulse 2s infinite;
          transition: transform 0.3s ease;
        }

        .title-glow:hover {
          transform: scale(1.1);
          text-shadow: 0 0 20px #f472b6, 0 0 40px #f472b6, 0 0 60px #f9a8d4,
            0 0 80px #f9a8d4;
        }

        @keyframes pulse {
          0%,
          100% {
            text-shadow: 0 0 10px #4299e1, 0 0 20px #4299e1, 0 0 30px #63b3ed,
              0 0 40px #63b3ed;
            transform: translateY(0);
          }
          50% {
            text-shadow: 0 0 20px #4299e1, 0 0 30px #90cdf4, 0 0 40px #90cdf4,
              0 0 50px #90cdf4;
            transform: translateY(-5px);
          }
        }

        @keyframes meteor {
          0% {
            transform: translate(0, 0) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: translate(-100px, 100vh) rotate(-45deg);
            opacity: 0;
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(100px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(100px) rotate(-360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, 20px) rotate(90deg);
          }
          50% {
            transform: translate(0, 40px) rotate(180deg);
          }
          75% {
            transform: translate(-20px, 20px) rotate(270deg);
          }
        }

        .aurora {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 60vh;
          background: linear-gradient(
            0deg,
            transparent,
            rgba(244, 114, 182, 0.2),
            rgba(216, 180, 254, 0.2)
          );
          filter: blur(60px);
          animation: aurora 15s infinite;
        }

        @keyframes aurora {
          0%,
          100% {
            opacity: 0.5;
            transform: translateY(0);
          }
          50% {
            opacity: 0.8;
            transform: translateY(20px);
          }
        }

        .planet-mars {
          background: radial-gradient(
            circle at 30% 30%,
            #ffd7c9,
            // Lightest surface highlight
            #ffa07a 20%,
            // Light coral
            #e85d04 40%,
            // Bright orange-red
            #dc2626 60%,
            // Mars red
            #991b1b 80%,
            // Dark red
            #7f1d1d 90% // Darkest shadow
          );
          box-shadow: inset -30px -30px 80px #7f1d1d,
            inset 20px 20px 60px rgba(255, 160, 122, 0.6),
            0 0 80px rgba(220, 38, 38, 0.5);
          border-radius: 50%;
          &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E"),
              radial-gradient(
                circle at 70% 70%,
                rgba(255, 255, 255, 0.2) 0%,
                transparent 50%
              );
            border-radius: 50%;
            mix-blend-mode: overlay;
          }
          &::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: repeating-conic-gradient(
              from 0deg,
              rgba(128, 0, 0, 0.15) 0deg 10deg,
              transparent 10deg 20deg
            );
            border-radius: 50%;
            filter: blur(2px);
          }
        }

        .planet-jupiter {
          background: repeating-linear-gradient(
              170deg,
              #fef3c7 0px,
              // Lightest cream
              #fbbf24 10px,
              // Bright yellow
              #d97706 20px,
              // Orange
              #92400e 30px,
              // Dark orange
              #78350f 40px,
              // Brown
              #451a03 50px // Darkest brown
            ),
            radial-gradient(
              circle at 40% 40%,
              rgba(251, 191, 36, 0.9),
              transparent 70%
            );
          border-radius: 50%;
          box-shadow: inset -40px -40px 80px #451a03,
            inset 30px 30px 60px rgba(251, 191, 36, 0.6),
            0 0 100px rgba(251, 191, 36, 0.4);
          &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(
              circle at 30% 30%,
              rgba(254, 243, 199, 0.3) 0%,
              transparent 50%
            );
            border-radius: 50%;
            filter: blur(5px);
          }
          &::after {
            content: "";
            position: absolute;
            width: 120%;
            height: 120%;
            top: -10%;
            left: -10%;
            background: repeating-conic-gradient(
              from 45deg,
              rgba(120, 53, 15, 0.3) 0deg 5deg,
              transparent 5deg 15deg
            );
            border-radius: 50%;
            animation: jupiterBands 100s linear infinite;
          }
        }

        .planet-saturn {
          background: linear-gradient(
              45deg,
              #fef3c7,
              // Cream
              #fcd34d,
              // Light yellow
              #d97706,
              // Orange
              #92400e,
              // Dark orange
              #78350f // Brown
            ),
            radial-gradient(
              circle at 30% 30%,
              rgba(253, 230, 138, 0.7),
              transparent 60%
            );
          border-radius: 50%;
          box-shadow: inset -35px -35px 70px #78350f,
            inset 25px 25px 50px rgba(253, 230, 138, 0.6),
            0 0 90px rgba(251, 191, 36, 0.4);
          &::before {
            content: "";
            position: absolute;
            width: 200%;
            height: 30px;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(251, 191, 36, 0.9) 20%,
              rgba(217, 119, 6, 0.9) 50%,
              rgba(146, 64, 14, 0.9) 80%,
              transparent 100%
            );
            left: -50%;
            top: 48%;
            transform: rotate(-20deg);
            border-radius: 50%;
            filter: blur(1px);
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.4),
              inset 0 0 30px rgba(0, 0, 0, 0.5);
          }
          &::after {
            content: "";
            position: absolute;
            width: 220%;
            height: 40px;
            background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(251, 191, 36, 0.7) 30%,
                rgba(217, 119, 6, 0.7) 50%,
                rgba(146, 64, 14, 0.7) 70%,
                transparent 100%
              ),
              repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.3) 0px,
                transparent 4px
              );
            left: -60%;
            top: 45%;
            transform: rotate(-20deg);
            border-radius: 50%;
            filter: blur(0.5px);
          }
        }

        @keyframes jupiterBands {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .star-field {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .nebula {
          position: fixed;
          width: 100%;
          height: 100%;
          background: radial-gradient(
              circle at 30% 50%,
              rgba(244, 114, 182, 0.2) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 70% 50%,
              rgba(192, 132, 252, 0.2) 0%,
              transparent 50%
            );
          pointer-events: none;
        }

        .player-ship {
          position: fixed;
          width: 50px;
          height: 50px;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          background: linear-gradient(45deg, #60a5fa, #3b82f6);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5),
            0 0 40px rgba(59, 130, 246, 0.3);
          transform-origin: center;
          transition: transform 0.1s ease;
          z-index: 100;
        }

        .player-ship::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 30px;
          background: linear-gradient(
            to bottom,
            rgba(59, 130, 246, 0.8),
            transparent
          );
          opacity: 0;
          transition: opacity 0.2s;
        }

        .player-ship.thrusting::after {
          opacity: 1;
        }

        @keyframes playerLaserShot {
          0% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(-1000px);
            opacity: 0;
          }
        }
      `}</style>

      <div className="aurora" />

      <div className="fixed inset-0 bg-black opacity-30">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-40 h-40 blur-xl"
            style={{
              background: `radial-gradient(circle at center, 
                rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
                Math.random() * 255
              }, 0.3),
                transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {planets.map((planet) => (
        <div
          key={planet.id}
          style={planet.style}
          className={`planet-${planet.type}`}
        />
      ))}

      {orbitingObjects.map((obj) => (
        <div
          key={obj.id}
          style={obj.style}
          className="bg-white rounded-full shadow-glow"
        />
      ))}

      {asteroids.map((asteroid) => (
        <div
          key={asteroid.id}
          style={asteroid.style}
          className="bg-gray-600 rounded-sm"
        />
      ))}

      <div className="nebula" />

      <div className="star-field">
        {stars.map((star) => (
          <div
            key={star.id}
            style={star.style}
            className="rounded-full shadow-glow"
          />
        ))}
      </div>

      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          style={meteor.style}
          className="w-1 h-20 bg-gradient-to-b from-white via-pink-300 to-transparent"
        />
      ))}

      {fire.map((particle) => (
        <div
          key={particle.id}
          style={{
            ...particle.style,
            background:
              "radial-gradient(circle at center, white, #f9a8d4, transparent)",
            boxShadow: "0 0 20px #f9a8d4, 0 0 40px #f472b6",
            width: "4px",
            height: "4px",
          }}
          className="rounded-full"
        />
      ))}

      {spaceships.map((ship) => (
        <div
          key={ship.id}
          style={ship.style}
          className={`planet-${ship.type}`}
        />
      ))}

      {lasers.map((laser) => (
        <div
          key={laser.id}
          style={laser.style}
          className="w-1 h-20 bg-gradient-to-b from-white via-pink-300 to-transparent"
        />
      ))}

      <div className="relative z-10 p-6 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-white hover:text-gray-300"
          >
            ← Back
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMusicClick}
            className="text-white hover:text-gray-300"
          >
            <Music className={isPlaying ? "text-blue-500" : ""} />
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-pink-500 mb-4 title-glow cursor-pointer">
            Space Station
          </h1>
          <Stars className="text-pink-400 w-12 h-12 animate-bounce hover:scale-125 transition-transform" />
        </div>
      </div>
       </div>
