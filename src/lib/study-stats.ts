import { localDateString } from "./study-date";

export interface DailyStats {
  date: string;
  practiceSeconds: number;
  correctCount: number;
  wrongCount: number;
  sentencesCompleted: number;
}

export interface SceneProgress {
  scene: string;
  level: string;
  completedIds: string[];
  total: number;
}

export interface StudyStats {
  dailyRecords: DailyStats[];
  sceneProgress: SceneProgress[];
  totalPracticeSeconds: number;
  totalCorrect: number;
  totalWrong: number;
  totalSentences: number;
}

export function emptyStudyStats(): StudyStats {
  return {
    dailyRecords: [],
    sceneProgress: [],
    totalPracticeSeconds: 0,
    totalCorrect: 0,
    totalWrong: 0,
    totalSentences: 0,
  };
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeDaily(raw: unknown): DailyStats | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const date = typeof record.date === "string" ? record.date : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

  const practiceSeconds =
    typeof record.practiceSeconds === "number"
      ? record.practiceSeconds
      : Math.round(asNumber(record.practiceMinutes) * 60);

  return {
    date,
    practiceSeconds: Math.max(0, Math.round(practiceSeconds)),
    correctCount: Math.max(0, Math.round(asNumber(record.correctCount))),
    wrongCount: Math.max(0, Math.round(asNumber(record.wrongCount))),
    sentencesCompleted: Math.max(0, Math.round(asNumber(record.sentencesCompleted))),
  };
}

function normalizeScene(raw: unknown): SceneProgress | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  if (typeof record.scene !== "string" || typeof record.level !== "string") return null;

  const completedIds = Array.isArray(record.completedIds)
    ? record.completedIds.filter((id): id is string => typeof id === "string")
    : [];

  return {
    scene: record.scene,
    level: record.level,
    completedIds,
    total: Math.max(0, Math.round(asNumber(record.total))),
  };
}

/** 读出本地统计。旧数据里的分钟数会换成秒，按下标记的完成数不再沿用。 */
export function normalizeStudyStats(raw: unknown): StudyStats {
  if (!raw || typeof raw !== "object") return emptyStudyStats();
  const record = raw as Record<string, unknown>;

  const dailyRecords = Array.isArray(record.dailyRecords)
    ? record.dailyRecords.flatMap((item) => {
        const daily = normalizeDaily(item);
        return daily ? [daily] : [];
      })
    : [];

  const sceneProgress = Array.isArray(record.sceneProgress)
    ? record.sceneProgress.flatMap((item) => {
        const scene = normalizeScene(item);
        return scene ? [scene] : [];
      })
    : [];

  const totalPracticeSeconds =
    typeof record.totalPracticeSeconds === "number"
      ? record.totalPracticeSeconds
      : Math.round(asNumber(record.totalPracticeMinutes) * 60);

  return {
    dailyRecords,
    sceneProgress,
    totalPracticeSeconds: Math.max(0, Math.round(totalPracticeSeconds)),
    totalCorrect: Math.max(0, Math.round(asNumber(record.totalCorrect))),
    totalWrong: Math.max(0, Math.round(asNumber(record.totalWrong))),
    totalSentences: Math.max(0, Math.round(asNumber(record.totalSentences))),
  };
}

export function applyPractice(
  stats: StudyStats,
  seconds: number,
  correct: number,
  wrong: number,
  sentences: number,
  today = localDateString(),
): StudyStats {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const safeCorrect = Math.max(0, Math.round(correct));
  const safeWrong = Math.max(0, Math.round(wrong));
  const safeSentences = Math.max(0, Math.round(sentences));

  const existing = stats.dailyRecords.find((record) => record.date === today);
  const dailyRecords = existing
    ? stats.dailyRecords.map((record) =>
        record.date === today
          ? {
              ...record,
              practiceSeconds: record.practiceSeconds + safeSeconds,
              correctCount: record.correctCount + safeCorrect,
              wrongCount: record.wrongCount + safeWrong,
              sentencesCompleted: record.sentencesCompleted + safeSentences,
            }
          : record,
      )
    : [
        ...stats.dailyRecords,
        {
          date: today,
          practiceSeconds: safeSeconds,
          correctCount: safeCorrect,
          wrongCount: safeWrong,
          sentencesCompleted: safeSentences,
        },
      ];

  return {
    ...stats,
    dailyRecords,
    totalPracticeSeconds: stats.totalPracticeSeconds + safeSeconds,
    totalCorrect: stats.totalCorrect + safeCorrect,
    totalWrong: stats.totalWrong + safeWrong,
    totalSentences: stats.totalSentences + safeSentences,
  };
}

export function markSentenceComplete(
  stats: StudyStats,
  scene: string,
  level: string,
  sentenceId: string,
  total: number,
): StudyStats {
  const existing = stats.sceneProgress.find(
    (item) => item.scene === scene && item.level === level,
  );

  const sceneProgress = existing
    ? stats.sceneProgress.map((item) => {
        if (item.scene !== scene || item.level !== level) return item;
        const completedIds = item.completedIds.includes(sentenceId)
          ? item.completedIds
          : [...item.completedIds, sentenceId];
        return { ...item, completedIds, total };
      })
    : [...stats.sceneProgress, { scene, level, completedIds: [sentenceId], total }];

  return { ...stats, sceneProgress };
}
