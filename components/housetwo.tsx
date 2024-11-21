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
  const [isSmileShown, setIsSmileShown] = useState(false);
  const [isCloudShown, setIsCloudShown] = useState(false);
  const [isGrowing, setIsGrowing] = useState(false);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleIceCreamClick = () => {
    setIsSmileShown(true);
    setTimeout(() => {
      setIsSmileShown(false);
    }, 3000);
  };

  const handleClick = () => {
    playSineWave(setIsCloudShown, setIsGrowing);
  };

  const handleSprayCanClick = () => {
    if (isDrawingEnabled) {
      setIsDrawingEnabled(false);
    } else {
      setIsDrawingEnabled(true);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    const context = canvas?.getContext("2d");
    let drawing = false;
    const startDrawing = (event: MouseEvent) => {
      drawing = true;
      draw(event);
    };

    const endDrawing = () => {
      drawing = false;
      context?.beginPath();
    };

    const draw = (event: MouseEvent) => {
      if (!drawing) return;
      if (context && canvas) {
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
      }
    };
    canvas?.addEventListener("mousedown", startDrawing);
    canvas?.addEventListener("mouseup", endDrawing);
    canvas?.addEventListener("mousemove", draw);

    return () => {
      canvas?.removeEventListener("mousedown", startDrawing);
      canvas?.removeEventListener("mouseup", endDrawing);
      canvas?.removeEventListener("mousemove", draw);
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
              width: isGrowing ? "200px" : "100px",
              height: isGrowing ? "200px" : "100px",
              color: "brown",
              transition: "width 5s, height 5s",
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
