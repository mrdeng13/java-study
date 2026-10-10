# Simple HTML 模板

## 简介

Simple HTML 是一个简单的项目模板，适用于快速创建静态页面和展示页面。

## 技术栈

- **类型**：简单项目
- **技术栈**：原生 HTML + CSS + Vite 5
- **用途**：简单静态页面、展示页面

## 特点

- ✅ 最小依赖（仅 Vite）
- ✅ 快速启动
- ✅ HMR Bridge 已集成（JavaScript 版本）
- ✅ Vite 配置预置

## 使用方法

### 通过 API 使用

```bash
# 从模板创建项目
curl -X POST http://localhost:4000/api/templates/scaffold \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "simple-html",
    "projectId": "my-simple-page",
    "projectName": "My Simple Page"
  }' | jq
```

### 在代码中使用

```typescript
import { scaffoldFromTemplate } from '@/lib/template-manager';

// 创建 Simple HTML 项目
const result = await scaffoldFromTemplate('simple-html', {
  projectId: 'my-simple-page',
  workspacePath: '/path/to/workspace',
  projectName: 'My Simple Page',
});

if (result.success) {
  console.log('✅ 项目创建成功:', result.projectPath);
} else {
  console.error('❌ 创建失败:', result.message);
}
```

### 在 Claude Code 中使用（自动）

用户只需输入需求，Claude Code 会自动选择合适的模板创建项目：

```
用户："创建一个简单的 Hello World 页面"
→ Claude Code 自动使用 simple-html 模板
```

## 项目结构

```
simple-html/
├── template.json          # 模板元数据（必需）
├── package.json           # 项目依赖配置
├── vite.config.js         # Vite 配置（必须包含 host & allowedHosts）
├── index.html             # HTML 入口
└── src/                   # 源代码目录
    ├── hmr-bridge.js      # HMR Bridge（必需，JavaScript 版本）
    └── ...                # 其他源文件
```

## template.json 配置

```json
{
  "id": "simple-html",
  "name": "Simple HTML + Vite",
  "description": "简单的 HTML 项目，使用 Vite 作为开发服务器",
  "type": "simple",
  "version": "1.0.0",
  "dependencies": {},
  "devDependencies": {
    "vite": "^5.4.2"
  },
  "features": [
    "原生 HTML + CSS",
    "Vite 开发服务器",
    "HMR Bridge",
    "最小依赖",
    "快速启动"
  ],
  "port": 8000,
  "keywords": ["html", "simple", "static"]
}
```

## 开发

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 注意事项

- Vite 配置必须包含 `host: true` 和 `allowedHosts: true` 配置
- HMR Bridge 文件位于 `src/hmr-bridge.js`（JavaScript 版本）
- 这是一个最小化模板，仅包含必要的依赖

---

## 后端数据服务（Spring Boot + MySQL）

本站点的教程数据已迁移到 MySQL，由 Spring Boot 后端通过 `/api/data/{name}` 提供，前端在启动时会异步拉取全部数据。

### 环境要求
- JDK 17（已验证路径：`/f/jdk/jdk-17.0.14`）
- MySQL 8.x，账户 `root` / `123456`，需先创建数据库 `java_tutorial`
- 数据库初始化脚本：`db/seed.sql`（含建表 + 26 条数据）

### 启动后端
```bash
# 1. 建库并灌入数据（首次）
mysql -uroot -p123456 < db/seed.sql

# 2. 编译（仅首次或改了 Java 代码时需要）
bash scripts/build-backend.sh

# 3. 启动（默认 8080 端口）
bash scripts/run-backend.sh
```

后端启动后：
- 健康检查：`GET http://localhost:8080/api/health` → `OK`
- 数据列表：`GET http://localhost:8080/api/data` → 所有数据名
- 单个数据：`GET http://localhost:8080/api/data/{name}` → 对应 JSON

> 前端通过 Vite 代理（`vite.config.js` 中 `/api` → `http://localhost:8080`）访问后端，无需处理跨域。若后端未启动，页面顶部会显示黄色提示条，并仅渲染已可用的内容。
> 数据记录共 **28** 条（26 条教程数据 + `summonPool` 召唤卡池 + `syllabusDetails` 知识清单单元详解）。

## 云端进度同步（学习进度落库）

默认进度只存浏览器 `localStorage`。若想进度写进你自己的 MySQL、换设备也能找回：

1. 后端新增了进度读写接口：`GET /api/progress?user=<名>`、`POST /api/progress?user=<名>&passcode=<口令>`（body 为整份 store 的 JSON），数据落在 `java_tutorial.user_progress` 表，首次访问自动建表。
2. 线上是纯静态托管，浏览器碰不到 MySQL，需要把本机后端经**内网穿透**暴露到公网。详见 **[TUNNEL.md](TUNNEL.md)**（Cloudflare 临时隧道 / 稳定隧道两种方案）。
3. 站点右上角新增 **☁ 账号** 按钮：填 用户名 / 口令（= `backend/src/main/resources/application.properties` 里的 `app.passcode`）/ 服务器地址（隧道 URL，本机调试留空），保存后即自动双向同步，后端不可达时静默降级为本机存储。

> 安全提示：`app.passcode` 是共享口令，只为挡住陌生人乱写；不用时关掉隧道 / 后端即可下线，且不要让 MySQL 的 3306 直接暴露公网。

---

## 金币召唤系统（学习激励）

学习行为产出**金币**，金币用于召唤收藏品。当前卡池共 **1728 件**：武将 753 / 宝物 820 / 奇物 155。

### 金币产出规则

| 行为 | 金币 |
|---|---|
| 章节打卡 | +300 |
| 专栏读完 | +300 |
| 测验答对 | +200 |
| 易错点答对 | +50 |
| 算法研读（首次展开解析） | +150 |
| 模拟考试（每 1 分） | +15 |
| 考试及格（额外奖励） | +600 |
| 解锁成就 | +800 |
| 闪卡全对 | +300 |
| 羁绊集齐 | +2000 ~ +3600 |

> 常量集中在 `src/main.js` 的 `COIN_RULES`（已整体 ×10）；其中**答对一道题固定 +200**（非 ×10 后的 80）。
> 章节/专栏/算法仅在**首次**完成时计币，防重复刷；羁绊奖励由 `gen_summon_pool.py` 的 `BOND_REWARD_SCALE` 同步放大 ×10。

### 召唤

- **单抽 100** / **十连 900**（十连保底至少 1 张 3★）
- 权重：5★ 2% / 4★ 8% / 3★ 20% / 2★ 30% / 1★ 40%
- 重复返还金币：5★ +200 / 4★ +80 / 3★ +30 / 2★ +15 / 1★ +8

### 福利武将 / 宝物

**福利召唤**：每日 1 次，**免费**，从 24 件福利藏品中随机（关平、周仓、廖化、古锭刀、孔明灯…）。冷却 24 小时，按钮直接显示剩余时间。

### 加热炉

- 熔炼 **3 张重复藏品 + 200 金币**
- **U 级极品 8%**：12 位觉醒武将（【觉醒】武圣·关羽、卧龙·诸葛亮、无双·吕奉先…）
- **唯一品质 0.4%**：**刘菊** —— 全池唯一一张，绝版
- 未出货返还 120 金币
- U 级与唯一品质**不会**从常规池 / 十连保底中产出，只能靠加热炉炼出（已回归校验）

### 羁绊（12 组）

| 羁绊 | 成员 | 奖励 |
|---|---|---|
| 桃园三结义 | 刘备 · 关羽 · 张飞 | +2600 |
| 五虎上将 | 关羽 · 张飞 · 赵云 · 马超 · 黄忠 | +3600 |
| 江东双璧 | 孙策 · 周瑜 | +2000 |
| 卧龙凤雏 | 诸葛亮 · 庞统 | +2500 |
| 曹魏五子良将 | 张辽 · 徐晃 · 张郃 · 于禁 · 乐进 | +3400 |
| 河北四庭柱 | 颜良 · 文丑 · 张郃 · 高览 | +2800 |
| 蜀汉四相 | 诸葛亮 · 蒋琬 · 费祎 · 董允 | +3000 |
| 曹氏宗亲 | 夏侯惇 · 夏侯渊 · 曹仁 · 曹洪 | +2600 |
| 西凉铁骑 | 马超 · 马岱 · 庞德 | +2400 |
| 武圣双绝 | 青龙偃月刀 · 赤兔马 | +2200 |
| 乱世双璧 | 传国玉玺 · 太平要术 | +2400 |
| 卧龙三宝 | 八阵图 · 木牛流马 · 兵书二十四篇 | +2800 |

集齐成员自动发放（一次性），页面显示每组进度 `2/5`。

### 卡池维护

```bash
# 1. 编辑 scripts/gen_summon_pool.py（名单 / 羁绊 / 概率）
# 2. 重新生成并导入
python scripts/gen_summon_pool.py
mysql -uroot -p123456 java_tutorial < db/summon_pool.sql
# 3. 回归校验（U/唯一不漏出、羁绊成员完整）
python scripts/verify_summon_pool.py
```

> `db/seed.sql` 末尾已包含同一条 INSERT（幂等），重建数据库时自动带上卡池。

### 知识清单单元详解（点击展开）

「完整知识清单」页的每个学习单元**可点击展开**：给出该单元全部知识点的详细讲解（共 107 单元 / 437 条，含易错点与面试问法），并附「接入文章 / 工具」链接直达对应章节与测验。

- 内容由 `scripts/gen_syllabus_details.py` 生成（`scripts/syllabus_details_a/b.py` 是详解内容源），存数据库 `json_doc(name='syllabusDetails')`
- 改内容：编辑详解数据文件 → `python scripts/gen_syllabus_details.py` → `mysql -uroot -p123456 java_tutorial < db/syllabus_details.sql`
- 对齐方式：按「模块下标-单元下标」（`m1-u5`），生成时会与 `syllabusModules` 的单元前缀做一致性校验（告警不中断）

### 存档位置

localStorage `java-fullstack-progress-v1`：`coins` / `collection` / `summonLog` / `bonds` / `welfareTs` / `furnaceLog`，与学习进度共用一份存档，顶栏「↺ 重置」一并清空。

---

## 线上部署（静态版）

站点可以脱离本机后端独立运行：**构建时把数据库里的 28 份数据导出成静态 JSON 随包发布**，前端优先请求 `/api/data/*`（连后端时走数据库），取不到就自动回退到 `./data/*.json`。

### 发布步骤

```bash
# 1. 把数据库当前数据导出为静态 JSON（写入 public/data/）
python scripts/export_static_data.py

# 2. 构建（数据会被复制到 dist/data/）
npx vite build          # 或 node ./node_modules/vite/bin/vite.js build

# 3. 部署 dist/ 到任意静态托管（对象存储 / Vercel / Netlify / GitHub Pages 均可）
```

部署后页面顶部会有一条蓝色提示「当前使用随包内置的静态数据（N 项，未连接后端）」，6 秒后自动消失——这是**正常状态**，不是报错。

### 注意事项

| 项目 | 说明 |
|---|---|
| 数据时效性 | 线上用的是**发布那一刻的快照**。改了数据库后需要重新执行第 1、2 步再发布 |
| 学习进度 | 存浏览器 localStorage，**不跨设备同步**，换浏览器/清缓存会丢失 |
| 链接性质 | CloudStudio 沙箱链接适合分享与临时访问；要长期固定域名请自行托管到对象存储或 Vercel 等平台 |

### 部署到 GitHub Pages（免费 · 固定地址 · 可绑自己的域名）

仓库已内置自动部署工作流 `.github/workflows/deploy-pages.yml`，**推送到 main 即自动构建并发布**，不用手工传文件。

只需配置一次：

1. 在 GitHub 新建一个**空仓库**（不要勾选 README / .gitignore / License）
2. 在项目目录执行（替换成你的用户名和仓库名）：

```bash
git remote add origin https://github.com/<用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

3. 打开仓库 **Settings → Pages → Source**，选择 **GitHub Actions**

首次推送后 Actions 会自动跑一次，完成后地址固定为：

```
https://<用户名>.github.io/<仓库名>/
```

之后每次改动只要 `git push`，站点自动更新。

> **自定义域名**：Pages 设置里填入你的域名，再到域名服务商添加一条 CNAME 记录指向 `<用户名>.github.io` 即可。
> **其它平台**：`dist/` 是标准静态产物，同样可直接上传到腾讯云 COS 静态网站、Vercel、Netlify 等。

### 本地开发（连数据库）

保持原样：先启动后端（8080）再 `npm run dev`（8000），此时走的是 MySQL 实时数据，页面不会出现静态数据提示条。
