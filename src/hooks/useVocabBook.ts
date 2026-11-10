import { useState, useEffect } from "react";

export interface VocabWord {
  word: string;
  phonetic: string;
  meaning: string;
  examples: string[];
  collectedAt: number;
}

const VOCAB_KEY = "dictation-vocab-book";

// Built-in dictionary for common words
const DICTIONARY: Record<string, Omit<VocabWord, "collectedAt">> = {
  "collaborate": {
    word: "collaborate",
    phonetic: "/kəˈlæbəreɪt/",
    meaning: "v. 合作，协作",
    examples: [
      "We need to collaborate with the marketing team on this project.",
      "The two companies collaborated to develop new technology."
    ]
  },
  "implement": {
    word: "implement",
    phonetic: "/ˈɪmplɪment/",
    meaning: "v. 实施，执行",
    examples: [
      "We will implement the new policy next month.",
      "The company implemented strict safety measures."
    ]
  },
  "comprehensive": {
    word: "comprehensive",
    phonetic: "/ˌkɑːmprɪˈhensɪv/",
    meaning: "adj. 全面的，综合的",
    examples: [
      "We need a comprehensive review of the system.",
      "The report provides a comprehensive analysis."
    ]
  },
  "sustainable": {
    word: "sustainable",
    phonetic: "/səˈsteɪnəbl/",
    meaning: "adj. 可持续的",
    examples: [
      "We focus on sustainable development practices.",
      "The company adopted sustainable business models."
    ]
  },
  "innovative": {
    word: "innovative",
    phonetic: "/ˈɪnəveɪtɪv/",
    meaning: "adj. 创新的",
    examples: [
      "They developed an innovative solution to the problem.",
      "The company is known for its innovative products."
    ]
  },
  "efficient": {
    word: "efficient",
    phonetic: "/ɪˈfɪʃnt/",
    meaning: "adj. 高效的",
    examples: [
      "We need a more efficient workflow.",
      "The new system is highly efficient."
    ]
  },
  "professional": {
    word: "professional",
    phonetic: "/prəˈfeʃənl/",
    meaning: "adj. 专业的；n. 专业人士",
    examples: [
      "She maintained a professional attitude throughout.",
      "The event attracted many industry professionals."
    ]
  },
  "experience": {
    word: "experience",
    phonetic: "/ɪkˈspɪriəns/",
    meaning: "n. 经验，经历",
    examples: [
      "I have five years of experience in this field.",
      "The trip was an unforgettable experience."
    ]
  },
  "opportunity": {
    word: "opportunity",
    phonetic: "/ˌɑːpərˈtuːnəti/",
    meaning: "n. 机会",
    examples: [
      "This is a great opportunity for career growth.",
      "Don't miss this opportunity to learn."
    ]
  },
  "challenge": {
    word: "challenge",
    phonetic: "/ˈtʃælɪndʒ/",
    meaning: "n. 挑战；v. 挑战",
    examples: [
      "The project presented many challenges.",
      "She challenged herself to learn a new skill."
    ]
  },
  "communication": {
    word: "communication",
    phonetic: "/kəˌmjuːnɪˈkeɪʃn/",
    meaning: "n. 沟通，交流",
    examples: [
      "Good communication is essential for teamwork.",
      "We need to improve our communication skills."
    ]
  },
  "responsibility": {
    word: "responsibility",
    phonetic: "/rɪˌspɑːnsəˈbɪləti/",
    meaning: "n. 责任",
    examples: [
      "She takes her responsibilities very seriously.",
      "It's your responsibility to complete the task."
    ]
  },
  "negotiate": {
    word: "negotiate",
    phonetic: "/nɪˈɡoʊʃieɪt/",
    meaning: "v. 谈判，协商",
    examples: [
      "We need to negotiate the terms of the contract.",
      "They negotiated a better deal."
    ]
  },
  "deadline": {
    word: "deadline",
    phonetic: "/ˈdedlaɪn/",
    meaning: "n. 截止日期",
    examples: [
      "The deadline for submission is next Friday.",
      "We missed the deadline by one day."
    ]
  },
  "presentation": {
    word: "presentation",
    phonetic: "/ˌpriːzenˈteɪʃn/",
    meaning: "n. 演示，报告",
    examples: [
      "She gave an excellent presentation.",
      "The presentation starts at 3 PM."
    ]
  },
  "curriculum": {
    word: "curriculum",
    phonetic: "/kəˈrɪkjələm/",
    meaning: "n. 课程",
    examples: [
      "The school updated its curriculum.",
      "The curriculum includes both theory and practice."
    ]
  },
  "research": {
    word: "research",
    phonetic: "/rɪˈsɜːrtʃ/",
    meaning: "n./v. 研究",
    examples: [
      "She conducted extensive research on the topic.",
      "The research findings were published."
    ]
  },
  "academic": {
    word: "academic",
    phonetic: "/ˌækəˈdemɪk/",
    meaning: "adj. 学术的",
    examples: [
      "He has an impressive academic record.",
      "The academic conference was well-attended."
    ]
  },
  "itinerary": {
    word: "itinerary",
    phonetic: "/aɪˈtɪnəreri/",
    meaning: "n. 行程",
    examples: [
      "We planned a detailed itinerary for the trip.",
      "The itinerary includes visits to three cities."
    ]
  },
  "accommodation": {
    word: "accommodation",
    phonetic: "/əˌkɑːməˈdeɪʃn/",
    meaning: "n. 住宿",
    examples: [
      "We booked accommodation near the beach.",
      "The hotel provides comfortable accommodation."
    ]
  },
  "scholarship": {
    word: "scholarship",
    phonetic: "/ˈskɑːlərʃɪp/",
    meaning: "n. 奖学金",
    examples: [
      "She received a full scholarship.",
      "The scholarship covers tuition and living expenses."
    ]
  },
  "application": {
    word: "application",
    phonetic: "/ˌæplɪˈkeɪʃn/",
    meaning: "n. 申请，应用",
    examples: [
      "She submitted her application last week.",
      "The application process takes two weeks."
    ]
  },
  "interview": {
    word: "interview",
    phonetic: "/ˈɪntərvjuː/",
    meaning: "n./v. 面试，采访",
    examples: [
      "She prepared well for the job interview.",
      "The interviewer asked about her experience."
    ]
  },
  "qualification": {
    word: "qualification",
    phonetic: "/ˌkwɑːlɪfɪˈkeɪʃn/",
    meaning: "n. 资格，资质",
    examples: [
      "She has the necessary qualifications for the job.",
      "The position requires specific qualifications."
    ]
  },
  "strength": {
    word: "strength",
    phonetic: "/streŋθ/",
    meaning: "n. 优势，力量",
    examples: [
      "Communication is one of my strengths.",
      "She identified her strengths and weaknesses."
    ]
  },
  "weakness": {
    word: "weakness",
    phonetic: "/ˈwiːknəs/",
    meaning: "n. 弱点",
    examples: [
      "He acknowledged his weakness in public speaking.",
      "We need to address this weakness."
    ]
  },
  "goal": {
    word: "goal",
    phonetic: "/ɡoʊl/",
    meaning: "n. 目标",
    examples: [
      "My career goal is to become a manager.",
      "She set clear goals for herself."
    ]
  },
  "achievement": {
    word: "achievement",
    phonetic: "/əˈtʃiːvmənt/",
    meaning: "n. 成就",
    examples: [
      "Graduating with honors was a great achievement.",
      "She celebrated her professional achievements."
    ]
  },
  "decision": {
    word: "decision",
    phonetic: "/dɪˈsɪʒn/",
    meaning: "n. 决定",
    examples: [
      "I made the decision to change careers.",
      "It was a difficult decision to make."
    ]
  },
  "data": {
    word: "data",
    phonetic: "/ˈdeɪtə/",
    meaning: "n. 数据",
    examples: [
      "We analyzed the data carefully.",
      "The data shows a clear trend."
    ]
  }
};

export function useVocabBook() {
  const [vocabList, setVocabList] = useState<VocabWord[]>(() => {
    try {
      const stored = localStorage.getItem(VOCAB_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(VOCAB_KEY, JSON.stringify(vocabList));
    } catch {
      // ignore
    }
  }, [vocabList]);

  const addWord = (word: string) => {
    const lowerWord = word.toLowerCase();
    
    // Check if already exists
    if (vocabList.some(w => w.word.toLowerCase() === lowerWord)) {
      return false;
    }

    // Get from dictionary or create placeholder
    const dictEntry = DICTIONARY[lowerWord];
    
    const newWord: VocabWord = dictEntry
      ? { ...dictEntry, collectedAt: Date.now() }
      : {
          word: lowerWord,
          phonetic: "",
          meaning: "（待补充）",
          examples: [],
          collectedAt: Date.now()
        };

    setVocabList(prev => [newWord, ...prev]);
    return true;
  };

  const removeWord = (word: string) => {
    setVocabList(prev => prev.filter(w => w.word.toLowerCase() !== word.toLowerCase()));
  };

  const isCollected = (word: string) => {
    return vocabList.some(w => w.word.toLowerCase() === word.toLowerCase());
  };

  return {
    vocabList,
    addWord,
    removeWord,
    isCollected
  };
}
