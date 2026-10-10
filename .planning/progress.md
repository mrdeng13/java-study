# 进度日志

## Session 2026-10-10

- [x] 需求分析完成 → simple-html 静态方案（无持久化业务数据）
- [x] 模板脚手架创建完成
- [x] 课程内容 9 大章节全部编写完成（data/chapters.js，约 3000+ 行教学内容）
- [x] 算法题库 10 题完成（data/algorithms.js）
- [x] 测验题库 47 题完成（data/quizzes.js）
- [x] UI 交互逻辑完成（sidebar 导航、测验判分、算法题展开、进度保存）
- [x] 样式完成（含响应式、代码高亮、暗色侧边栏）
- [x] dev server 启动验证通过（curl 200）
- [x] 页面资源加载验证通过（/src/main.js、/src/style.css 均 200）

## 验证结果
- http://localhost:8000 → 200 OK
- 数据校验：9 章 / 280 知识块 / 10 算法题 / 47 测验题，答案结构 0 问题
- dev-server.log 无编译错误，rum-events.log 无运行时错误
- 测验数量标注已从 40 修正为 47

## V2 扩展（全量罗列 + 八股 + 易错 + 考试）
- [x] syllabus.js：完整知识清单 8 模块 / 81 单元 / 必修 238 天 / 全量 285 天
- [x] baguwen.js：面试八股文 8 分类 / 37 问（标准答案+加分点+追问链）
- [x] pitfalls.js：易错点考场 30 天 / 120 易错点 / 60 道考查题
- [x] exams.js：模拟考试 3 套卷 / 60 题（限时+计分+复盘+历史最佳）
- [x] main.js 新增 4 个视图（syllabus/baguwen/pitfalls/exam），考试含计时器/交卷判分/逐题复盘
- [x] index.html 侧边导航新增"知识总览与考查"分组
- [x] style.css 追加 V2 样式（约 170 行）
- [x] 修复 2 处 JS 单引号转义语法错误（baguwen.js / pitfalls.js）
- [x] 数据校验 0 异常，全部资源 HTTP 200，RUM 旧错误已清空无新增

## V2 验证结果
- 数据校验：8 模块 81 单元 / 37 八股 / 30 天 120 点 60 题 / 3 卷 60 题，0 异常
- 所有新资源 200：syllabus.js / baguwen.js / pitfalls.js / exams.js / main.js
- dev-server.log 仅 HMR 正常日志，无编译错误

## V3 扩充（对标小林 coding：考点与内容量倍增）
- [x] topics-network-os.js：图解原理专栏 5 篇（TCP握手挥手/HTTP演进+HTTPS/流量拥塞控制/进程线程IPC/虚拟内存+epoll）
- [x] topics-mysql-redis.js：图解原理专栏 4 篇（B+树/MVCC与事务/Redis数据结构/缓存三大问题+持久化+集群）
- [x] baguwen.js 37→53 问（新增 计算机网络 6 / 操作系统 5 / MyBatis·设计模式·CAP 5）
- [x] algorithms.js 10→30 题（+20：树/BFS/双指针/二分/区间/DP×4/前缀和/接雨水/编辑距离/单调栈/N皇后/TopK）
- [x] quizzes.js 47→78 题（+31：网络 8 / OS 7 / MySQL 深入 8 / Redis 深入 8）
- [x] exams.js 3→6 卷 120 题（+网络专项 20 / OS 专项 20 / MySQL·Redis 深度 20）
- [x] pitfalls.js 30→60 天 210 点 120 题（+网络/OS/MySQL/Redis/并发/JVM/Spring/分布式/场景设计）
- [x] main.js 新增 topics 视图（标签筛选+已读打卡），导航/首页卡片同步
- [x] style.css 追加 V3 样式（topic-card/filter/read-btn）
- [x] 全量数据校验 0 异常；全部资源 200；无编译/运行时错误

## V3 最终数据
9 章 280 块 + 9 篇图解长文 115 块 / 53 八股 / 78 测验 / 30 算法 / 60 天易错 120 题 / 6 卷 120 题

## V5 扩充（题量与知识点再翻倍，用户反馈"题少了知识点"）
- [x] quizzes.js 78→126 题（+48：并发 8 / JVM 8 / Spring 8 / MQ 5 / 分布式 6 / Linux 5 / MyBatis·接口 4 / 场景设计 4）
- [x] baguwen.js 53→91 问 16 类（+38：JVM 进阶 10 / Spring 进阶 8 / 设计模式 7 / 场景设计二 6 / 部署运维 7）
- [x] algorithms.js 30→50 题（+20：删倒数N/环形链表II/重排链表/最小栈/栈序列验证/位运算/路径总和/LCA/矩阵置零/二分答案/盛水容器/前缀和+哈希/打家劫舍/零钱兑换/LIS/岛屿数/腐烂橘子/手写快排/最小覆盖子串/归并统计）
- [x] pitfalls.js 60→90 天 334 点 180 题（+30 天：并发3/JVM2/Spring2/MySQL2/Redis2/网络1/Linux1/分布式1/设计题2/算法方法论/面试表达/Git/MyBatis/MQ/微服务/监控/Offer谈判/简历/背调/持续成长/速记/时间线/毕业总结）
- [x] exams.js 6→9 卷 180 题（+并发JVM专项20 / Spring专项20 / 分布式架构专项20）
- [x] syllabus.js 8→11 模块 107 单元（+JVM与性能工程9 / Spring深度与云原生9 / 分布式系统与架构8）
- [x] main.js 首页简介与卡片全部改为动态统计；renderQuiz 头部题数动态化
- [x] index.html 导航数量同步（91 问/126 题/50 题/90 天 180 题/9 套卷/9 篇）
- [x] 修复 algo50 solution 中无效占位代码（nums == null 行）
- [x] 全量校验 0 异常（含答案越界/重复天数检查），全部资源 200，无编译/运行时错误

## V5 最终数据（题目总数 627）
9 章 280 块 + 9 篇图解长文 / 91 八股（16 类）/ 50 算法 / 126 测验（21 组）/ 90 天易错 334 点 180 题 / 9 卷 180 题 / 知识清单 11 模块 107 单元（必修 248 天 / 全部 384 天）

## V6 扩充（用户点名三样：集合源码专篇 / 更多困难题 / 按公司真题）
- [x] topics-collections.js：6 篇集合源码级原创长文（ArrayList 扩容与 fail-fast / LinkedList 双端队列 / HashMap put 六步与树化 / CHM CAS+synchronized+CounterCell / LinkedHashMap-LRU+TreeMap 红黑树 / 框架全景+Arrays.asList 四坑）
- [x] algorithms.js 50→60（+10 全困难：合并K链表/最长有效括号/柱状图最大矩形/最小覆盖子串/数据流中位数/LRU/最大路径和/戳气球/中位数二分分割线/编辑距离——已有困难题累计 17 道）
- [x] company-questions.js：9 家大厂 56 问（阿里/字节/腾讯/美团/百度/京东/拼多多/快手/网易小米合集），每题含答案要点+考察意图+标签，附各厂风格解读与高频方向
- [x] main.js：import 两文件、renderCompanies 视图、renderTopics 合并集合篇（标签筛选自动出现"集合源码"）、路由注册、首页简介/卡片更新
- [x] index.html 导航新增"🏢 大厂分类真题（9 家 56 问）"，图解专栏更名"原理与源码专栏（15 篇）"，刷题 60 题
- [x] style.css 追加公司真题样式（co-*/coq-* 约 60 行）
- [x] 全量校验 0 异常；全部资源 200；无编译/运行时错误

## V6 最终数据
15 篇原理长文 185 块（网络3+OS2+MySQL2+Redis2+集合源码6）/ 60 算法（17 困难）/ 56 公司真题 / 91 八股 / 126 测验 / 90 天易错 180 题 / 9 卷 180 题 / 107 知识单元

## V7 扩充（用户点名：易错点提醒 + 成就勋章系统）
- [x] achievements.js：26 枚勋章 · 8 大系列（求知者/答题手/刷题侠/避坑人/考霸/原理控/收藏家/特别），铜银金钻四档，每枚带 check(stats) 检查器，全零/满状态模拟执行无异常
- [x] mistake-alerts.js：48 条易错提醒 · 10 组（语法 6/OOP 5/集合 6/并发 6/JVM 4/Spring 5/MySQL 6/Redis 5/网络 3/Linux 工程 2），三段式「错误认知→正确真相→常见场景」
- [x] main.js 成就引擎：buildStats() 统计快照 → checkAchievements() 全量检查 → toast 队列逐个弹出（4.2s 间隔）→ localStorage 持久化 + 侧边栏角标
- [x] main.js 提醒引擎：maybeAlertToast() 切页 28% 概率弹未读提醒（8s 自动消失可手关）
- [x] 行为埋点 6 处：章节打卡/测验判分/算法展开/易错作答/专栏已读/考试交卷 + 闪卡作答，答错与夜间行为单独记录（卷土重来/夜猫子前置）
- [x] 成就中心视图：按系列分组勋章墙（解锁彩色+锁定灰阶），总进度条 + 「即将达成」提示 + 解锁日期
- [x] 易错提醒中心视图：分组速查卡 + 🎴 随机闪卡小测 8 题（随机正反陈述，答后揭示真相 + 计入成就统计）
- [x] index.html：新增「激励与防坑」导航组（⚡易错点提醒 / 🏆成就勋章 + 角标）
- [x] style.css：+约 260 行（勋章墙/toast/进度条/闪卡/移动端适配）
- [x] 重置逻辑同步清空成就/提醒/闪卡数据
- [x] 全量校验 0 异常；所有资源 200；无编译/运行时错误（rum-events.log 不存在）

## V7 最终状态
全站题量 700+：60 算法 + 56 公司真题 + 91 八股 + 126 测验 + 180 易错题 + 180 考题 + 26 枚成就 + 48 条提醒 + 8 题闪卡。访问 http://localhost:8000（预览面板或 k79ugfzimkn5-preview.rush.zhenguanyu.com）。

## V8 扩充（用户点名：加入几个隐藏成就）
- [x] achievements.js：新增 hidden 系列（第 9 个系列）+ 6 枚隐藏成就（hidden:true / desc='？？？' / hint=解锁后揭晓的谜底）：
  - 🤫 咖啡的 secret 配方（金）：连点左上角 Logo 7 次
  - 🃏 透视之眼（金）：闪卡小测 8 题全对
  - ⚡ 光速交卷（金）：90 秒内完成考试并及格
  - 👣 全图鉴探险家（银）：足迹遍布 9 大板块（含公司真题/闪卡/八股）
  - 🕳️ 坑王的本能（银）：累计答错 20 题
  - 🔮 打破次元壁（钻石）：集齐 26 枚常规勋章 + 总动作 300
- [x] 毕业礼条件修正：由写死 23 枚改为「集齐其余全部常规勋章」动态计算（隐藏不计入），同步修复历史计数偏差
- [x] main.js：buildStats 新增 logoClicks/flashPerfect/fastPassExam/touchedZones/wrongCount 五指标；checkAchievements 改传常规已解锁数 + 使用 allAchievements；新增 6 处彩蛋埋点（logo 连点/闪卡作答/闪卡结算/考试交卷/quiz 判分含八股足迹/公司真题踏足）
- [x] 隐藏成就解锁 toast 专属紫色皮肤 +「🎉 隐藏成就解锁」标题 + hint 揭晓
- [x] 成就中心：隐藏系列未解锁时整组显示「？？？神秘墙」；未解锁隐藏勋章显示 ❓？？？条件保密；「即将达成」过滤隐藏项；文案提示彩蛋存在
- [x] store 扩展：examMeta/logoClicks/wrongCount/flashPerfect/fastPassExam/touchedZones，reset 全量清空
- [x] style.css：+约 60 行（虚线神秘卡/❓脉冲动画/紫色解锁框/toast 皮肤/神秘系列墙）
- [x] 校验：数据结构/全零不误解锁/满状态全解锁/毕业礼 25→是 24→否/次元壁 26 且 ≥300 动作/stats 导出，全部通过
- [x] 服务验证：所有资源 200，无编译错误，无运行时错误

## V8 最终状态
32 枚勋章（26 常规 + 6 隐藏）· 9 大系列。隐藏成就不剧透条件、不计入毕业礼，纯探索向彩蛋。
