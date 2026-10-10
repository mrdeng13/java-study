// Java 全栈修炼手册 - 主逻辑
// 数据改为运行时从后端 API 拉取（MySQL via Spring Boot），不再静态 import。
// 经 Vite 代理转发到后端 8080，使用相对路径即可。
const API_BASE = '/api';

// 原静态导入的数据，现由 bootstrap() 异步赋值（先声明为 let）
let chaptersPart1, chaptersPart2, chaptersPart3;
let algorithmProblems;
let quizSections;
let syllabusModules, syllabusStats;
let syllabusDetails;
let baguwenCategories, baguwenStats;
let pitfallDays, pitfallStats;
let examPapers, examStats;
let topicsNetworkOS;
let topicsMySQLRedis;
let topicsCollections;
let companyQuestions, companyStats;
let achievements, hiddenAchievements, allAchievements, achievementSeries, achievementStats;
let mistakeAlerts, alertGroups, alertStats;
let summonPool;

// 需要拉取的数据名（与后端 json_doc 表的 name 一一对应）
const DATA_NAMES = [
  'chaptersPart1', 'chaptersPart2', 'chaptersPart3',
  'algorithmProblems', 'quizSections',
  'syllabusModules', 'syllabusStats', 'syllabusDetails',
  'baguwenCategories', 'baguwenStats',
  'pitfallDays', 'pitfallStats',
  'examPapers', 'examStats',
  'topicsNetworkOS', 'topicsMySQLRedis', 'topicsCollections',
  'companyQuestions', 'companyStats',
  'achievements', 'hiddenAchievements', 'allAchievements', 'achievementSeries', 'achievementStats',
  'mistakeAlerts', 'alertGroups', 'alertStats',
  'summonPool',
];

let allChapters = [];
let allBlocks = [];

/* ---------------- 状态（localStorage 持久化） ---------------- */
const STORE_KEY = 'java-fullstack-progress-v1';
let store = { doneChapters: [], quizAnswers: {}, algoOpens: {}, pitfallAnswers: {}, examResults: {}, achievements: {}, alertsShown: {}, flashCards: {}, examMeta: {}, logoClicks: 0, wrongCount: 0, flashPerfect: 0, fastPassExam: 0, touchedZones: {}, coins: 0, collection: {}, summonLog: [], bonds: {}, welfareTs: 0, furnaceLog: [] };
try {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) store = { ...store, ...JSON.parse(raw) };
} catch (e) { /* ignore */ }

function saveStore() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ }
}

let totalUnits = 0;
function updateProgress() {
  const done = store.doneChapters.length;
  const pct = totalUnits === 0 ? 0 : Math.round((done / totalUnits) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `学习进度 ${pct}%（${done}/${totalUnits} 章）`;
  document.querySelectorAll('#chapterNav .nav-item').forEach(item => {
    const id = item.dataset.tab;
    const check = item.querySelector('.done-check');
    if (check) check.textContent = store.doneChapters.includes(id) ? '✓' : '';
  });
}

/* ---------------- 工具 ---------------- */
const escapeHtml = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// 手写轻量代码高亮（注释 → 字符串 → 关键字 → 数字）
const KEYWORDS = [
  'public', 'private', 'protected', 'class', 'interface', 'extends', 'implements',
  'static', 'final', 'void', 'new', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'throws',
  'this', 'super', 'import', 'package', 'abstract', 'volatile', 'synchronized',
  'instanceof', 'enum', 'true', 'false', 'null', 'default',
  'const', 'let', 'var', 'function', 'async', 'await', 'of', 'in', 'export',
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'JOIN', 'LEFT', 'INNER', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING',
  'LIMIT', 'OFFSET', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'LIKE', 'IN', 'AS', 'COUNT', 'USE',
  'START', 'TRANSACTION', 'COMMIT', 'ROLLBACK', 'PRIMARY', 'KEY', 'AUTO_INCREMENT',
  'UNIQUE', 'DEFAULT', 'NOT', 'EXPLAIN', 'INDEX', 'ON', 'CONFLICT', 'EXCLUDED',
];
const kwRe = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'g');

function highlight(code) {
  let out = escapeHtml(code);
  const stash = [];
  const keep = html => { stash.push(html); return `\u0000${stash.length - 1}\u0000`; };
  out = out
    .replace(/\/\/[^\n]*|--[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\//g, m => keep(`<span class="tk-cm">${m}</span>`))
    .replace(/&#39;[^&\n]*?&#39;/g, m => keep(`<span class="tk-str">${m}</span>`))
    .replace(/&quot;[^&\n]*?&quot;/g, m => keep(`<span class="tk-str">${m}</span>`))
    .replace(kwRe, m => keep(`<span class="tk-kw">${m}</span>`))
    .replace(/\b(\d+(?:\.\d+)?[LlfF]?)\b/g, m => keep(`<span class="tk-num">${m}</span>`));
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[i]);
}

/* ---------------- 视图渲染 ---------------- */
const content = document.getElementById('content');

// 数据块 → HTML
function renderBlock(b) {
  switch (b.t) {
    case 'p': return `<div class="block-card"><p>${b.html}</p></div>`;
    case 'h': return `<div class="block-card"><h2>${b.html}</h2></div>`;
    case 'list':
      return `<div class="block-card"><ul class="plain">${b.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`;
    case 'code':
      return `<div class="code-card">
        <div class="code-head"><span>📄 ${b.title || b.lang || ''}</span>
        <button class="code-copy" data-code="${escapeHtml(b.code)}">复制代码</button></div>
        <pre>${highlight(b.code)}</pre></div>`;
    case 'table':
      return `<div class="block-card"><div class="table-wrap"><table class="data-table">
        <thead><tr>${b.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div></div>`;
    case 'tip': case 'info': case 'warn': {
      const label = { tip: '💡 小贴士', info: '📌 划重点', warn: '⚠️ 避坑警告' }[b.t];
      return `<div class="callout callout-${b.t}"><b>${label}：</b>${b.html}</div>`;
    }
    case 'steps':
      return `<div class="steps">${b.items.map(i => `<div class="step-item"><div class="step-num"></div><div>${i}</div></div>`).join('')}</div>`;
    case 'qa':
      return `<div class="qa-card">
        <div class="qa-q">${b.q}</div>
        <button class="qa-toggle">▶ 查看参考思路</button>
        <div class="qa-a">${b.a}</div></div>`;
    default: return '';
  }
}

/* ---- 视图：首页 ---- */
function renderHome() {
  const quizTotal = quizSections.reduce((n, s) => n + s.questions.length, 0);
  content.innerHTML = `
    <section class="hero">
      <h1>从 <em>零基础</em> 到 <em>Java 全栈开发师</em> 的完整修炼手册</h1>
      <p>这是一份写给"第一次接触编程的你"的保姆级教程：9 大章节覆盖 计算机基础 → Java SE → 前端 → MySQL → Spring Boot → 中间件 → 工程化 → 全栈实战，全程用生活化类比 + 可运行代码 + 避坑警告讲解；并配套 <b>15 篇原理长文</b>（含 <b>6 篇 Java 集合源码级专篇</b>）、<b>${companyStats.companies} 家大厂 ${companyStats.total} 问分类真题</b>、<b>${baguwenStats.total} 问面试八股文</b>、<b>${syllabusStats.totalPoints} 条完整知识清单</b>、<b>${pitfallStats.days} 天易错点考场</b>、<b>${examStats.papers} 套限时模拟考</b>、${quizTotal} 道章节测验和 ${algorithmProblems.length} 道力扣风格算法题（含 10 道纯困难题）。</p>
      <div class="hero-tags">
        <span class="hero-tag">☕ Java SE / JVM / 并发</span>
        <span class="hero-tag">🎨 前端三件套 / Vue</span>
        <span class="hero-tag">🗄️ MySQL / 索引 / 事务</span>
        <span class="hero-tag">🍃 Spring Boot / MyBatis</span>
        <span class="hero-tag">⚡ Redis / MQ / Nginx / ES</span>
        <span class="hero-tag">🛠️ Git / Linux / Docker</span>
        <span class="hero-tag">⚔️ 力扣风格算法题</span>
      </div>
    </section>

    <section class="overview">
      <div class="ov-head">📊 这份手册里有什么</div>
      <div class="ov-grid">
        <div class="ov-card"><span class="ov-num">${allChapters.length}</span><span class="ov-label">系统章节</span></div>
        <div class="ov-card"><span class="ov-num">${quizTotal}</span><span class="ov-label">章节测验题</span></div>
        <div class="ov-card"><span class="ov-num">${algorithmProblems.length}</span><span class="ov-label">算法真题</span></div>
        <div class="ov-card"><span class="ov-num">${baguwenStats.total}</span><span class="ov-label">面试八股</span></div>
        <div class="ov-card"><span class="ov-num">${pitfallStats.days}</span><span class="ov-label">易错天</span></div>
        <div class="ov-card"><span class="ov-num">${examStats.papers}</span><span class="ov-label">模拟考卷</span></div>
      </div>
    </section>

    <div class="home-grid" id="homeGrid"></div>

    <div class="block-card">
      <h2>📖 怎么使用这份手册（重要，30 秒读完）</h2>
      <div class="steps">
        <div class="step-item"><div class="step-num"></div><div><b>按顺序学，不要跳章</b>。第 1~2 章是地基，第 3 章是最长最硬的主干（Java SE），预计 6~9 个月学完全部内容。每学完一章，点击章节底部的「完成本章」按钮，顶部进度条会记录你的旅程。</div></div>
        <div class="step-item"><div class="step-num"></div><div><b>代码必须亲手敲</b>。每个代码块右上角有「复制代码」按钮，但请先手敲再对照；看到 <code>类、对象、SQL</code> 的概念，先自己举一个生活的例子再往下走。</div></div>
        <div class="step-item"><div class="step-num"></div><div><b>学完一章就去「章节测验」验证</b>——答错不要紧，每道题都有详细解析，错题正是你知识漏洞的地图。</div></div>
        <div class="step-item"><div class="step-num"></div><div><b>每周做一道算法题</b>（刷题训练营），先自己想 20 分钟，再看提示，最后看答案和复杂度分析。算法是笔试硬门槛，细水长流胜过考前突击。</div></div>
        <div class="step-item"><div class="step-num"></div><div><b>「一页看懂知识地图」</b>页汇总了 12 个月学习路线和技能全景，迷路的时候去那里看看。</div></div>
      </div>
    </div>

    <div class="callout callout-tip"><b>💡 心态提醒：</b>编程学习 20% 靠天赋，80% 靠"遇到报错不删库跑路的耐心"。报错是常态，看懂报错信息是程序员的超能力，从今天开始练习吧！</div>
  `;

  const grid = document.getElementById('homeGrid');
  const cardData = allChapters.map((c, i) => ({
    icon: c.icon, title: c.title.replace('第', '第 ').replace(' 章', ' 章'),
    desc: c.subtitle, tab: c.id,
  }));
  cardData.push({ icon: '🖼️', title: '图解原理专栏 · ' + (topicsNetworkOS.length + topicsMySQLRedis.length + topicsCollections.length) + ' 篇', desc: '小林式硬核长文 + 6 篇 Java 集合源码级专篇（ArrayList/HashMap/CHM 源码逐行读），ASCII 图解 + 追问链', tab: 'topics' });
  cardData.push({ icon: '🏢', title: '大厂分类真题 · ' + companyStats.total + ' 问', desc: '阿里/字节/腾讯/美团/百度/京东/拼多多/快手 8 家：风格解读 + 真题 + 答案要点 + 考察意图', tab: 'companies' });
  cardData.push({ icon: '📋', title: '完整知识清单 · ' + syllabusStats.totalPoints + ' 条', desc: '所有要学的东西全量罗列：11 大模块 107 个学习单元，附学习理由与天数规划', tab: 'syllabus' });
  cardData.push({ icon: '💼', title: '面试八股文 · ' + baguwenStats.total + ' 问', desc: '高频真题直接给答案：标准答法 + 加分点 + 面试官追问链', tab: 'baguwen' });
  cardData.push({ icon: '⚠️', title: '易错点考场 · ' + pitfallStats.days + ' 天', desc: '每天一组高频易错点 + 配套考查题，点击即测，错误答案是你的漏洞地图', tab: 'pitfalls' });
  cardData.push({ icon: '🎓', title: '模拟考试 · ' + examStats.papers + ' 套卷', desc: '含网络/OS/MySQL·Redis/并发JVM/Spring/分布式六套专项卷，限时计分 + 交卷复盘 + 逐题解析', tab: 'exam' });
  cardData.push({ icon: '📝', title: '章节测验 · ' + quizSections.reduce((n, s) => n + s.questions.length, 0) + ' 题', desc: '单选/多选/判断题，覆盖 9 章 + 并发/JVM/Spring/MQ/分布式/Linux/MyBatis/场景深入组，答完即时判分 + 解析', tab: 'quiz' });
  cardData.push({ icon: '⚔️', title: '刷题训练营 · ' + algorithmProblems.length + ' 题', desc: '力扣风格：题目 → 提示 → 参考答案 → 复杂度分析，含 10 道纯困难题（LRU/合并K链表/戳气球…）', tab: 'algo' });
  cardData.push({ icon: '⚡', title: '易错点提醒 · ' + alertStats.total + ' 条', desc: '「错误认知 → 正确真相 → 常见场景」三段式防坑速查 + 随机闪卡小测，页面浏览时也会弹提醒', tab: 'alerts' });
  cardData.push({ icon: '🏆', title: '成就勋章 · ' + achievementStats.total + ' 枚', desc: '8 大系列：阅读/测验/刷题/避坑/考霸/原理/收藏家/特别，学习行为自动解锁（已得 ' + Object.keys(store.achievements).length + ' 枚）', tab: 'achievements' });
  cardData.push({ icon: '🗺️', title: '知识地图', desc: '12 个月学习路线图 + 全栈技能全景一页览', tab: 'roadmap' });

  grid.innerHTML = cardData.map(c => `
    <a class="home-card" data-tab="${c.tab}" href="#${c.tab}">
      <div class="hc-icon">${c.icon}</div><h3>${c.title}</h3><p>${c.desc}</p>
    </a>`).join('');
}

/* ---- 视图：章节 ---- */
function renderChapter(id) {
  const idx = allBlocks.findIndex(c => c.id === id);
  if (idx < 0) return renderHome();
  const ch = allBlocks[idx];
  const prev = allBlocks[idx - 1];
  const next = allBlocks[idx + 1];
  const isDone = store.doneChapters.includes(id);

  content.innerHTML = `
    <div class="chapter-header">
      <div class="chapter-icon">${ch.icon}</div>
      <h1>${ch.title}</h1>
      <div class="chapter-sub">${ch.subtitle}</div>
      <div class="chapter-meta">
        <span class="meta-chip">第 ${idx + 1} / ${allBlocks.length} 章</span>
        <span class="meta-chip">${ch.blocks.length} 个知识块</span>
        ${isDone ? '<span class="meta-chip" style="background:#c6f6d5;color:#276749">✓ 已完成</span>' : ''}
      </div>
    </div>
    ${ch.blocks.map(renderBlock).join('')}
    <div class="chapter-done-bar">
      <button class="done-btn ${isDone ? 'completed' : ''}" id="doneBtn">
        ${isDone ? '✓ 已完成本章（点击取消）' : '✓ 我已学完本章，标记完成'}
      </button>
    </div>
    <div class="prev-next">
      ${prev ? `<button class="pn-btn" data-tab="${prev.id}"><small>← 上一章</small>${prev.title}</button>` : '<span style="flex:1"></span>'}
      ${next ? `<button class="pn-btn" data-tab="${next.id}"><small>下一章 →</small>${next.title}</button>` : '<span style="flex:1"></span>'}
    </div>
  `;

  document.getElementById('doneBtn').addEventListener('click', () => {
    const i = store.doneChapters.indexOf(id);
    const wasDone = i >= 0;
    if (wasDone) store.doneChapters.splice(i, 1); else store.doneChapters.push(id);
    saveStore(); updateProgress(); renderChapter(id);
    if (!wasDone) { awardCoins(COIN_RULES.chapter, '章节打卡'); checkAchievements(); }
  });
}

/* ---- 视图：测验 ---- */
const TYPE_LABEL = { single: '单选', multi: '多选', judge: '判断' };

function renderQuiz() {
  const quizTotal = quizSections.reduce((n, s) => n + s.questions.length, 0);
  let html = `
    <div class="page-header">
      <h1>📝 章节测验 · 共 ${quizTotal} 题</h1>
      <p>每道题作答后立即判分并展示解析；<b>多选题需要凑齐所有正确选项</b>。答案进度自动保存在浏览器本地，刷新不丢。</p>
    </div>`;

  quizSections.forEach(sec => {
    const answered = sec.questions.filter(q => store.quizAnswers[q.id]).length;
    const correct = sec.questions.filter(q => {
      const a = store.quizAnswers[q.id];
      return a && arraysEqual(a, q.answer);
    }).length;

    html += `<div class="quiz-section-head">
      <span>${sec.chapter}</span>
      <span class="quiz-score">已答 ${answered}/${sec.questions.length} · 正确 ${correct}</span>
    </div>`;

    sec.questions.forEach((q, qi) => {
      const chosen = store.quizAnswers[q.id];
      const isAnswered = !!chosen;
      const isCorrect = isAnswered && arraysEqual(chosen, q.answer);
      html += `<div class="quiz-card" data-qid="${q.id}">
        <div class="quiz-q">
          <span class="q-no">Q${qi + 1}</span>
          <span class="q-type">${TYPE_LABEL[q.type] || ''}</span>
          ${q.q}
        </div>
        <div class="quiz-options">
          ${q.options.map((opt, oi) => {
            let cls = 'quiz-option';
            if (isAnswered) {
              cls += ' disabled';
              if (q.answer.includes(oi)) cls += ' correct';
              else if (chosen.includes(oi)) cls += ' wrong';
            }
            const mark = q.type === 'multi' ? '☑' : String.fromCharCode(65 + oi);
            return `<div class="${cls}" data-oi="${oi}">
              <span class="opt-mark">${isAnswered && q.answer.includes(oi) ? '✓' : mark}</span>
              <span>${opt}</span></div>`;
          }).join('')}
        </div>
        <div class="quiz-explain ${isAnswered ? 'show' : ''}">
          <span class="ex-tag">${isAnswered ? (isCorrect ? '✅ 回答正确！' : '❌ 回答错误。') : ''}</span>
          💡 ${q.explain}
        </div>
      </div>`;
    });
  });
  content.innerHTML = html;

  // 选项点击 → 判分
  content.querySelectorAll('.quiz-card').forEach(card => {
    const qid = card.dataset.qid;
    const q = findQuestion(qid);
    card.querySelectorAll('.quiz-option').forEach(optEl => {
      optEl.addEventListener('click', () => {
        if (store.quizAnswers[qid]) return;               // 已作答
        const oi = Number(optEl.dataset.oi);
        if (q.type === 'multi') {
          // 多选：点选累积，凑够答案数量即判分
          const cur = multiSelectState[qid] || [];
          if (cur.includes(oi)) return;
          cur.push(oi);
          multiSelectState[qid] = cur;
          optEl.classList.add('selected');
          if (cur.length >= q.answer.length) judge(qid, cur, card, q);
        } else {
          judge(qid, [oi], card, q);
        }
      });
    });
  });
}

let multiSelectState = {};
function judge(qid, chosen, card, q) {
  store.quizAnswers[qid] = chosen;
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) store.answeredAtNight = true;
  if (!arraysEqual(chosen, q.answer)) {
    store.someWrongBefore = true;                        // 曾答错（成就：卷土重来前置）
    store.wrongCount = (store.wrongCount || 0) + 1;      // 彩蛋：坑王的本能
  } else {
    awardCoins(COIN_RULES.quiz, '测验答对');              // 答对 → 金币
  }
  if (qid.startsWith('bw-')) {                           // 足迹：八股自测
    store.touchedZones = store.touchedZones || {};
    store.touchedZones.baguwen = true;
  }
  saveStore();
  renderQuiz();
  updateProgress();
  checkAchievements();
}
function arraysEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y), sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}
function findQuestion(qid) {
  for (const sec of quizSections) {
    const q = sec.questions.find(x => x.id === qid);
    if (q) return q;
  }
  return null;
}

/* ==================== 成就勋章引擎 ==================== */
// 统计快照：从 store 推导所有成就判定所需指标
function buildStats() {
  const quizCorrect = quizSections.reduce((n, sec) => n + sec.questions.filter(q => {
    const a = store.quizAnswers[q.id];
    return a && arraysEqual(a, q.answer);
  }).length, 0);

  // 是否存在「整组全对」的测验组（5 题以上全对才算）
  const hasPerfectQuizGroup = quizSections.some(sec =>
    sec.questions.length >= 5 &&
    sec.questions.every(q => {
      const a = store.quizAnswers[q.id];
      return a && arraysEqual(a, q.answer);
    }));

  const algoOpens = Object.keys(store.algoOpens).length;
  const algoHardOpens = algorithmProblems.filter(p => p.difficulty === 'hard' && store.algoOpens[p.id]).length;
  const pitfallAnswered = Object.keys(store.pitfallAnswers).length;
  const examPapersDone = Object.values(store.examResults);
  const examCount = examPapersDone.length;
  const examPassCount = examPapersDone.filter(r => r.score >= 60).length;
  const examBest = examPapersDone.reduce((m, r) => Math.max(m, r.score), 0);
  const topicsRead = store.doneChapters.filter(id => id.startsWith('topic-')).length;
  const chaptersDone = store.doneChapters.filter(id => !id.startsWith('topic-')).length;

  const touched = [
    chaptersDone >= 1, quizCorrect >= 1, algoOpens >= 1,
    pitfallAnswered >= 1, examCount >= 1, topicsRead >= 1,
  ];
  const totalActions = chaptersDone + quizCorrect + algoOpens + pitfallAnswered + topicsRead + Object.keys(store.flashCards).length;

  // —— 隐藏成就专用指标 ——
  // 全站足迹：9 大板块各有动作（章节/测验/算法/易错/考试/专栏/公司真题/闪卡/八股）
  const flashTouched = Object.keys(store.flashCards).length >= 1;
  const touchedZones = [
    chaptersDone >= 1,            // 1 章节
    quizCorrect >= 1,             // 2 测验
    algoOpens >= 1,               // 3 算法
    pitfallAnswered >= 1,         // 4 易错
    examCount >= 1,               // 5 考试
    topicsRead >= 1,              // 6 专栏
    !!store.touchedZones.company, // 7 公司真题
    flashTouched,                 // 8 闪卡
    !!store.touchedZones.baguwen, // 9 八股
  ].filter(Boolean).length;

  return {
    chaptersDone, quizCorrect, hasPerfectQuizGroup, algoOpens, algoHardOpens,
    pitfallAnswered, examCount, examPassCount, examBest,
    examDistinct: examCount, topicsRead,
    touchedDimensions: touched.filter(Boolean).length,
    totalActions,
    answeredAtNight: !!store.answeredAtNight,
    someWrongBefore: !!store.someWrongBefore,
    // 隐藏成就
    logoClicks: store.logoClicks || 0,
    flashPerfect: store.flashPerfect || 0,
    fastPassExam: store.fastPassExam || 0,
    touchedZones,
    wrongCount: store.wrongCount || 0,
  };
}

// 成就判定逻辑：数据迁移到 MySQL(JSON) 后，原对象里的 check 函数无法序列化，
// 因此把判定逻辑收归代码，按成就 id 映射到函数。数据本身只保留 id/icon/name/tier/desc 等展示字段。
const ACH_CHECKS = {
  // 求知者（章节阅读）
  'ach-first-read': s => s.chaptersDone >= 1,
  'ach-read-4': s => s.chaptersDone >= 4,
  'ach-read-all': s => s.chaptersDone >= 9,
  // 答题手（章节测验）
  'ach-quiz-1': s => s.quizCorrect >= 1,
  'ach-quiz-30': s => s.quizCorrect >= 30,
  'ach-quiz-80': s => s.quizCorrect >= 80,
  'ach-quiz-perfect': s => s.hasPerfectQuizGroup,
  // 刷题侠（算法）
  'ach-algo-1': s => s.algoOpens >= 1,
  'ach-algo-15': s => s.algoOpens >= 15,
  'ach-algo-all': s => s.algoOpens >= 60,
  'ach-algo-hard': s => s.algoHardOpens >= 5,
  // 避坑人（易错点）
  'ach-pit-1': s => s.pitfallAnswered >= 1,
  'ach-pit-40': s => s.pitfallAnswered >= 40,
  'ach-pit-120': s => s.pitfallAnswered >= 120,
  // 考霸（模拟考试）
  'ach-exam-first': s => s.examCount >= 1,
  'ach-exam-pass-3': s => s.examPassCount >= 3,
  'ach-exam-elite': s => s.examBest >= 90,
  'ach-exam-all': s => s.examDistinct >= 9,
  // 原理控（专栏）
  'ach-topic-1': s => s.topicsRead >= 1,
  'ach-topic-6': s => s.topicsRead >= 6,
  'ach-topic-all': s => s.topicsRead >= 15,
  // 收藏家（全维度）
  'ach-allrounder': s => s.touchedDimensions >= 6,
  'ach-marathon': s => s.totalActions >= 150,
  // 特别勋章
  'ach-night-owl': s => s.answeredAtNight,
  'ach-comeback': s => s.totalActions >= 20 && s.someWrongBefore,
  // 隐藏成就
  'ach-hidden-logo': s => s.logoClicks >= 7,
  'ach-hidden-flash': s => s.flashPerfect >= 1,
  'ach-hidden-speed': s => s.fastPassExam >= 1,
  'ach-hidden-footprint': s => s.touchedZones >= 9,
  'ach-hidden-wrong20': s => s.wrongCount >= 20,
};
// 毕业礼 / 打破次元壁：依赖「已解锁常规勋章数」，从 allAchievements 实时计算，避免依赖统计快照形态
ACH_CHECKS['ach-master'] = (s, normalUnlocked) => {
  const normalTotal = (allAchievements || []).filter(a => !a.hidden).length;
  return normalUnlocked >= normalTotal - 1;
};
ACH_CHECKS['ach-hidden-polygon'] = (s, normalUnlocked) => {
  const normalTotal = (allAchievements || []).filter(a => !a.hidden).length;
  return normalUnlocked >= normalTotal && s.totalActions >= 300;
};

// 解锁成就 + 弹 toast 队列
const toastQueue = [];
let toastShowing = false;
function checkAchievements() {
  const stats = buildStats();
  const newly = [];
  // 已解锁的常规勋章数（隐藏成就不计入，供毕业礼/次元壁判定）
  const normalUnlocked = allAchievements.filter(a => !a.hidden && store.achievements[a.id]).length;
  allAchievements.forEach(a => {
    const fn = ACH_CHECKS[a.id];
    if (!store.achievements[a.id] && fn && fn(stats, normalUnlocked)) {
      store.achievements[a.id] = Date.now();
      newly.push(a);
      awardCoins(COIN_RULES.achievement, '成就解锁');   // 成就 → 金币
    }
  });
  if (newly.length) {
    saveStore();
    newly.forEach(a => toastQueue.push(a));
    pumpToastQueue();
    updateNavBadge();
  }
  return newly;
}

function pumpToastQueue() {
  if (toastShowing || toastQueue.length === 0) return;
  const a = toastQueue.shift();
  toastShowing = true;
  showToast(a);
  setTimeout(() => { toastShowing = false; pumpToastQueue(); }, 4200);
}

function showToast(a) {
  let box = document.getElementById('toastBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toastBox';
    box.className = 'toast-box';
    document.body.appendChild(box);
  }
  const el = document.createElement('div');
  el.className = 'ach-toast' + (a.hidden ? ' ach-toast-hidden' : '');
  el.innerHTML = `
    <div class="at-icon">${a.icon}</div>
    <div class="at-body">
      <div class="at-title">${a.hidden ? '🎉 隐藏成就解锁！' : '🏅 成就解锁'}：${a.name}</div>
      <div class="at-desc">${a.hidden ? (a.hint || a.desc) : a.desc}</div>
      <div class="at-tier">${a.tier}级勋章${a.hidden ? ' · 彩蛋' : ''}</div>
    </div>`;
  box.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 500);
  }, 3600);
}

// 侧边栏成就角标
function updateNavBadge() {
  const badge = document.getElementById('achBadge');
  if (badge) badge.textContent = Object.keys(store.achievements).length;
}

/* ==================== 金币与召唤（学习激励） ==================== */
// 金币：完成学习行为产出；召唤：消耗金币抽取收藏品（武将 / 宝物 / 奇物）
const COIN_RULES = {
  chapter: 300,       // 章节打卡
  topic: 300,         // 专栏读完
  quiz: 200,          // 测验答对（单独指定：答对一道题 +200）
  pitfall: 50,        // 易错点答对
  algo: 150,          // 算法研读
  examPerScore: 15,   // 考试：每 1 分
  examPass: 600,      // 考试及格额外
  achievement: 800,   // 解锁成就
  flash: 300,         // 闪卡全对
};
// 注：以上为「全部 ×10」后的额度，其中答题由原 8×10=80 单独提到 200。
// 若嫌召唤太容易，把卡池的 costSingle / costTen 同比例上调即可（在 summonPool 数据里）。

// DB 缺失 summonPool 时的最小兜底（真实卡池以数据库为准，这里只保证页面不崩）
const FALLBACK_SUMMON_POOL = {
  categories: [
    { key: 'general', name: '武将', icon: '⚔️' },
    { key: 'relic', name: '宝物', icon: '🔮' },
    { key: 'item', name: '奇物', icon: '🎁' },
  ],
  costSingle: 100, costTen: 900,
  weights: { '5': 2, '4': 8, '3': 20, '2': 30, '1': 40 },
  refund: { '7': 2000, '6': 600, '5': 200, '4': 80, '3': 30, '2': 15, '1': 8 },
  tenGuaranteeRarity: 3,
  welfare: { cooldownMs: 86400000 },
  furnace: { costCoins: 200, costDupCards: 3, uChance: 0.08, uniqueChance: 0.004, failRefund: 120 },
  bonds: [],
  items: [],
};

const RARITY_LABEL = { '7': '唯一', '6': 'U', '5': '5★', '4': '4★', '3': '3★', '2': '2★', '1': '1★' };
function rarityText(r) { return RARITY_LABEL[String(r)] || (r + '★'); }
function starsOf(r) { return r >= 6 ? rarityText(r) : '★'.repeat(r); }

function awardCoins(n, label) {
  n = Math.round(n || 0);
  if (n <= 0) return;
  store.coins = (store.coins || 0) + n;
  saveStore();
  updateCoinDisplay();
  showCoinToast(n, label);
}

function updateCoinDisplay() {
  const el = document.getElementById('coinCount');
  if (el) el.textContent = store.coins || 0;
}

function showCoinToast(n, label) {
  let box = document.getElementById('coinToastBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'coinToastBox';
    box.className = 'coin-toast-box';
    document.body.appendChild(box);
  }
  const el = document.createElement('div');
  el.className = 'coin-toast';
  el.innerHTML = '<span class="ct-icon">🪙</span><span class="ct-num">+' + n + '</span>' +
    (label ? '<span class="ct-label">' + label + '</span>' : '');
  box.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 1800);
}

/* ---------- 卡池工具 ---------- */
// 常规池：排除仅加热炉产出的 U 级 / 唯一品质
function normalItems() {
  return ((summonPool || FALLBACK_SUMMON_POOL).items || []).filter(i => !i.only);
}
function rollOne(items, pool) {
  const w = pool.weights || {};
  const keys = Object.keys(w);
  const total = keys.reduce((s, k) => s + (w[k] || 0), 0);
  let r = Math.random() * total, rarity = 1;
  for (const k of keys) { r -= (w[k] || 0); if (r <= 0) { rarity = Number(k); break; } }
  const bucket = items.filter(i => i.rarity === rarity);
  const src = bucket.length ? bucket : items;
  return src[Math.floor(Math.random() * src.length)];
}
function rollAtLeast(items, minR) {
  const bucket = items.filter(i => i.rarity >= minR);
  const src = bucket.length ? bucket : items;
  return src[Math.floor(Math.random() * src.length)];
}
// 入库，返回 { isNew, refund }
function grantItem(it) {
  const pool = summonPool || FALLBACK_SUMMON_POOL;
  store.collection = store.collection || {};
  const isNew = !store.collection[it.id];
  store.collection[it.id] = (store.collection[it.id] || 0) + 1;
  const refund = isNew ? 0 : ((pool.refund || {})[String(it.rarity)] || 0);
  return { isNew, refund };
}

/* ---------- 羁绊 ---------- */
function bondProgress(b) {
  const c = store.collection || {};
  const have = b.members.filter(id => c[id] > 0).length;
  return { have: have, total: b.members.length, done: have === b.members.length };
}
function checkBonds() {
  const bonds = (summonPool || FALLBACK_SUMMON_POOL).bonds || [];
  store.bonds = store.bonds || {};
  const newly = [];
  bonds.forEach(b => {
    if (store.bonds[b.id]) return;
    if (bondProgress(b).done) {
      store.bonds[b.id] = Date.now();
      newly.push(b);
      awardCoins(b.reward, '羁绊·' + b.name);
    }
  });
  if (newly.length) saveStore();
  return newly;
}

/* ---------- 召唤 ---------- */
function doSummon(times) {
  const pool = summonPool || FALLBACK_SUMMON_POOL;
  const items = normalItems();
  if (!items.length) {
    alert('召唤池为空：请确认后端已启动，且数据库已导入 summonPool（见 scripts/gen_summon_pool.py）。');
    return;
  }
  const cost = times >= 10 ? (pool.costTen || 900) : (pool.costSingle || 100);
  if ((store.coins || 0) < cost) {
    alert('金币不足：本次需要 ' + cost + ' 枚，还差 ' + (cost - (store.coins || 0)) + ' 枚。\n去学章节 / 答题 / 考试就能赚金币～');
    return;
  }
  store.coins -= cost;
  const results = [];
  for (let i = 0; i < times; i++) results.push(Object.assign({}, rollOne(items, pool)));
  if (times >= 10) {
    const g = pool.tenGuaranteeRarity || 3;
    if (!results.some(r => r.rarity >= g)) {
      let minIdx = 0;
      results.forEach((r, i) => { if (r.rarity < results[minIdx].rarity) minIdx = i; });
      results[minIdx] = Object.assign({}, rollAtLeast(items, g));
    }
  }
  let refund = 0;
  results.forEach(r => {
    const g = grantItem(r);
    refund += g.refund;
    r.isNew = g.isNew;
  });
  store.coins += refund;
  saveStore(); updateCoinDisplay();
  checkBonds();
  renderSummon(results, refund);
}

/* ---------- 福利召唤（每日免费） ---------- */
function doWelfareSummon() {
  const pool = summonPool || FALLBACK_SUMMON_POOL;
  const wf = (pool.items || []).filter(i => i.welfare);
  if (!wf.length) { alert('福利池为空（卡池数据未加载完整）。'); return; }
  const cd = (pool.welfare && pool.welfare.cooldownMs) || 86400000;
  const now = Date.now();
  const passed = now - (store.welfareTs || 0);
  if (passed < cd) {
    const left = cd - passed;
    const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000);
    alert('福利召唤冷却中，还需 ' + h + ' 小时 ' + m + ' 分钟。');
    return;
  }
  store.welfareTs = now;
  const it = Object.assign({}, wf[Math.floor(Math.random() * wf.length)]);
  const g = grantItem(it);
  store.coins += g.refund;
  it.isNew = g.isNew;
  saveStore(); updateCoinDisplay();
  checkBonds();
  renderSummon([it], g.refund, 'welfare');
}

/* ---------- 加热炉（熔炼 → U 级 / 唯一品质） ---------- */
function dupIds() {
  const c = store.collection || {};
  return Object.keys(c).filter(id => c[id] > 1);
}
function doFurnace() {
  const pool = summonPool || FALLBACK_SUMMON_POOL;
  const f = pool.furnace || {};
  const needCards = f.costDupCards || 3;
  const needCoins = f.costCoins || 200;
  const dups = dupIds();
  if (dups.length < needCards) {
    alert('重复藏品不足：需要 ' + needCards + ' 张，当前 ' + dups.length + ' 张。\n抽到重复的卡会自动累积，多抽几次就够了。');
    return;
  }
  if ((store.coins || 0) < needCoins) {
    alert('金币不足：熔炼需要 ' + needCoins + ' 枚。');
    return;
  }
  store.coins -= needCoins;
  const used = [];
  for (let i = 0; i < needCards; i++) {
    const id = dups[i];
    store.collection[id] -= 1;
    if (store.collection[id] <= 0) delete store.collection[id];
    used.push(id);
  }
  const items = pool.items || [];
  const uniqPool = items.filter(i => i.rarity === 7);
  const uPool = items.filter(i => i.rarity === 6);
  const hasUnique = uniqPool.some(i => (store.collection || {})[i.id]);
  const r = Math.random();
  const uq = f.uniqueChance || 0.004, uc = f.uChance || 0.08;
  let got = null;
  if (!hasUnique && uniqPool.length && r < uq) {
    got = Object.assign({}, uniqPool[0]);
  } else if (uPool.length && r < uq + uc) {
    got = Object.assign({}, uPool[Math.floor(Math.random() * uPool.length)]);
  }
  let refund = 0;
  if (got) {
    const g = grantItem(got);
    refund = g.refund; got.isNew = g.isNew;
    store.coins += refund;
  } else {
    refund = f.failRefund || 120;
    store.coins += refund;
  }
  store.furnaceLog = store.furnaceLog || [];
  store.furnaceLog.unshift({ ts: Date.now(), got: got ? got.id : null, used: used, refund: refund });
  store.furnaceLog = store.furnaceLog.slice(0, 20);
  saveStore(); updateCoinDisplay();
  checkBonds();
  renderSummon(got ? [got] : null, refund, 'furnace',
               got ? null : '未炼出极品，返还 ' + refund + ' 金币');
}

/* ---------- 召唤页渲染 ---------- */
const SUMMON_PAGE_SIZE = 120;
let summonFilter = 'all';
let summonRarity = 'all';
let summonPage = 0;
let lastSummonResults = null;

function nameOf(id) {
  const it = ((summonPool || FALLBACK_SUMMON_POOL).items || []).find(x => x.id === id);
  return it ? it.name : id;
}

function renderSummon(revealResults, refund, mode, note) {
  if (revealResults) lastSummonResults = revealResults;
  const pool = summonPool || FALLBACK_SUMMON_POOL;
  const items = pool.items || [];
  const cats = pool.categories || [];
  const bonds = pool.bonds || [];
  const coins = store.coins || 0;
  const costS = pool.costSingle || 100, costT = pool.costTen || 900;
  const collection = store.collection || {};
  const ownedCount = Object.keys(collection).length;

  /* 结果区 */
  let resultHtml = '';
  if (revealResults && revealResults.length) {
    const tag = mode === 'furnace' ? '🔥 加热炉熔炼' : mode === 'welfare' ? '🎁 福利召唤' : '🎉 召唤结果';
    resultHtml =
      '<div class="summon-result">' +
        '<div class="sr-title">' + tag +
          (refund ? ' · 重复返还 <b>+' + refund + '</b> 🪙' : '') +
          (note ? ' · <span class="sr-note">' + note + '</span>' : '') +
        '</div>' +
        '<div class="sr-cards">' +
          revealResults.map((r, i) =>
            '<div class="sr-card r' + r.rarity + (r.rarity >= 6 ? ' ultra' : '') + '" style="animation-delay:' + (i * 90) + 'ms">' +
              '<div class="src-icon">' + r.icon + '</div>' +
              '<div class="src-name">' + r.name + '</div>' +
              '<div class="src-rarity">' + starsOf(r.rarity) + '</div>' +
              '<div class="src-tag">' + (r.isNew ? '<span class="sr-new">NEW</span>' : '<span class="sr-dup">重复 ×' + collection[r.id] + '</span>') + '</div>' +
            '</div>').join('') +
        '</div>' +
      '</div>';
  } else if (note) {
    resultHtml = '<div class="summon-result"><div class="sr-title">' + note + '</div></div>';
  }

  /* 福利冷却 */
  const cd = (pool.welfare && pool.welfare.cooldownMs) || 86400000;
  const passed = Date.now() - (store.welfareTs || 0);
  const wfReady = passed >= cd;
  let wfLeft = '';
  if (!wfReady) {
    const left = cd - passed;
    wfLeft = '（' + Math.floor(left / 3600000) + 'h' + Math.floor((left % 3600000) / 60000) + 'm 后可再领）';
  }

  /* 加热炉 */
  const f = pool.furnace || {};
  const dups = dupIds();
  const furnaceHtml =
    '<div class="furnace-panel">' +
      '<div class="fp-title">🔥 加热炉 · 熔炼极品</div>' +
      '<div class="fp-desc">' + (f.desc || ('熔炼 ' + (f.costDupCards || 3) + ' 张重复藏品 + ' + (f.costCoins || 200) + ' 金币，有机会炼出 U 级极品甚至唯一品质')) + '</div>' +
      '<div class="fp-row">' +
        '<span>重复藏品：<b class="' + (dups.length >= (f.costDupCards || 3) ? 'ok' : 'no') + '">' + dups.length + '</b> / 需 ' + (f.costDupCards || 3) + '</span>' +
        '<span>U 级概率：<b>' + Math.round((f.uChance || 0.08) * 100) + '%</b></span>' +
        '<span>唯一品质：<b>' + ((f.uniqueChance || 0.004) * 100).toFixed(1) + '%</b></span>' +
      '</div>' +
      '<button class="furnace-btn" id="furnaceBtn"' + (dups.length < (f.costDupCards || 3) ? ' disabled' : '') + '>开始熔炼（-' + (f.costCoins || 200) + ' 🪙）</button>' +
      ((store.furnaceLog || []).length ? '<div class="fp-log">最近熔炼：' + store.furnaceLog.slice(0, 5).map(l => l.got ? '<b class="hit">' + nameOf(l.got) + '</b>' : '未出货').join(' · ') + '</div>' : '') +
    '</div>';

  /* 羁绊 */
  let bondsHtml = '';
  if (bonds.length) {
    bondsHtml =
      '<div class="bond-panel">' +
        '<div class="bp-title">🤝 羁绊 · 集齐成员领金币（共 ' + bonds.length + ' 组，已激活 ' + Object.keys(store.bonds || {}).length + ' 组）</div>' +
        '<div class="bp-grid">' +
          bonds.map(b => {
            const p = bondProgress(b);
            const active = !!(store.bonds || {})[b.id];
            return '<div class="bond-card' + (active ? ' active' : '') + '">' +
              '<div class="bc-name">' + b.name + (active ? ' ✅' : '') + '</div>' +
              '<div class="bc-members">' + b.memberNames.map(n => {
                const it = items.find(x => x.name === n);
                return '<span class="bc-m' + (it && collection[it.id] ? ' got' : '') + '">' + n + '</span>';
              }).join('') + '</div>' +
              '<div class="bc-prog">' + p.have + '/' + p.total + ' · 奖励 <b>+' + b.reward + '</b> 🪙</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  /* 图鉴（类目 + 稀有度筛选 + 分页） */
  let shown = summonFilter === 'all' ? items : items.filter(i => i.category === summonFilter);
  if (summonRarity !== 'all') shown = shown.filter(i => String(i.rarity) === summonRarity);
  const pages = Math.max(1, Math.ceil(shown.length / SUMMON_PAGE_SIZE));
  if (summonPage >= pages) summonPage = pages - 1;
  if (summonPage < 0) summonPage = 0;
  const pageItems = shown.slice(summonPage * SUMMON_PAGE_SIZE, summonPage * SUMMON_PAGE_SIZE + SUMMON_PAGE_SIZE);
  const gallery = pageItems.length ? pageItems.map(it => {
    const have = collection[it.id] || 0;
    const locked = !have;
    return '<div class="gal-card r' + it.rarity + (it.rarity >= 6 ? ' ultra' : '') + (locked ? ' locked' : ' owned') + '" title="' + (locked ? '未获得' : escapeHtml(it.desc || '')) + '">' +
      '<div class="gal-icon">' + (locked ? '❔' : it.icon) + '</div>' +
      '<div class="gal-name">' + (locked ? '？？？' : it.name) + '</div>' +
      '<div class="gal-rarity">' + starsOf(it.rarity) + '</div>' +
      (have > 1 ? '<span class="gal-count">×' + have + '</span>' : '') +
    '</div>';
  }).join('') : '<div class="empty-tip">该筛选下暂无收藏品</div>';

  content.innerHTML =
    '<div class="page-header">' +
      '<h1>🪙 金币召唤 · 收藏图鉴</h1>' +
      '<p>学习行为产出金币，金币用于召唤 <b>武将 / 宝物 / 奇物</b>（共 ' + items.length + ' 件）。另有<b>福利召唤</b>（每日免费）、<b>加热炉</b>（熔炼重复藏品出 U 级与唯一品质）与<b>羁绊</b>（集齐成员领金币）。</p>' +
    '</div>' +

    '<div class="summon-hud">' +
      '<div class="sh-coin">' +
        '<span class="sh-coin-icon">🪙</span>' +
        '<span class="sh-coin-num">' + coins + '</span>' +
        '<span class="sh-coin-label">当前金币</span>' +
      '</div>' +
      '<div class="sh-btns">' +
        '<button class="summon-btn single" id="summonOne">单抽 · ' + costS + ' 🪙</button>' +
        '<button class="summon-btn ten" id="summonTen">十连 · ' + costT + ' 🪙</button>' +
        '<button class="summon-btn welfare' + (wfReady ? '' : ' cd') + '" id="welfareBtn">🎁 福利召唤' + wfLeft + '</button>' +
      '</div>' +
      '<div class="sh-prog">图鉴收集 <b>' + ownedCount + '</b> / ' + items.length + '</div>' +
    '</div>' +

    resultHtml + furnaceHtml + bondsHtml +

    '<div class="coin-rules">' +
      '<div class="cr-title">💰 金币怎么赚</div>' +
      '<div class="cr-grid">' +
        '<div class="cr-item"><span>章节打卡</span><b>+' + COIN_RULES.chapter + '</b></div>' +
        '<div class="cr-item"><span>专栏读完</span><b>+' + COIN_RULES.topic + '</b></div>' +
        '<div class="cr-item"><span>测验答对</span><b>+' + COIN_RULES.quiz + '</b></div>' +
        '<div class="cr-item"><span>易错点答对</span><b>+' + COIN_RULES.pitfall + '</b></div>' +
        '<div class="cr-item"><span>算法研读</span><b>+' + COIN_RULES.algo + '</b></div>' +
        '<div class="cr-item"><span>考试（每分）</span><b>+' + COIN_RULES.examPerScore + '</b></div>' +
        '<div class="cr-item"><span>考试及格</span><b>+' + COIN_RULES.examPass + '</b></div>' +
        '<div class="cr-item"><span>解锁成就</span><b>+' + COIN_RULES.achievement + '</b></div>' +
        '<div class="cr-item"><span>闪卡全对</span><b>+' + COIN_RULES.flash + '</b></div>' +
      '</div>' +
    '</div>' +

    '<div class="gal-filter">' +
      '<button class="gf-btn' + (summonFilter === 'all' ? ' active' : '') + '" data-cat="all">全部</button>' +
      cats.map(c => '<button class="gf-btn' + (summonFilter === c.key ? ' active' : '') + '" data-cat="' + c.key + '">' + c.icon + ' ' + c.name + (pool.categoryCount && pool.categoryCount[c.key] ? '(' + pool.categoryCount[c.key] + ')' : '') + '</button>').join('') +
      '<span class="gf-sep"></span>' +
      ['7', '6', '5', '4', '3', '2', '1'].map(r => '<button class="gf-btn rf' + (summonRarity === r ? ' active' : '') + '" data-rar="' + r + '">' + rarityText(r) + '</button>').join('') +
      '<button class="gf-btn rf' + (summonRarity === 'all' ? ' active' : '') + '" data-rar="all">全部星级</button>' +
    '</div>' +
    '<div class="gal-grid">' + gallery + '</div>' +
    (pages > 1 ? '<div class="gal-pager">' +
      '<button class="gp-btn" id="gpPrev"' + (summonPage === 0 ? ' disabled' : '') + '>← 上一页</button>' +
      '<span class="gp-info">第 ' + (summonPage + 1) + ' / ' + pages + ' 页（本页 ' + pageItems.length + ' 件）</span>' +
      '<button class="gp-btn" id="gpNext"' + (summonPage >= pages - 1 ? ' disabled' : '') + '>下一页 →</button>' +
    '</div>' : '');

  const btnOne = document.getElementById('summonOne');
  const btnTen = document.getElementById('summonTen');
  const btnWel = document.getElementById('welfareBtn');
  const btnFur = document.getElementById('furnaceBtn');
  if (btnOne) btnOne.addEventListener('click', () => doSummon(1));
  if (btnTen) btnTen.addEventListener('click', () => doSummon(10));
  if (btnWel) btnWel.addEventListener('click', doWelfareSummon);
  if (btnFur) btnFur.addEventListener('click', doFurnace);

  content.querySelectorAll('.gf-btn[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      summonFilter = btn.dataset.cat; summonPage = 0;
      renderSummon(lastSummonResults, 0, mode, note);
    });
  });
  content.querySelectorAll('.gf-btn[data-rar]').forEach(btn => {
    btn.addEventListener('click', () => {
      summonRarity = btn.dataset.rar; summonPage = 0;
      renderSummon(lastSummonResults, 0, mode, note);
    });
  });
  const gpPrev = document.getElementById('gpPrev');
  const gpNext = document.getElementById('gpNext');
  if (gpPrev) gpPrev.addEventListener('click', () => { summonPage--; renderSummon(lastSummonResults, 0, mode, note); });
  if (gpNext) gpNext.addEventListener('click', () => { summonPage++; renderSummon(lastSummonResults, 0, mode, note); });
}

/* ==================== 易错点提醒引擎 ==================== */
// 随机抽提醒弹 toast（切 tab 时小概率触发，避免打扰）
function maybeAlertToast() {
  if (Math.random() > 0.28) return;
  const fresh = mistakeAlerts.filter(a => !store.alertsShown[a.id]);
  const pool = fresh.length ? fresh : mistakeAlerts;
  const alert = pool[Math.floor(Math.random() * pool.length)];
  store.alertsShown[alert.id] = Date.now();
  saveStore();

  let box = document.getElementById('alertBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'alertBox';
    box.className = 'alert-box';
    document.body.appendChild(box);
  }
  const el = document.createElement('div');
  el.className = 'mistake-toast';
  el.innerHTML = `
    <div class="mt-head"><span class="mt-icon">${alert.icon}</span><b>易错点提醒</b>
      <button class="mt-close" title="关闭">✕</button></div>
    <div class="mt-title">${alert.title}</div>
    <div class="mt-wrong">❌ ${alert.wrong}</div>
    <div class="mt-right">✅ ${alert.right}</div>
    <div class="mt-scene">🎬 常见于：${alert.scene}</div>`;
  box.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  const close = () => { el.classList.remove('show'); setTimeout(() => el.remove(), 450); };
  el.querySelector('.mt-close').addEventListener('click', close);
  setTimeout(() => { if (el.isConnected) close(); }, 8000);
}

/* ---- 视图：算法训练营 ---- */
let algoFilter = 'all';

function renderAlgo() {
  const levels = [
    { key: 'all', label: `全部 (${algorithmProblems.length})` },
    { key: 'easy', label: `简单 (${algorithmProblems.filter(p => p.difficulty === 'easy').length})` },
    { key: 'medium', label: `中等 (${algorithmProblems.filter(p => p.difficulty === 'medium').length})` },
    { key: 'hard', label: `困难 (${algorithmProblems.filter(p => p.difficulty === 'hard').length})` },
  ];
  const list = algorithmProblems.filter(p => algoFilter === 'all' || p.difficulty === algoFilter);

  content.innerHTML = `
    <div class="page-header">
      <h1>⚔️ 刷题训练营 · 力扣风格 10 题</h1>
      <p>先<b>自己想 20 分钟</b> → 再逐条展开提示 → 最后看参考答案与复杂度。每道题的「关键套路」是比答案本身更重要的东西。</p>
      <div class="algo-toolbar" style="margin-top:14px">
        ${levels.map(l => `<button class="algo-filter ${algoFilter === l.key ? 'active' : ''}" data-level="${l.key}">${l.label}</button>`).join('')}
      </div>
    </div>
    ${list.map((p, i) => {
      const opened = store.algoOpens[p.id];
      return `<div class="fold-card ${opened ? 'open' : ''}" data-algo="${p.id}">
        <button class="fold-head">
          <span class="diff-chip diff-${p.difficulty}">${p.difficultyLabel}</span>
          <span>${i + 1}. ${p.title}</span>
          <span style="font-weight:400;color:var(--muted);font-size:12.5px">${p.tag}</span>
          <span class="fold-arrow">▼</span>
        </button>
        <div class="fold-body">
          <p class="algo-desc" style="font-weight:600;color:#4a5568">${p.leetcodeTag}</p>
          <p class="algo-desc">${p.description}</p>
          <div class="algo-examples">${p.examples.map(e => `<div>▸ ${e}</div>`).join('')}</div>

          <p style="margin:14px 0 6px;font-weight:700;font-size:14.5px">💡 逐级提示（先自己想！）</p>
          <button class="qa-toggle hint-ctrl">▶ 展开第 1 条提示</button>
          <div class="hint-reveal">
            <div class="algo-hint-list">
              ${p.hints.map((h, hi) => `<div class="algo-hint"><b>提示 ${hi + 1}：</b>${h}</div>`).join('')}
            </div>
            <button class="qa-toggle sol-ctrl">▶ 展开参考答案</button>
            <div class="sol-reveal hint-reveal">
              <div class="code-card"><div class="code-head"><span>✅ 参考答案（Java）</span>
                <button class="code-copy" data-code="${escapeHtml(p.solution)}">复制代码</button></div>
                <pre>${highlight(p.solution)}</pre></div>
              <div class="callout callout-info"><b>📌 复杂度分析：</b>${p.complexity}</div>
              <div class="callout callout-tip"><b>💡 关键套路：</b>${p.keyPoint}</div>
            </div>
          </div>
        </div>
      </div>`;
    }).join('')}
  `;

  // 过滤器
  content.querySelectorAll('.algo-filter').forEach(btn => {
    btn.addEventListener('click', () => { algoFilter = btn.dataset.level; renderAlgo(); });
  });
  // 折叠
  content.querySelectorAll('.fold-head').forEach(head => {
    head.addEventListener('click', () => {
      const card = head.closest('.fold-card');
      card.classList.toggle('open');
      const id = card.dataset.algo;
      const wasOpen = !!store.algoOpens[id];
      store.algoOpens[id] = card.classList.contains('open');
      saveStore();
      if (store.algoOpens[id]) {                       // 展开 = 研读打卡（仅首次计金币）
        if (!wasOpen) awardCoins(COIN_RULES.algo, '算法研读');
        checkAchievements();
      }
    });
  });
  // 提示/答案二级展开
  content.querySelectorAll('.hint-ctrl').forEach(btn => {
    btn.addEventListener('click', () => {
      const reveal = btn.nextElementSibling;
      const show = reveal.classList.toggle('show');
      btn.textContent = show ? '▼ 收起提示' : '▶ 展开第 1 条提示';
    });
  });
  content.querySelectorAll('.sol-ctrl').forEach(btn => {
    btn.addEventListener('click', () => {
      const reveal = btn.nextElementSibling;
      const show = reveal.classList.toggle('show');
      btn.textContent = show ? '▼ 收起答案' : '▶ 展开参考答案';
    });
  });
}

/* ---- 视图：知识地图 ---- */
function renderRoadmap() {
  const stages = [
    { m: '第 1~2 月', t: 'Java 入门：语法 + 面向对象', d: '环境搭建、基础语法、流程控制、方法、数组、面向对象三大特性、常用 API', skills: ['JDK/IDEA', '语法', 'OOP', 'String/数组', '异常'] },
    { m: '第 3 月', t: 'Java 进阶 + MySQL 入门', d: '集合框架、泛型、IO、多线程基础、JVM 初识；MySQL 安装、SQL 增删改查', skills: ['集合', '泛型', '多线程', 'JVM', 'SQL CRUD'] },
    { m: '第 4~5 月', t: 'Web 开发核心：前后端框架', d: 'HTML/CSS/JS 基础、HTTP 深入、Maven、Spring Boot、MyBatis、RESTful 接口设计，完成博客/任务管理项目', skills: ['HTML/CSS/JS', 'Vue', 'Spring Boot', 'MyBatis', 'JWT'] },
    { m: '第 6 月', t: '数据库进阶 + 中间件', d: '索引/事务/SQL 优化、Redis 缓存实战、消息队列、Linux 与 Git 协作、Docker 部署', skills: ['索引/事务', 'Redis', 'RabbitMQ', 'Linux', 'Docker'] },
    { m: '第 7~8 月', t: '刷题 + 面试冲刺', d: 'LeetCode Hot 100、八股文系统复习（集合/并发/JVM/MySQL/Redis/Spring）、简历打磨、模拟面试', skills: ['LeetCode', '八股文', '项目深挖', '系统设计入门'] },
    { m: '第 9 月', t: '求职 + 入职', d: '海投面试、复盘迭代；入职后补源码阅读、分布式、线上问题排查能力', skills: ['面试复盘', '源码阅读', '分布式', '稳定性思维'] },
  ];
  const techMap = [
    { icon: '☕', name: 'Java SE', items: '语法 / OOP / 集合 / 异常 / 泛型 / IO / 多线程 / JVM' },
    { icon: '🎨', name: '前端', items: 'HTML / CSS / JS / ES6 / Vue 3 / Axios' },
    { icon: '🗄️', name: '数据库', items: 'MySQL / SQL / 索引 / 事务 / 连接池' },
    { icon: '🍃', name: '后端框架', items: 'Maven / Spring / Spring Boot / MyBatis / RESTful / JWT' },
    { icon: '⚡', name: '中间件', items: 'Redis / RabbitMQ / Nginx / Elasticsearch' },
    { icon: '🛠️', name: '工程化', items: 'Git / Linux / Docker / 测试 / CI/CD' },
    { icon: '⚔️', name: '算法', items: '双指针 / 哈希 / 链表 / 栈 / 滑动窗口 / BFS / DP' },
  ];
  content.innerHTML = `
    <div class="page-header">
      <h1>🗺️ 一页看懂：Java 全栈知识地图</h1>
      <p>左边是时间路线，右边是技能全景。迷路的时候回来看看自己走到了哪一站。</p>
    </div>
    <div class="road-map">
      ${stages.map(s => `
        <div class="road-stage">
          <div class="stage-month">${s.m}</div>
          <div>
            <h3>${s.t}</h3>
            <p>${s.d}</p>
            <div class="skill-cloud">${s.skills.map(k => `<span class="skill-pill core">${k}</span>`).join('')}</div>
          </div>
        </div>`).join('')}
    </div>
    <div class="block-card">
      <h2>🧰 全栈技能全景表</h2>
      ${techMap.map(t => `<p><b>${t.icon} ${t.name}</b> —— ${t.items}</p>`).join('')}
    </div>
    <div class="callout callout-warn"><b>⚠️ 最重要的提醒：</b>不要陷入"收藏 = 学会"的幻觉。路线图再完美，不如今天敲下第一行 <code>public class HelloWorld</code>。就现在，去第 1 章。</div>
  `;
}

/* ---- 视图：完整知识清单 ---- */
function renderSyllabus() {
  const lvlCls = { '必修': 'lv-must', '进阶': 'lv-adv', '加分': 'lv-bonus' };
  content.innerHTML = `
    <div class="page-header">
      <h1>📋 完整知识清单 · 所有要学的全在这里</h1>
      <p><b>${syllabusStats.moduleCount} 大模块 · ${syllabusStats.totalPoints} 个学习单元 · ${syllabusStats.totalPoints} 条知识点全量罗列</b>。必修约 ${syllabusStats.mustDays} 天（≈${Math.round(syllabusStats.mustDays / 30)} 个月全职），含进阶与加分项共 ${syllabusStats.allDays} 天。每条都写了"为什么学"和"建议天数"——学什么、为什么、学多久，一目了然。</p>
      <div class="hero-tags" style="margin-top:12px">
        <span class="hero-tag">必修 = 面试硬门槛</span>
        <span class="hero-tag">进阶 = 中高级岗位分水岭</span>
        <span class="hero-tag">加分 = 大厂/加分项</span>
      </div>
    </div>
    ${syllabusModules.map((m, mi) => `
      <div class="block-card syllabus-mod">
        <div class="sm-head">
          <span class="sm-icon">${m.icon}</span>
          <div>
            <h2>${m.name}</h2>
            <p class="sm-desc">${m.desc}</p>
          </div>
          <span class="sm-weight">权重 ${m.weight}%</span>
        </div>
        <div class="table-wrap">
          <table class="data-table syllabus-table">
            <thead><tr><th style="width:44px">#</th><th>知识点 / 学习单元</th><th>为什么学</th><th style="width:70px">天数</th><th style="width:64px">级别</th></tr></thead>
            <tbody>
              ${m.units.map((u, ui) => {
                const ukey = 'm' + mi + '-u' + ui;
                return `
                <tr class="syl-row" data-ukey="${ukey}" title="点击展开本单元详细知识点">
                  <td class="s-no">${mi + 1}.${ui + 1}</td>
                  <td class="s-name"><span class="s-arrow">▶</span>${u.name}</td>
                  <td class="s-why">${u.why}</td>
                  <td class="s-days">${u.days} 天</td>
                  <td><span class="lv-chip ${lvlCls[u.level] || ''}">${u.level}</span></td>
                </tr>
                <tr class="syl-detail" data-detail="${ukey}"><td colspan="5"></td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="sm-foot">本模块小计：${m.units.length} 个单元 · ${m.units.reduce((n, u) => n + u.days, 0)} 天</div>
      </div>`).join('')}
    <div class="callout callout-warn"><b>⚠️ 使用说明：</b>清单是地图不是枷锁——允许按兴趣微调顺序，但<b>必修单元一个都不能少</b>。每学完一条，就回「易错点考场」和「模拟考试」验证自己是不是真的掌握了。</div>
  `;

  // 点击单元行 → 展开/收起本单元的详细知识点（首次展开时懒渲染，107 单元不卡页面）
  content.querySelectorAll('.syl-row').forEach(row => {
    row.addEventListener('click', () => {
      const ukey = row.dataset.ukey;
      const detail = content.querySelector('.syl-detail[data-detail="' + ukey + '"]');
      if (!detail) return;
      const open = detail.classList.toggle('open');
      row.classList.toggle('expanded', open);
      row.querySelector('.s-arrow').textContent = open ? '▼' : '▶';
      if (open && !detail.dataset.filled) {
        detail.querySelector('td').innerHTML = buildSyllabusDetail(ukey);
        detail.dataset.filled = '1';
      }
    });
  });
}

/* 知识清单：单元详情面板（知识点详解 + 接入文章/工具链接） */
function buildSyllabusDetail(ukey) {
  const d = (syllabusDetails && syllabusDetails[ukey]) || null;
  if (!d) return '<div class="sd-empty">该单元的详解数据未加载：请确认后端已启动，且数据库已导入 syllabusDetails（scripts/gen_syllabus_details.py）。</div>';
  const pts = d.points || [];
  const links = d.links || [];
  return `
    <div class="sd-box">
      <div class="sd-head">🔍 本单元知识点详解 · ${pts.length} 条</div>
      <ol class="sd-list">
        ${pts.map(p => `<li><b>${p[0]}</b><span>${p[1]}</span></li>`).join('')}
      </ol>
      ${links.length ? `<div class="sd-links">
        <span class="sd-links-label">📖 接入文章 / 工具：</span>
        ${links.map(l => `<a class="sd-link" data-tab="${l[1]}" href="#${l[1]}">${l[0]} →</a>`).join('')}
      </div>` : ''}
    </div>`;
}

/* ---- 视图：面试八股文 ---- */
let bwOpenSet = new Set();

function renderBaguwen() {
  content.innerHTML = `
    <div class="page-header">
      <h1>💼 面试八股文 · ${baguwenStats.total} 问直接背</h1>
      <p>高频真题 + <b>标准答案</b> + <b>加分点</b> + <b>面试官追问链</b>。使用方法：先自己答一遍 → 展开对照 → 把"加分点"补进自己的话术 → 追问链逐个自测。八股的本质是<b>把理解压缩成结构化表达</b>，死背不如懂了再背。</p>
    </div>
    ${baguwenCategories.map(cat => `
      <div class="block-card bw-cat">
        <div class="bw-cat-head">
          <span class="bw-cat-icon">${cat.icon}</span>
          <div><h2>${cat.name}</h2><p>${cat.desc}</p></div>
          <span class="bw-cat-count">${cat.items.length} 问</span>
        </div>
        ${cat.items.map((it, i) => {
          const key = cat.id + '-' + i;
          const open = bwOpenSet.has(key);
          return `
          <div class="bw-item ${open ? 'open' : ''}" data-bw="${key}">
            <button class="bw-q">
              <span class="bw-idx">Q${i + 1}</span>
              <span class="bw-q-text">${it.q}</span>
              <span class="fold-arrow">${open ? '▲' : '▼'}</span>
            </button>
            <div class="bw-a">
              <div class="bw-block"><div class="bw-tag bw-tag-a">标准答案</div><div class="bw-body">${it.a}</div></div>
              <div class="bw-block"><div class="bw-tag bw-tag-plus">⚡ 加分点</div><div class="bw-body">${it.plus}</div></div>
              <div class="bw-block"><div class="bw-tag bw-tag-fu">🔗 面试官追问链（逐个自测）</div>
                <ol class="bw-followups">${it.followups.map(f => `<li>${f}</li>`).join('')}</ol>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>`).join('')}
  `;

  content.querySelectorAll('.bw-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.bw-item');
      const key = item.dataset.bw;
      const open = item.classList.toggle('open');
      btn.querySelector('.fold-arrow').textContent = open ? '▲' : '▼';
      if (open) bwOpenSet.add(key); else bwOpenSet.delete(key);
    });
  });
}

/* ---- 视图：图解原理专栏（小林式长文） ---- */
let topicFilter = '全部';

function renderTopics() {
  const allTopics = [...topicsNetworkOS, ...topicsMySQLRedis, ...topicsCollections];
  const tags = ['全部', ...new Set(allTopics.map(t => t.tag))];
  const shown = topicFilter === '全部' ? allTopics : allTopics.filter(t => t.tag === topicFilter);
  const openedCount = allTopics.filter(t => store.doneChapters.includes('topic-' + t.id)).length;

  content.innerHTML = `
    <div class="page-header">
      <h1>🖼️ 图解原理专栏 · ${allTopics.length} 篇深度长文</h1>
      <p>对标小林 coding 的<b>图解式硬核长文</b>：ASCII 原理图 + 层层追问 + 面试问答 + 速记口诀。覆盖 <b>${tags.filter(t => t !== '全部').join(' / ')}</b>。已读 ${openedCount}/${allTopics.length} 篇。这些是校招/社招面试的<b>底层原理区分题</b>——背结论只能及格，看懂图解才能拿 offer。</p>
      <div class="topic-filter">
        ${tags.map(tg => `<button class="tf-btn ${tg === topicFilter ? 'active' : ''}" data-tag="${tg}">${tg}</button>`).join('')}
      </div>
    </div>
    ${shown.map(tp => {
      const read = store.doneChapters.includes('topic-' + tp.id);
      return `
      <div class="block-card topic-card ${read ? 'read' : ''}" id="topic-${tp.id}">
        <div class="topic-head">
          <span class="topic-icon">${tp.icon}</span>
          <div class="topic-meta">
            <span class="topic-tag">${tp.tag}</span>
            <h2>${tp.title}</h2>
            <p class="topic-desc">${tp.desc}</p>
          </div>
          <button class="topic-read-btn ${read ? 'on' : ''}" data-topic="${tp.id}">${read ? '✓ 已读' : '标记已读'}</button>
        </div>
        <div class="topic-body">
          ${tp.blocks.map(b => renderBlock(b)).join('')}
        </div>
      </div>`;
    }).join('')}
  `;

  content.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', () => { topicFilter = btn.dataset.tag; renderTopics(); });
  });
  content.querySelectorAll('.topic-read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = 'topic-' + btn.dataset.topic;
      const i = store.doneChapters.indexOf(key);
      const wasDone = i >= 0;
      if (wasDone) store.doneChapters.splice(i, 1); else store.doneChapters.push(key);
      saveStore(); updateProgress();
      if (!wasDone) { awardCoins(COIN_RULES.topic, '专栏读完'); checkAchievements(); }
      renderTopics();
    });
  });
}

/* ---- 视图：按公司分类真题 ---- */
function renderCompanies() {
  // 足迹：踏入公司真题板块即记录（彩蛋「全图鉴探险家」条件之一）
  store.touchedZones = store.touchedZones || {};
  if (!store.touchedZones.company) {
    store.touchedZones.company = true;
    saveStore();
    checkAchievements();
  }
  content.innerHTML = `
    <div class="page-header">
      <h1>🏢 按公司分类真题 · ${companyStats.companies} 家大厂 ${companyStats.total} 问</h1>
      <p>不同大厂面试风格差异极大：阿里<b>深挖源码与架构</b>、字节<b>手撕算法是门槛</b>、腾讯<b>重网络与操作系统底层</b>、美团<b>场景设计连环追问</b>、百度<b>重底层与海量数据</b>、京东<b>重电商高可用</b>、拼多多<b>考算法+成本意识</b>。每题给出<b>参考答案要点</b>和<b>考察意图</b>——知道面试官想听什么，比背答案更重要。按公司定向刷，面试前精准复盘。</p>
    </div>
    ${companyQuestions.map(co => `
      <div class="block-card company-card" id="company-${co.id}">
        <div class="co-head">
          <span class="co-icon">${co.icon}</span>
          <div class="co-meta">
            <h2>${co.name}</h2>
            <p class="co-style">${co.style}</p>
            <span class="co-freq">🎯 ${co.freqDesc}</span>
          </div>
        </div>
        ${co.sections.map(sec => `
          <div class="co-section">
            <h3 class="co-sec-title">${sec.name}</h3>
            ${sec.questions.map(item => `
              <div class="coq-item">
                <div class="coq-q">${item.q}</div>
                <div class="coq-block">
                  <span class="coq-label coq-key-label">💡 答案要点</span>
                  <div class="coq-body">${item.key}</div>
                </div>
                <div class="coq-block">
                  <span class="coq-label coq-intent-label">🎯 考察意图</span>
                  <div class="coq-body coq-intent">${item.intent}</div>
                </div>
                <div class="coq-tags">${(item.tags || []).map(t => `<span class="coq-tag">${t}</span>`).join('')}</div>
              </div>`).join('')}
          </div>`).join('')}
      </div>`).join('')}
  `;
}

/* ---- 视图：易错点考场 ---- */
function renderPitfalls() {
  const answeredTotal = Object.keys(store.pitfallAnswers).length;
  content.innerHTML = `
    <div class="page-header">
      <h1>⚠️ 易错点考场 · 30 天每日打卡</h1>
      <p><b>${pitfallStats.points} 个高频易错点</b>按 30 天编排（每天一个主题），每天配 <b>${pitfallStats.questions / pitfallStats.days} 道考查题</b>点击即测。<b>共 ${pitfallStats.questions} 题，已完成 ${answeredTotal} 题。</b>错误的题目就是你的知识漏洞地图——考前把错题重刷一遍，比做十套新卷子有用。</p>
    </div>
    ${pitfallDays.map(d => {
      const answered = d.questions.filter(q => store.pitfallAnswers[d.day + '-' + q.q.slice(0, 12)] !== undefined).length;
      return `
      <div class="block-card pit-day">
        <div class="pit-head">
          <div class="pit-day-no">Day<br>${d.day}</div>
          <div class="pit-title-wrap">
            <span class="pit-stage">${d.stage}</span>
            <h3>${d.title}</h3>
          </div>
          <span class="pit-score">${answered}/${d.questions.length} 已测</span>
        </div>
        <div class="pit-points">
          ${d.points.map(p => `<div class="pit-point"><span class="pp-bullet">✗</span><div>${p}</div></div>`).join('')}
        </div>
        <div class="pit-quiz-title">🎯 今日考查（点击作答，即时判分）</div>
        ${d.questions.map((q, qi) => {
          const key = d.day + '-' + q.q.slice(0, 12);
          const chosen = store.pitfallAnswers[key];
          return `
          <div class="pit-q" data-key="${key}" data-answer="${q.answer}">
            <div class="pq-title">Q${qi + 1}. ${q.q}</div>
            <div class="pq-options">
              ${q.options.map((opt, oi) => {
                let cls = 'pq-opt';
                if (chosen !== undefined) {
                  if (oi === q.answer) cls += ' correct';
                  else if (oi === chosen) cls += ' wrong';
                }
                return `<button class="${cls}" data-oi="${oi}">${String.fromCharCode(65 + oi)}. ${opt}</button>`;
              }).join('')}
            </div>
            <div class="pq-explain ${chosen !== undefined ? 'show' : ''}">💡 ${q.explain}</div>
          </div>`;
        }).join('')}
      </div>`;
    }).join('')}
  `;

  content.querySelectorAll('.pit-q').forEach(qEl => {
    qEl.querySelectorAll('.pq-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = qEl.dataset.key;
        if (store.pitfallAnswers[key] !== undefined) return;   // 已作答
        const chosen = Number(btn.dataset.oi);
        store.pitfallAnswers[key] = chosen;
        if (chosen !== Number(qEl.dataset.answer)) store.someWrongBefore = true;
        else awardCoins(COIN_RULES.pitfall, '易错点答对');   // 答对 → 金币
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) store.answeredAtNight = true;
        saveStore();
        renderPitfalls();
        checkAchievements();
      });
    });
  });
}

/* ---- 视图：模拟考试 ---- */
let examState = null;   // { paperId, answers: {}, startTs, submitted }

function renderExam() {
  // 正在考试中 → 渲染考试界面
  if (examState && !examState.submitted) { renderExamRunning(); return; }
  if (examState && examState.submitted) { renderExamResult(); return; }

  content.innerHTML = `
    <div class="page-header">
      <h1>🎓 模拟考试中心 · ${examStats.papers} 套全真模拟卷</h1>
      <p>共 <b>${examStats.total} 题</b>。规则：限时作答（到时自动交卷）、提交后统一判分出成绩单、逐题复盘解析。<b>模拟真实笔试流程：答题期间不能回看教程</b>——考完的分数才是你当前的真实水平。</p>
    </div>
    <div class="exam-grid">
      ${examPapers.map(p => {
        const best = store.examResults[p.id];
        return `
        <div class="exam-card">
          <div class="exam-card-head"><span class="ec-icon">${p.icon}</span>
            <div><h3>${p.name}</h3><p class="ec-desc">${p.desc}</p></div>
          </div>
          <div class="exam-card-meta">
            <span class="meta-chip">⏱ 限时 ${p.minutes} 分钟</span>
            <span class="meta-chip">📋 ${p.questions.length} 题</span>
            <span class="meta-chip">🎯 ${p.passScore} 分及格</span>
            <span class="meta-chip">📈 ${p.level}</span>
          </div>
          ${best ? `<div class="exam-best">🏆 历史最佳：<b>${best.score}</b> 分（${new Date(best.ts).toLocaleDateString()}）${best.score >= p.passScore ? ' ✅ 已通过' : ' 未达及格线'}</div>` : ''}
          <button class="exam-start-btn" data-paper="${p.id}">▶ 开始考试</button>
        </div>`;
      }).join('')}
    </div>
    <div class="callout callout-tip"><b>💡 考试建议：</b>基础卷 60 分以下 → 回第 1~3 章补地基；进阶卷 60 分以下 → 重点复习并发/JVM/MySQL 原理；面试卷 70 分以下 → 回「面试八股文」逐问过一遍再来。</div>
  `;

  content.querySelectorAll('.exam-start-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      examState = { paperId: btn.dataset.paper, answers: {}, startTs: Date.now(), submitted: false };
      renderExamRunning();
      window.scrollTo({ top: 0 });
    });
  });
}

function renderExamRunning() {
  const paper = examPapers.find(p => p.id === examState.paperId);
  const answeredCount = Object.keys(examState.answers).length;
  const pct = Math.round(answeredCount / paper.questions.length * 100);

  content.innerHTML = `
    <div class="exam-running-bar">
      <div class="er-info"><b>${paper.name}</b><span id="examTimer">--:--</span></div>
      <div class="er-progress"><div class="er-fill" style="width:${pct}%"></div></div>
      <div class="er-count">已答 ${answeredCount}/${paper.questions.length}</div>
      <button class="er-submit" id="examSubmit">交卷</button>
    </div>
    ${paper.questions.map((q, qi) => {
      const chosen = examState.answers[qi];
      return `
      <div class="block-card exam-q" data-qi="${qi}">
        <div class="quiz-q"><span class="q-no">Q${qi + 1}</span><span class="q-type">${q.topic}</span>${q.q}</div>
        <div class="pq-options">
          ${q.options.map((opt, oi) => `<button class="pq-opt ${chosen === oi ? 'selected' : ''}" data-oi="${oi}">${String.fromCharCode(65 + oi)}. ${opt}</button>`).join('')}
        </div>
      </div>`;
    }).join('')}
    <div class="exam-footer-bar"><button class="er-submit big" id="examSubmit2">交卷并查看成绩</button></div>
  `;

  const tick = () => {
    const t = document.getElementById('examTimer');
    if (!t || !examState || examState.submitted) return;
    const left = paper.minutes * 60 - Math.floor((Date.now() - examState.startTs) / 1000);
    if (left <= 0) { doSubmitExam(); return; }
    const m = String(Math.floor(left / 60)).padStart(2, '0'), s = String(left % 60).padStart(2, '0');
    t.textContent = `⏱ 剩余 ${m}:${s}`;
    t.style.color = left < 60 ? 'var(--red)' : '';
  };
  tick();
  if (renderExam._timer) clearInterval(renderExam._timer);
  renderExam._timer = setInterval(tick, 1000);

  const submit = document.getElementById('examSubmit');
  if (submit) submit.addEventListener('click', () => {
    if (Object.keys(examState.answers).length < paper.questions.length &&
        !confirm(`还有 ${paper.questions.length - Object.keys(examState.answers).length} 题未作答，确定交卷？`)) return;
    doSubmitExam();
  });
  const submit2 = document.getElementById('examSubmit2');
  if (submit2) submit2.addEventListener('click', () => {
    if (Object.keys(examState.answers).length < paper.questions.length &&
        !confirm(`还有 ${paper.questions.length - Object.keys(examState.answers).length} 题未作答，确定交卷？`)) return;
    doSubmitExam();
  });

  content.querySelectorAll('.exam-q').forEach(qEl => {
    const qi = Number(qEl.dataset.qi);
    qEl.querySelectorAll('.pq-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        examState.answers[qi] = Number(btn.dataset.oi);
        qEl.querySelectorAll('.pq-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const answered = Object.keys(examState.answers).length;
        const bar = content.querySelector('.er-count');
        if (bar) bar.textContent = `已答 ${answered}/${paper.questions.length}`;
        const fill = content.querySelector('.er-fill');
        if (fill) fill.style.width = Math.round(answered / paper.questions.length * 100) + '%';
      });
    });
  });
}

function doSubmitExam() {
  if (renderExam._timer) { clearInterval(renderExam._timer); renderExam._timer = null; }
  const paper = examPapers.find(p => p.id === examState.paperId);
  let correct = 0;
  paper.questions.forEach((q, qi) => { if (examState.answers[qi] === q.answer) correct++; });
  const score = Math.round(correct / paper.questions.length * 100);
  const usedSec = Math.floor((Date.now() - examState.startTs) / 1000);
  examState.submitted = true;
  examState.score = score; examState.correct = correct; examState.usedSec = usedSec;
  const prev = store.examResults[paper.id];
  if (!prev || score > prev.score) {
    store.examResults[paper.id] = { score, ts: Date.now() };
  }
  // 彩蛋埋点：极速及格（90 秒内交卷且过线）+ 考试足迹
  store.examMeta = store.examMeta || {};
  store.examMeta[paper.id] = { usedSec, score };
  if (usedSec <= 90 && score >= paper.passScore) store.fastPassExam = (store.fastPassExam || 0) + 1;
  store.touchedZones = store.touchedZones || {};
  store.touchedZones.exam = true;
  const examPass = score >= paper.passScore;            // 考试 → 金币（分数 + 及格奖励）
  awardCoins(Math.round(score * COIN_RULES.examPerScore) + (examPass ? COIN_RULES.examPass : 0),
             examPass ? '考试及格' : '完成考试');
  saveStore();
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) { store.answeredAtNight = true; saveStore(); }
  checkAchievements();
  renderExamResult();
}

function renderExamResult() {
  const paper = examPapers.find(p => p.id === examState.paperId);
  const pass = examState.score >= paper.passScore;
  const mm = Math.floor(examState.usedSec / 60), ss = examState.usedSec % 60;
  const grade = examState.score >= 90 ? '优秀 · 面试水平' : examState.score >= 80 ? '良好 · 差点火候' : examState.score >= paper.passScore ? '及格 · 继续加固' : '未通过 · 回炉重造';

  content.innerHTML = `
    <div class="result-hero ${pass ? 'pass' : 'fail'}">
      <div class="rh-score">${examState.score}<small>分</small></div>
      <div class="rh-grade">${pass ? '🎉' : '💪'} ${grade}</div>
      <div class="rh-meta">
        <span>${paper.icon} ${paper.name}</span>
        <span>答对 ${examState.correct} / ${paper.questions.length} 题</span>
        <span>用时 ${mm} 分 ${ss} 秒</span>
        <span>及格线 ${paper.passScore} 分</span>
      </div>
      <div class="rh-actions">
        <button class="rh-btn" id="retakeBtn">🔄 再考一次</button>
        <button class="rh-btn ghost" id="backListBtn">返回考试中心</button>
      </div>
    </div>
    <div class="page-header"><h1>📖 逐题复盘</h1><p>重点看<b>错题</b>——每一道错题都对应八股文里的一个必背考点。</p></div>
    ${paper.questions.map((q, qi) => {
      const chosen = examState.answers[qi];
      const ok = chosen === q.answer;
      return `
      <div class="block-card exam-restore ${ok ? 'ok' : 'bad'}">
        <div class="quiz-q">
          <span class="q-no">${ok ? '✅' : '❌'} Q${qi + 1}</span>
          <span class="q-type">${q.topic}</span>${q.q}
        </div>
        <div class="pq-options static">
          ${q.options.map((opt, oi) => {
            let cls = 'pq-opt';
            if (oi === q.answer) cls += ' correct';
            else if (oi === chosen) cls += ' wrong';
            return `<div class="${cls}">${String.fromCharCode(65 + oi)}. ${opt}${oi === chosen ? ' ← 你的答案' : ''}${oi === q.answer ? ' ✓ 正确' : ''}</div>`;
          }).join('')}
        </div>
        <div class="pq-explain show">💡 ${q.explain}</div>
      </div>`;
    }).join('')}
  `;

  document.getElementById('retakeBtn').addEventListener('click', () => {
    examState = { paperId: paper.id, answers: {}, startTs: Date.now(), submitted: false };
    renderExamRunning();
    window.scrollTo({ top: 0 });
  });
  document.getElementById('backListBtn').addEventListener('click', () => {
    examState = null;
    renderExam();
    window.scrollTo({ top: 0 });
  });
}

/* ---------------- 路由与导航 ---------------- */

/* ---- 视图：成就勋章中心 ---- */
function renderAchievements() {
  const stats = buildStats();
  const unlocked = allAchievements.filter(a => store.achievements[a.id]);
  const total = allAchievements.length;
  const pct = Math.round(unlocked.length / total * 100);
  const tierStyle = { '铜': 'tier-bronze', '银': 'tier-silver', '金': 'tier-gold', '钻石': 'tier-diamond' };
  const hiddenUnlocked = unlocked.filter(a => a.hidden).length;

  // 即将达成：只提示常规成就（隐藏成就不剧透）
  const nextUp = allAchievements
    .filter(a => !a.hidden && !store.achievements[a.id])
    .slice(0, 3);

  content.innerHTML = `
    <div class="page-header">
      <h1>🏆 成就勋章中心 · ${unlocked.length}/${total}</h1>
      <p>学习行为自动触发勋章解锁：<b>读章节、答测验、刷算法、过易错、考模拟、读专栏</b>都有对应成就。解锁瞬间右下角弹 medal 通知，集齐「全栈毕业礼」钻石勋章 = 完成整条学习闭环。另外——听说这里还藏着 <b>${achievementStats.hiddenTotal} 枚没人告诉你怎么解锁的隐藏成就</b>${hiddenUnlocked ? `，你已挖出 <b>${hiddenUnlocked}</b> 枚` : '，多点点、多试试，彩蛋无处不在 🔍'}。</p>
      <div class="ach-progress-wrap">
        <div class="ach-progress-bar"><div class="ach-progress-fill" style="width:${pct}%"></div></div>
        <span class="ach-progress-label">${pct}%</span>
      </div>
      ${nextUp.length ? `<div class="ach-nextup">🎯 即将达成：${nextUp.map(a => `${a.icon} <b>${a.name}</b>（${a.desc}）`).join('　·　')}</div>` : ''}
    </div>

    ${achievementSeries.map(series => {
      const isHiddenSeries = series.key === 'hidden';
      const list = allAchievements.filter(a => a.series === series.key);
      const got = list.filter(a => store.achievements[a.id]).length;
      if (isHiddenSeries && got === 0) {
        return `
        <div class="ach-series ach-series-mystery">
          <div class="ach-series-head">
            <span class="ach-series-dot" style="background:${series.color}"></span>
            <h3>？？？ 隐藏成就</h3>
            <span class="ach-series-count">0/${list.length}</span>
          </div>
          <div class="ach-mystery-hint">🕵️ 这里有 <b>${list.length}</b> 枚神秘勋章沉睡在网站的角落里。它们不会告诉你解锁条件——像真正的彩蛋一样，需要你自己去发现。提示只有一句：<b>保持好奇心，多和页面互动。</b></div>
        </div>`;
      }
      return `
      <div class="ach-series">
        <div class="ach-series-head">
          <span class="ach-series-dot" style="background:${series.color}"></span>
          <h3>${series.name}</h3>
          <span class="ach-series-count">${got}/${list.length}</span>
        </div>
        <div class="ach-grid">
          ${list.map(a => {
            const ok = !!store.achievements[a.id];
            if (a.hidden && !ok) {
              // 未解锁的隐藏成就：完全保密
              return `
              <div class="ach-medal locked ach-medal-secret">
                <div class="am-icon">❓</div>
                <div class="am-name">？？？</div>
                <div class="am-tier">隐藏</div>
                <div class="am-desc">条件保密，自己探索</div>
              </div>`;
            }
            const desc = a.hidden ? `🎁 ${a.hint}` : a.desc;
            return `
            <div class="ach-medal ${ok ? 'unlocked' : 'locked'} ${ok ? tierStyle[a.tier] : ''} ${a.hidden ? 'ach-medal-hidden' : ''}" title="${desc}">
              <div class="am-icon">${ok ? a.icon : '🔒'}</div>
              <div class="am-name">${a.name}</div>
              <div class="am-tier">${a.tier}</div>
              <div class="am-desc">${desc}</div>
              ${ok ? `<div class="am-date">🏅 ${new Date(store.achievements[a.id]).toLocaleDateString()} 解锁</div>` : ''}
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('')}
    <div class="callout callout-tip"><b>💡 刷成就小技巧：</b>「夜猫子工程师」要在凌晨 0~5 点答题；「十连精通」找一组 ≥5 题的测验全对；「全栈毕业礼」需要集齐其它全部常规勋章——按「知识清单」的顺序推进，成就自然一路点亮。<b>隐藏成就不列入毕业礼条件</b>，纯属给探索者的浪漫。</div>
  `;
}

/* ---- 视图：易错提醒中心 ---- */
let alertGroupFilter = 'all';
let flashState = null;   // { items: [...alert], idx, correct, wrong }

function renderAlerts() {
  const groups = [{ key: 'all', name: '全部' }, ...alertGroups];
  const shown = alertGroupFilter === 'all' ? mistakeAlerts : mistakeAlerts.filter(a => a.group === alertGroupFilter);
  const readCount = Object.keys(store.alertsShown).length;

  if (flashState) { renderFlashCards(); return; }

  content.innerHTML = `
    <div class="page-header">
      <h1>⚡ 易错点提醒 · ${alertStats.total} 条防坑速查</h1>
      <p>每条都是<b>「错误认知 → 正确真相 → 常见场景」</b>三段式。这些坑在真实项目和面试里出现率极高——刷题前扫一遍，能避开 80% 的低级错误。你看页面时右下角也会不定期弹出提醒（已看过 ${Math.min(readCount, alertStats.total)}/${alertStats.total} 条）。</p>
      <div class="alert-toolbar">
        ${groups.map(g => `<button class="tf-btn ${alertGroupFilter === g.key ? 'active' : ''}" data-group="${g.key}">${g.name}${g.key !== 'all' ? ` (${alertStats.byGroup[g.key] || 0})` : ''}</button>`).join('')}
      </div>
      <div class="alert-actions">
        <button class="alert-quiz-btn" id="startFlash">🎴 随机闪卡小测（8 题模式）</button>
      </div>
    </div>

    ${shown.map(a => {
      const g = alertGroups.find(x => x.key === a.group);
      return `
      <div class="block-card alert-card" id="${a.id}">
        <div class="alert-head">
          <span class="alert-icon">${a.icon}</span>
          <div class="alert-title-wrap">
            <span class="alert-group-chip" style="background:${g.color}1a;color:${g.color}">${g.name}</span>
            <h3>${a.title}</h3>
          </div>
          ${store.alertsShown[a.id] ? '<span class="alert-seen">👁 已弹出过</span>' : ''}
        </div>
        <div class="alert-row wrong-row"><span class="ar-tag">❌ 错误认知</span>${a.wrong}</div>
        <div class="alert-row right-row"><span class="ar-tag">✅ 正确真相</span>${a.right}</div>
        <div class="alert-row scene-row"><span class="ar-tag">🎬 常见场景</span>${a.scene}</div>
      </div>`;
    }).join('')}
  `;

  content.querySelectorAll('.tf-btn[data-group]').forEach(btn => {
    btn.addEventListener('click', () => { alertGroupFilter = btn.dataset.group; renderAlerts(); });
  });
  const flashBtn = document.getElementById('startFlash');
  if (flashBtn) flashBtn.addEventListener('click', startFlashCards);
}

// 随机闪卡小测：从提醒库里抽 8 条，遮住正确答案让用户判断
function startFlashCards() {
  const shuffled = [...mistakeAlerts].sort(() => Math.random() - 0.5).slice(0, 8);
  flashState = { items: shuffled.map(a => ({ alert: a, guessed: null })), idx: 0, correct: 0, wrong: 0, startTs: Date.now() };
  renderFlashCards();
}

function renderFlashCards() {
  const card = flashState.items[flashState.idx];
  const alert = card.alert;
  const answered = card.guessed !== null;
  const isRight = answered && card.guessed === true;

  content.innerHTML = `
    <div class="flash-wrap">
      <div class="flash-progress">
        <div class="flash-fill" style="width:${flashState.idx / flashState.items.length * 100}%"></div>
        <span class="flash-label">第 ${flashState.idx + 1} / ${flashState.items.length} 题 · 对 ${flashState.correct} 错 ${flashState.wrong}</span>
      </div>
      <div class="flash-card">
        <div class="flash-q-label">以下说法是<b>对的</b>还是<b>错的</b>？</div>
        <div class="flash-q">"${flashState.idx % 2 === 0 ? card.alert.wrong : card.alert.right}"</div>
        <div class="flash-q-src">— 关于「${card.alert.title}」（${alertGroups.find(g => g.key === card.alert.group).name}）</div>
        ${!answered ? `
          <div class="flash-btns">
            <button class="flash-btn fb-right" data-guess="1">✅ 这是对的</button>
            <button class="flash-btn fb-wrong" data-guess="0">❌ 这是错的</button>
          </div>` : `
          <div class="flash-result ${isRight ? 'fr-ok' : 'fr-bad'}">
            <b>${isRight ? '🎉 判断正确！' : '💥 判断错误！'}</b>
            <div class="flash-truth">题面陈述是「${flashState.idx % 2 === 0 ? card.alert.wrong : card.alert.right}」——它是${flashState.idx % 2 === 0 ? '正确' : '错误'}的。</div>
            <div class="flash-explain">✅ 记住这条：${card.alert.right}</div>
          </div>
          <button class="flash-next" id="flashNext">${flashState.idx + 1 >= flashState.items.length ? '🏁 查看小测成绩' : '下一题 →'}</button>
        `}
      </div>
      <button class="flash-exit" id="flashExit">退出小测</button>
    </div>
  `;

  if (answered) {
    const nextBtn = document.getElementById('flashNext');
    nextBtn.addEventListener('click', () => {
      flashState.idx++;
      if (flashState.idx >= flashState.items.length) { finishFlash(); return; }
      renderFlashCards();
    });
  } else {
    content.querySelectorAll('.flash-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const guess = btn.dataset.guess === '1';
        const truth = flashState.idx % 2 === 0;   // 题面偶数序=正确陈述，奇数序=错误陈述
        card.guessed = guess === truth;
        if (card.guessed) flashState.correct++; else flashState.wrong++;
        const key = 'flash-' + card.alert.id + '-' + flashState.startTs;
        store.flashCards[key] = card.guessed;
        if (!card.guessed) { store.someWrongBefore = true; store.wrongCount = (store.wrongCount || 0) + 1; }
        store.touchedZones = store.touchedZones || {};
        store.touchedZones.flash = true;   // 足迹：闪卡
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) store.answeredAtNight = true;
        saveStore();
        renderFlashCards();
        checkAchievements();
      });
    });
  }
  const exitBtn = document.getElementById('flashExit');
  if (exitBtn) exitBtn.addEventListener('click', () => { flashState = null; renderAlerts(); });
}

function finishFlash() {
  const total = flashState.items.length;
  const score = flashState.correct;
  const rate = Math.round(score / total * 100);
  if (score === total && total >= 8) {           // 彩蛋：闪卡全对 →「透视之眼」
    store.flashPerfect = (store.flashPerfect || 0) + 1;
    saveStore();
    awardCoins(COIN_RULES.flash, '闪卡全对');        // 全对 → 金币
    checkAchievements();
  }
  const comment = rate >= 90 ? '防坑意识一流，面试官的陷阱题对你无效' : rate >= 60 ? '还有几个坑要填，回到上方速查表重点看错的那几条' : '建议把这 8 条的原文再读一遍——踩坑往往从"我以为"开始';
  content.innerHTML = `
    <div class="flash-done">
      <div class="fd-score">${score}<small>/${total}</small></div>
      <div class="fd-comment">${comment}</div>
      <div class="fd-actions">
        <button class="alert-quiz-btn" id="flashAgain">🔄 再来一轮</button>
        <button class="flash-exit" id="flashBack">返回提醒列表</button>
      </div>
    </div>`;
  document.getElementById('flashAgain').addEventListener('click', startFlashCards);
  document.getElementById('flashBack').addEventListener('click', () => { flashState = null; renderAlerts(); });
}

/* ---------------- 路由与导航 ---------------- */
function buildChapterNav() {
  const nav = document.getElementById('chapterNav');
  nav.innerHTML = allChapters.map(c =>
    `<a class="nav-item" data-tab="${c.id}" href="#${c.id}">
      <span class="nav-icon">${c.icon}</span>
      <span class="nav-text">${c.title.replace(/ · /g, ' · ')}</span>
      <span class="done-check"></span>
    </a>`).join('');
}

let currentTab = 'home';

function switchTab(tab, scroll = true) {
  currentTab = tab;
  if (tab === 'home') renderHome();
  else if (tab === 'quiz') renderQuiz();
  else if (tab === 'algo') renderAlgo();
  else if (tab === 'roadmap') renderRoadmap();
  else if (tab === 'syllabus') renderSyllabus();
  else if (tab === 'baguwen') renderBaguwen();
  else if (tab === 'topics') renderTopics();
  else if (tab === 'companies') renderCompanies();
  else if (tab === 'pitfalls') renderPitfalls();
  else if (tab === 'exam') renderExam();
  else if (tab === 'achievements') renderAchievements();
  else if (tab === 'summon') renderSummon();
  else if (tab === 'alerts') renderAlerts();
  else renderChapter(tab);

  // 首页之外的页面小概率弹出易错提醒（成就中心/提醒中心不重复弹）
  if (tab !== 'home' && tab !== 'alerts') maybeAlertToast();

  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('active', el.dataset.tab === tab));

  closeMobileMenu();
  if (scroll) {
    content.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

/* 事件委托：data-tab 跳转 + 代码复制 + QA 展开 */
document.addEventListener('click', e => {
  // 代码复制
  const copyBtn = e.target.closest('.code-copy');
  if (copyBtn) {
    e.preventDefault();
    const code = copyBtn.dataset.code;
    const done = () => { copyBtn.textContent = '✓ 已复制'; setTimeout(() => copyBtn.textContent = '复制代码', 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(done).catch(() => fallbackCopy(code, done));
    } else fallbackCopy(code, done);
    return;
  }
  // QA 展开
  const qaBtn = e.target.closest('.qa-toggle');
  if (qaBtn && !qaBtn.classList.contains('hint-ctrl') && !qaBtn.classList.contains('sol-ctrl')) {
    e.preventDefault();
    const ans = qaBtn.nextElementSibling;
    const open = ans.classList.toggle('open');
    qaBtn.textContent = open ? '▼ 收起思路' : '▶ 查看参考思路';
    return;
  }
  // 导航跳转
  const navEl = e.target.closest('[data-tab]');
  if (navEl) {
    e.preventDefault();
    switchTab(navEl.dataset.tab);
    history.replaceState(null, '', '#' + navEl.dataset.tab);
  }
});

function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
  document.body.removeChild(ta);
}

/* 移动端菜单 */
const sidebar = document.getElementById('sidebar');
const mask = document.getElementById('mobileMask');
function closeMobileMenu() { sidebar.classList.remove('show'); mask.classList.remove('show'); }
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
  sidebar.classList.toggle('show');
  mask.classList.toggle('show');
});
mask.addEventListener('click', closeMobileMenu);

/* 重置进度 */
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('确定要清空所有学习进度、测验答案、易错点测试、考试成绩、做题记录和已解锁的成就勋章吗？')) {
    store = { doneChapters: [], quizAnswers: {}, algoOpens: {}, pitfallAnswers: {}, examResults: {}, achievements: {}, alertsShown: {}, flashCards: {}, examMeta: {}, logoClicks: 0, wrongCount: 0, flashPerfect: 0, fastPassExam: 0, touchedZones: {}, coins: 0, collection: {}, summonLog: [], bonds: {}, welfareTs: 0, furnaceLog: [] };
    multiSelectState = {};
    examState = null;
    flashState = null;
    saveStore();
    switchTab(currentTab, false);
    updateProgress();
    updateNavBadge();
  }
});

/* hash 路由 */
window.addEventListener('hashchange', () => {
  const tab = location.hash.replace('#', '') || 'home';
  if (tab !== currentTab) switchTab(tab);
});

/* 启动：优先从后端 API（数据库）取数，取不到时回退到随包发布的静态 JSON。
   这样本地连后端走数据库，线上纯静态部署也能完整使用（数据为发布时的快照）。 */
async function bootstrap() {
  content.innerHTML = '<div class="loading">⏳ 正在加载教程数据…</div>';
  const map = {};
  const src = {};          // 每个数据名的来源：api / static / null
  let failed = 0;

  async function fetchData(name) {
    // 1) 后端 API
    try {
      const res = await fetch(`${API_BASE}/data/${name}`);
      if (res.ok) {
        const j = await res.json();
        // 后端对缺失记录返回 []，遇到空数组继续尝试静态文件
        if (j !== null && !(Array.isArray(j) && j.length === 0)) { src[name] = 'api'; return j; }
      }
    } catch (e) { /* 后端不可用 → 走静态兜底 */ }
    // 2) 随包静态文件（public/data/*.json，构建后位于 dist/data/）
    try {
      const res2 = await fetch(`./data/${name}.json`);
      if (res2.ok) { src[name] = 'static'; return await res2.json(); }
    } catch (e) { /* 都不可用 */ }
    src[name] = null;
    return null;
  }

  await Promise.all(DATA_NAMES.map(async (name) => {
    const j = await fetchData(name);
    map[name] = (j === undefined ? null : j);
    if (src[name] === null) failed++;
  }));
  const staticCount = Object.values(src).filter(v => v === 'static').length;
  // 按名字显式赋值（不用位置解构）：新增数据名时不会让后续变量整体错位一位
  // —— 曾因 DATA_NAMES 新增 syllabusDetails 而未同步解构列表，导致 topicsNetworkOS /
  //    mistakeAlerts / companyQuestions 全部错位成别的数据，改动此处请保持按名字赋值。
  chaptersPart1      = map['chaptersPart1']      || [];
  chaptersPart2      = map['chaptersPart2']      || [];
  chaptersPart3      = map['chaptersPart3']      || [];
  algorithmProblems  = map['algorithmProblems']  || [];
  quizSections       = map['quizSections']       || [];
  syllabusModules    = map['syllabusModules']    || [];
  syllabusStats      = map['syllabusStats']      || {};
  syllabusDetails    = map['syllabusDetails']    || {};   // 单元详解（对象，缺失时展开降级提示）
  baguwenCategories  = map['baguwenCategories']  || [];
  baguwenStats       = map['baguwenStats']       || {};
  pitfallDays        = map['pitfallDays']        || [];
  pitfallStats       = map['pitfallStats']       || {};
  examPapers         = map['examPapers']         || [];
  examStats          = map['examStats']          || {};
  topicsNetworkOS    = map['topicsNetworkOS']    || [];
  topicsMySQLRedis   = map['topicsMySQLRedis']   || [];
  topicsCollections  = map['topicsCollections']  || [];
  companyQuestions   = map['companyQuestions']   || [];
  companyStats       = map['companyStats']       || {};
  achievements       = map['achievements']       || [];
  hiddenAchievements = map['hiddenAchievements'] || [];
  allAchievements    = map['allAchievements']    || [];
  achievementSeries  = map['achievementSeries']  || [];
  achievementStats   = map['achievementStats']   || {};
  mistakeAlerts      = map['mistakeAlerts']      || [];
  alertGroups        = map['alertGroups']        || [];
  alertStats         = map['alertStats']         || {};
  // 召唤卡池（对象）：DB 缺失时用最小兜底配置，避免页面崩溃
  summonPool         = map['summonPool']         || FALLBACK_SUMMON_POOL;
  allChapters = [...chaptersPart1, ...chaptersPart2, ...chaptersPart3];
  allBlocks = [...allChapters];
  totalUnits = allChapters.length;

  if (failed > 0) {
    const bar = document.createElement('div');
    bar.className = 'data-warn';
    bar.textContent = `⚠️ 有 ${failed} 项数据未能加载：后端 API 与内置静态文件都没有这份数据。已显示其余可用内容（见 README）。`;
    document.body.appendChild(bar);
  } else if (staticCount > 0) {
    // 线上静态部署的正常状态：不是错误，只是提示数据来自发布时快照
    const bar = document.createElement('div');
    bar.className = 'data-warn data-warn-static';
    bar.textContent = `📦 当前使用随包内置的静态数据（${staticCount} 项，未连接后端）：功能完整可用，学习进度保存在本机浏览器。`;
    document.body.appendChild(bar);
    setTimeout(() => bar.remove(), 6000);
  }
  buildChapterNav();
  updateProgress();
  const initial = location.hash.replace('#', '') || 'home';
  switchTab(initial);
  updateCoinDisplay();
}

bootstrap();

/* 优化：阅读进度条 + 返回顶部（页面级滚动，rAF 节流） */
(function initScrollEnhance() {
  const bar = document.createElement('div');
  bar.className = 'read-progress';
  bar.innerHTML = '<div class="read-progress-fill"></div>';
  document.body.appendChild(bar);
  const fill = bar.firstChild;

  const back = document.createElement('button');
  back.className = 'back-top';
  back.type = 'button';
  back.setAttribute('aria-label', '返回顶部');
  back.title = '返回顶部';
  back.textContent = '↑';
  document.body.appendChild(back);

  let ticking = false;
  function update() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    fill.style.width = p + '%';
    back.classList.toggle('show', doc.scrollTop > 600);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  update();
})();

/* 彩蛋：连点左上角 Logo 7 次 → 隐藏成就「咖啡的 secret 配方」 */
(function initLogoEgg() {
  const logo = document.querySelector('.topbar .brand');
  if (!logo) return;
  logo.addEventListener('click', () => {
    store.logoClicks = (store.logoClicks || 0) + 1;
    if (store.logoClicks <= 7) saveStore();
    if (store.logoClicks === 7) checkAchievements();   // 第 7 次触发判定
  });
})();
