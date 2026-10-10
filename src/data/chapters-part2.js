// 课程内容 第 4-6 章：前端三件套 / MySQL 数据库 / Spring 后端框架

export const chaptersPart2 = [
  {
    id: 'ch4',
    icon: '🎨',
    title: '第 4 章 · 前端开发',
    subtitle: 'HTML/CSS/JavaScript 三件套 + ES6 + Vue 框架，够用就好的后端向前端课',
    blocks: [
      { t: 'p', html: 'Java 全栈工程师学前端的目标是：<b>能看懂、能修改、能调接口、能排错</b>，不需要像素级还原设计稿。本章按"够用就好"的深度讲解。' },

      { t: 'h', html: '4.1 HTML：网页的骨架' },
      { t: 'p', html: 'HTML（HyperText Markup Language）不是编程语言，是<b>标记语言</b>——用一堆"标签"告诉浏览器：这里是标题、这里是图片、这里是按钮。' },
      { t: 'code', lang: 'html', title: '一个完整但极简的网页', code: '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n    <meta charset="UTF-8">              <!-- 乱码救星，必须写 -->\n    <title>我的第一个网页</title>       <!-- 浏览器标签页标题 -->\n</head>\n<body>                                      <!-- 用户看到的内容都在 body 里 -->\n\n    <h1>这是一级标题</h1>\n    <h2>这是二级标题</h2>\n\n    <p>这是一个段落，可以写很长的文字。</p>\n\n    <a href="https://www.baidu.com">这是一个超链接</a>\n\n    <img src="cat.jpg" alt="图片加载失败时显示这句话" width="200">\n\n    <!-- 列表 -->\n    <ul>\n        <li>无序列表项 1</li>\n        <li>无序列表项 2</li>\n    </ul>\n\n    <!-- 表单：前后端交互的起点 -->\n    <form>\n        <input type="text" placeholder="请输入用户名">\n        <input type="password" placeholder="请输入密码">\n        <button type="submit">登录</button>\n    </form>\n\n    <!-- div 是万能容器，配合 CSS 排版全靠它 -->\n    <div class="card">\n        <span>span 是行内小容器</span>\n    </div>\n\n</body>\n</html>' },
      { t: 'tip', html: '<b>练习方法</b>：桌面新建 hello.html，用记事本写代码、双击用浏览器打开，改完刷新。5 分钟就能看到自己写的网页，这是成就感最快的一步。' },

      { t: 'h', html: '4.2 CSS：给骨架穿上衣服' },
      { t: 'p', html: 'CSS（层叠样式表）负责"长什么样"：颜色、大小、位置、布局。基本语法是"选择器 + 属性: 值"：' },
      { t: 'code', lang: 'css', title: 'CSS 核心语法', code: '/* 选择器：选中谁？{} 内：怎么改 */\np { color: #333; font-size: 16px; }        /* 标签选择器：所有 p */\n.card { background: white; border-radius: 8px; }  /* class 选择器，最常用 */\n#header { height: 60px; }                   /* id 选择器，唯一 */\n\n/* 布局神器 Flex：一行内横向排列并居中，背下来 */\n.nav {\n    display: flex;\n    justify-content: space-between;   /* 两端对齐 */\n    align-items: center;              /* 垂直居中 */\n    gap: 16px;                        /* 子元素间距 */\n}' },
      { t: 'p', html: '新手三种布局需求，全部用 flex 解决：' },
      { t: 'list', items: [
        '<b>水平居中</b>：<code>display:flex; justify-content:center;</code>',
        '<b>垂直居中</b>：<code>display:flex; align-items:center;</code>',
        '<b>水平垂直都居中</b>：两个都写。<b>老式 margin:auto + 各种 hack 可以全部忘掉</b>。',
      ]},

      { t: 'h', html: '4.3 JavaScript：让页面动起来' },
      { t: 'p', html: 'JS 是真正的编程语言（语法和 Java 很像，但它是动态弱类型），负责交互逻辑：点击按钮、发送请求、修改页面内容。' },
      { t: 'code', lang: 'javascript', title: 'JS 核心：变量、函数、DOM 操作、事件', code: '// 变量声明：const 优先，会重新赋值才用 let（var 已淘汰）\nconst name = "张三";\nlet count = 0;\n\n// 函数（箭头函数是主流写法）\nfunction add(a, b) { return a + b; }\nconst add2 = (a, b) => a + b;         // 等价简写\n\n// DOM：把 HTML 当对象树来操作\nconst btn = document.querySelector("#myBtn");   // 按 CSS 选择器找元素\nbtn.textContent = "点我";                        // 改文字\nbtn.style.color = "red";                         // 改样式\n\n// 事件：用户点了怎么办\nbtn.addEventListener("click", () => {\n    count++;\n    btn.textContent = "点了 " + count + " 次";\n});\n\n// 条件循环和 Java 几乎一样\nif (count >= 3) {\n    console.log("手速惊人");\n}\nfor (let i = 0; i < 5; i++) { console.log(i); }' },

      { t: 'h', html: '4.4 前后端交互的核心：fetch / axios 发请求' },
      { t: 'code', lang: 'javascript', title: '调用后端接口（全栈日常核心动作）', code: '// 原生 fetch 写法（浏览器自带）\nfetch("http://localhost:8080/api/users/1")\n    .then(res => res.json())            // 把响应体解析成 JS 对象\n    .then(data => {\n        console.log(data);              // {id: 1, name: "张三"}\n        document.querySelector("#name").textContent = data.name;\n    })\n    .catch(err => console.error("请求失败", err));\n\n// 现代项目更常用 axios 库（Vue/React 项目标配），支持拦截器\n// axios.get("/api/users/1").then(res => console.log(res.data));' },
      { t: 'warn', html: '<b>必懂概念：跨域（CORS）</b>：浏览器出于安全，默认禁止"网页 A 域名"的 JS 去请求"B 域名"的接口。前端 localhost:5173 请求后端 localhost:8080 就会跨域报错。解法是<b>后端配置 CORS 允许来源</b>（Spring 一个注解/配置搞定），开发期也可用 Vite 代理转发。记住：跨域是浏览器的限制，Postman 直连后端没有这个问题。' },

      { t: 'h', html: '4.5 ES6+ 现代语法速成（看懂 Vue 项目的门槛）' },
      { t: 'code', lang: 'javascript', title: 'ES6 六大高频特性', code: '// 1. 解构赋值：从对象/数组里直接取值\nconst user = { id: 1, name: "张三", age: 25 };\nconst { name, age } = user;         // name="张三", age=25\nconst [first, second] = [10, 20];   // first=10\n\n// 2. 模板字符串：拼接神器，反引号 + ${}\nconst msg = `用户 ${name} 今年 ${age} 岁`;   // 比 + 拼接清爽太多\n\n// 3. 展开运算符\nconst newArr = [...oldArr, 4, 5];       // 复制并追加（React 状态更新的基础）\nconst newUser = { ...user, age: 26 };   // 复制并覆盖 age\n\n// 4. 箭头函数（上面讲过）+ 默认参数\nconst greet = (name = "游客") => `你好, ${name}`;\n\n// 5. 数组高阶方法（后端 Stream 流的 JS 版，必须会！）\nconst nums = [1, 2, 3, 4, 5];\nnums.map(n => n * 2);              // [2,4,6,8,10] 每个元素加工\nnums.filter(n => n % 2 === 0);     // [2,4] 过滤\nnums.reduce((sum, n) => sum + n, 0); // 15 聚合求和\nnums.find(n => n > 3);             // 4 找第一个满足的\n\n// 6. async/await 异步（取代回调地狱，必会）\nasync function loadUser() {\n    try {\n        const res = await fetch("/api/users/1");\n        const data = await res.json();\n        console.log(data);\n    } catch (e) {\n        console.error(e);\n    }\n}' },

      { t: 'h', html: '4.6 Vue 3 框架：声明式渲染，告别手动改 DOM' },
      { t: 'p', html: '原生 JS 改页面要先找元素再改内容，页面一复杂就乱成一锅粥。Vue 的思路是<b>"数据变了，页面自动跟着变"</b>（响应式），开发者只管操作数据。' },
      { t: 'code', lang: 'html', title: 'Vue 3 组合式 API（当前主流写法）', code: '<div id="app">\n    <h1>{{ title }}</h1>                        <!-- {{ }} 插值：显示数据 -->\n    <input v-model="keyword" placeholder="搜索">  <!-- 双向绑定 -->\n    <p>你输入了：{{ keyword }}</p>\n\n    <ul>\n        <!-- v-for 列表渲染 -->\n        <li v-for="todo in filteredTodos" :key="todo.id">\n            <!-- v-on:click 简写 @click 绑定事件 -->\n            <span @click="todo.done = !todo.done"\n                  :style="{ textDecoration: todo.done ? \'line-through\' : \'none\' }">\n                {{ todo.text }}\n            </span>\n        </li>\n    </ul>\n    <p>待完成：{{ remaining }} 项</p>\n</div>\n\n<script type="module">\nimport { createApp, ref, computed } from \'vue\';\n\ncreateApp({\n    setup() {\n        const title = ref("我的待办清单");\n        const keyword = ref("");\n        // ref() 让数据变成响应式：数据变 → 页面自动更新\n        const todos = ref([\n            { id: 1, text: "学 Vue", done: false },\n            { id: 2, text: "学 Spring", done: true },\n        ]);\n        // computed 计算属性：依赖变了自动重算\n        const filteredTodos = computed(() =>\n            todos.value.filter(t => t.text.includes(keyword.value))\n        );\n        const remaining = computed(() => todos.value.filter(t => !t.done).length);\n\n        return { title, keyword, todos, filteredTodos, remaining };\n    }\n}).mount("#app");\n</script>' },
      { t: 'table', headers: ['Vue 指令', '作用', '例子'], rows: [
        ['{{ }}', '插值显示数据', '<code>{{ user.name }}</code>'],
        ['v-bind / :xxx', '绑定属性', '<code>:src="imgUrl"</code>'],
        ['v-model', '表单双向绑定', '<code>v-model="keyword"</code>'],
        ['v-on / @xxx', '绑定事件', '<code>@click="submit"</code>'],
        ['v-if / v-show', '条件显示', '<code>v-if="isLogin"</code>'],
        ['v-for', '列表循环', '<code>v-for="item in list"</code>'],
      ]},
      { t: 'tip', html: '<b>React 怎么办</b>：React 也是同样的思路（数据驱动视图），语法用 JSX。核心思想"组件化 + 状态驱动"两家一致，学会 Vue 后转 React 只需 1~2 周。国内 Vue 生态更普及，中小公司多用；大厂 React 略多。<b>先精通一个，另一个用到时再学</b>。' },
      { t: 'qa', q: '前端学到什么程度可以开始学后端了？', a: '达成以下标准即可：① 能手写 HTML 表单页并用 CSS flex 排版；② 会用 JS 的 map/filter/解构/async-await；③ 能用 Vue 完成一个"TodoList + 调用后端接口渲染列表"的小页面；④ 理解 v-model、v-for、组件 props。前端深度（性能优化、源码、打包工程化）放到后端学完后再补，面试后端岗时够用。' },
    ],
  },

  {
    id: 'ch5',
    icon: '🗄️',
    title: '第 5 章 · MySQL 数据库',
    subtitle: '数据的家：从安装到 SQL，再到索引、事务与设计范式',
    blocks: [
      { t: 'p', html: '程序一关机内存数据就没了，而用户数据必须永久保存——这件事交给<b>数据库</b>。MySQL 是全球最流行的开源关系型数据库，Java 后端的第一标配。<b>SQL 是你要学的所有技术里复用寿命最长的技能</b>，值得花 3 周练扎实。' },

      { t: 'h', html: '5.1 核心概念：库、表、行、列' },
      { t: 'info', html: '📚 <b>类比 Excel</b>：数据库（DB）= 一个 Excel 文件；表（Table）= 其中一张工作表；列（Column）= 表头（规定了每格存什么类型）；行（Row）= 一条完整记录。比如 user 表：列是 id、name、age、email；每一行是一个用户。' },
      { t: 'steps', items: [
        '安装：<b>MySQL 8.0</b> 官网下载安装包，或用 Docker 一条命令跑起来（推荐，第 8 章会学）；',
        '安装客户端：命令行能用，但推荐 <b>Navicat / DBeaver / IDEA 自带数据库面板</b>，可视化操作；',
        '记住默认端口 3306、root 密码；连接成功后创建练习库：<code>CREATE DATABASE demo;</code>',
        '官方练习数据：搜索 sakila 示例库导入，后续所有 SQL 在真实数据上练。',
      ]},

      { t: 'h', html: '5.2 SQL 第一梯队：增删改查（CRUD）' },
      { t: 'code', lang: 'sql', title: '建库建表（先认识数据类型）', code: '-- 建库并选中\nCREATE DATABASE demo DEFAULT CHARACTER SET utf8mb4;\nUSE demo;\n\n-- 建表\nCREATE TABLE user (\n    id          BIGINT PRIMARY KEY AUTO_INCREMENT,  -- 主键，自增\n    name        VARCHAR(50)  NOT NULL,              -- 变长字符串，必填\n    age         TINYINT      DEFAULT 0,             -- 小整数\n    email       VARCHAR(100) UNIQUE,                -- 唯一，不许重复\n    balance     DECIMAL(10,2) NOT NULL DEFAULT 0,   -- 金额必须用 DECIMAL！\n    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 常用类型速记：\n-- 整数 BIGINT/INT/TINYINT   小数 DECIMAL(总位数,小数位)\n-- 字符串 VARCHAR(长度)      长文本 TEXT\n-- 时间 DATETIME / DATE      布尔用 TINYINT(1)' },
      { t: 'code', lang: 'sql', title: 'INSERT 增 / DELETE 删 / UPDATE 改', code: '-- 增\nINSERT INTO user (name, age, email, balance)\nVALUES (\'张三\', 25, \'zhangsan@qq.com\', 100.00),\n       (\'李四\', 30, \'lisi@qq.com\', 250.50);\n\n-- 改（⚠️ 必须带 WHERE，否则全表被改！\nUPDATE user SET age = 26 WHERE name = \'张三\';\n\n-- 删（⚠️ 同上，先 SELECT 确认范围再 DELETE）\nDELETE FROM user WHERE id = 2;\n\n-- 生产环境更推荐"逻辑删除"：加一列 is_deleted，删除改成 UPDATE 置 1\n-- 数据可恢复、可审计，业务表几乎都这么设计' },
      { t: 'code', lang: 'sql', title: 'SELECT 查 —— 精华所在', code: '-- 基础查询\nSELECT * FROM user;                          -- 全表（生产禁用，列多的表很慢）\nSELECT id, name, balance FROM user WHERE age > 18;   -- 指定列 + 条件\n\n-- 常用 WHERE 条件\nWHERE age >= 18 AND age <= 30        -- 区间（等价 BETWEEN 18 AND 30）\nWHERE name LIKE \'张%\'                 -- 模糊：张开头（% 通配任意个字符）\nWHERE email IS NULL                   -- 判空用 IS NULL，不能写 = NULL\nWHERE id IN (1, 3, 5)                 -- 集合\n\n-- 排序 + 分页（列表页标配）\nSELECT * FROM user ORDER BY balance DESC, id ASC\nLIMIT 10 OFFSET 20;                   -- 按余额降序，跳过 20 条取 10 条（第 3 页）\n\n-- 聚合统计\nSELECT COUNT(*) FROM user;                        -- 总数\nSELECT AVG(age), MAX(balance), MIN(balance) FROM user;\n\n-- 分组：每个年龄段有多少人，只看人数大于 10 的组\nSELECT age, COUNT(*) AS cnt\nFROM user\nGROUP BY age\nHAVING cnt > 10;                      -- HAVING 过滤分组结果（WHERE 过滤行）' },
      { t: 'warn', html: '<b>执行顺序面试题</b>：一条 SQL 的逻辑执行顺序是 FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT。所以 WHERE 里不能用 SELECT 的别名，HAVING 才是对分组后的结果过滤——理解了顺序，90% 的"为什么这里报错"都能自己推出答案。' },

      { t: 'h', html: '5.3 多表查询与 JOIN —— 面试必考' },
      { t: 'p', html: '真实业务数据分散在多张表（用户表、订单表、商品表），JOIN 负责把它们按关联字段拼起来。' },
      { t: 'code', lang: 'sql', title: 'JOIN 全家福', code: '-- 需求：查每个订单 + 下单人的名字（order 表有 user_id 关联 user 表）\n\n-- 内连接：只返回两边都能匹配上的行\nSELECT o.id AS order_id, o.amount, u.name\nFROM `order` o                              -- 给表起短别名\nINNER JOIN user u ON o.user_id = u.id;\n\n-- 左连接：左表全保留，右表匹配不上的填 NULL\n-- 需求：所有用户 + 他们的订单（没下过单的用户也要列出来）\nSELECT u.name, o.id AS order_id\nFROM user u\nLEFT JOIN `order` o ON o.user_id = u.id;\n\n-- 经典衍生：查"从没下过单"的用户 → 左连接后右表为空\nSELECT u.name\nFROM user u\nLEFT JOIN `order` o ON o.user_id = u.id\nWHERE o.id IS NULL;\n\n-- 子查询：查询余额高于平均值的用户\nSELECT name, balance FROM user\nWHERE balance > (SELECT AVG(balance) FROM user);' },
      { t: 'info', html: '<b>JOIN 记忆法</b>：INNER JOIN = 交集（两表都有才要）；LEFT JOIN = 左表全要，右表凑不齐补 NULL；RIGHT JOIN 反之（实际开发几乎都用 LEFT JOIN，表意更清晰）。' },

      { t: 'h', html: '5.4 数据库设计：三大范式与外键' },
      { t: 'list', items: [
        '<b>第一范式（1NF）</b>：每列不可再拆。如 address 存"浙江省杭州市西湖区"想按省统计 → 拆成 province / city / district 三列；',
        '<b>第二范式（2NF）</b>：非主键列必须完全依赖主键（联合主键时不能只依赖一半）；',
        '<b>第三范式（3NF）</b>：非主键列之间不能相互依赖。如订单表里存了 user_id 就不要再存 user_name（应该 JOIN 查），否则改名字要改 N 张表；',
        '<b>实际权衡</b>：互联网公司常"反范式"适度冗余（如订单表冗余一份商品快照名），用空间换查询性能，避免大表 JOIN。',
      ]},
      { t: 'p', html: '<b>表关系</b>：一对多（一个用户多个订单 → 订单表存 user_id 外键）；多对多（学生选课 → 中间表选课表存 student_id + course_id）；一对一（用户和详情 → 可合表或拆表）。<b>互联网实践：逻辑外键（只存 id，不建物理外键约束）</b>，避免外键带来的锁和性能负担，关联完整性由应用层保证。' },

      { t: 'h', html: '5.5 索引：让查询从 10 秒变 0.01 秒' },
      { t: 'info', html: '📖 <b>类比</b>：没有索引 = 在 500 页的书里一页页翻某个词（全表扫描）；有索引 = 先查书末尾的索引页，直接跳到对应页码。索引底层是 <b>B+ 树</b>：一种多叉排序树，树高 3~4 层即可支撑千万级数据，即"3~4 次磁盘 IO 定位任意一条数据"。' },
      { t: 'code', lang: 'sql', title: '索引操作与失效场景（高频面试）', code: '-- 建索引（对 WHERE、JOIN、ORDER BY 频繁用到的列）\nCREATE INDEX idx_user_name ON user(name);\nCREATE INDEX idx_order_userid_amount ON `order`(user_id, amount);  -- 联合索引\n\n-- 查看一条 SQL 走没走索引：EXPLAIN 是你的武器\nEXPLAIN SELECT * FROM user WHERE name = \'张三\';\n-- 看 type 列：const/ref 优秀，range 可接受，ALL = 全表扫描要优化\n-- 看 key 列：实际用到的索引名\n\n-- ⚠️ 索引失效的典型写法（背下来）\nWHERE YEAR(created_at) = 2024        -- 对索引列套函数 → 失效，改成范围查询\nWHERE name LIKE \'%三\'                 -- 前置 % → 失效（\'张%\' 可以走索引）\nWHERE phone = 13800138000            -- phone 是 VARCHAR 却传数字 → 隐式转换失效\nWHERE age + 1 = 20                   -- 列参与运算 → 失效\n-- 联合索引 (a,b,c) 遵循"最左前缀"：WHERE b=1 用不上，WHERE a=1 AND b=2 才行' },
      { t: 'warn', html: '<b>索引不是越多越好</b>：每个索引都是一棵要维护的 B+ 树，写入（INSERT/UPDATE）时要同步更新所有索引，拖慢写速度、占磁盘。原则：<b>读多写少的列建索引，一张表不超过 5~6 个，主键和唯一约束自动有索引</b>。' },

      { t: 'h', html: '5.6 事务：要么全成，要么全不做' },
      { t: 'info', html: '💸 <b>转账必须用事务</b>：A 给 B 转 100 元 = "A 减 100" + "B 加 100" 两步。如果第一步成功、第二步失败（断电/报错），钱就凭空消失了。事务保证这两步是<b>原子</b>的：要么都成功（COMMIT 提交），要么都回滚（ROLLBACK，像什么都没发生）。' },
      { t: 'code', lang: 'sql', title: '事务的基本用法', code: 'START TRANSACTION;                       -- 开启事务\n\nUPDATE account SET balance = balance - 100 WHERE id = 1;\nUPDATE account SET balance = balance + 100 WHERE id = 2;\n\nCOMMIT;      -- 两句都成功 → 提交，变更生效\n-- ROLLBACK; -- 任何一句失败 → 回滚，假装无事发生' },
      { t: 'p', html: '<b>事务四大特性（ACID，面试必背）</b>：' },
      { t: 'table', headers: ['特性', '全称', '一句话解释'], rows: [
        ['原子性 Atomicity', '要么全做，要么全不做', '转账两步是一个不可分割的整体'],
        ['一致性 Consistency', '事务前后数据完整性不被破坏', '转账前后总余额不变'],
        ['隔离性 Isolation', '并发事务之间互不干扰', '你在转账时别人查不到"减了没加"的中间态'],
        ['持久性 Durability', '提交后永久保存', 'COMMIT 后断电数据也在（靠 redo log）'],
      ]},
      { t: 'p', html: '<b>并发事务的问题与隔离级别</b>（进阶面试）：多个事务同时读写会引发"脏读（读到别人未提交的数据）、不可重复读（两次读结果不一样）、幻读（两次读行数不一样）"。MySQL 默认隔离级别是 <b>可重复读（REPEATABLE READ）</b>，配合 MVCC 多版本并发控制基本解决上述问题——面试能说出"脏读、可重复读、MVCC、锁"这些关键词即达标，深入学习可在工作后补。' },

      { t: 'h', html: '5.7 从 Java 连接数据库：JDBC 与连接池' },
      { t: 'code', lang: 'java', title: 'JDBC 原生操作（理解原理用，实际用框架）', code: '// JDBC 四步：加载驱动 → 建连接 → 执行 SQL → 处理结果\ntry (Connection conn = DriverManager.getConnection(\n        "jdbc:mysql://localhost:3306/demo", "root", "密码");\n     // ⚠️ PreparedStatement 预编译，防 SQL 注入！\n     PreparedStatement ps = conn.prepareStatement(\n        "SELECT id, name FROM user WHERE age > ?")) {\n\n    ps.setInt(1, 18);                        // 填充占位符 ?\n    try (ResultSet rs = ps.executeQuery()) {\n        while (rs.next()) {\n            System.out.println(rs.getLong("id") + " " + rs.getString("name"));\n        }\n    }\n}' },
      { t: 'warn', html: '<b>必懂安全漏洞：SQL 注入</b>：如果 SQL 用字符串拼接 <code>"... WHERE name = \'" + input + "\'"</code>，用户输入 <code>\' OR \'1\'=\'1</code> 就能绕过条件查全表甚至删库。<b>防御方法只有一个：永远用 PreparedStatement 占位符（?）传参</b>，绝不拼接。这是安全面试与代码审查的必考点。' },
      { t: 'p', html: '<b>连接池</b>：数据库连接的创建开销大（TCP 握手 + 认证），连接池（HikariCP、Druid）启动时建好 N 条连接反复借用归还——和线程池同一思想。<b>Spring Boot 默认集成 HikariCP，无需额外配置即可用</b>。' },
      { t: 'qa', q: 'MySQL 为什么用 B+ 树而不是哈希表或二叉树做索引？', a: '① 对比哈希表：哈希只能等值查询，不支持范围查询（WHERE age > 18）和排序，B+ 树叶子节点有序且串成链表，范围查询扫链表即可；② 对比二叉搜索树：数据量大时二叉树太高（千万数据约 23 层 = 23 次磁盘 IO），B+ 树矮胖（3~4 层），每层一次磁盘 IO，性能稳定；③ 对比 B 树：B+ 树非叶子节点不存数据只存索引，单页能放更多键，且数据全在叶子层，查询稳定。' },
      { t: 'qa', q: '聚簇索引和非聚簇索引的区别？什么是回表？', a: '聚簇索引（主键索引）：叶子节点直接存整行数据，InnoDB 表本身就是按主键组织的 B+ 树。非聚簇索引（二级索引，如 idx_name）：叶子节点存的是"索引列值 + 主键值"。用二级索引查到主键后，如果 SELECT 的列不在索引里，还要拿主键回聚簇索引再查一次整行——这就是<b>回表</b>。优化手段：把要查的列都放进联合索引（覆盖索引），一次查询搞定不回表，如索引 (name, age) 支撑 SELECT age WHERE name=...。' },
    ],
  },

  {
    id: 'ch6',
    icon: '🍃',
    title: '第 6 章 · 后端框架 Spring 全家桶',
    subtitle: 'Maven → Spring → Spring Boot → MyBatis：写出真实企业级项目的全套武器',
    blocks: [
      { t: 'p', html: '学完 Java SE 和 MySQL，你已经会"写代码"了；这一章让你学会"写项目"。<b>Spring 是 Java 后端的事实标准</b>，国内招聘 JD（职位描述）上的"精通 Spring/Spring Boot/MyBatis"指的就是这一章的内容。' },

      { t: 'h', html: '6.1 Maven：依赖与构建管理' },
      { t: 'p', html: '一个项目要用几十个第三方库（连接 MySQL 的驱动、JSON 工具……），手动下载 jar 包管理版本是灾难。Maven 解决两件事：<b>声明依赖自动下载</b> + <b>统一构建流程</b>（编译/测试/打包一条命令）。' },
      { t: 'code', lang: 'xml', title: 'pom.xml：Maven 的项目说明书', code: '<?xml version="1.0" encoding="UTF-8"?>\n<project>\n    <modelVersion>4.0.0</modelVersion>\n    <!-- 项目坐标：groupId+artifactId+version 唯一定位一个项目 -->\n    <groupId>com.example</groupId>\n    <artifactId>demo</artifactId>\n    <version>1.0.0</version>\n\n    <properties>\n        <java.version>17</java.version>\n    </properties>\n\n    <dependencies>\n        <!-- 声明依赖，Maven 自动从中央仓库下载 jar 包 -->\n        <dependency>\n            <groupId>com.mysql</groupId>\n            <artifactId>mysql-connector-j</artifactId>\n            <version>8.3.0</version>\n        </dependency>\n    </dependencies>\n</project>' },
      { t: 'list', items: [
        '<b>常用命令</b>：<code>mvn clean package</code> 打包成 jar；<code>mvn test</code> 跑测试；IDEA 里点鼠标即可；',
        '<b>依赖传递</b>：A 依赖 B，B 依赖 C，你引 A 就自动有 B 和 C；版本冲突时"路径最短优先"；',
        '<b>国内加速</b>：settings.xml 配置阿里云镜像，下载速度起飞；',
        'Gradle 是同类工具（Android 用得多），思想相同，Java 后端 Maven 仍是主流。',
      ]},

      { t: 'h', html: '6.2 Spring 核心：IoC 与 AOP' },
      { t: 'p', html: 'Spring 框架的两大基石，面试必考，先用大白话讲懂：' },
      { t: 'info', html: '🔧 <b>IoC（控制反转）/ DI（依赖注入）</b>：传统写法里对象自己 new 依赖：<code>UserService service = new UserService();</code>——你自己当"装配工"。Spring 说：把创建和装配的权力<b>反转</b>给框架！你只需声明"我需要一个 UserService"，Spring 容器自动创建好并塞给你。好处：对象单例复用、解耦（换实现类只改一行注解）、测试方便。' },
      { t: 'code', lang: 'java', title: '依赖注入的三种方式（推荐构造器注入）', code: '@Service                          // 告诉 Spring：这个类交给你管理（Bean）\npublic class UserService {\n\n    private final UserRepository userRepository;\n\n    // 构造器注入：Spring 自动把 UserRepository 的实例传进来\n    // （只有一个构造器时 @Autowired 可省略）\n    public UserService(UserRepository userRepository) {\n        this.userRepository = userRepository;\n    }\n\n    public User getUser(Long id) {\n        return userRepository.findById(id)\n                .orElseThrow(() -> new RuntimeException("用户不存在"));\n    }\n}\n// 常用声明注解：@Service 业务层 / @Component 通用 /\n// @Repository 数据层 / @Controller Web 层 —— 本质都是"注册为 Bean"' },
      { t: 'info', html: '🍰 <b>AOP（面向切面编程）</b>：日志、权限校验、事务这些逻辑横跨所有业务方法，在每个方法里重复写是灾难。AOP 把它们抽成"切面"，通过动态代理<b>在方法执行前后自动织入</b>。类比：快递员（业务方法）只管送件，安检扫描（切面）在仓库出入口统一自动进行，谁也逃不掉。' },
      { t: 'p', html: '你暂时不用手写 AOP，但必须知道：<b>@Transactional 事务、全局日志、权限校验，底层都是 AOP</b>。' },

      { t: 'h', html: '6.3 Spring Boot：约定优于配置，10 分钟起项目' },
      { t: 'p', html: '老 Spring 要写一堆 XML 配置。Spring Boot 的革命：<b>起步依赖（starter 一引一套）+ 自动配置 + 内嵌 Tomcat</b>，让"跑起一个 Web 服务"从半天变 10 分钟。' },
      { t: 'steps', items: [
        '打开 <b>start.spring.io</b>（或 IDEA 的 New Project → Spring Initializr）；',
        '选 Maven、Java 17、Spring Boot 3.x；',
        '勾选依赖：Spring Web、MySQL Driver、MyBatis Framework、Lombok、Validation；',
        'Generate 下载 zip → IDEA 打开 → 等依赖下载完；',
        '运行主类的 main 方法，控制台出现 Spring logo 即启动成功（默认端口 8080）！',
      ]},
      { t: 'code', lang: 'java', title: '一个最小的 Web 接口', code: '@RestController                  // = @Controller + @ResponseBody（返回 JSON）\n@RequestMapping("/api/users")    // 类级路径前缀\npublic class UserController {\n\n    private final UserService userService;\n    public UserController(UserService userService) {\n        this.userService = userService;\n    }\n\n    @GetMapping("/{id}")         // GET /api/users/1\n    public User getById(@PathVariable Long id) {   // 取路径参数\n        return userService.getUser(id);   // 返回对象自动序列化成 JSON\n    }\n\n    @PostMapping                 // POST /api/users，body 传 JSON\n    public User create(@RequestBody @Valid UserCreateDTO dto) {\n        return userService.create(dto);   // @RequestBody 把 JSON 转对象\n    }\n}' },

      { t: 'h', html: '6.4 三层架构：企业项目的标准骨架' },
      { t: 'p', html: '所有正规 Java 项目都长这样，<b>面试让你"介绍项目架构"就是答这个</b>：' },
      { t: 'code', lang: 'text', title: '请求流动路线（背下来）', code: '浏览器/APP 发起 HTTP 请求\n   ↓\nController 控制层      —— 接收请求、参数校验、调用服务、返回 JSON（不写业务逻辑！）\n   ↓\nService 服务层        —— 业务逻辑核心：判断、计算、事务（@Transactional 加在这）\n   ↓\nMapper/DAO 数据层     —— 只负责数据库读写，一条 SQL 一个方法\n   ↓\nMySQL 数据库\n\n目录结构：\nsrc/main/java/com/example/demo/\n├── controller/   UserController.java\n├── service/      UserService.java（接口）+ impl/UserServiceImpl.java\n├── mapper/       UserMapper.java\n├── entity/       User.java（对应数据库表）\n├── dto/          UserCreateDTO.java（接口入参）/ UserVO.java（接口出参）\n└── DemoApplication.java（启动类）' },
      { t: 'tip', html: '<b>为什么要分 DTO/Entity/VO</b>：Entity 对应数据库表结构，直接暴露给前端会泄露字段（如 password）且耦合。DTO（入参）和 VO（出参）是接口的"外壳"，隔离变化、保护敏感数据。小项目可先只建 Entity，但<b>规范意识要从小养成</b>。' },

      { t: 'h', html: '6.5 MyBatis：优雅地操作数据库' },
      { t: 'p', html: 'JDBC 太啰嗦（手动开连接、塞参数、遍历结果集），MyBatis 帮你把<b>"SQL 结果 → Java 对象"的映射全自动化</b>：你写 SQL（写在注解或 XML 里），它负责其余一切。' },
      { t: 'code', lang: 'java', title: 'MyBatis Mapper（注解版入门）', code: '@Mapper                          // 启动时生成实现类并注册为 Bean\npublic interface UserMapper {\n\n    @Select("SELECT * FROM user WHERE id = #{id}")\n    User findById(Long id);      // #{id} 自动取方法参数并防注入\n\n    @Select("SELECT * FROM user WHERE age > #{age} ORDER BY id DESC")\n    List<User> findByAgeGreaterThan(int age);\n\n    @Insert("INSERT INTO user(name, age, email) "\n          + "VALUES(#{name}, #{age}, #{email})")\n    @Options(useGeneratedKeys = true, keyProperty = "id")  // 回填自增 id\n    int insert(User user);\n\n    @Update("UPDATE user SET name = #{name} WHERE id = #{id}")\n    int updateName(User user);\n\n    @Delete("DELETE FROM user WHERE id = #{id}")\n    int deleteById(Long id);\n}\n// 复杂 SQL（动态条件、多表 JOIN）写 XML 映射文件，\n// <where>/<if> 标签支持"条件拼接"——工作后再深入，先用注解版跑通增删改查。' },
      { t: 'p', html: '<b>application.yml 配置</b>（连接数据库的必写项）：' },
      { t: 'code', lang: 'yaml', title: 'src/main/resources/application.yml', code: 'server:\n  port: 8080                 # 服务端口\n\nspring:\n  datasource:\n    url: jdbc:mysql://localhost:3306/demo?useUnicode=true&characterEncoding=utf8\n    username: root\n    password: 你的密码\n    driver-class-name: com.mysql.cj.jdbc.Driver' },

      { t: 'h', html: '6.6 RESTful API 设计规范' },
      { t: 'p', html: '前后端协作靠接口文档，RESTful 是最通用的接口风格：<b>URL 表示资源，HTTP 方法表示操作</b>。' },
      { t: 'table', headers: ['操作', '方法 + URL', '说明'], rows: [
        ['查列表', 'GET /api/users?page=1&size=10', '分页参数放查询串'],
        ['查单个', 'GET /api/users/1', 'id 放路径'],
        ['新建', 'POST /api/users', '数据放请求体 JSON'],
        ['全量更新', 'PUT /api/users/1', ''],
        ['删除', 'DELETE /api/users/1', ''],
      ]},
      { t: 'code', lang: 'json', title: '统一响应格式（团队协作的基础）', code: '// 成功\n{\n  "code": 0,\n  "message": "ok",\n  "data": { "id": 1, "name": "张三" }\n}\n// 失败\n{\n  "code": 40001,\n  "message": "用户名已存在",\n  "data": null\n}\n// 前端约定：code===0 才处理 data，否则弹 message —— 全公司接口风格统一' },

      { t: 'h', html: '6.7 全局异常处理 + 参数校验 + 事务（工程三件套）' },
      { t: 'code', lang: 'java', title: '写出"别人敢用"的接口', code: '// 1. 参数校验：DTO 上加注解，框架自动拦截非法参数\npublic class UserCreateDTO {\n    @NotBlank(message = "用户名不能为空")\n    private String name;\n    @Min(value = 1, message = "年龄不合法")\n    @Max(150)\n    private Integer age;\n    @Email(message = "邮箱格式不正确")\n    private String email;\n}\n\n// 2. 全局异常处理器：任何地方抛异常都在这统一兜底，返回友好 JSON\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    public Result<Void> handleValid(MethodArgumentNotValidException e) {\n        String msg = e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();\n        return Result.fail(40000, msg);\n    }\n\n    @ExceptionHandler(BizException.class)          // 自定义业务异常\n    public Result<Void> handleBiz(BizException e) {\n        return Result.fail(e.getCode(), e.getMessage());\n    }\n\n    @ExceptionHandler(Exception.class)\n    public Result<Void> handleOther(Exception e) {\n        log.error("系统异常", e);                   // 记日志！\n        return Result.fail(50000, "系统繁忙，请稍后再试");\n    }\n}\n\n// 3. 声明式事务：Service 方法上加一个注解，方法内所有 DB 操作原子化\n@Transactional(rollbackFor = Exception.class)\npublic void transfer(Long from, Long to, BigDecimal amount) {\n    accountMapper.deduct(from, amount);        // 任何一步抛异常\n    accountMapper.add(to, amount);             // 两步都会自动回滚\n}' },

      { t: 'h', html: '6.8 登录认证：JWT + 拦截器（最常见的面试实战题）' },
      { t: 'p', html: 'HTTP 是无状态的：上次请求登录了，下次请求服务器不认识你。解决方案有两代：' },
      { t: 'table', headers: ['方案', '原理', '优缺点'], rows: [
        ['Session + Cookie', '登录后服务器存 Session，下发 Cookie 里的 sessionId', '传统方案；集群下要共享 Session（存 Redis），有跨域限制'],
        ['JWT（Token）', '登录后签发加密字符串（含用户信息+过期时间），前端每次请求放在 Header 里', '服务端无状态、天然支持分布式；无法主动作废单个 Token（需配合 Redis 黑名单）'],
      ]},
      { t: 'code', lang: 'java', title: 'JWT 拦截器标准实现', code: '// 登录接口：校验账密，签发 Token\n@PostMapping("/api/auth/login")\npublic Result<String> login(@RequestBody LoginDTO dto) {\n    User user = userService.verify(dto);            // 校验账密（密码要 BCrypt 加密存储！）\n    String token = Jwts.builder()\n            .subject(String.valueOf(user.getId()))\n            .expiration(new Date(System.currentTimeMillis() + 7 * 86400_000L))\n            .signWith(secretKey)\n            .compact();\n    return Result.ok(token);\n}\n\n// 拦截器：除登录/注册外，所有请求都要带合法 Token\n@Component\npublic class AuthInterceptor implements HandlerInterceptor {\n    @Override\n    public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object h) {\n        String token = req.getHeader("Authorization");   // 前端放 Header 里\n        if (token == null || !jwtUtil.verify(token)) {\n            resp.setStatus(401);                         // 未认证\n            return false;                                // 拦截，不再进 Controller\n        }\n        Long userId = jwtUtil.getUserId(token);\n        UserContext.set(userId);                         // 存 ThreadLocal，后续链路取用\n        return true;\n    }\n}\n// 注册拦截器并放行登录接口 —— 配置类里 addInterceptors(...)\n// .excludePathPatterns("/api/auth/login", "/api/auth/register")' },
      { t: 'tip', html: '<b>安全红线（必须养成习惯）</b>：① 数据库里的密码必须 BCrypt 加密，绝不能明文；② 敏感配置（数据库密码、JWT 密钥）放环境变量或配置中心，<b>绝不能提交到 Git</b>；③ 接口入参一律校验（前端校验可绕过，后端校验才是真的）；④ SQL 一律预编译防注入。' },

      { t: 'h', html: '6.9 毕业项目：把整章串起来' },
      { t: 'steps', items: [
        '<b>需求</b>：个人博客系统 —— 用户注册登录、发表文章、文章列表（分页+搜索）、评论；',
        '<b>建表</b>：user、article（title/content/user_id/views）、comment（article_id/user_id/content）三张表，画好 ER 图再动手；',
        '<b>接口</b>：RESTful 风格 + 统一 Result 返回 + 全局异常；JWT 登录；发表文章必须登录（拦截器）；',
        '<b>业务点</b>：发表文章用 @Transactional（写 article + 更新用户发帖数）；列表用 MyBatis 动态 SQL 实现按标题模糊搜索；',
        '<b>自测</b>：用 Postman 把每个接口测一遍（正常流 + 异常流：空参数、错误 Token、删别人的文章）；',
        '<b>前端</b>（可选加分）：Vue 写个简陋页面调通接口；',
        '<b>部署</b>：打包 jar 传到云服务器上跑起来（第 8 章学完 Linux/Docker 回来做）。',
      ]},
      { t: 'p', html: '做完这个项目，你就具备了<b>初级 Java 后端的全部技能骨架</b>。把它写上简历——这就是你的第一个真实项目经验。' },
      { t: 'qa', q: 'Spring Bean 的作用域和生命周期？', a: '作用域：默认单例（singleton，整个容器一个实例，无状态 Bean 用它）；还有 prototype（每次获取新建）、request、session 等。生命周期简版：实例化 → 依赖注入（@Autowired）→ 初始化回调（@PostConstruct）→ 使用中 → 容器关闭时销毁回调（@PreDestroy）。面试常见追问：单例 Bean 里的成员变量会被并发修改吗？——会！所以 Service 里不要放可变的请求级状态（要用 ThreadLocal）。' },
      { t: 'qa', q: '@Autowired 和 @Resource 的区别？构造器注入为什么被推荐？', a: '@Autowired 是 Spring 的，默认按类型（byType）注入，多个同类型 Bean 需配合 @Qualifier 指定名字；@Resource 是 JDK 标准的，默认按名称（byName）注入。构造器注入被推荐的原因：① 依赖不可变（可以加 final），更安全；② 依赖必需性在构造时就校验，缺依赖启动即报错（fail-fast），而字段注入要等到实际调用才 NPE；③ 便于单元测试（直接 new 传 mock）。Spring 官方和阿里规范都推荐构造器注入。' },
    ],
  },
];
