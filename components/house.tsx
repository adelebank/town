"use client";

import { useState, useRef, useEffect } from "react";
import {
  ToiletIcon,
  Cloud,
  SprayCanIcon,
  IceCreamCone,
  HomeIcon,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CloudState {
  setIsCloudShown: (shown: boolean) => void;
  setIsGrowing: (growing: boolean) => void;
}

function playSineWave({ setIsCloudShown, setIsGrowing }: CloudState) {
  setIsCloudShown(true);
  setIsGrowing(true);

  const audioContext = new ((window as any).AudioContext ||
    (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(50, audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
    setIsCloudShown(false);
    setIsGrowing(false);
  }, 5000);
}

export default function HouseComponent() {
  const [isSmileShown, setIsSmileShown] = useState(false);
  const [isCloudShown, setIsCloudShown] = useState(false);
  const [isGrowing, setIsGrowing] = useState(false);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [cloudSize, setCloudSize] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleIceCreamClick = () => {
    setIsSmileShown(true);
    setTimeout(() => setIsSmileShown(false), 3000);
  };

  const handleClick = () => {
    playSineWave({ setIsCloudShown, setIsGrowing });
    setCloudSize(100); // Reset size
  };

  const handleSprayCanClick = () => {
    setIsDrawingEnabled((prev) => !prev);
  };

  useEffect(() => {
    let animationFrame: number;
    if (isCloudShown) {
      const startTime = Date.now();
      const duration = 5000; // 5 seconds
      const maxSize = 200;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const newSize = 100 + (maxSize - 100) * progress;
        setCloudSize(newSize);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isCloudShown]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    let drawing = false;

    const startDrawing = (event: MouseEvent) => {
      drawing = true;
      draw(event);
    };

    const endDrawing = () => {
      drawing = false;
      context.beginPath();
    };

    const draw = (event: MouseEvent) => {
      if (!drawing) return;

      context.lineWidth = 5;
      context.lineCap = "round";
      context.strokeStyle = "red";

      context.lineTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
      );
      context.stroke();
      context.beginPath();
      context.moveTo(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
      );
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", endDrawing);
      canvas.removeEventListener("mousemove", draw);
    };
  }, [isDrawingEnabled]);

  return (
    <>
      <div style={{ zIndex: 100, position: "relative" }}>
        <h1>House</h1>
        <HomeIcon />
        <Button variant="ghost" size="icon" onClick={handleIceCreamClick}>
          {isSmileShown ? <Smile /> : <IceCreamCone />}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSprayCanClick}>
          <SprayCanIcon />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleClick}>
          <ToiletIcon />
        </Button>
        {isCloudShown && (
          <Cloud
            style={{
              width: `${cloudSize}px`,
              height: `${cloudSize}px`,
              color: "brown",
              transition: "none",
            }}
          />
        )}
      </div>
      {isDrawingEnabled && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
          }}
        />
      )}
    </>
  );
}
