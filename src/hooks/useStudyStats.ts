import { useState, useEffect, useCallback } from "react";
import { addDaysToLocalDate, isDateInRange, localDateString } from "@/lib/study-date";
import {
  applyPractice,
  emptyStudyStats,
  markSentenceComplete as markSentenceInStats,
  normalizeStudyStats,
  type DailyStats,
  type SceneProgress,
  type StudyStats,
} from "@/lib/study-stats";

const STATS_KEY = "dictation-study-stats";

export type { DailyStats, SceneProgress, StudyStats };

function loadStats(): StudyStats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) return normalizeStudyStats(JSON.parse(stored));
  } catch {
    // 损坏的本地数据直接从空记录开始
  }
  return emptyStudyStats();
}

function saveStats(stats: StudyStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // 存储不可用时只保留内存中的本次数据
  }
}

export function useStudyStats() {
  const [stats, setStats] = useState<StudyStats>(loadStats);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const recordPractice = useCallback(
    (seconds: number, correct: number, wrong: number, sentences: number) => {
      setStats((prev) => applyPractice(prev, seconds, correct, wrong, sentences));
    },
    [],
  );

  const markSentenceComplete = useCallback(
    (scene: string, level: string, sentenceId: string, total: number) => {
      setStats((prev) => markSentenceInStats(prev, scene, level, sentenceId, total));
    },
    [],
  );

  const getWeeklyStats = useCallback((): DailyStats[] => {
    const today = localDateString();
    const start = addDaysToLocalDate(today, -6);
    return stats.dailyRecords
      .filter((record) => isDateInRange(record.date, start, today))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [stats.dailyRecords]);

  const getAccuracyTrend = useCallback((): { date: string; accuracy: number }[] => {
    return stats.dailyRecords
      .filter((record) => record.correctCount + record.wrongCount > 0)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((record) => ({
        date: record.date,
        accuracy: Math.round(
          (record.correctCount / (record.correctCount + record.wrongCount)) * 100,
        ),
      }))
      .slice(-7);
  }, [stats.dailyRecords]);

  const resetStats = useCallback(() => {
    setStats(emptyStudyStats());
  }, []);

  return {
    stats,
    recordPractice,
    markSentenceComplete,
    getWeeklyStats,
    getAccuracyTrend,
    resetStats,
  };
}
