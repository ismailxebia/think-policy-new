"use client";

import { useEffect, useState } from "react";

type Phase = "typing" | "holding" | "deleting" | "switching";

interface TypewriterWordProps {
  words: string[];
  className?: string;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}

export default function TypewriterWord({
  words,
  className,
  typeMs = 80,
  deleteMs = 40,
  holdMs = 1700,
}: TypewriterWordProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    const word = words[wordIndex];
    let timeout: number | undefined;

    if (phase === "typing") {
      if (length < word.length) {
        timeout = window.setTimeout(() => setLength((l) => l + 1), typeMs);
      } else {
        timeout = window.setTimeout(() => setPhase("holding"), 0);
      }
    } else if (phase === "holding") {
      timeout = window.setTimeout(() => setPhase("deleting"), holdMs);
    } else if (phase === "deleting") {
      if (length > 0) {
        timeout = window.setTimeout(() => setLength((l) => l - 1), deleteMs);
      } else {
        timeout = window.setTimeout(() => setPhase("switching"), 0);
      }
    } else {
      timeout = window.setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase("typing");
      }, 350);
    }

    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, [phase, length, wordIndex, words, typeMs, deleteMs, holdMs]);

  return (
    <span className={className}>
      {words[wordIndex].slice(0, length)}
      <span
        aria-hidden="true"
        className="inline-block w-[0.5em] animate-[cursor-blink_1.05s_step-end_infinite] text-white/70"
      >
        |
      </span>
    </span>
  );
}
