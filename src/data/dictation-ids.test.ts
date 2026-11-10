import { describe, expect, it } from "vitest";
import { dictationScenes } from "./dictationData";

describe("dictationScenes", () => {
  it("每句都有稳定且唯一的 ID", () => {
    const ids = dictationScenes.flatMap((scene) =>
      scene.levels.flatMap((level) => level.sentences.map((sentence) => sentence.id)),
    );

    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-z]+-[a-z]+-\d{3}$/.test(id))).toBe(true);
    expect(ids[0]).toBe("daily-basic-001");
  });
});
