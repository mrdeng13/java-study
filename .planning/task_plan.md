# 任务计划：Java 全栈保姆级教程网站（单页 HTML）

## 需求
用户要一份"从 0 到 Java 全栈开发师"的保姆级教程，整理成一个 HTML 页面：
- 把用户当第一次接触编程的人
- 前端 / 后端 / 数据库 / 中间件全覆盖
- 附带问题（面试题/思考题）+ 力扣风格测试题
- 要求非常详细

## 技术决策
- **项目类型**：`simple-html`（纯静态展示 + 本地交互，无跨用户数据，无需数据库）
- **技术栈**：HTML + CSS + 原生 JS（Vite 构建），内容硬编码在 JS 数据模块中
- **交互功能**：侧边导航、章节展开、Tab 切换、测验（单选/多选/判断）、算法题练习、进度标记（localStorage）

## Phases
- [x] Phase 1: 规划与需求分析 — complete
- [x] Phase 2: 项目脚手架（simple-html 模板）— complete
- [x] Phase 3: 课程内容数据编写（9 大章节）— complete
- [x] Phase 4: 算法题库编写（10 题，含答案解析）— complete
- [x] Phase 5: 测验题库编写（47 题）— complete
- [x] Phase 6: UI 组件与交互逻辑 — complete
- [x] Phase 7: 样式与响应式 — complete
- [x] Phase 8: dev server 启动验证 — complete
- [x] Phase 9: 交付验证（curl + 浏览器等价检查）— complete

## Phases 2（V2 扩展：全量罗列 + 八股 + 易错 + 考试）
- [ ] Phase 10: 数据-完整知识清单 syllabus.js（7 模块全量知识点罗列）
- [ ] Phase 11: 数据-面试八股文 baguwen.js（Java基础/集合/并发/JVM/Spring/MySQL/Redis/MQ 场景题）
- [ ] Phase 12: 数据-易错点考查 pitfalls.js（30 天每日易错点 + 每日 2 道考查题）
- [ ] Phase 13: 数据-模拟考试 exams.js（3 套卷：基础/进阶/综合，自动计分限时）
- [ ] Phase 14: main.js 四个新视图（syllabus / baguwen / pitfalls / exam）+ 侧边导航
- [ ] Phase 15: style.css 新样式（清单表/八股卡/考试计时/成绩单）
- [ ] Phase 16: 验证（数据校验 + 日志 + curl）

## 状态
V1~V6 已交付（15 篇原理长文 / 60 算法 / 91 八股 / 126 测验 / 90 天易错 / 9 卷 / 9 家公司真题）。

## Phases 7（V7：易错提醒 + 成就勋章系统）
- [ ] Phase 17: 数据-achievements.js（24 枚勋章：阅读/测验/刷题/易错/考试/收藏家/速度/毅力 8 大系，含解锁条件描述与检查器）
- [ ] Phase 18: 数据-mistake-alerts.js（48 条经典易错提醒：语法/OOP/集合/并发/JVM/Spring/MySQL/Redis/网络/Linux 10 组）
- [ ] Phase 19: main.js 成就引擎（统计快照 → 条件检查 → 解锁 toast 队列 → localStorage 持久化）+ 成就中心视图
- [ ] Phase 20: main.js 易错提醒（随机轮播 toast + 「易错提醒」视图：48 条速查 + 随机 8 题小测）+ 行为埋点（quiz/algo/pitfall/exam/topic 6 处）
- [ ] Phase 21: index.html 导航（🏆 成就 + ⚡ 易错提醒入口）+ style.css（勋章卡/toast/进度环）
- [ ] Phase 22: 全量验证（node 校验 + 日志 + curl + 规划文件收尾）
