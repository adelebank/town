"use client";

import { useState, useEffect } from "react";
import { HomeIcon, Music, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import * as Tone from "tone";

export default function HouseThreeComponent() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [fire, setFire] = useState<
    Array<{ id: number; style: React.CSSProperties }>
  >([]);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  useEffect(() => {
    // Create synth when component mounts
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);

    return () => {
      if (synth) {
        synth.dispose();
      }
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleMusicClick = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Extended dramatic melody inspired by Night on Bald Mountain
      const melody = [
        // First phrase
        { note: "D3", duration: "8n" },
        { note: "A3", duration: "8n" },
        { note: "D4", duration: "4n" },
        { note: "C4", duration: "8n" },
        { note: "Bb3", duration: "8n" },
        { note: "A3", duration: "4n" },
        { note: "G3", duration: "8n" },
        { note: "A3", duration: "8n" },
        { note: "Bb3", duration: "4n" },
        { note: "A3", duration: "2n" },

        // Second phrase - more intense
        { note: "D4", duration: "8n" },
        { note: "F4", duration: "8n" },
        { note: "A4", duration: "4n" },
        { note: "G4", duration: "8n" },
        { note: "F4", duration: "8n" },
        { note: "E4", duration: "4n" },
        { note: "D4", duration: "8n" },
        { note: "C4", duration: "8n" },
        { note: "Bb3", duration: "4n" },

        // Third phrase - climactic
        { note: "A4", duration: "4n" },
        { note: "G4", duration: "8n" },
        { note: "F4", duration: "8n" },
        { note: "E4", duration: "4n" },
        { note: "D4", duration: "8n" },
        { note: "E4", duration: "8n" },
        { note: "F4", duration: "4n" },
        { note: "E4", duration: "2n" },

        // Final phrase - resolving
        { note: "D4", duration: "4n" },
        { note: "A3", duration: "4n" },
        { note: "D3", duration: "2n" },
      ];

      if (synth) {
        // Enhanced synth settings for a more dramatic tone
        synth.set({
          oscillator: { type: "triangle8" }, // richer harmonic content
          envelope: {
            attack: 0.1,
            decay: 0.3,
            sustain: 0.4,
            release: 0.8,
          },
          volume: -6, // slightly reduced volume to prevent clipping
        });

        let time = Tone.now();
        melody.forEach(({ note, duration }) => {
          synth.triggerAttackRelease(note, duration, time);
          time += Tone.Time(duration).toSeconds();
        });
      }
      createFire();
    } else {
      if (synth) {
        synth.triggerRelease();
      }
      setFire([]);
    }
  };

  const createFire = () => {
    const newFire = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        bottom: "0",
        animation: `flicker ${Math.random() * 2 + 1}s infinite`,
        position: "fixed" as const,
      },
    }));
    setFire(newFire);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
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
      `}</style>

      {fire.map((flame) => (
        <div
          key={flame.id}
          style={{
            ...flame.style,
            width: "16px",
            height: "16px",
            background: "#f97316",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          }}
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
          <h1 className="text-3xl font-bold text-white mb-4">Anna jr. House</h1>
          <HomeIcon className="text-white w-12 h-12" />
        </div>
      </div>
    </div>
  );
}
