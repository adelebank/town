"use client";

import { HomeIcon, Snowflake } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function HouseTwoComponent() {
  const router = useRouter();
  const [snowflakeMode, setSnowflakeMode] = useState(false);
  const [snowflakes, setSnowflakes] = useState<
    Array<{ id: number; x: number; y: number; angle: number }>
  >([]);
  let snowflakeId = 0;

  useEffect(() => {
    if (snowflakeMode) {
      const createSnowflake = (x: number, y: number) => {
        const newSnowflake = {
          id: snowflakeId++,
          x,
          y,
          angle: Math.random() * 360,
        };
        setSnowflakes((prev) => [...prev, newSnowflake]);
      };

      const interval = setInterval(() => {
        setSnowflakes((prev) =>
          prev
            .filter((s) => s.y < window.innerHeight + 50)
            .map((s) => ({
              ...s,
              x: s.x + Math.sin(s.angle) * 2,
              y: s.y + 2,
              angle: s.angle + 0.02,
            }))
        );
      }, 50);

      const handleMouseMove = (e: MouseEvent) => {
        if (Math.random() < 0.3) {
          // 30% chance to create snowflake on mouse move
          createSnowflake(e.clientX, e.clientY);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        clearInterval(interval);
        setSnowflakes([]);
      };
    }
  }, [snowflakeMode]);

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <style jsx global>{`
        .snowflake {
          position: fixed;
          color: #a8d5ff;
          pointer-events: none;
          z-index: 9999;
          animation: fall 2s linear;
        }
        @keyframes fall {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.5);
          }
        }
        ${snowflakeMode ? "body { cursor: none; }" : ""}
      `}</style>

      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="snowflake"
          style={{
            left: `${snowflake.x}px`,
            top: `${snowflake.y}px`,
          }}
        >
          ❄
        </div>
      ))}

      <div style={{ zIndex: 100, position: "relative" }}>
        <button onClick={handleBack}>Go Back</button>
        <h1>Elsa Jr&apos;s House</h1>
        <HomeIcon />
        <button onClick={() => setSnowflakeMode(!snowflakeMode)}>
          <Snowflake size={20} />
        </button>
      </div>
    </>
  );
}
