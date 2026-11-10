import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, TrendingUp, Clock, Target, BarChart3 } from "lucide-react";
import { useStudyStats } from "@/hooks/useStudyStats";
import { formatDuration } from "@/lib/study-time";

export const Route = createFileRoute("/stats")({
  component: StatsPage,
});

function StatsPage() {
  const navigate = useNavigate();
  const { stats, getWeeklyStats, getAccuracyTrend, resetStats } = useStudyStats();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const weeklyStats = getWeeklyStats();
  const accuracyTrend = getAccuracyTrend();

  const totalAccuracy =
    stats.totalCorrect + stats.totalWrong > 0
      ? Math.round(
          (stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100
        )
      : 0;

  const maxSeconds = Math.max(...weeklyStats.map((day) => day.practiceSeconds), 1);

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
        <h1 className="text-lg font-semibold">学习统计</h1>
        <div className="w-9" />
      </header>

      <main className="flex-1 px-5 sm:px-8 py-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: "var(--dict-card-bg)",
              border: "1px solid var(--dict-card-border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} style={{ color: "var(--color-primary)" }} />
              <span className="text-xs" style={{ color: "var(--dict-shortcut-fg)" }}>
                总时长
              </span>
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {formatDuration(stats.totalPracticeSeconds)}
            </div>
            <div className="text-xs" style={{ color: "var(--dict-shortcut-fg)" }}>
              有效练习
            </div>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: "var(--dict-card-bg)",
              border: "1px solid var(--dict-card-border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} style={{ color: "var(--color-success)" }} />
              <span className="text-xs" style={{ color: "var(--dict-shortcut-fg)" }}>
                正确率
              </span>
            </div>
            <div className="text-2xl font-bold tabular-nums">{totalAccuracy}%</div>
            <div className="text-xs" style={{ color: "var(--dict-shortcut-fg)" }}>
              {stats.totalCorrect} / {stats.totalCorrect + stats.totalWrong}
            </div>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: "var(--dict-card-bg)",
              border: "1px solid var(--dict-card-border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} style={{ color: "var(--color-primary)" }} />
              <span className="text-xs" style={{ color: "var(--dict-shortcut-fg)" }}>
                完成句子
              </span>
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {stats.totalSentences}
            </div>
            <div className="text-xs" style={{ color: "var(--dict-shortcut-fg)" }}>
              个
            </div>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: "var(--dict-card-bg)",
              border: "1px solid var(--dict-card-border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} style={{ color: "var(--color-success)" }} />
              <span className="text-xs" style={{ color: "var(--dict-shortcut-fg)" }}>
                练习天数
              </span>
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {stats.dailyRecords.length}
            </div>
            <div className="text-xs" style={{ color: "var(--dict-shortcut-fg)" }}>
              天
            </div>
          </div>
        </div>

        {/* Weekly Practice Chart */}
        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: "var(--dict-card-bg)",
            border: "1px solid var(--dict-card-border)",
          }}
        >
          <h2 className="text-base font-semibold mb-4">本周练习时长</h2>
          {weeklyStats.length === 0 ? (
            <div
              className="text-center py-8 text-sm"
              style={{ color: "var(--dict-shortcut-fg)" }}
            >
              暂无数据
            </div>
          ) : (
            <div className="space-y-2">
              {weeklyStats.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <div
                    className="text-xs w-16 tabular-nums"
                    style={{ color: "var(--dict-shortcut-fg)" }}
                  >
                    {day.date.slice(5)}
                  </div>
                  <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: "var(--dict-kbd-bg)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(day.practiceSeconds / maxSeconds) * 100}%`,
                        backgroundColor: "var(--color-primary)",
                      }}
                    />
                  </div>
                  <div
                    className="text-xs w-16 text-right tabular-nums"
                    style={{ color: "var(--dict-shortcut-fg)" }}
                  >
                    {formatDuration(day.practiceSeconds)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accuracy Trend */}
        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: "var(--dict-card-bg)",
            border: "1px solid var(--dict-card-border)",
          }}
        >
          <h2 className="text-base font-semibold mb-4">正确率趋势</h2>
          {accuracyTrend.length === 0 ? (
            <div
              className="text-center py-8 text-sm"
              style={{ color: "var(--dict-shortcut-fg)" }}
            >
              暂无数据
            </div>
          ) : (
            <div className="space-y-2">
              {accuracyTrend.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <div
                    className="text-xs w-16 tabular-nums"
                    style={{ color: "var(--dict-shortcut-fg)" }}
                  >
                    {day.date.slice(5)}
                  </div>
                  <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: "var(--dict-kbd-bg)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${day.accuracy}%`,
                        backgroundColor:
                          day.accuracy >= 80
                            ? "var(--color-success)"
                            : day.accuracy >= 60
                            ? "var(--color-warning, oklch(0.75 0.15 80))"
                            : "var(--color-error)",
                      }}
                    />
                  </div>
                  <div
                    className="text-xs w-12 text-right tabular-nums"
                    style={{ color: "var(--dict-shortcut-fg)" }}
                  >
                    {day.accuracy}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scene Progress */}
        {stats.sceneProgress.length > 0 && (
          <div
            className="p-5 rounded-xl"
            style={{
              backgroundColor: "var(--dict-card-bg)",
              border: "1px solid var(--dict-card-border)",
            }}
          >
            <h2 className="text-base font-semibold mb-4">场景完成度</h2>
            <div className="space-y-3">
              {stats.sceneProgress.map((scene) => {
                const completed = scene.completedIds.length;
                const percent =
                  scene.total > 0 ? Math.round((completed / scene.total) * 100) : 0;
                return (
                  <div key={`${scene.scene}-${scene.level}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium">
                        {scene.scene} · {scene.level}
                      </div>
                      <div
                        className="text-xs tabular-nums"
                        style={{ color: "var(--dict-shortcut-fg)" }}
                      >
                        {completed} / {scene.total}
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--dict-kbd-bg)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: "var(--color-success)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="pt-4">
          {showResetConfirm ? (
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm" style={{ color: "var(--dict-shortcut-fg)" }}>
                确认重置所有统计数据？
              </span>
              <button
                onClick={() => {
                  resetStats();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: "var(--color-error)",
                  color: "var(--color-primary-foreground)",
                }}
              >
                确认
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: "var(--dict-nav-arrow-disabled)",
                  color: "var(--dict-nav-arrow-disabled-fg)",
                }}
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--dict-nav-arrow-disabled)",
                color: "var(--dict-nav-arrow-disabled-fg)",
              }}
            >
              重置统计数据
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
