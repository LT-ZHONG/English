import { describe, expect, it } from "vitest";
import { addDaysToLocalDate, isDateInRange, localDateString } from "./study-date";
import { accumulateActiveMs, activeMsToSeconds, IDLE_LIMIT_MS } from "./study-time";
import { applyPractice, markSentenceComplete, normalizeStudyStats } from "./study-stats";

describe("localDateString", () => {
  it("用本地年月日", () => {
    expect(localDateString(new Date(2026, 10, 10, 0, 30))).toBe("2026-11-10");
    expect(localDateString(new Date(2026, 0, 1, 0, 0))).toBe("2026-01-01");
  });
});

describe("addDaysToLocalDate", () => {
  it("按本地日历加减，跨月也正确", () => {
    expect(addDaysToLocalDate("2026-11-10", -6)).toBe("2026-11-04");
    expect(addDaysToLocalDate("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDaysToLocalDate("2024-03-01", -1)).toBe("2024-02-29");
  });
});

describe("isDateInRange", () => {
  it("用日期字符串比较，包含两端", () => {
    expect(isDateInRange("2026-11-10", "2026-11-04", "2026-11-10")).toBe(true);
    expect(isDateInRange("2026-11-03", "2026-11-04", "2026-11-10")).toBe(false);
  });
});

describe("accumulateActiveMs", () => {
  it("第一次输入不计时长，之后把间隔累加进去", () => {
    const first = accumulateActiveMs(0, null, 1_000);
    expect(first).toEqual({ activeMs: 0, lastActivityAt: 1_000 });

    const second = accumulateActiveMs(first.activeMs, first.lastActivityAt, 11_000);
    expect(second.activeMs).toBe(10_000);
    expect(activeMsToSeconds(second.activeMs)).toBe(10);
  });

  it("空闲超过 60 秒的间隔不计入", () => {
    const next = accumulateActiveMs(5_000, 1_000, 1_000 + IDLE_LIMIT_MS + 1);
    expect(next).toEqual({ activeMs: 5_000, lastActivityAt: 1_000 + IDLE_LIMIT_MS + 1 });
  });
});

describe("normalizeStudyStats", () => {
  it("把旧的分钟数换算成秒，并丢掉按下标记的完成数", () => {
    const stats = normalizeStudyStats({
      dailyRecords: [{ date: "2026-11-10", practiceMinutes: 2, correctCount: 3, wrongCount: 1, sentencesCompleted: 1 }],
      sceneProgress: [{ scene: "日常", level: "基础", completed: 4, total: 5 }],
      totalPracticeMinutes: 2,
      totalCorrect: 3,
      totalWrong: 1,
      totalSentences: 1,
    });

    expect(stats.dailyRecords[0].practiceSeconds).toBe(120);
    expect(stats.totalPracticeSeconds).toBe(120);
    expect(stats.sceneProgress[0].completedIds).toEqual([]);
    expect(stats.sceneProgress[0].total).toBe(5);
  });
});

describe("applyPractice", () => {
  it("同一天累加秒数，短练习不会被抬成 1 分钟", () => {
    const once = applyPractice(
      normalizeStudyStats(null),
      20,
      3,
      1,
      1,
      "2026-11-10",
    );
    const twice = applyPractice(once, 15, 2, 0, 1, "2026-11-10");

    expect(twice.dailyRecords).toEqual([
      {
        date: "2026-11-10",
        practiceSeconds: 35,
        correctCount: 5,
        wrongCount: 1,
        sentencesCompleted: 2,
      },
    ]);
    expect(twice.totalPracticeSeconds).toBe(35);
  });

  it("北京时间凌晨的练习记在传入的本地日期上", () => {
    const stats = applyPractice(normalizeStudyStats(null), 12, 1, 0, 1, "2026-11-10");
    expect(stats.dailyRecords[0].date).toBe("2026-11-10");
  });
});

describe("markSentenceComplete", () => {
  it("按句子 ID 记录，重复完成不增加次数", () => {
    const first = markSentenceComplete(normalizeStudyStats(null), "日常", "基础", "daily-basic-001", 5);
    const again = markSentenceComplete(first, "日常", "基础", "daily-basic-001", 6);
    const next = markSentenceComplete(again, "日常", "基础", "daily-basic-002", 6);

    expect(next.sceneProgress).toEqual([
      {
        scene: "日常",
        level: "基础",
        completedIds: ["daily-basic-001", "daily-basic-002"],
        total: 6,
      },
    ]);
  });
});
