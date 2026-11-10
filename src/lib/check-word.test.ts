import { describe, expect, it } from "vitest";
import { checkWord, nextWordCounts, wordStatus } from "./check-word";

describe("checkWord", () => {
  it("完全一致算对", () => {
    expect(checkWord("how", "how")).toBe("correct");
  });

  it("大小写不同也算对", () => {
    expect(checkWord("HOW", "how")).toBe("correct");
  });

  it("忽略首尾空格", () => {
    expect(checkWord("  how  ", "how")).toBe("correct");
  });

  it("空字符串是 empty", () => {
    expect(checkWord("", "how")).toBe("empty");
  });

  it("纯空格是 empty", () => {
    expect(checkWord("   ", "how")).toBe("empty");
  });

  it("只输入撇号是 empty", () => {
    expect(checkWord("'", "don't")).toBe("empty");
  });

  it("正确前缀不算错", () => {
    expect(checkWord("ho", "how")).toBe("prefix");
  });

  it("缩写写到撇号前仍是前缀", () => {
    expect(checkWord("don", "don't")).toBe("prefix");
    expect(checkWord("don'", "don't")).toBe("prefix");
  });

  it("写错字母算 wrong", () => {
    expect(checkWord("hx", "how")).toBe("wrong");
  });

  it("丢掉连字符算 wrong", () => {
    expect(checkWord("longterm", "long-term")).toBe("wrong");
  });

  it("don't 原样输入算对", () => {
    expect(checkWord("don't", "don't")).toBe("correct");
  });

  it("省略撇号的 dont 算对", () => {
    expect(checkWord("dont", "don't")).toBe("correct");
  });

  it("弯引号 don’t 算对", () => {
    expect(checkWord("don’t", "don't")).toBe("correct");
  });

  it("I'd 原样输入算对", () => {
    expect(checkWord("I'd", "I'd")).toBe("correct");
  });

  it("省略撇号的 Id 算对", () => {
    expect(checkWord("Id", "I'd")).toBe("correct");
  });

  it("analysts 与 analysts' 算对", () => {
    expect(checkWord("analysts", "analysts'")).toBe("correct");
  });

  it("保留撇号的 analysts' 算对", () => {
    expect(checkWord("analysts'", "analysts'")).toBe("correct");
  });

  it("弯双引号先转成直双引号", () => {
    expect(checkWord("“hi”", '"hi"')).toBe("correct");
  });

  it("连字符必须保留", () => {
    expect(checkWord("long-term", "long-term")).toBe("correct");
  });

  it("反引号形式的撇号同样接受", () => {
    expect(checkWord("don`t", "don't")).toBe("correct");
  });
});

describe("wordStatus", () => {
  it("前缀显示为 empty，错误才显示 wrong", () => {
    expect(wordStatus("ho", "how")).toBe("empty");
    expect(wordStatus("hx", "how")).toBe("wrong");
    expect(wordStatus("how", "how")).toBe("correct");
  });
});

describe("nextWordCounts", () => {
  it("进入 wrong 只计 1 次，连续错键不加", () => {
    expect(nextWordCounts("empty", "wrong")).toEqual({ correct: 0, wrong: 1 });
    expect(nextWordCounts("wrong", "wrong")).toEqual({ correct: 0, wrong: 0 });
  });

  it("清空后再次写错算新的一次，答对只在进入 correct 时加", () => {
    expect(nextWordCounts("wrong", "empty")).toEqual({ correct: 0, wrong: 0 });
    expect(nextWordCounts("empty", "wrong")).toEqual({ correct: 0, wrong: 1 });
    expect(nextWordCounts("wrong", "correct")).toEqual({ correct: 1, wrong: 0 });
    expect(nextWordCounts("correct", "correct")).toEqual({ correct: 0, wrong: 0 });
  });
});
