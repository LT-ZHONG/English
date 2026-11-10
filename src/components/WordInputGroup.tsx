import { useRef, useEffect, useCallback } from "react";
import { checkWord } from "@/lib/check-word";

interface WordInputGroupProps {
  words: string[];
  index: number;
  value: string;
  status: "empty" | "correct" | "wrong";
  onChange: (index: number, value: string) => void;
  onCorrect: (index: number) => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  focusIndex: number;
}

export function WordInputGroup({
  words,
  index,
  value,
  status,
  onChange,
  onCorrect,
  inputRefs,
  focusIndex,
}: WordInputGroupProps) {
  const localRef = useRef<HTMLInputElement>(null);

  const setRef = useCallback(
    (el: HTMLInputElement | null) => {
      localRef.current = el;
      inputRefs.current[index] = el;
    },
    [index, inputRefs],
  );

  useEffect(() => {
    if (focusIndex === index && localRef.current) {
      localRef.current.focus();
    }
  }, [focusIndex, index]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(index, newValue);

    if (checkWord(newValue, words[0]) === "correct" && status !== "correct") {
      onCorrect(index);
    }
  };

  const underlineColor =
    status === "correct"
      ? "bg-success"
      : status === "wrong"
        ? "bg-error"
        : "bg-foreground/15";

  const textColor =
    status === "correct"
      ? "text-success"
      : status === "wrong"
        ? "text-error"
        : "text-foreground";

  const animStyle =
    status === "correct"
      ? { animation: "successGlow 0.5s ease-out forwards" }
      : status === "wrong"
        ? { animation: "errorPulse 1.2s ease-in-out infinite" }
        : undefined;

  return (
    <div className="flex flex-col items-center mx-1.5">
      <input
        ref={setRef}
        type="text"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder=" "
        className={`
          bg-transparent border-none outline-none text-center
          font-serif text-xl sm:text-2xl
          caret-foreground/50 placeholder:text-transparent
          ${textColor}
          focus:outline-none
        `}
        style={{
          width: `${Math.max(value.length, 3) + 1.5}ch`,
          minWidth: "3.5ch",
          transition: "width 0.15s ease, color 0.2s ease",
          ...animStyle,
        }}
      />
      <div
        className={`h-[2px] w-full rounded-full mt-1.5 transition-colors duration-300 ${underlineColor}`}
      />
    </div>
  );
}
