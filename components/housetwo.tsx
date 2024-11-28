"use client";

import { HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HouseTwoComponent() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div style={{ zIndex: 100, position: "relative" }}>
      <button onClick={handleBack}>Go Back</button>
      <h1>Elsa Jr&apos;s House</h1>
      <HomeIcon />
    </div>
  );
}
