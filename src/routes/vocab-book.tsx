import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Volume2, Trash2, BookOpen } from "lucide-react";
import { useVocabBook } from "@/hooks/useVocabBook";

export const Route = createFileRoute("/vocab-book")({
  component: VocabBookPage,
});

function VocabBookPage() {
  const navigate = useNavigate();
  const { vocabList, removeWord } = useVocabBook();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const playAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDelete = (word: string) => {
    removeWord(word);
    setShowDeleteConfirm(null);
    if (selectedWord === word) {
      setSelectedWord(null);
    }
  };

  const selectedWordData = vocabList.find(w => w.word === selectedWord);

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
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen size={20} />
          生词本
        </h1>
        <div className="w-9" />
      </header>

      <main className="flex-1 px-5 sm:px-8 py-6 max-w-4xl mx-auto w-full">
        {vocabList.length === 0 ? (
          <div
            className="text-center py-16"
            style={{ color: "var(--dict-shortcut-fg)" }}
          >
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">生词本为空</p>
            <p className="text-sm">在练习中点击单词旁的收藏按钮添加生词</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Word List */}
            <div className="space-y-2">
              <div className="text-sm mb-3" style={{ color: "var(--dict-shortcut-fg)" }}>
                已收藏 {vocabList.length} 个单词
              </div>
              {vocabList.map((item) => (
                <div
                  key={item.word}
                  className="p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: selectedWord === item.word
                      ? "var(--color-primary)"
                      : "var(--dict-card-bg)",
                    color: selectedWord === item.word
                      ? "var(--color-primary-foreground)"
                      : "var(--foreground)",
                    border: "1px solid var(--dict-card-border)",
                  }}
                  onClick={() => setSelectedWord(item.word)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-serif" style={{ fontFamily: "var(--font-serif)" }}>
                        {item.word}
                      </span>
                      {item.phonetic && (
                        <span className="text-sm opacity-70">{item.phonetic}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(item.word);
                        }}
                        className="p-1.5 rounded-lg transition-all duration-200 hover:scale-105"
                        style={{
                          backgroundColor: selectedWord === item.word
                            ? "rgba(255,255,255,0.2)"
                            : "var(--dict-nav-arrow-disabled)",
                          color: selectedWord === item.word
                            ? "var(--color-primary-foreground)"
                            : "var(--dict-nav-arrow-disabled-fg)",
                        }}
                        title="播放发音"
                      >
                        <Volume2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(item.word);
                        }}
                        className="p-1.5 rounded-lg transition-all duration-200 hover:scale-105"
                        style={{
                          backgroundColor: "var(--dict-badge-error-bg)",
                          color: "var(--dict-badge-error-fg)",
                        }}
                        title="删除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm mt-1 opacity-80">{item.meaning}</div>
                </div>
              ))}
            </div>

            {/* Word Detail */}
            <div className="md:sticky md:top-6 md:self-start">
              {selectedWordData ? (
                <div
                  className="p-6 rounded-xl"
                  style={{
                    backgroundColor: "var(--dict-card-bg)",
                    border: "1px solid var(--dict-card-border)",
                  }}
                >
                  <div className="mb-4">
                    <h2 className="text-2xl font-serif mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                      {selectedWordData.word}
                    </h2>
                    {selectedWordData.phonetic && (
                      <div className="text-sm opacity-70 mb-2">
                        {selectedWordData.phonetic}
                      </div>
                    )}
                    <button
                      onClick={() => playAudio(selectedWordData.word)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-primary-foreground)",
                      }}
                    >
                      <Volume2 size={14} />
                      播放发音
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm mb-2" style={{ color: "var(--dict-shortcut-fg)" }}>
                      释义
                    </div>
                    <div className="text-base">{selectedWordData.meaning}</div>
                  </div>

                  {selectedWordData.examples.length > 0 && (
                    <div>
                      <div className="text-sm mb-2" style={{ color: "var(--dict-shortcut-fg)" }}>
                        例句
                      </div>
                      <div className="space-y-3">
                        {selectedWordData.examples.map((example, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg"
                            style={{
                              backgroundColor: "var(--dict-kbd-bg)",
                              border: "1px solid var(--dict-kbd-border)",
                            }}
                          >
                            <div className="text-sm font-serif italic" style={{ fontFamily: "var(--font-serif)" }}>
                              {example}
                            </div>
                            <button
                              onClick={() => playAudio(example)}
                              className="mt-2 text-xs opacity-70 hover:opacity-100 transition-opacity"
                            >
                              🔊 播放
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--dict-card-border)" }}>
                    <div className="text-xs opacity-60">
                      收藏于 {new Date(selectedWordData.collectedAt).toLocaleDateString("zh-CN")}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="p-6 rounded-xl text-center"
                  style={{
                    backgroundColor: "var(--dict-card-bg)",
                    border: "1px solid var(--dict-card-border)",
                    color: "var(--dict-shortcut-fg)",
                  }}
                >
                  <p className="text-sm">点击左侧单词查看详情</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="p-6 rounded-xl max-w-sm w-full"
            style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--dict-card-border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">确认删除</h3>
            <p className="text-sm mb-6" style={{ color: "var(--dict-shortcut-fg)" }}>
              确定要从生词本中删除 "{showDeleteConfirm}" 吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: "var(--dict-nav-arrow-disabled)",
                  color: "var(--dict-nav-arrow-disabled-fg)",
                }}
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: "var(--color-error)",
                  color: "var(--color-primary-foreground)",
                }}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
