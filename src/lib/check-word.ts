export type WordMatch = "empty" | "prefix" | "correct" | "wrong";

export type WordStatus = "empty" | "correct" | "wrong";

/**
 * 听写比对前的规范化。
 * 弯引号先转成直引号，再去掉撇号，因此 don't、don’t、dont 视为同一个词。
 * 连字符保留，long-term 与 longterm 不相同。忽略大小写和首尾空格。
 */
export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019\u0060\u00B4]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/'/g, "");
}

export function checkWord(input: string, target: string): WordMatch {
  if (input.trim() === "") return "empty";

  const normalizedInput = normalizeAnswer(input);
  const normalizedTarget = normalizeAnswer(target);
  if (normalizedInput === "") return "empty";
  if (normalizedInput === normalizedTarget) return "correct";
  if (normalizedTarget.startsWith(normalizedInput)) return "prefix";
  return "wrong";
}

/** 前缀保持空白样式，避免用户还在输入时被标红。 */
export function wordStatus(input: string, target: string): WordStatus {
  const match = checkWord(input, target);
  if (match === "correct") return "correct";
  if (match === "wrong") return "wrong";
  return "empty";
}

/**
 * 每个词一次错误只计 1 次：连续键入都处于 wrong 时不重复加。
 * 清空后再次写错，算新的一次。答对同理，只在进入 correct 时加 1。
 */
export function nextWordCounts(
  previous: WordStatus,
  next: WordStatus,
): { correct: number; wrong: number } {
  return {
    correct: next === "correct" && previous !== "correct" ? 1 : 0,
    wrong: next === "wrong" && previous !== "wrong" ? 1 : 0,
  };
}
