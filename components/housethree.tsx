"use client";

import { useState, useEffect } from "react";
import { HomeIcon, Music, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import * as Tone from "tone";

export default function HouseThreeComponent() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [stars, setStars] = useState<
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
      // Ode to Joy melody
      const melody = [
        { note: "E4", duration: "4n" },
        { note: "E4", duration: "4n" },
        { note: "F4", duration: "4n" },
        { note: "G4", duration: "4n" },
        { note: "G4", duration: "4n" },
        { note: "F4", duration: "4n" },
        { note: "E4", duration: "4n" },
        { note: "D4", duration: "4n" },
        { note: "C4", duration: "4n" },
        { note: "C4", duration: "4n" },
        { note: "D4", duration: "4n" },
        { note: "E4", duration: "4n" },
        { note: "E4", duration: "4n." },
        { note: "D4", duration: "8n" },
        { note: "D4", duration: "2n" },
      ];

      if (synth) {
        // Start playing from the beginning
        let time = Tone.now();
        melody.forEach(({ note, duration }) => {
          synth.triggerAttackRelease(note, duration, time);
          // Add time based on duration
          time += Tone.Time(duration).toSeconds();
        });
      }
      createStars();
    } else {
      if (synth) {
        synth.triggerRelease();
      }
      setStars([]);
    }
  };

  const createStars = () => {
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        animation: `twinkle ${Math.random() * 2 + 1}s infinite`,
        position: "fixed" as const,
      },
    }));
    setStars(newStars);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <style jsx global>{`
        @keyframes twinkle {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>

      {stars.map((star) => (
        <Stars
          key={star.id}
          size={16}
          style={star.style}
          className="text-yellow-300"
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
          <h1 className="text-3xl font-bold text-white mb-4">Musical House</h1>
          <HomeIcon className="text-white w-12 h-12" />
        </div>
      </div>
    </div>
  );
}
