"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CharacterSelect() {
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (isSubmitted) {
      let start = 0;
      const interval = setInterval(() => {
        start += 1;
        setProgress(start);
        if (start === 100) {
          clearInterval(interval);
          if (selectedCharacter === "frost-jr") {
            router.push("/house2");
          } else if (selectedCharacter === "musical-jr") {
            router.push("/house3");
          } else {
            router.push("/house");
          }
        }
      }, 20);
    }
  }, [isSubmitted, router, selectedCharacter]);

  const handleCharacterSelect = () => {
    router.push("/house");
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        selectedCharacter === "gege-jr-jr"
          ? "bg-blue-900"
          : selectedCharacter === "frost-jr"
          ? "bg-white"
          : selectedCharacter === "musical-jr"
          ? "bg-red-500"
          : selectedCharacter === "other"
          ? "bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500"
          : "bg-pink-500"
      }`}
    >
      <Card className="max-w-md w-full">
        {!isSubmitted && (
          <>
            <CardHeader>
              <CardTitle>Choose Your Character</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => setSelectedCharacter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Who is Your Character" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gege-jr-jr">Gege Jr. Jr.</SelectItem>
                  <SelectItem value="meimei-jr-jr">Mei Mei Jr. Jr.</SelectItem>
                  <SelectItem value="frost-jr">Frost Jr.</SelectItem>
                  <SelectItem value="musical-jr">Musical Jr.</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </>
        )}
        <CardFooter className="flex justify-center items-center">
          {!isSubmitted && (
            <Button
              variant="ghost"
              className="opacity-50 hover:opacity-100 transition-opacity"
              onClick={handleSubmit}
            >
              Secret Button 👻
            </Button>
          )}
          {isSubmitted && <Progress value={progress} />}
        </CardFooter>
      </Card>
    </div>
  );
}
