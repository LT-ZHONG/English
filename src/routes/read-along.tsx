import { useState, useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mic, MicOff, Volume2, Play, RotateCcw } from "lucide-react";
import { dictationScenes } from "@/data/dictationData";

export const Route = createFileRoute("/read-along")({
  component: ReadAlongPage,
});

function ReadAlongPage() {
  const navigate = useNavigate();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [levelIdx, setLevelIdx] = useState(0);
  const [sentIdx, setSentIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [wordResults, setWordResults] = useState<
    Array<{ word: string; status: "correct" | "wrong" | "missing" }>
  >([]);

  const recognitionRef = useRef<any>(null);

  const scene = dictationScenes[sceneIdx];
  const level = scene.levels[levelIdx];
  const sentence = level.sentences[sentIdx];
  const targetWords = sentence.wordGroups.flat().filter((w) => w !== "/");
  const targetText = targetWords.join(" ");
  const calculateAccuracyRef = useRef<(transcript: string) => void>(() => {});

  calculateAccuracyRef.current = (transcript: string) => {
    const spokenWords = transcript.toLowerCase().split(/\s+/);
    const results: Array<{ word: string; status: "correct" | "wrong" | "missing" }> = [];
    let correctCount = 0;

    targetWords.forEach((targetWord) => {
      const target = targetWord.toLowerCase();
      const found = spokenWords.find((w) => w === target);

      if (found) {
        results.push({ word: targetWord, status: "correct" });
        correctCount++;
      } else {
        results.push({ word: targetWord, status: "missing" });
      }
    });

    spokenWords.forEach((spoken) => {
      if (!targetWords.some((t) => t.toLowerCase() === spoken)) {
        results.push({ word: spoken, status: "wrong" });
      }
    });

    setWordResults(results);
    const acc = Math.round((correctCount / targetWords.length) * 100);
    setAccuracy(acc);
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setRecognizedText(transcript);
        calculateAccuracyRef.current(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    setRecognizedText("");
    setAccuracy(null);
    setWordResults([]);
  }, [sceneIdx, levelIdx, sentIdx]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setRecognizedText("");
      setAccuracy(null);
      setWordResults([]);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const playAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(targetText);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const reset = () => {
    setRecognizedText("");
    setAccuracy(null);
    setWordResults([]);
  };

  const goNext = () => {
    if (sentIdx < level.sentences.length - 1) {
      setSentIdx(sentIdx + 1);
    } else if (levelIdx < scene.levels.length - 1) {
      setLevelIdx(levelIdx + 1);
      setSentIdx(0);
    } else if (sceneIdx < dictationScenes.length - 1) {
      setSceneIdx(sceneIdx + 1);
      setLevelIdx(0);
      setSentIdx(0);
    }
  };

  const goPrev = () => {
    if (sentIdx > 0) {
      setSentIdx(sentIdx - 1);
    } else if (levelIdx > 0) {
      setLevelIdx(levelIdx - 1);
      const prevLevel = scene.levels[levelIdx - 1];
      setSentIdx(prevLevel.sentences.length - 1);
    } else if (sceneIdx > 0) {
      setSceneIdx(sceneIdx - 1);
      const prevScene = dictationScenes[sceneIdx - 1];
      setLevelIdx(prevScene.levels.length - 1);
      const lastLevel = prevScene.levels[prevScene.levels.length - 1];
      setSentIdx(lastLevel.sentences.length - 1);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Header */}
      <header
        className="px-5 sm:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--dict-footer-border)" }}
      >
        <button
          onClick={() => navigate({ to: "/" })}
          className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: "var(--dict-nav-arrow-disabled)",
            color: "var(--dict-nav-arrow-disabled-fg)",
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">跟读练习</h1>
        <div className="w-9" />
      </header>

      <main className="flex-1 px-5 sm:px-8 py-6 max-w-3xl mx-auto w-full">
        {/* Category Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <select
              value={sceneIdx}
              onChange={(e) => {
                setSceneIdx(Number(e.target.value));
                setLevelIdx(0);
                setSentIdx(0);
              }}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--dict-card-bg)",
                color: "var(--foreground)",
                border: "1px solid var(--dict-card-border)",
              }}
            >
              {dictationScenes.map((s, i) => (
                <option key={i} value={i}>
                  {s.scene}
                </option>
              ))}
            </select>
            <select
              value={levelIdx}
              onChange={(e) => {
                setLevelIdx(Number(e.target.value));
                setSentIdx(0);
              }}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--dict-card-bg)",
                color: "var(--foreground)",
                border: "1px solid var(--dict-card-border)",
              }}
            >
              {scene.levels.map((l, i) => (
                <option key={i} value={i}>
                  {l.level}
                </option>
              ))}
            </select>
            <select
              value={sentIdx}
              onChange={(e) => setSentIdx(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg text-sm flex-1"
              style={{
                backgroundColor: "var(--dict-card-bg)",
                color: "var(--foreground)",
                border: "1px solid var(--dict-card-border)",
              }}
            >
              {level.sentences.map((_, i) => (
                <option key={i} value={i}>
                  第 {i + 1} 题
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Sentence */}
        <div
          className="p-6 rounded-xl mb-6"
          style={{
            backgroundColor: "var(--dict-card-bg)",
            border: "1px solid var(--dict-card-border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: "var(--dict-shortcut-fg)" }}>
              目标句子
            </span>
            <button
              onClick={playAudio}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
              }}
              title="播放标准发音"
            >
              <Volume2 size={18} />
            </button>
          </div>
          <p
            className="text-xl font-serif leading-relaxed"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {targetText}
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--dict-shortcut-fg)" }}
          >
            {sentence.chinese}
          </p>
        </div>

        {/* Recording Area */}
        <div
          className="p-6 rounded-xl mb-6"
          style={{
            backgroundColor: "var(--dict-card-bg)",
            border: "1px solid var(--dict-card-border)",
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={isListening ? stopListening : startListening}
              className="p-4 rounded-full transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isListening
                  ? "var(--color-error)"
                  : "var(--color-success)",
                color: "var(--color-primary-foreground)",
              }}
              title={isListening ? "停止录音" : "开始录音"}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button
              onClick={reset}
              className="p-3 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "var(--dict-nav-arrow-disabled)",
                color: "var(--dict-nav-arrow-disabled-fg)",
              }}
              title="重置"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          {isListening && (
            <div
              className="text-center text-sm mb-4"
              style={{ color: "var(--color-error)" }}
            >
              正在录音...请朗读句子
            </div>
          )}

          {recognizedText && (
            <div className="mt-4">
              <div className="text-sm mb-2" style={{ color: "var(--dict-shortcut-fg)" }}>
                识别结果
              </div>
              <p className="text-lg font-serif" style={{ fontFamily: "var(--font-serif)" }}>
                {recognizedText}
              </p>
            </div>
          )}
        </div>

        {/* Accuracy Results */}
        {accuracy !== null && (
          <div
            className="p-6 rounded-xl mb-6"
            style={{
              backgroundColor: "var(--dict-card-bg)",
              border: "1px solid var(--dict-card-border)",
            }}
          >
            <div className="text-center mb-4">
              <div className="text-sm mb-2" style={{ color: "var(--dict-shortcut-fg)" }}>
                发音准确度
              </div>
              <div
                className="text-4xl font-bold"
                style={{
                  color:
                    accuracy >= 80
                      ? "var(--color-success)"
                      : accuracy >= 60
                      ? "var(--color-warning, oklch(0.75 0.15 80))"
                      : "var(--color-error)",
                }}
              >
                {accuracy}%
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm mb-3" style={{ color: "var(--dict-shortcut-fg)" }}>
                单词对比
              </div>
              <div className="flex flex-wrap gap-2">
                {wordResults.map((result, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-sm font-serif"
                    style={{
                      fontFamily: "var(--font-serif)",
                      backgroundColor:
                        result.status === "correct"
                          ? "var(--dict-badge-success-bg)"
                          : result.status === "wrong"
                          ? "var(--dict-badge-error-bg)"
                          : "var(--dict-badge-neutral-bg)",
                      color:
                        result.status === "correct"
                          ? "var(--dict-badge-success-fg)"
                          : result.status === "wrong"
                          ? "var(--dict-badge-error-fg)"
                          : "var(--dict-badge-neutral-fg)",
                      border: `1px solid ${
                        result.status === "correct"
                          ? "var(--dict-badge-success-border)"
                          : result.status === "wrong"
                          ? "var(--dict-badge-error-border)"
                          : "var(--dict-badge-neutral-border)"
                      }`,
                      textDecoration: result.status === "missing" ? "line-through" : "none",
                    }}
                  >
                    {result.word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={goPrev}
            disabled={sentIdx === 0 && levelIdx === 0 && sceneIdx === 0}
            className="p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: "var(--dict-nav-arrow-disabled)",
              color: "var(--dict-nav-arrow-disabled-fg)",
            }}
          >
            <Play size={22} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button
            onClick={goNext}
            className="p-3 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "var(--color-success)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <Play size={22} />
          </button>
        </div>
      </main>
    </div>
  );
}
