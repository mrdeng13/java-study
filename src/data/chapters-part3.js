// 课程内容 第 7-9 章：中间件 / 工程化工具 / 全栈实战与职业路线

export const chaptersPart3 = [
  {
    id: 'ch7',
    icon: '⚡',
    title: '第 7 章 · 中间件',
    subtitle: 'Redis 缓存、消息队列、Nginx、Elasticsearch —— 高并发系统的四大件',
    blocks: [
      { t: 'p', html: '单体应用写完只是起点。当用户量上来（日活几万起），数据库扛不住、接口变慢、系统开始出问题——<b>中间件就是为此而生的"高级武器库"</b>。这一章也是大厂面试区分度最大的部分。' },
      { t: 'info', html: '🏭 <b>一句话理解中间件</b>：夹在"应用层"和"数据库/网络"之间的通用基础软件。就像餐饮店的后厨设备（冰箱、传送带、排风扇）——不直接面对客人，但决定了店铺能接待多少客人。每解决一类问题，就有一类中间件。' },

      { t: 'h', html: '7.1 Redis：内存数据库，"快"字当头' },
      { t: 'p', html: '<b>Redis 是基于内存的 key-value 数据库</b>。读内存是纳秒级，读 MySQL（磁盘）是毫秒级——差十万倍。所以核心数据的"读热点"放 Redis，数据库压力瞬间消失。' },
      { t: 'table', headers: ['数据类型', '能干嘛', '业务例子'], rows: [
        ['String', '存字符串/数字，可设过期时间', '验证码（5 分钟过期）、缓存 JSON、计数器'],
        ['Hash', '对象的字段级存取', '购物车：用户id → {商品id: 数量}'],
        ['List', '有序列表，两端进出', '最新消息列表、简单队列'],
        ['Set', '无序不重复', '点赞用户集合、抽奖去重、共同好友（交集）'],
        ['ZSet（有序集合）', '带分数排序', '排行榜（销量榜）、延迟队列'],
      ]},
      { t: 'code', lang: 'java', title: 'Spring Boot 集成 Redis（Spring Data Redis）', code: '// 引依赖 spring-boot-starter-data-redis 后，直接注入模板类\n@Autowired\nprivate StringRedisTemplate redis;\n\n// 缓存用户查询的标准模式：Cache Aside 旁路缓存\npublic User getUser(Long id) {\n    String key = "user:" + id;                       // 命名规范：业务:主键\n    String cached = redis.opsForValue().get(key);\n    if (cached != null) {\n        return JSON.parseObject(cached, User.class);  // 1. 命中缓存直接返回\n    }\n    User user = userMapper.findById(id);             // 2. 未命中查数据库\n    if (user != null) {\n        redis.opsForValue().set(key, JSON.toJSONString(user),\n                Duration.ofMinutes(30));              // 3. 写回缓存 + 过期时间\n    }\n    return user;\n}\n\n// 常用命令对照\nredis.opsForValue().set("code:13800", "8848", Duration.ofMinutes(5));\nredis.opsForValue().get("code:13800");\nredis.delete("user:1");                              // 更新数据时删缓存\nredis.opsForZSet().add("rank:sales", "商品A", 999);   // 排行榜\nredis.expire("key", Duration.ofSeconds(60));         // 设置过期' },
      { t: 'warn', html: '<b>缓存三大经典问题（面试必考）</b>：<br>① <b>缓存穿透</b>：恶意查不存在的 id，缓存永远没有 → 全打到数据库。解法：空值也缓存（短过期）或布隆过滤器拦截。<br>② <b>缓存击穿</b>：某个热 key 过期瞬间，海量请求同时压到数据库。解法：互斥锁（只放一个请求去重建缓存）或热点数据不过期。<br>③ <b>缓存雪崩</b>：大批 key 同时过期，数据库瞬间被打垮。解法：过期时间加随机值打散，多级缓存。' },
      { t: 'warn', html: '<b>缓存与数据库一致性</b>：更新数据时"先更新数据库，再删除缓存"（Cache Aside），让下次查询重新加载。为什么是"删缓存"不是"改缓存"？——删更简单且并发下不易写脏。极端并发下仍有小概率不一致，强一致场景直接读库或加分布式锁。' },

      { t: 'h', html: '7.2 消息队列（MQ）：削峰、解耦、异步' },
      { t: 'info', html: '📮 <b>类比</b>：没有 MQ = 餐厅服务员（服务 A）把订单直接吼给每个厨师（服务 B/C/D），吼完必须等厨师确认才能服务下一位，厨师忙不过来服务员也只能干等。有 MQ = 订单扔进出票机（队列），厨师按自己节奏取单处理，服务员瞬间空闲。' },
      { t: 'p', html: 'MQ 的三大价值，每个都要能举例：' },
      { t: 'list', items: [
        '<b>异步提速</b>：注册流程 = 写用户表(50ms) + 发欢迎邮件(500ms) + 发短信(500ms) = 1 秒+。把邮件短信扔进 MQ 立即返回，注册只要 60ms，体验飙升；',
        '<b>削峰填谷</b>：秒杀瞬间 10 万请求直接写库会崩。请求先进 MQ 排队，数据库按自己能承受的速度消费，洪峰被"削"成平流；',
        '<b>系统解耦</b>：订单服务只管发"订单已支付"消息到 MQ，谁关心（物流、积分、通知）谁去订阅。将来加"风控服务"不用改订单代码。',
      ]},
      { t: 'code', lang: 'java', title: 'Spring Boot + RabbitMQ 最小示例', code: '// 生产者：下单成功后发消息\n@Autowired\nprivate RabbitTemplate rabbitTemplate;\n\npublic void createOrder(Order order) {\n    orderMapper.insert(order);\n    rabbitTemplate.convertAndSend("order.exchange", "order.paid",\n            JSON.toJSONString(order));        // 发出去就完事，不等消费者\n}\n\n// 消费者：积分服务监听消息\n@RabbitListener(bindings = @QueueBinding(\n        value = @Queue("points.queue"),\n        exchange = @Exchange("order.exchange"),\n        key = "order.paid"))\npublic void handleOrderPaid(String msg) {\n    Order order = JSON.parseObject(msg, Order.class);\n    pointsService.addPoints(order.getUserId(), order.getAmount());\n}\n// ⚠️ 消息可能丢（MQ 挂了/消费失败）：生产确认 + 持久化 + 手动 ack + 死信队列\n// ⚠️ 消息可能重（网络重试）：消费者接口必须幂等（如用唯一订单号判断是否处理过）' },
      { t: 'table', headers: ['产品', '特点', '选型建议'], rows: [
        ['RabbitMQ', '功能全面、管理界面友好、吞吐中等', '中小项目首选，学习资料多'],
        ['RocketMQ', '阿里出品，事务消息、延迟消息强', '电商类、需要高级特性时'],
        ['Kafka', '超高吞吐、日志流场景王者', '日志采集、大数据管道'],
      ]},

      { t: 'h', html: '7.3 Nginx：流量的大门' },
      { t: 'p', html: '<b>Nginx 是高性能的 Web 服务器/反向代理服务器</b>，任何上线项目都会经过它。两大核心用途：' },
      { t: 'list', items: [
        '<b>反向代理</b>：用户访问 example.com → Nginx（80/443 端口）→ 转发给内部的 Java 服务（8080）。好处：统一入口、隐藏真实服务、配 HTTPS 证书、限流、防攻击都在这层做；',
        '<b>负载均衡</b>：一个 Java 服务扛不住就部署 3 个实例，Nginx 把请求轮流分发（默认轮询，可按权重、IP 哈希），横向扩容的基础。',
      ]},
      { t: 'code', lang: 'nginx', title: 'Nginx 配置示例（看懂即可）', code: 'server {\n    listen 80;\n    server_name example.com;\n\n    # 前端静态资源：Nginx 直接返回（性能极高）\n    location / {\n        root /var/www/dist;\n        try_files $uri $uri/ /index.html;   # 单页应用路由兜底\n    }\n\n    # 后端接口：转发给 Java 服务（反向代理）\n    location /api/ {\n        proxy_pass http://backend;          # 指向上游服务器组\n        proxy_set_header Host $host;\n    }\n}\n\n# 负载均衡：3 个后端实例轮着分流量\nupstream backend {\n    server 127.0.0.1:8081;\n    server 127.0.0.1:8082;\n    server 127.0.0.1:8083;\n}' },

      { t: 'h', html: '7.4 Elasticsearch（ES）：让搜索飞起来' },
      { t: 'p', html: '需求：在 1000 万商品里搜"红色 连衣裙 排除穿过"，还要按相关度排序。MySQL 的 LIKE \'%红%连衣裙%\' 无法走索引且慢。<b>ES 是基于倒排索引的分布式搜索引擎</b>：像书的索引页"关键词 → 出现在哪些文档"，毫秒级完成全文检索 + 分词 + 排序 + 高亮。' },
      { t: 'list', items: [
        '使用场景：电商商品搜索、App 内容搜索、日志分析平台（ELK = ES + Logstash + Kibana）；',
        '核心概念对照 MySQL：Index（索引）≈ 表；Document（文档，JSON）≈ 行；Mapping ≈ 表结构；',
        '学习路线：先会用 Docker 起一个 ES + Kibana，再学分词器（中文用 IK）、基本增删改查 DSL，最后 Spring Data Elasticsearch 整合。',
      ]},

      { t: 'h', html: '7.5 高并发演进：从单体到分布式（建立全局观）' },
      { t: 'steps', items: [
        '<b>单体架构</b>：一个 Spring Boot 项目包打天下。日活几千完全够用，<b>别过度设计</b>；',
        '<b>数据库先顶不住</b>：加 Redis 缓存读；读写分离（主库写、从库读）；分库分表（单表超千万再考虑）；',
        '<b>应用层顶不住</b>：Nginx 负载均衡 + 应用横向多实例；无状态化（Session 放 Redis）才能随意扩容；',
        '<b>微服务化</b>：按业务拆成用户服务、订单服务、商品服务，独立开发部署。用 Spring Cloud 全家桶：注册中心 Nacos（服务互相找得到）、网关 Gateway（统一入口鉴权）、远程调用 OpenFeign、熔断限流 Sentinel（防止一个服务拖垮全链路）；',
        '<b>再往上</b>：消息队列全面接入、分布式锁（Redis）、分布式事务（最终一致性）、链路追踪、容器编排 K8s —— 到这一步已经是高级工程师的战场。',
      ]},
      { t: 'tip', html: '<b>面试官视角</b>：初级岗考"知不知道 Redis 是什么、怎么用"；中级岗考"缓存一致性、穿透击穿雪崩怎么解决"；高级岗考"为什么这么设计、量化过收益吗、出过什么线上事故怎么复盘"。<b>每个中间件先当使用者，再当思考者。</b>' },
      { t: 'qa', q: 'Redis 为什么快？单线程为什么反而快？', a: '① 纯内存操作（快 10 万倍于磁盘）；② 高效数据结构（跳表、哈希表、压缩列表）；③ 单线程模型避免上下文切换和锁竞争，且 Redis 6 起网络 IO 多线程、命令执行仍单线程；④ IO 多路复用（epoll），单线程同时监听大量连接，谁就绪处理谁。注意：单线程快的前提是"快进快出"，在 Redis 里执行 O(n) 大命令（如 KEYS *）会阻塞整个服务——生产禁用。' },
      { t: 'qa', q: '如何用 Redis 实现分布式锁？有什么坑？', a: '核心命令 SET key uniqueValue NX EX 30 —— NX 保证只有一个客户端能设置成功（拿到锁），EX 防止死锁（超时自动释放），value 存唯一标识防止误删别人的锁。释放锁用 Lua 脚本保证"判断是自己的 + 删除"原子执行。坑：① 业务超时锁先过期 → 加看门狗自动续期（Redisson 已实现）；② 主从切换锁丢失 → RedLock 或用 Zookeeper。实战直接用 Redisson 的 RLock，别手写。' },
    ],
  },

  {
    id: 'ch8',
    icon: '🛠️',
    title: '第 8 章 · 工程化必备',
    subtitle: 'Git、Linux、Docker、测试与部署 —— 从"会写代码"到"能交付软件"',
    blocks: [
      { t: 'p', html: '公司里没人 single 独写代码单机运行。这一章是"职场生存技能"：<b>协作（Git）、服务器（Linux）、交付（Docker/CI）、质量（测试）</b>。每一项只学最核心的 20%，覆盖 80% 的日常使用。' },

      { t: 'h', html: '8.1 Git 与 GitHub：版本管理 · 团队协作' },
      { t: 'p', html: 'Git 是代码的"时光机 + 合并神器"：每次提交存一个快照，随时回退、分支开发、多人合并。' },
      { t: 'code', lang: 'bash', title: '日常高频命令（这 12 条覆盖 90% 场景）', code: 'git init                          # 初始化仓库\ngit status                        # 看当前状态（改了啥，最常用）\ngit add .                         # 添加所有改动到暂存区\ngit commit -m "feat: 用户登录接口"  # 提交快照（写清楚干了啥）\ngit log --oneline                 # 查看提交历史\n\ngit checkout -b feature/login     # 创建并切换到新分支\ngit add . && git commit -m "..."  # 在分支上开发\ngit checkout master               # 切回主分支\ngit merge feature/login           # 把分支合并进来\n\ngit remote add origin <仓库地址>   # 关联远程仓库\ngit push -u origin master         # 推送\ngit pull                          # 拉取同事的新代码' },
      { t: 'info', html: '<b>分支模型（理解团队协作）</b>：master/main 分支永远可部署；开发新功能从 master 拉 feature 分支，开发完发起 Pull Request（PR/MR）→ 同事 Review 代码 → 合并。禁止直接往 master push（公司规范）。<b>commit message 规范</b>：feat 新功能 / fix 修 bug / docs 文档 / refactor 重构——半年后翻历史全靠它。' },
      { t: 'warn', html: '<b>安全红线</b>：.gitignore 必须排除 application-local.yml、.env、密码文件、node_modules、日志。<b>密码提交进 Git = 变相公开泄露</b>（即使删了，历史里还在）。' },

      { t: 'h', html: '8.2 Linux：服务器 99% 跑在它上面' },
      { t: 'p', html: '你的项目最终要跑在云服务器（阿里云/腾讯云，学生机 9.9 元/月）上，而服务器都是 Linux（没有图形界面，全靠命令行）。' },
      { t: 'code', lang: 'bash', title: '服务器生存必需命令', code: '# 文件与目录\nls -la            # 列出文件（含隐藏）\ncd /home/app      # 进入目录（pwd 看自己在哪）\ncat / tail -f app.log   # 看文件 / 实时滚动看日志（排查问题第一命令！）\n\n# 进程与端口\nps -ef | grep java        # 找到 Java 进程\nkill -9 12345             # 强杀进程（PID）\nnetstat -tlnp | grep 8080 # 谁占着 8080 端口\n\n# 文件传输与远程\nscp app.jar root@1.2.3.4:/home/app   # 上传 jar 包到服务器\nssh root@1.2.3.4                      # 远程登录服务器\n\n# 文本处理\ngrep "ERROR" app.log          # 从日志里捞错误\ngrep -C 5 "NullPointer" app.log  # 连带前后 5 行上下文' },
      { t: 'tip', html: '<b>实战路径</b>：买台最便宜的云服务器 → 部署你第 6 章的博客项目：装 JDK → scp 上传 jar → nohup java -jar app.jar & 后台运行 → 开放安全组端口 → 浏览器访问公网 IP 验证。走完这一遍，"部署"就再也不是黑盒。' },

      { t: 'h', html: '8.3 Docker：一次构建，处处运行' },
      { t: 'p', html: '"在我电脑上是好的"——环境不一致是部署头号难题。Docker 把<b>应用 + 依赖 + 环境</b>打包成镜像（Image），到哪都跑出一模一样的容器（Container）。类比：以前搬家一件件搬家具（装环境），现在整个集装箱吊走（镜像）。' },
      { t: 'code', lang: 'bash', title: 'Docker 高频操作', code: '# 镜像与容器\ndocker pull mysql:8.0            # 拉镜像\ndocker images                    # 看本地镜像\ndocker run -d --name mysql \\\n  -p 3306:3306 \\\n  -e MYSQL_ROOT_PASSWORD=123456 \\\n  mysql:8.0                      # 一条命令起一个 MySQL！\ndocker ps                        # 看运行中的容器\ndocker logs -f mysql             # 看容器日志\ndocker exec -it mysql mysql -uroot -p   # 钻进容器里操作\n\n# 把自己的 Java 项目打包成镜像（项目根目录 Dockerfile）\n# FROM eclipse-temurin:17-jre\n# COPY target/app.jar /app.jar\n# ENTRYPOINT ["java", "-jar", "/app.jar"]\ndocker build -t my-blog:1.0 .\ndocker run -d -p 8080:8080 my-blog:1.0' },
      { t: 'p', html: '多个容器（app + mysql + redis）一起管理用 <b>Docker Compose</b>：一个 yml 文件声明所有服务，<code>docker compose up -d</code> 一键全起。学到"能用 Docker 部署自己的全栈项目"即达标，K8s 是进阶后的事。' },

      { t: 'h', html: '8.4 测试：让代码可信' },
      { t: 'code', lang: 'java', title: 'JUnit 5 单元测试（Spring Boot 自带）', code: '@SpringBootTest\nclass UserServiceTest {\n\n    @Autowired\n    private UserService userService;\n\n    @Test\n    void 转账_余额不足时应抛异常() {          // 测试方法名直接写场景\n        BizException e = assertThrows(BizException.class,\n                () -> userService.transfer(1L, 2L, new BigDecimal("999999")));\n        assertEquals("余额不足", e.getMessage());   // 验证异常信息正确\n    }\n\n    @Test\n    void 正常转账_双方余额应正确变化() {\n        userService.transfer(1L, 2L, new BigDecimal("100"));\n        assertEquals(new BigDecimal("900"), accountMapper.findById(1L).getBalance());\n        assertEquals(new BigDecimal("600"), accountMapper.findById(2L).getBalance());\n    }\n}\n// 测试金字塔：单元测试（多、快、不依赖外部）→ 接口测试（Postman 自动化）→ 手工点一点（最少）\n// 原则：核心业务逻辑（钱、库存、权限）必须有测试覆盖' },

      { t: 'h', html: '8.5 CI/CD：代码提交后自动测试、构建、部署' },
      { t: 'p', html: '<b>CI（持续集成）</b>：每次 push 自动跑测试 + 打包，发现问题立刻通知；<b>CD（持续部署）</b>：打包好的镜像自动发布到服务器。GitHub Actions 免费且最流行：' },
      { t: 'code', lang: 'yaml', title: '.github/workflows/deploy.yml（能看懂流程即可）', code: 'name: Deploy\non:\n  push:\n    branches: [master]        # master 有新提交就触发\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-java@v4\n        with: { java-version: "17", distribution: "temurin" }\n      - run: mvn test             # ① 自动跑测试，挂了就中断\n      - run: mvn package -DskipTests\n      - name: 部署到服务器\n        run: |\n          scp target/app.jar user@server:/app/\n          ssh user@server "systemctl restart myapp"   # ② 重启服务' },
      { t: 'tip', html: '<b>排错心法（贯穿职业生涯）</b>：① 报错先看<b>完整堆栈第一行</b>（Caused by: 才是根因）；② 先看日志再瞎猜，<code>tail -f</code> + 复现操作；③ 二分法定位：注释一半代码/打印中间变量，缩小范围；④ 搜索报错信息时带上技术栈关键词（"Spring Boot JSR303 not working"），优先看 Stack Overflow 和官方文档。' },
      { t: 'qa', q: 'git merge 和 git rebase 的区别？', a: '都在"整合分支"，历史形态不同：merge 产生一个合并提交，历史是真实的分叉网状图，安全通用；rebase 把当前分支的提交"摘下来接到目标分支末尾重放"，历史变成一条直线更整洁，但<b>改写了历史</b>。铁律：只对自己未推送的本地提交用 rebase；已经 push 到公共分支的提交用 rebase 会坑死同事。日常：功能分支合回主库用 merge（或平台 squash merge），整理自己本地提交用 rebase。' },
      { t: 'qa', q: '线上接口突然变慢，你的排查思路？', a: '按链路从外到内：① 看监控/日志确认范围：全慢还是个别慢？何时开始？改过什么版本？② 服务器层面：top 看 CPU/内存，iostat 看磁盘 IO，netstat 看连接数；③ 应用层面：jstack 看线程是否死锁/阻塞，jstat 看 GC 是否频繁 Full GC；④ 数据库层面：慢查询日志定位慢 SQL，EXPLAIN 分析是否走索引；⑤ 外部依赖：Redis/MQ/第三方接口是否超时。形成假设后用数据验证，改完必须有前后对比数据。' },
    ],
  },

  {
    id: 'ch9',
    icon: '🚀',
    title: '第 9 章 · 全栈实战与职业路线',
    subtitle: '综合项目设计、简历、面试与未来 12 个月的成长地图',
    blocks: [
      { t: 'p', html: '恭喜走到这里！前面 8 章的"零件"你已经集齐，这一章教你<b>组装成真正的全栈作品</b>，以及如何把它变成 offer。' },

      { t: 'h', html: '9.1 全栈项目实战：从零做一个"任务管理系统"' },
      { t: 'p', html: '选它是因为：业务简单但覆盖完整全栈链路（注册登录 + 增删改查 + 统计 + 部署），且能持续迭代加入中间件。' },
      { t: 'table', headers: ['层次', '技术选型', '要实现的点'], rows: [
        ['前端', 'Vue 3 + Element Plus + Axios', '登录页、任务看板、表单校验、Token 管理'],
        ['后端', 'Spring Boot + MyBatis + JWT', 'RESTful 接口、全局异常、参数校验、事务'],
        ['数据库', 'MySQL 8 + Redis', '用户/任务/标签表设计；任务列表缓存'],
        ['中间件', 'RabbitMQ（可选）', '任务完成异步发通知'],
        ['部署', 'Docker Compose + Nginx', '一键启动全家桶，Nginx 反代前后端'],
      ]},
      { t: 'steps', items: [
        '<b>第 1 周 · 设计</b>：写需求文档（功能列表）；画 ER 图（user / task / tag / task_tag 四表）；画接口文档（每个 API 的方法、路径、入参、出参、错误码）——<b>先设计后编码是职业习惯</b>；',
        '<b>第 2 周 · 后端骨架</b>：Spring Boot 项目 + 建表 SQL + JWT 登录注册 + 全局异常 + 统一返回；Postman 全部测通；',
        '<b>第 3 周 · 核心业务</b>：任务 CRUD + 分页筛选 + 状态流转（待办→进行中→完成）+ 统计接口（今日完成数等，Redis 缓存）；',
        '<b>第 4 周 · 前端</b>：Vue 路由 + 登录页 + 任务看板；Axios 拦截器自动带 Token、401 自动跳登录；',
        '<b>第 5 周 · 部署上线</b>：Dockerfile + docker-compose.yml（app/mysql/redis/nginx 四容器）→ 服务器部署 → 绑定域名 + HTTPS；',
        '<b>第 6 周 · 打磨简历</b>：写 README（架构图、技术亮点、踩坑记录）；压测核心接口记录 QPS；整理 3 个"技术决策"故事（为什么用 JWT？缓存怎么保证一致？）。',
      ]},
      { t: 'tip', html: '<b>加分项（有余力再做）</b>：单元测试覆盖率 > 50%；GitHub Actions CI；WebSocket 任务实时提醒；接入第三方登录（OAuth2）；压力测试报告。招聘方看重的不是项目多花哨，而是<b>每个技术点你能否讲出"为什么"</b>。' },

      { t: 'h', html: '9.2 简历与面试准备' },
      { t: 'list', items: [
        '<b>简历结构</b>：基本信息 → 技能清单（按掌握度诚实分级：精通/熟练/熟悉/了解）→ 项目经历（STAR 法：背景-任务-行动-结果）→ 教育背景；',
        '<b>技能清单示例</b>：熟悉 Java 集合、JVM 内存模型与 GC；熟悉 Spring Boot/MyBatis；熟悉 MySQL 索引与事务、SQL 优化；熟悉 Redis 常用结构与缓存问题；了解 RabbitMQ、Docker；',
        '<b>项目描述示例</b>："独立开发任务管理系统：前后端分离架构，JWT 无状态认证；任务列表接口通过 Redis 缓存 + 索引优化，P95 响应从 180ms 降至 15ms；Docker Compose 一键部署。"——有数字、有原因、有结果；',
        '<b>面试八股重点</b>（按出题频率）：Java 集合（HashMap）、并发（线程池/synchronized/锁）、JVM（内存+GC）、MySQL（索引+事务+锁）、Redis（数据结构+缓存三问+持久化）、Spring（IoC/AOP/Bean 生命周期/循环依赖）、网络（TCP/HTTP/HTTPS）；',
        '<b>算法笔试</b>：国内大厂笔试基本是 LeetCode 风格 2~4 题。目标：Hot 100 刷完 + 高频题型模板化（双指针、滑动窗口、二叉树遍历、动态规划入门）。本站"刷题训练营"标签页提供 10 道精选入门题。',
      ]},
      { t: 'table', headers: ['面试轮次', '考察什么', '怎么准备'], rows: [
        ['笔试/机试', '算法 + 选择题（八股）', 'LeetCode Hot 100 + 本站测验题'],
        ['一面（基础）', '语言、集合、并发、JVM、数据库', '八股文 + 结合项目场景回答'],
        ['二面（项目/设计）', '项目深挖、系统设计、排查思路', '对项目每个决策能说出 why 和 trade-off'],
        ['三面/HR', '稳定性、成长动机、薪资沟通', '真实表达 + 提前调研市场薪资'],
      ]},

      { t: 'h', html: '9.3 12 个月成长地图（收藏这张表）' },
      { t: 'table', headers: ['阶段', '时间', '目标', '检验标准'], rows: [
        ['Java 入门', '第 1~2 月', 'Java SE 语法 + OOP + 集合 + 异常', '能独立写控制台版学生管理系统'],
        ['进阶 + 数据库', '第 3 月', '多线程基础 + MySQL/SQL 熟练', '能设计三张表的博客库并写复杂查询'],
        ['前后端框架', '第 4~5 月', 'JavaWeb + Spring Boot + MyBatis + Vue 基础', '完成第 9.1 节的项目并部署'],
        ['中间件 + 工程化', '第 6 月', 'Redis 实战 + Git/Linux/Docker', '项目加缓存、CI/CD、容器部署'],
        ['刷题 + 八股', '第 7~8 月', 'LeetCode 150 题 + 八股一轮', '模拟面试能流畅作答'],
        ['求职冲刺', '第 9 月', '简历 + 海投 + 面试复盘', '拿到 2+ offer 对比'],
        ['入职后第一年', '持续', '读源码（Spring/Redis）、深入分布式、补系统设计', '独立负责模块、能值夜班排查故障'],
      ]},

      { t: 'h', html: '9.4 保持成长的底层习惯' },
      { t: 'list', items: [
        '<b>官方文档优先</b>：遇到新技术的第一站是官方文档，其次才是一篇过教程——信息源质量决定成长速度；',
        '<b>输出倒逼输入</b>：写技术博客/笔记，讲不清 = 没学会；',
        '<b>读源码不贪多</b>：从 Spring 的 Bean 创建、Redis 的跳表这类"小而美"入口开始，带着问题读；',
        '<b>造轮子练内功</b>：手写简易版 HashMap、线程池、Spring IoC 容器——面试杀手锏；',
        '<b>关注稳定性思维</b>：高级工程师和初级的差距往往不在"会更多框架"，而在<b>边界思考</b>：这里失败了怎么办？流量翻 10 倍会怎样？数据丢了能恢复吗？',
      ]},
      { t: 'qa', q: '学完本站内容能达到什么水平？如何继续进阶？', a: '本站目标是"初级全栈工程师的完整知识框架 + 动手能力"（约等于校招初级/1 年经验水平）。进阶方向：① 深入 JVM 调优与并发编程（读《深入理解 Java 虚拟机》《Java 并发编程的艺术》）；② 分布式与微服务（Spring Cloud Alibaba 实战、读《数据密集型应用系统设计》DDIA）；③ 系统设计（秒杀、短链、feed 流等经典题）；④ 云原生（K8s、可观测性）。编程没有毕业，只有版本迭代——祝你在代码世界里持续升级！' },
    ],
  },
];
