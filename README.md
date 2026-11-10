# 英语听写与口语练习

一个基于浏览器的英语学习单页应用：听写（看中文 / 听发音，填写英文单词）、跟读口语评测、生词本与学习统计。所有数据保存在浏览器本地，无需后端。

## 功能

- **听写练习**（`/`）
  - 6 个场景 × 3 个难度（基础 / 进阶 / 高级）= 18 组题目
  - 场景：日常、商务、学术、旅游、留学、面试
  - 根据中文提示逐词填空，输入框自动聚焦并校验对错
  - TTS 朗读整句（美式英语，语速 0.85）
  - 快捷键：`Space` 朗读、`PageUp` 上一题、`PageDown` / `Enter` 下一题（需全部答对）
  - 浅色 / 深色主题切换，偏好自动记忆
- **跟读练习**（`/read-along`）：使用语音识别识别你的朗读，按词比对并给出正确率（正确 / 错误 / 漏读）
- **生词本**（`/vocab-book`）：查看音标、释义和例句，支持发音与删除。⚠️ 目前处于半成品状态：页面没有入口链接，也没有任何地方调用"收藏单词"（`addWord`），实际无法添加单词
- **学习统计**（`/stats`）：每日练习时长、完成题数，以及各场景进度图表。⚠️ 目前听写页没有累计正确 / 错误次数，因此正确率相关数据恒为 0

## 技术栈

- React 19 + TypeScript
- Vite 7
- TanStack Router（文件路由）、TanStack Query
- Tailwind CSS 4 + shadcn/ui（Radix UI）
- lucide-react（图标）、recharts（图表）、framer-motion
- Web Speech API（`speechSynthesis` 朗读、`SpeechRecognition` 语音识别）

## 快速开始

环境要求：Node.js 18+，推荐使用 [pnpm](https://pnpm.io/)。

```bash
# 安装依赖
pnpm install

# 启动开发服务器（http://localhost:3015，端口被占用时会直接报错）
pnpm dev

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 单元测试
pnpm test

# 生产构建（输出到 dist/）
pnpm build

# 本地预览构建产物（端口 3015）
pnpm preview
```

## 项目结构

```
src/
├── main.tsx                  # 应用入口
├── router.tsx                # 路由实例
├── routeTree.gen.ts          # 路由树（由 TanStack Router 插件自动生成，勿手改）
├── styles.css                # 全局样式与主题变量
├── routes/
│   ├── __root.tsx            # 根布局（QueryClientProvider、404/错误回退到首页）
│   ├── index.tsx             # 听写练习主页面
│   ├── read-along.tsx        # 跟读练习
│   ├── vocab-book.tsx        # 生词本
│   └── stats.tsx             # 学习统计
├── components/
│   ├── WordInputGroup.tsx    # 单词填空组件
│   └── ui/                   # shadcn/ui 通用组件
├── hooks/
│   ├── useStudyStats.ts      # 学习统计数据管理
│   ├── useVocabBook.ts       # 生词本数据管理（含内置词典）
│   └── use-mobile.tsx        # 移动端检测
├── data/
│   └── dictationData.ts      # 题库：场景 → 难度 → 句子
└── lib/
    ├── utils.ts              # 工具函数（cn 等）
    └── reveal-engine.ts      # 滚动渐入动画运行时（模板预置）
```

## 题库格式

题库定义在 `src/data/dictationData.ts`，结构为 场景 → 难度 → 句子：

```ts
{
  scene: "日常",
  levels: [
    {
      level: "基础", // "基础" | "进阶" | "高级"
      sentences: [
        { id: "daily-basic-001", chinese: "你好吗？", wordGroups: [["How"], ["are"], ["you"]] },
      ],
    },
  ],
}
```

- `id`：稳定 ID，进度按它记录。格式是 `场景-难度-序号`，例如 `daily-basic-001`
- `chinese`：中文提示
- `wordGroups`：每个子数组对应一组输入框；`"/"` 表示分隔符，不参与校验与朗读

新增题目只需在对应难度的 `sentences` 中追加条目即可。

## 数据存储

数据均保存在浏览器 `localStorage`：

| Key | 内容 |
| --- | --- |
| `dictation-theme` | 主题偏好 |
| `dictation-study-stats` | 学习统计（每日记录按本地日期和有效练习秒数、按句子 ID 记录的场景进度、累计数据） |
| `dictation-vocab-book` | 生词本 |

清除浏览器站点数据会同时清空这些记录。

## 开发注意事项

- **ref 管理**：不要手动替换 `inputRefs.current` 数组（如 `inputRefs.current = []`），否则子组件 ref 回调会写入旧数组引用；让 React 的 ref 回调自然管理。聚焦由 `focusIndex` 状态驱动。
- **TTS 延迟**：Web Speech API 需要等浏览器语音服务初始化，在 `useEffect` 中自动朗读时应使用 `setTimeout`（约 300ms）延迟调用，不要直接调用 `speak()`。
- **开发服务器**：`vite.config.ts` 固定监听 `3015` 端口（`strictPort`），并开启 HMR。

## 浏览器兼容性

- 朗读依赖 `speechSynthesis`，主流现代浏览器均支持。
- 跟读依赖 `SpeechRecognition` / `webkitSpeechRecognition`，推荐使用 Chrome 或 Edge，并允许麦克风权限；不支持的浏览器无法使用跟读评测。
