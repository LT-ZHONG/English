import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Trophy,
  Sun,
  Moon,
  ChevronDown,
  BarChart3,
  Mic,
} from "lucide-react";
import { dictationScenes } from "@/data/dictationData";
import { WordInputGroup } from "@/components/WordInputGroup";
import { useStudyStats } from "@/hooks/useStudyStats";
import { nextWordCounts, wordStatus } from "@/lib/check-word";
import { accumulateActiveMs, activeMsToSeconds } from "@/lib/study-time";

export const Route = createFileRoute("/")({
  component: DictationPractice,
});

const THEME_KEY = "dictation-theme";

function getInitialTheme(): "light" | "dark" {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore
  }
  return "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

function DictationPractice() {
  const navigate = useNavigate();
  const { recordPractice, markSentenceComplete } = useStudyStats();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [levelIdx, setLevelIdx] = useState(0);
  const [sentIdx, setSentIdx] = useState(0);
  const [inputs, setInputs] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<("empty" | "correct" | "wrong")[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [prevSentence, setPrevSentence] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isCompleteRef = useRef(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const activeMsRef = useRef(0);
  const lastActivityRef = useRef<number | null>(null);
  const lastRecordedRef = useRef({ correct: 0, wrong: 0 });

  const noteActivity = useCallback(() => {
    const next = accumulateActiveMs(activeMsRef.current, lastActivityRef.current, Date.now());
    activeMsRef.current = next.activeMs;
    lastActivityRef.current = next.lastActivityAt;
  }, []);

  const flushPractice = useCallback(
    (sentences: number) => {
      noteActivity();
      const seconds = activeMsToSeconds(activeMsRef.current);
      const correct = correctCount - lastRecordedRef.current.correct;
      const wrong = wrongCount - lastRecordedRef.current.wrong;
      if (seconds > 0 || correct > 0 || wrong > 0 || sentences > 0) {
        recordPractice(seconds, correct, wrong, sentences);
      }
      lastRecordedRef.current = { correct: correctCount, wrong: wrongCount };
      activeMsRef.current = 0;
      lastActivityRef.current = null;
    },
    [correctCount, wrongCount, noteActivity, recordPractice],
  );

  const scene = dictationScenes[sceneIdx];
  const level = scene.levels[levelIdx];
  const sentence = level.sentences[sentIdx];
  const totalSentences = level.sentences.length;
  const progress = ((sentIdx + 1) / totalSentences) * 100;
  const totalAttempts = correctCount + wrongCount;
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  const [showCatDropdown, setShowCatDropdown] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      applyTheme(next);
      return next;
    });
  }, []);

  const selectCategory = useCallback(
    (newSceneIdx: number, newLevelIdx: number) => {
      if (newSceneIdx === sceneIdx && newLevelIdx === levelIdx) {
        setShowCatDropdown(false);
        return;
      }
      flushPractice(0);
      setSceneIdx(newSceneIdx);
      setLevelIdx(newLevelIdx);
      setSentIdx(0);
      setInputs([]);
      setStatuses([]);
      setAllCorrect(false);
      setPrevSentence(null);
      setIsComplete(false);
      isCompleteRef.current = false;
      setShowCatDropdown(false);
    },
    [sceneIdx, levelIdx, flushPractice],
  );

  // Initialize inputs when sentence changes
  useEffect(() => {
    setInputs(new Array(sentence.wordGroups.length).fill(""));
    setStatuses(new Array(sentence.wordGroups.length).fill("empty"));
    setAllCorrect(false);
    setFocusIndex(0);
  }, [sceneIdx, levelIdx, sentIdx, sentence.wordGroups.length]);

  // Check if all correct
  useEffect(() => {
    const answerable = sentence.wordGroups
      .map((words, index) => (words[0] === "/" ? -1 : index))
      .filter((index) => index >= 0);
    const done =
      answerable.length > 0 && answerable.every((index) => statuses[index] === "correct");
    if (done && !isCompleteRef.current) {
      setAllCorrect(true);
      isCompleteRef.current = true;
    }
  }, [statuses, sentence.wordGroups]);

  const handleWordChange = useCallback(
    (index: number, value: string) => {
      if (isCompleteRef.current) return;
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);

      noteActivity();
      const newStatuses = [...statuses];
      const nextStatus = wordStatus(value, sentence.wordGroups[index][0]);
      const delta = nextWordCounts(statuses[index] ?? "empty", nextStatus);
      newStatuses[index] = nextStatus;
      setStatuses(newStatuses);
      if (delta.correct > 0) setCorrectCount((count) => count + delta.correct);
      if (delta.wrong > 0) setWrongCount((count) => count + delta.wrong);
    },
    [inputs, statuses, sentence.wordGroups, noteActivity],
  );

  const handleWordCorrect = useCallback(
    (index: number) => {
      let nextIdx = -1;
      for (let i = index + 1; i < sentence.wordGroups.length; i++) {
        if (sentence.wordGroups[i][0] !== "/") {
          nextIdx = i;
          break;
        }
      }
      if (nextIdx >= 0) {
        setFocusIndex(nextIdx);
      }
    },
    [sentence.wordGroups],
  );

  const speak = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        sentence.wordGroups.flat().filter((w) => w !== "/").join(" "),
      );
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }, [sentence]);

  const goNext = useCallback(() => {
    flushPractice(1);
    markSentenceComplete(scene.scene, level.level, sentence.id, totalSentences);

    if (sentIdx < totalSentences - 1) {
      setPrevSentence(sentence.chinese);
      setSentIdx(sentIdx + 1);
    } else if (levelIdx < scene.levels.length - 1) {
      setPrevSentence(sentence.chinese);
      setLevelIdx(levelIdx + 1);
      setSentIdx(0);
    } else if (sceneIdx < dictationScenes.length - 1) {
      setPrevSentence(sentence.chinese);
      setSceneIdx(sceneIdx + 1);
      setLevelIdx(0);
      setSentIdx(0);
    } else {
      setIsComplete(true);
    }
    isCompleteRef.current = false;
  }, [sentIdx, totalSentences, levelIdx, sceneIdx, scene.levels.length, sentence.chinese, sentence.id, flushPractice, markSentenceComplete, scene.scene, level.level]);

  const goPrev = useCallback(() => {
    if (sentIdx > 0) {
      setSentIdx(sentIdx - 1);
    } else if (levelIdx > 0) {
      const prevLevel = scene.levels[levelIdx - 1];
      setLevelIdx(levelIdx - 1);
      setSentIdx(prevLevel.sentences.length - 1);
    } else if (sceneIdx > 0) {
      const prevScene = dictationScenes[sceneIdx - 1];
      const lastLevel = prevScene.levels[prevScene.levels.length - 1];
      setSceneIdx(sceneIdx - 1);
      setLevelIdx(prevScene.levels.length - 1);
      setSentIdx(lastLevel.sentences.length - 1);
    }
    isCompleteRef.current = false;
  }, [sentIdx, levelIdx, sceneIdx, scene.levels]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA";

      if (e.code === "Space" && !isInput) {
        e.preventDefault();
        speak();
        return;
      }
      if (e.code === "PageUp") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.code === "PageDown") {
        e.preventDefault();
        if (allCorrect) goNext();
        return;
      }
      if (e.code === "Enter" && allCorrect) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [speak, goPrev, goNext, allCorrect]);

  // ── Completion Screen ──
  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--dict-bg)" }}>
        <div className="text-center" style={{ animation: "fadeIn 0.6s ease-out" }}>
          <Trophy className="mx-auto mb-6" size={56} style={{ color: "var(--color-success)" }} />
          <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--dict-fg)" }}>
            练习完成！
          </h1>
          <p className="text-lg mb-8" style={{ color: "var(--dict-complete-stat-label)" }}>
            你已完成「{scene.scene} · {level.level}」全部 {totalSentences} 道题目
          </p>
          <div className="flex gap-4 justify-center mb-10">
            <div
              className="px-6 py-4 rounded-2xl text-center"
              style={{
                backgroundColor: "var(--dict-complete-stat-success-bg)",
                border: "1px solid var(--dict-complete-stat-success-border)",
              }}
            >
              <div className="text-3xl font-bold" style={{ color: "var(--color-success)" }}>
                {correctCount}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--dict-complete-stat-label)" }}>
                答对
              </div>
            </div>
            <div
              className="px-6 py-4 rounded-2xl text-center"
              style={{
                backgroundColor: "var(--dict-complete-stat-error-bg)",
                border: "1px solid var(--dict-complete-stat-error-border)",
              }}
            >
              <div className="text-3xl font-bold" style={{ color: "var(--color-error)" }}>
                {wrongCount}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--dict-complete-stat-label)" }}>
                答错
              </div>
            </div>
            <div
              className="px-6 py-4 rounded-2xl text-center"
              style={{
                backgroundColor: "var(--dict-complete-stat-neutral-bg)",
                border: "1px solid var(--dict-complete-stat-neutral-border)",
              }}
            >
              <div className="text-3xl font-bold" style={{ color: "var(--dict-fg)" }}>
                {accuracy}%
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--dict-complete-stat-label)" }}>
                正确率
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSceneIdx(0);
              setLevelIdx(0);
              setSentIdx(0);
              setCorrectCount(0);
              setWrongCount(0);
              lastRecordedRef.current = { correct: 0, wrong: 0 };
              activeMsRef.current = 0;
              lastActivityRef.current = null;
              setPrevSentence(null);
              setIsComplete(false);
              isCompleteRef.current = false;
            }}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <RotateCcw size={18} />
            重新开始
          </button>
        </div>
      </div>
    );
  }

  // ── Main Practice Screen ──
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--dict-bg)" }}>
      {/* ═══ Progress Bar ═══ */}
      <div className="h-[3px] w-full" style={{ backgroundColor: "var(--dict-progress-track)" }}>
        <div
          className="h-full rounded-r-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: "var(--color-success)",
          }}
        />
      </div>

      {/* ══ Header ═══ */}
      <header
        className="relative flex items-center justify-between px-5 sm:px-8 py-4"
        style={{ borderBottom: "1px solid var(--dict-header-border)" }}
      >
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-lg transition-colors duration-200 hover:bg-foreground/5"
            style={{ color: "var(--dict-fg)" }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold leading-tight" style={{ color: "var(--dict-fg)" }}>
              听写练习
            </h1>
            <button
              onClick={() => setShowCatDropdown(!showCatDropdown)}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-0.5 transition-colors duration-200 hover:opacity-80"
              style={{
                backgroundColor: "var(--dict-category-bg)",
                color: "var(--dict-category-fg)",
              }}
            >
              {scene.scene} · {level.level}
              <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Category Dropdown */}
        {showCatDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowCatDropdown(false)}
            />
            <div
              className="absolute top-full left-5 sm:left-8 mt-2 z-50 rounded-xl py-1.5 min-w-[180px]"
              style={{
                backgroundColor: "var(--dict-card)",
                border: "1px solid var(--dict-card-border)",
                boxShadow: "0 8px 24px var(--dict-shadow-lg)",
                animation: "slideDown 0.2s ease-out",
              }}
            >
              {dictationScenes.map((s, si) => (
                <div key={si}>
                  <div
                    className="px-4 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wider"
                    style={{ color: "var(--dict-shortcut-fg)" }}
                  >
                    {s.scene}
                  </div>
                  {s.levels.map((lv, li) => {
                    const isActive = si === sceneIdx && li === levelIdx;
                    return (
                      <button
                        key={li}
                        onClick={() => selectCategory(si, li)}
                        className="w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center justify-between"
                        style={{
                          color: isActive ? "var(--dict-category-fg)" : "var(--dict-fg)",
                          backgroundColor: isActive ? "var(--dict-category-bg)" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive)
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                              "var(--dict-hover-overlay)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive)
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                              "transparent";
                        }}
                      >
                        <span>{lv.level}</span>
                        {isActive && <CheckCircle2 size={14} />}
                      </button>
                    );
                  })}
                  {si < dictationScenes.length - 1 && (
                    <div className="mx-3 my-1" style={{ borderTop: "1px solid var(--dict-card-border)" }} />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={speak}
            className="p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "var(--dict-btn-muted)",
              color: "var(--dict-btn-muted-fg)",
            }}
            title="朗读 (Space)"
          >
            <Volume2 size={18} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "var(--dict-btn-muted)",
              color: "var(--dict-btn-muted-fg)",
            }}
            title={theme === "light" ? "切换深色模式" : "切换浅色模式"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <div
          className="text-sm font-medium tabular-nums"
          style={{ color: "var(--dict-shortcut-fg)" }}
        >
          {sentIdx + 1} / {totalSentences}
        </div>
      </header>

      {/* ═══ Main Content ═══ */}
      <main
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6"
        style={{
          animation: allCorrect ? "celebrate 0.5s ease-out" : undefined,
        }}
      >
        {/* History Toast */}
        <div className="h-8 mb-4 flex items-center justify-center">
          {prevSentence && (
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm"
              style={{
                backgroundColor: "var(--dict-toast-bg)",
                color: "var(--dict-toast-fg)",
                animation: "slideDown 0.35s ease-out",
              }}
            >
              <CheckCircle2 size={14} />
              <span>上一题：{prevSentence}</span>
            </div>
          )}
        </div>

        {/* Chinese Prompt */}
        <h2
          className="text-3xl sm:text-4xl font-bold mb-10 text-center leading-relaxed tracking-wide"
          style={{ color: "var(--dict-chinese-prompt)" }}
        >
          {sentence.chinese}
        </h2>

        {/* Word Input Area */}
        <div
          className="w-full max-w-2xl rounded-2xl px-6 sm:px-10 py-8 sm:py-10"
          style={{
            backgroundColor: "var(--dict-card)",
            border: "1px solid var(--dict-card-border)",
            boxShadow: `0 1px 3px var(--dict-shadow), 0 8px 24px var(--dict-shadow-lg)`,
          }}
        >
          <div className="flex flex-wrap items-end justify-center gap-y-5">
            {sentence.wordGroups.map((words, i) => {
              if (words[0] === "/") {
                return (
                  <span
                    key={`sep-${i}`}
                    className="text-xl sm:text-2xl font-serif px-2 self-center"
                    style={{ color: "var(--dict-separator)" }}
                  >
                    /
                  </span>
                );
              }
              return (
                <WordInputGroup
                  key={`${sceneIdx}-${levelIdx}-${sentIdx}-${i}`}
                  words={words}
                  index={i}
                  value={inputs[i] || ""}
                  status={statuses[i] || "empty"}
                  onChange={handleWordChange}
                  onCorrect={handleWordCorrect}
                  inputRefs={inputRefs}
                  focusIndex={focusIndex}
                />
              );
            })}
          </div>

          {/* All Correct Indicator */}
          {allCorrect && (
            <div
              className="text-center mt-8 text-sm font-medium flex items-center justify-center gap-1.5"
              style={{
                color: "var(--color-success)",
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              <CheckCircle2 size={16} />
              <span>回答正确！按 Enter 或 PageDown 继续</span>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-6 mt-8">
          <button
            onClick={goPrev}
            disabled={sentIdx === 0 && levelIdx === 0 && sceneIdx === 0}
            className="p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: "var(--dict-nav-arrow-disabled)",
              color: "var(--dict-nav-arrow-disabled-fg)",
            }}
            title="上一题 (PageUp)"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={goNext}
            disabled={!allCorrect}
            className="p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: allCorrect
                ? "var(--color-success)"
                : "var(--dict-nav-arrow-disabled)",
              color: allCorrect
                ? "var(--color-primary-foreground)"
                : "var(--dict-nav-arrow-disabled-fg)",
            }}
            title="下一题 (PageDown)"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </main>

      {/* ═══ Footer ═══ */}
      <footer
        className="px-5 sm:px-8 py-4"
        style={{ borderTop: "1px solid var(--dict-footer-border)" }}
      >
        {/* Stats Badges */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span
            className="px-3.5 py-1.5 rounded-full text-sm font-medium tabular-nums"
            style={{
              backgroundColor: "var(--dict-badge-success-bg)",
              color: "var(--dict-badge-success-fg)",
              border: "1px solid var(--dict-badge-success-border)",
            }}
          >
            已答对 {correctCount}
          </span>
          <span
            className="px-3.5 py-1.5 rounded-full text-sm font-medium tabular-nums"
            style={{
              backgroundColor: "var(--dict-badge-error-bg)",
              color: "var(--dict-badge-error-fg)",
              border: "1px solid var(--dict-badge-error-border)",
            }}
          >
            已答错 {wrongCount}
          </span>
          <span
            className="px-3.5 py-1.5 rounded-full text-sm font-medium tabular-nums"
            style={{
              backgroundColor: "var(--dict-badge-neutral-bg)",
              color: "var(--dict-badge-neutral-fg)",
              border: "1px solid var(--dict-badge-neutral-border)",
            }}
          >
            正确率 {accuracy}%
          </span>
        </div>

        {/* Entry Buttons */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={() => navigate({ to: "/stats" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "var(--dict-nav-arrow-disabled)",
              color: "var(--dict-nav-arrow-disabled-fg)",
            }}
          >
            <BarChart3 size={16} />
            学习统计
          </button>
          <button
            onClick={() => navigate({ to: "/read-along" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <Mic size={16} />
            跟读练习
          </button>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center justify-center gap-3 text-xs mb-4" style={{ color: "var(--dict-shortcut-fg)" }}>
          <span className="flex items-center gap-1">
            上一题
            <kbd
              className="px-1.5 py-0.5 rounded text-[10px] font-mono"
              style={{
                backgroundColor: "var(--dict-kbd-bg)",
                border: "1px solid var(--dict-kbd-border)",
              }}
            >
              PgUp
            </kbd>
          </span>
          <span className="flex items-center gap-1">
            朗读
            <kbd
              className="px-1.5 py-0.5 rounded text-[10px] font-mono"
              style={{
                backgroundColor: "var(--dict-kbd-bg)",
                border: "1px solid var(--dict-kbd-border)",
              }}
            >
              Space
            </kbd>
          </span>
          <span className="flex items-center gap-1">
            下一题
            <kbd
              className="px-1.5 py-0.5 rounded text-[10px] font-mono"
              style={{
                backgroundColor: "var(--dict-kbd-bg)",
                border: "1px solid var(--dict-kbd-border)",
              }}
            >
              PgDn
            </kbd>
          </span>
        </div>
      </footer>
    </div>
  );
}
