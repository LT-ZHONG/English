export interface SentenceData {
  id: string;
  chinese: string;
  wordGroups: string[][];
}

export interface DifficultyLevel {
  level: "基础" | "进阶" | "高级";
  sentences: SentenceData[];
}

export interface SceneGroup {
  scene: string;
  levels: DifficultyLevel[];
}

export const dictationScenes: SceneGroup[] = [
  {
    scene: "日常",
    levels: [
      {
        level: "基础",
        sentences: [
          { id: "daily-basic-001", chinese: "你好吗？", wordGroups: [["How"], ["are"], ["you"]] },
          { id: "daily-basic-002", chinese: "谢谢你的帮助", wordGroups: [["Thank"], ["you"], ["for"], ["your"], ["help"]] },
          { id: "daily-basic-003", chinese: "我很好", wordGroups: [["I"], ["am"], ["fine"]] },
          { id: "daily-basic-004", chinese: "早上好", wordGroups: [["Good"], ["morning"]] },
          { id: "daily-basic-005", chinese: "再见", wordGroups: [["Goodbye"], ["/"], ["See"], ["you"]] },
        ],
      },
      {
        level: "进阶",
        sentences: [
          { id: "daily-intermediate-001", chinese: "我喜欢在雨天读书", wordGroups: [["I"], ["like"], ["reading"], ["on"], ["rainy"], ["days"]] },
          { id: "daily-intermediate-002", chinese: "你能帮我一个忙吗？", wordGroups: [["Can"], ["you"], ["do"], ["me"], ["a"], ["favor"]] },
          {
            id: "daily-intermediate-003",
            chinese: "我通常乘公交或骑自行车上班",
            wordGroups: [["I"], ["usually"], ["take", "/"], ["the"], ["bus"], ["or"], ["ride"], ["a"], ["bike"], ["to"], ["work"]],
          },
          { id: "daily-intermediate-004", chinese: "她正在学习弹钢琴", wordGroups: [["She"], ["is"], ["learning"], ["to"], ["play"], ["the"], ["piano"]] },
          { id: "daily-intermediate-005", chinese: "我们周末去爬山吧", wordGroups: [["Let's"], ["go"], ["hiking"], ["this"], ["weekend"]] },
        ],
      },
      {
        level: "高级",
        sentences: [
          {
            id: "daily-advanced-001",
            chinese: "经验是犯错误后学到的东西",
            wordGroups: [["Experience"], ["is"], ["what"], ["you"], ["get"], ["after"], ["making"], ["a"], ["mistake"]],
          },
          {
            id: "daily-advanced-002",
            chinese: "你越努力练习，就会变得越好",
            wordGroups: [["The"], ["more"], ["you"], ["practice"], ["/"], ["the"], ["better"], ["you"], ["will"], ["become"]],
          },
          {
            id: "daily-advanced-003",
            chinese: "直到失去健康你才意识到它有多重要",
            wordGroups: [
              ["You"], ["don't"], ["realize"], ["how"], ["important"], ["health"], ["is"],
              ["until"], ["you"], ["lose"], ["it"],
            ],
          },
          {
            id: "daily-advanced-004",
            chinese: "如果我能回到过去，我会更加努力学习",
            wordGroups: [
              ["If"], ["I"], ["could"], ["go"], ["back"], ["in"], ["time"],
              ["/"], ["I"], ["would"], ["study"], ["harder"],
            ],
          },
          {
            id: "daily-advanced-005",
            chinese: "成功不是终点，失败也不致命，继续前进的勇气才最重要",
            wordGroups: [
              ["Success"], ["is"], ["not"], ["final"], ["/"], ["failure"], ["is"], ["not"], ["fatal"],
              ["/"], ["the"], ["courage"], ["to"], ["continue"], ["is"], ["what"], ["matters"], ["most"],
            ],
          },
        ],
      },
    ],
  },
  {
    scene: "商务",
    levels: [
      {
        level: "基础",
        sentences: [
          { id: "business-basic-001", chinese: "感谢您的耐心等待", wordGroups: [["Thank"], ["you"], ["for"], ["your"], ["patience"]] },
          { id: "business-basic-002", chinese: "您能给我报个价吗？", wordGroups: [["Could"], ["you"], ["give"], ["me"], ["a"], ["quote"]] },
          { id: "business-basic-003", chinese: "请在周五之前把报告发给我", wordGroups: [["Please"], ["send"], ["me"], ["the"], ["report"], ["by"], ["Friday"]] },
          { id: "business-basic-004", chinese: "我们很乐意与贵公司合作", wordGroups: [["We"], ["are"], ["pleased"], ["to"], ["work"], ["with"], ["your"], ["company"]] },
          { id: "business-basic-005", chinese: "会议几点开始？", wordGroups: [["What"], ["time"], ["does"], ["the"], ["meeting"], ["start"]] },
        ],
      },
      {
        level: "进阶",
        sentences: [
          {
            id: "business-intermediate-001",
            chinese: "我们想安排一次会议来讨论这个项目",
            wordGroups: [["We"], ["would"], ["like"], ["to"], ["schedule"], ["a"], ["meeting"], ["to"], ["discuss"], ["this"], ["project"]],
          },
          {
            id: "business-intermediate-002",
            chinese: "我们需要在截止日期前完成这个任务",
            wordGroups: [["We"], ["need"], ["to"], ["finish"], ["this"], ["task"], ["before"], ["the"], ["deadline"]],
          },
          {
            id: "business-intermediate-003",
            chinese: "请查看附件中的合同草案",
            wordGroups: [["Please"], ["review"], ["the"], ["draft"], ["contract"], ["in"], ["the"], ["attachment"]],
          },
          {
            id: "business-intermediate-004",
            chinese: "我们希望在下季度扩大市场份额",
            wordGroups: [["We"], ["hope"], ["to"], ["expand"], ["our"], ["market"], ["share"], ["next"], ["quarter"]],
          },
          {
            id: "business-intermediate-005",
            chinese: "这个提案需要董事会的批准",
            wordGroups: [["This"], ["proposal"], ["requires"], ["approval"], ["from"], ["the"], ["board"], ["of"], ["directors"]],
          },
        ],
      },
      {
        level: "高级",
        sentences: [
          {
            id: "business-advanced-001",
            chinese: "鉴于目前的市场波动，我们建议采取更为保守的投资策略",
            wordGroups: [["Given"], ["the"], ["current"], ["market"], ["volatility"], ["/"], ["we"], ["recommend"], ["adopting"], ["a"], ["more"], ["conservative"], ["investment"], ["strategy"]],
          },
          {
            id: "business-advanced-002",
            chinese: "双方就知识产权归属问题进行了长达三小时的谈判",
            wordGroups: [["The"], ["two"], ["parties"], ["negotiated"], ["for"], ["over"], ["three"], ["hours"], ["on"], ["the"], ["issue"], ["of"], ["intellectual"], ["property"], ["rights"]],
          },
          {
            id: "business-advanced-003",
            chinese: "除非贵方同意修改付款条件，否则我们无法签署这份协议",
            wordGroups: [["Unless"], ["your"], ["side"], ["agrees"], ["to"], ["modify"], ["the"], ["payment"], ["terms"], ["/"], ["we"], ["cannot"], ["sign"], ["this"], ["agreement"]],
          },
          {
            id: "business-advanced-004",
            chinese: "本季度营收同比增长了百分之十五，超出分析师预期",
            wordGroups: [["Revenue"], ["grew"], ["fifteen"], ["percent"], ["year"], ["over"], ["year"], ["this"], ["quarter"], ["/"], ["exceeding"], ["analysts'"], ["expectations"]],
          },
          {
            id: "business-advanced-005",
            chinese: "我们致力于在可持续发展的框架内实现长期价值创造",
            wordGroups: [["We"], ["are"], ["committed"], ["to"], ["achieving"], ["long-term"], ["value"], ["creation"], ["within"], ["the"], ["framework"], ["of"], ["sustainable"], ["development"]],
          },
        ],
      },
    ],
  },
  {
    scene: "学术",
    levels: [
      {
        level: "基础",
        sentences: [
          { id: "academic-basic-001", chinese: "请在下节课之前阅读第三章", wordGroups: [["Please"], ["read"], ["chapter"], ["three"], ["before"], ["the"], ["next"], ["class"]] },
          { id: "academic-basic-002", chinese: "这个发现与之前的研究一致", wordGroups: [["This"], ["finding"], ["is"], ["consistent"], ["with"], ["previous"], ["research"]] },
          { id: "academic-basic-003", chinese: "作业截止日期是下周一", wordGroups: [["The"], ["assignment"], ["is"], ["due"], ["next"], ["Monday"]] },
          { id: "academic-basic-004", chinese: "教授今天请假了", wordGroups: [["The"], ["professor"], ["is"], ["absent"], ["today"]] },
          { id: "academic-basic-005", chinese: "图书馆几点关门？", wordGroups: [["What"], ["time"], ["does"], ["the"], ["library"], ["close"]] },
        ],
      },
      {
        level: "进阶",
        sentences: [
          {
            id: "academic-intermediate-001",
            chinese: "这篇论文探讨了气候变化的影响",
            wordGroups: [["This"], ["paper"], ["examines"], ["the"], ["impact"], ["of"], ["climate"], ["change"]],
          },
          {
            id: "academic-intermediate-002",
            chinese: "研究结果表明两者之间存在显著相关性",
            wordGroups: [["The"], ["results"], ["indicate"], ["a"], ["significant"], ["correlation"], ["between"], ["the"], ["two"]],
          },
          {
            id: "academic-intermediate-003",
            chinese: "作者认为这个理论需要进一步验证",
            wordGroups: [["The"], ["author"], ["argues"], ["that"], ["this"], ["theory"], ["needs"], ["further"], ["verification"]],
          },
          {
            id: "academic-intermediate-004",
            chinese: "我们使用了定量和定性两种研究方法",
            wordGroups: [["We"], ["used"], ["both"], ["quantitative"], ["and"], ["qualitative"], ["research"], ["methods"]],
          },
          {
            id: "academic-intermediate-005",
            chinese: "文献综述部分需要引用至少十篇来源",
            wordGroups: [["The"], ["literature"], ["review"], ["section"], ["needs"], ["at"], ["least"], ["ten"], ["sources"], ["cited"]],
          },
        ],
      },
      {
        level: "高级",
        sentences: [
          {
            id: "academic-advanced-001",
            chinese: "本研究采用混合方法设计，结合了纵向数据收集与横断面分析",
            wordGroups: [["This"], ["study"], ["employs"], ["a"], ["mixed-methods"], ["design"], ["/"], ["combining"], ["longitudinal"], ["data"], ["collection"], ["with"], ["cross-sectional"], ["analysis"]],
          },
          {
            id: "academic-advanced-002",
            chinese: "尽管样本量有限，研究结果仍具有重要的理论启示意义",
            wordGroups: [["Despite"], ["the"], ["limited"], ["sample"], ["size"], ["/"], ["the"], ["findings"], ["carry"], ["significant"], ["theoretical"], ["implications"]],
          },
          {
            id: "academic-advanced-003",
            chinese: "同行评审过程中，审稿人对方法论的严谨性提出了质疑",
            wordGroups: [["During"], ["peer"], ["review"], ["/"], ["reviewers"], ["questioned"], ["the"], ["methodological"], ["rigor"], ["of"], ["the"], ["study"]],
          },
          {
            id: "academic-advanced-004",
            chinese: "该模型的解释力在控制混杂变量后仍然显著",
            wordGroups: [["The"], ["explanatory"], ["power"], ["of"], ["the"], ["model"], ["remains"], ["significant"], ["after"], ["controlling"], ["for"], ["confounding"], ["variables"]],
          },
          {
            id: "academic-advanced-005",
            chinese: "未来研究应探索因果关系而非仅仅关注相关关系",
            wordGroups: [["Future"], ["research"], ["should"], ["explore"], ["causal"], ["relationships"], ["rather"], ["than"], ["merely"], ["focusing"], ["on"], ["correlations"]],
          },
        ],
      },
    ],
  },
  {
    scene: "旅游",
    levels: [
      {
        level: "基础",
        sentences: [
          { id: "travel-basic-001", chinese: "这个多少钱？", wordGroups: [["How"], ["much"], ["is"], ["this"]] },
          { id: "travel-basic-002", chinese: "我想退房", wordGroups: [["I"], ["would"], ["like"], ["to"], ["check"], ["out"]] },
          { id: "travel-basic-003", chinese: "请给我看一下菜单", wordGroups: [["Could"], ["I"], ["see"], ["the"], ["menu"], ["please"]] },
          { id: "travel-basic-004", chinese: "我想预订一间双人房", wordGroups: [["I"], ["would"], ["like"], ["to"], ["book"], ["a"], ["double"], ["room"]] },
          { id: "travel-basic-005", chinese: "附近有推荐的餐厅吗？", wordGroups: [["Is"], ["there"], ["a"], ["good"], ["restaurant"], ["nearby"]] },
        ],
      },
      {
        level: "进阶",
        sentences: [
          {
            id: "travel-intermediate-001",
            chinese: "请问去火车站怎么走？",
            wordGroups: [["Excuse"], ["me"], ["/"], ["how"], ["do"], ["I"], ["get"], ["to"], ["the"], ["train"], ["station"]],
          },
          {
            id: "travel-intermediate-002",
            chinese: "我想租一辆车，最好有导航",
            wordGroups: [["I'd"], ["like"], ["to"], ["rent"], ["a"], ["car"], ["/"], ["preferably"], ["with"], ["GPS"]],
          },
          {
            id: "travel-intermediate-003",
            chinese: "这个景点的开放时间是几点到几点？",
            wordGroups: [["What"], ["are"], ["the"], ["opening"], ["hours"], ["for"], ["this"], ["attraction"]],
          },
          {
            id: "travel-intermediate-004",
            chinese: "请问这趟航班在哪个登机口？",
            wordGroups: [["Excuse"], ["me"], ["/"], ["which"], ["gate"], ["is"], ["this"], ["flight"], ["boarding"], ["from"]],
          },
          {
            id: "travel-intermediate-005",
            chinese: "我需要把行李寄存在这里",
            wordGroups: [["I"], ["need"], ["to"], ["leave"], ["my"], ["luggage"], ["here"]],
          },
        ],
      },
      {
        level: "高级",
        sentences: [
          {
            id: "travel-advanced-001",
            chinese: "由于航班延误，我需要改签到明天的同一航班",
            wordGroups: [["Due"], ["to"], ["the"], ["flight"], ["delay"], ["/"], ["I"], ["need"], ["to"], ["reschedule"], ["to"], ["the"], ["same"], ["flight"], ["tomorrow"]],
          },
          {
            id: "travel-advanced-002",
            chinese: "请问你们酒店是否提供机场接送服务？",
            wordGroups: [["Does"], ["your"], ["hotel"], ["offer"], ["airport"], ["transfer"], ["service"]],
          },
          {
            id: "travel-advanced-003",
            chinese: "我想取消预订，请问退款政策是怎样的？",
            wordGroups: [["I'd"], ["like"], ["to"], ["cancel"], ["my"], ["reservation"], ["/"], ["what"], ["is"], ["the"], ["refund"], ["policy"]],
          },
          {
            id: "travel-advanced-004",
            chinese: "这个旅行套餐包含哪些景点和交通方式？",
            wordGroups: [["What"], ["attractions"], ["and"], ["modes"], ["of"], ["transportation"], ["are"], ["included"], ["in"], ["this"], ["tour"], ["package"]],
          },
          {
            id: "travel-advanced-005",
            chinese: "我的护照在酒店房间遗失了，请问失物招领处在哪里？",
            wordGroups: [["I"], ["lost"], ["my"], ["passport"], ["in"], ["my"], ["hotel"], ["room"], ["/"], ["where"], ["is"], ["the"], ["lost"], ["and"], ["found"]],
          },
        ],
      },
    ],
  },
  {
    scene: "留学",
    levels: [
      {
        level: "基础",
        sentences: [
          { id: "study-basic-001", chinese: "很高兴认识你", wordGroups: [["Nice"], ["to"], ["meet"], ["you"]] },
          { id: "study-basic-002", chinese: "我想注册这门课程", wordGroups: [["I"], ["would"], ["like"], ["to"], ["enroll"], ["in"], ["this"], ["course"]] },
          { id: "study-basic-003", chinese: "请问宿舍的租金是多少？", wordGroups: [["How"], ["much"], ["is"], ["the"], ["rent"], ["for"], ["the"], ["dormitory"]] },
          { id: "study-basic-004", chinese: "校园里有超市吗？", wordGroups: [["Is"], ["there"], ["a"], ["supermarket"], ["on"], ["campus"]] },
          { id: "study-basic-005", chinese: "我需要延长我的签证", wordGroups: [["I"], ["need"], ["to"], ["extend"], ["my"], ["visa"]] },
        ],
      },
      {
        level: "进阶",
        sentences: [
          {
            id: "study-intermediate-001",
            chinese: "你能推荐一些课外活动吗？",
            wordGroups: [["Can"], ["you"], ["recommend"], ["any"], ["extracurricular"], ["activities"]],
          },
          {
            id: "study-intermediate-002",
            chinese: "这门课的先修要求是什么？",
            wordGroups: [["What"], ["are"], ["the"], ["prerequisites"], ["for"], ["this"], ["course"]],
          },
          {
            id: "study-intermediate-003",
            chinese: "我想申请奖学金，需要什么材料？",
            wordGroups: [["I"], ["want"], ["to"], ["apply"], ["for"], ["a"], ["scholarship"], ["/"], ["what"], ["documents"], ["are"], ["needed"]],
          },
          {
            id: "study-intermediate-004",
            chinese: "国际学生办公室在哪里？",
            wordGroups: [["Where"], ["is"], ["the"], ["international"], ["students"], ["office"]],
          },
          {
            id: "study-intermediate-005",
            chinese: "我可以旁听这门课吗？",
            wordGroups: [["Can"], ["I"], ["audit"], ["this"], ["class"]],
          },
        ],
      },
      {
        level: "高级",
        sentences: [
          {
            id: "study-advanced-001",
            chinese: "我正在准备研究生入学申请，需要两封推荐信",
            wordGroups: [["I'm"], ["preparing"], ["my"], ["graduate"], ["school"], ["application"], ["/"], ["I"], ["need"], ["two"], ["letters"], ["of"], ["recommendation"]],
          },
          {
            id: "study-advanced-002",
            chinese: "请问助教的工作时间是什么时候，我可以预约面谈吗？",
            wordGroups: [["What"], ["are"], ["the"], ["TA's"], ["office"], ["hours"], ["/"], ["can"], ["I"], ["schedule"], ["an"], ["appointment"]],
          },
          {
            id: "study-advanced-003",
            chinese: "我的研究计划需要导师签字后才能提交",
            wordGroups: [["My"], ["research"], ["proposal"], ["needs"], ["my"], ["advisor's"], ["signature"], ["before"], ["submission"]],
          },
          {
            id: "study-advanced-004",
            chinese: "学分转换申请已经提交，大概多久能出结果？",
            wordGroups: [["The"], ["credit"], ["transfer"], ["application"], ["has"], ["been"], ["submitted"], ["/"], ["how"], ["long"], ["until"], ["I"], ["get"], ["the"], ["result"]],
          },
          {
            id: "study-advanced-005",
            chinese: "我想参加交换生项目，GPA 要求是多少？",
            wordGroups: [["I"], ["want"], ["to"], ["participate"], ["in"], ["the"], ["exchange"], ["program"], ["/"], ["what"], ["is"], ["the"], ["GPA"], ["requirement"]],
          },
        ],
      },
    ],
  },
  {
    scene: "面试",
    levels: [
      {
        level: "基础",
        sentences: [
          { id: "interview-basic-001", chinese: "我叫李明，来自北京", wordGroups: [["My"], ["name"], ["is"], ["Li"], ["Ming"], ["/"], ["I'm"], ["from"], ["Beijing"]] },
          { id: "interview-basic-002", chinese: "我毕业于北京大学", wordGroups: [["I"], ["graduated"], ["from"], ["Peking"], ["University"]] },
          { id: "interview-basic-003", chinese: "我有三年的工作经验", wordGroups: [["I"], ["have"], ["three"], ["years"], ["of"], ["work"], ["experience"]] },
          { id: "interview-basic-004", chinese: "我擅长团队合作和沟通", wordGroups: [["I"], ["am"], ["good"], ["at"], ["teamwork"], ["and"], ["communication"]] },
          { id: "interview-basic-005", chinese: "我对这个职位很感兴趣", wordGroups: [["I"], ["am"], ["very"], ["interested"], ["in"], ["this"], ["position"]] },
        ],
      },
      {
        level: "进阶",
        sentences: [
          {
            id: "interview-intermediate-001",
            chinese: "我上一份工作负责项目管理，带领十人团队",
            wordGroups: [["In"], ["my"], ["previous"], ["role"], ["/"], ["I"], ["managed"], ["projects"], ["and"], ["led"], ["a"], ["team"], ["of"], ["ten"]],
          },
          {
            id: "interview-intermediate-002",
            chinese: "我最大的优点是有较强的学习能力",
            wordGroups: [["My"], ["greatest"], ["strength"], ["is"], ["my"], ["ability"], ["to"], ["learn"], ["quickly"]],
          },
          {
            id: "interview-intermediate-003",
            chinese: "我希望能在这个岗位上发挥我的专业技能",
            wordGroups: [["I"], ["hope"], ["to"], ["apply"], ["my"], ["professional"], ["skills"], ["in"], ["this"], ["role"]],
          },
          {
            id: "interview-intermediate-004",
            chinese: "我熟悉 Python 和 Java 两种编程语言",
            wordGroups: [["I"], ["am"], ["proficient"], ["in"], ["both"], ["Python"], ["and"], ["Java"]],
          },
          {
            id: "interview-intermediate-005",
            chinese: "我离职的原因是寻求更大的发展空间",
            wordGroups: [["I"], ["left"], ["my"], ["last"], ["job"], ["/"], ["because"], ["I"], ["was"], ["seeking"], ["greater"], ["growth"], ["opportunities"]],
          },
        ],
      },
      {
        level: "高级",
        sentences: [
          {
            id: "interview-advanced-001",
            chinese: "在上一份工作中，我主导了一次系统架构升级，将响应时间缩短了百分之四十",
            wordGroups: [["In"], ["my"], ["previous"], ["role"], ["/"], ["I"], ["led"], ["a"], ["system"], ["architecture"], ["upgrade"], ["/"], ["reducing"], ["response"], ["time"], ["by"], ["forty"], ["percent"]],
          },
          {
            id: "interview-advanced-002",
            chinese: "我认为有效的跨部门协作是推动项目成功的关键因素",
            wordGroups: [["I"], ["believe"], ["that"], ["effective"], ["cross-departmental"], ["collaboration"], ["is"], ["the"], ["key"], ["factor"], ["in"], ["driving"], ["project"], ["success"]],
          },
          {
            id: "interview-advanced-003",
            chinese: "面对紧迫的截止日期，我会优先梳理任务的关键路径并合理分配资源",
            wordGroups: [["When"], ["facing"], ["tight"], ["deadlines"], ["/"], ["I"], ["prioritize"], ["mapping"], ["the"], ["critical"], ["path"], ["and"], ["allocating"], ["resources"], ["accordingly"]],
          },
          {
            id: "interview-advanced-004",
            chinese: "我的职业目标是在五年内成长为一名技术负责人",
            wordGroups: [["My"], ["career"], ["objective"], ["is"], ["to"], ["grow"], ["into"], ["a"], ["technical"], ["lead"], ["role"], ["within"], ["five"], ["years"]],
          },
          {
            id: "interview-advanced-005",
            chinese: "我具备在高压环境下保持冷静分析并做出数据驱动决策的能力",
            wordGroups: [["I"], ["have"], ["the"], ["ability"], ["to"], ["remain"], ["calm"], ["under"], ["pressure"], ["/"], ["and"], ["make"], ["data-driven"], ["decisions"]],
          },
        ],
      },
    ],
  },
];
