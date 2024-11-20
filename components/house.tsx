"use client";

import { useState } from "react";
import { HomeIcon } from "lucide-react";
import { ToiletIcon, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

function playSineWave(setIsCloudShown: Function, setIsGrowing: Function) {
  setTimeout(() => {
    setIsGrowing(true);
  }, 0);
  setIsCloudShown(true);
  const audioContext = new ((window as any).AudioContext ||
    (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(50, audioContext.currentTime); // 50 Hz for a low frequency sound
  oscillator.connect(audioContext.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    setIsCloudShown(false);
    setIsGrowing(false);
  }, 5000);
}

export default function HouseComponent() {
  const [isCloudShown, setIsCloudShown] = useState(false);
  const [isGrowing, setIsGrowing] = useState(false);

  const handleClick = () => {
    playSineWave(setIsCloudShown, setIsGrowing);
  };

  return (
    <div>
      <h1>House</h1>
      <HomeIcon />
      <Button variant="ghost" size="icon" onClick={handleClick}>
        <ToiletIcon />
      </Button>
      {isCloudShown && (
        <Cloud
          style={{
            width: isGrowing ? "200px" : "100px",
            height: isGrowing ? "200px" : "100px",
            color: "brown",
            transition: "width 5s, height 5s",
          }}
        />
      )}
    </div>
  );
}
