"use client";

import { useState } from "react";
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

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        selectedCharacter === "gege-jr-jr"
          ? "bg-blue-900"
          : selectedCharacter === "else-jr"
          ? "bg-white"
          : selectedCharacter === "anna-jr"
          ? "bg-red-500"
          : selectedCharacter === "other"
          ? "bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500"
          : "bg-pink-500"
      }`}
    >
      <Card className="max-w-md w-full">
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
              <SelectItem value="anna-jr">Anna Jr.</SelectItem>
              <SelectItem value="else-jr">Elsa Jr.</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
