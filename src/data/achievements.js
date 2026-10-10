// 成就勋章系统：26 枚常规 + 6 枚隐藏 · 9 大系列
// 每枚勋章：{ id, icon, name, tier(铜/银/金/钻石), desc(解锁条件文案), series, check(stats) => bool, hidden? }
// stats 为统计快照（见 main.js buildStats()），在每次关键行为后重新计算并检查
// check 的第二个参数是「已解锁的常规勋章数」（隐藏成就不计入），供毕业礼/次元壁类成就使用

export const achievementSeries = [
  { key: 'read',    name: '求知者（阅读）', color: '#3b82f6' },
  { key: 'quiz',    name: '答题手（测验）', color: '#8b5cf6' },
  { key: 'algo',    name: '刷题侠（算法）', color: '#10b981' },
  { key: 'pitfall', name: '避坑人（易错点）', color: '#f59e0b' },
  { key: 'exam',    name: '考霸（考试）', color: '#ef4444' },
  { key: 'topic',   name: '原理控（专栏）', color: '#06b6d4' },
  { key: 'collect', name: '收藏家（全维度）', color: '#ec4899' },
  { key: 'special', name: '特别勋章', color: '#6366f1' },
  { key: 'hidden',  name: '？？？ 隐藏成就', color: '#a855f7', hidden: true },
];

export const achievements = [
  /* ===== 求知者（章节阅读）===== */
  {
    id: 'ach-first-read', icon: '📖', tier: '铜', series: 'read',
    name: '初出茅庐', desc: '完成第 1 个章节的学习打卡',
    check: s => s.chaptersDone >= 1,
  },
  {
    id: 'ach-read-4', icon: '📚', tier: '银', series: 'read',
    name: '学而不厌', desc: '完成 4 个章节的学习打卡',
    check: s => s.chaptersDone >= 4,
  },
  {
    id: 'ach-read-all', icon: '🎓', tier: '钻石', series: 'read',
    name: '学富五车', desc: '完成全部 9 个章节的学习打卡',
    check: s => s.chaptersDone >= 9,
  },

  /* ===== 答题手（章节测验）===== */
  {
    id: 'ach-quiz-1', icon: '✏️', tier: '铜', series: 'quiz',
    name: '初试锋芒', desc: '答对第 1 道章节测验题',
    check: s => s.quizCorrect >= 1,
  },
  {
    id: 'ach-quiz-30', icon: '🖊️', tier: '银', series: 'quiz',
    name: '笔耕不辍', desc: '章节测验累计答对 30 题',
    check: s => s.quizCorrect >= 30,
  },
  {
    id: 'ach-quiz-80', icon: '🏅', tier: '金', series: 'quiz',
    name: '百发百中', desc: '章节测验累计答对 80 题（题库共 126 题）',
    check: s => s.quizCorrect >= 80,
  },
  {
    id: 'ach-quiz-perfect', icon: '🎯', tier: '金', series: 'quiz',
    name: '十连精通', desc: '某组测验 10 题全部答对（零失误）',
    check: s => s.hasPerfectQuizGroup,
  },

  /* ===== 刷题侠（算法）===== */
  {
    id: 'ach-algo-1', icon: '🧩', tier: '铜', series: 'algo',
    name: '牛刀小试', desc: '展开第 1 道算法题的完整解析',
    check: s => s.algoOpens >= 1,
  },
  {
    id: 'ach-algo-15', icon: '🗡️', tier: '银', series: 'algo',
    name: '愈战愈勇', desc: '研读 15 道算法题解析',
    check: s => s.algoOpens >= 15,
  },
  {
    id: 'ach-algo-all', icon: '⚔️', tier: '钻石', series: 'algo',
    name: '题海无涯', desc: '研读全部 60 道算法题解析',
    check: s => s.algoOpens >= 60,
  },
  {
    id: 'ach-algo-hard', icon: '🔥', tier: '金', series: 'algo',
    name: '硬骨头猎人', desc: '研读 5 道困难级算法题解析',
    check: s => s.algoHardOpens >= 5,
  },

  /* ===== 避坑人（易错点考场）===== */
  {
    id: 'ach-pit-1', icon: '🕳️', tier: '铜', series: 'pitfall',
    name: '看见陷阱', desc: '完成第 1 道易错点考查题',
    check: s => s.pitfallAnswered >= 1,
  },
  {
    id: 'ach-pit-40', icon: '🧭', tier: '银', series: 'pitfall',
    name: '绕坑而行', desc: '完成 40 道易错点考查题',
    check: s => s.pitfallAnswered >= 40,
  },
  {
    id: 'ach-pit-120', icon: '🛡️', tier: '金', series: 'pitfall',
    name: '坑位图鉴', desc: '完成 120 道易错点考查题',
    check: s => s.pitfallAnswered >= 120,
  },

  /* ===== 考霸（模拟考试）===== */
  {
    id: 'ach-exam-first', icon: '📝', tier: '铜', series: 'exam',
    name: '初次赴考', desc: '完成第 1 场模拟考试',
    check: s => s.examCount >= 1,
  },
  {
    id: 'ach-exam-pass-3', icon: '📄', tier: '银', series: 'exam',
    name: '三连及格', desc: '3 场不同的模拟考试达到及格线',
    check: s => s.examPassCount >= 3,
  },
  {
    id: 'ach-exam-elite', icon: '👑', tier: '钻石', series: 'exam',
    name: '六边形战士', desc: '单场考试 90 分以上（面试水平认证）',
    check: s => s.examBest >= 90,
  },
  {
    id: 'ach-exam-all', icon: '🏆', tier: '金', series: 'exam',
    name: '九卷通关', desc: '9 套试卷全部考过一次（不论分数）',
    check: s => s.examDistinct >= 9,
  },

  /* ===== 原理控（专栏已读）===== */
  {
    id: 'ach-topic-1', icon: '🔍', tier: '铜', series: 'topic',
    name: '刨根问底', desc: '读完第 1 篇原理/源码专栏长文',
    check: s => s.topicsRead >= 1,
  },
  {
    id: 'ach-topic-6', icon: '🧬', tier: '银', series: 'topic',
    name: '源码猎人', desc: '读完 6 篇专栏长文',
    check: s => s.topicsRead >= 6,
  },
  {
    id: 'ach-topic-all', icon: '🧠', tier: '金', series: 'topic',
    name: '知其所以然', desc: '读完全部 15 篇专栏长文',
    check: s => s.topicsRead >= 15,
  },

  /* ===== 收藏家（全维度）===== */
  {
    id: 'ach-allrounder', icon: '🌟', tier: '金', series: 'collect',
    name: '六边形学徒', desc: '六大板块全部破冰（章节/测验/算法/易错/考试/专栏各有动作）',
    check: s => s.touchedDimensions >= 6,
  },
  {
    id: 'ach-marathon', icon: '🚀', tier: '钻石', series: 'collect',
    name: '全栈修行者', desc: '累计完成 150 个学习动作（打卡+答题+刷题+易错+专栏）',
    check: s => s.totalActions >= 150,
  },

  /* ===== 特别勋章 ===== */
  {
    id: 'ach-night-owl', icon: '🌙', tier: '银', series: 'special',
    name: '夜猫子工程师', desc: '在凌晨 0 点~5 点之间完成一次答题',
    check: s => s.answeredAtNight,
  },
  {
    id: 'ach-comeback', icon: '🔄', tier: '银', series: 'special',
    name: '卷土重来', desc: '答错后重新再来，累计 20 次学习动作',
    check: s => s.totalActions >= 20 && s.someWrongBefore,
  },
  {
    id: 'ach-master', icon: '💎', tier: '钻石', series: 'special',
    name: '全栈毕业礼', desc: '集齐其余全部常规勋章（真·全栈毕业，隐藏成就不计入）',
    check: (s, unlockedCount) => unlockedCount >= achievements.filter(a => !a.hidden).length - 1,
  },
];

/* ==================== 隐藏成就（彩蛋）====================
 * hidden: true —— 未解锁时在成就中心显示为「？？？」，不提示条件
 * hint  —— 解锁后的谜底揭晓文案（说明触发方式，供已解锁者回顾）
 * 触发埋点见 main.js：logo 连点 / 闪卡全对 / 极速及格 / 全站足迹
 */
export const hiddenAchievements = [
  {
    id: 'ach-hidden-logo', icon: '🤫', tier: '金', series: 'hidden', hidden: true,
    name: '咖啡的 secret 配方', desc: '？？？',
    hint: '连点左上角的 ☕ Logo 7 次——好的工程师对界面上的每个元素都充满好奇',
    check: s => s.logoClicks >= 7,
  },
  {
    id: 'ach-hidden-flash', icon: '🃏', tier: '金', series: 'hidden', hidden: true,
    name: '透视之眼', desc: '？？？',
    hint: '闪卡小测 8 题全部答对——48 条易错点全部刻进了 DNA',
    check: s => s.flashPerfect >= 1,
  },
  {
    id: 'ach-hidden-speed', icon: '⚡', tier: '金', series: 'hidden', hidden: true,
    name: '光速交卷', desc: '？？？',
    hint: '在 90 秒内完成一场模拟考试并达到及格线——题目在你眼里是送分题',
    check: s => s.fastPassExam >= 1,
  },
  {
    id: 'ach-hidden-footprint', icon: '👣', tier: '银', series: 'hidden', hidden: true,
    name: '全图鉴探险家', desc: '？？？',
    hint: '足迹遍布全部板块：章节、测验、算法、易错、考试、专栏、公司真题、闪卡、八股——一个都没落下',
    check: s => s.touchedZones >= 9,
  },
  {
    id: 'ach-hidden-wrong20', icon: '🕳️', tier: '银', series: 'hidden', hidden: true,
    name: '坑王的本能', desc: '？？？',
    hint: '累计答错 20 题仍没有放弃——错题不是污点，是你独有的漏洞地图',
    check: s => s.wrongCount >= 20,
  },
  {
    id: 'ach-hidden-polygon', icon: '🔮', tier: '钻石', series: 'hidden', hidden: true,
    name: '打破次元壁', desc: '？？？',
    hint: '集齐全部常规勋章（含全栈毕业礼）后仍保持学习热情，总学习动作达 300——成就只是路标，成长本身才是目的',
    check: (s, normalUnlocked) => normalUnlocked >= achievements.length && s.totalActions >= 300,
  },
];

// 对外统一导出：常规 + 隐藏
export const allAchievements = [...achievements, ...hiddenAchievements];

export const achievementStats = (() => {
  const byTier = { '铜': 0, '银': 0, '金': 0, '钻石': 0 };
  achievements.forEach(a => byTier[a.tier]++);
  const hidden = hiddenAchievements.length;
  return {
    total: achievements.length + hidden,
    normalTotal: achievements.length,
    hiddenTotal: hidden,
    byTier,
    seriesCount: achievementSeries.length,
  };
})();
