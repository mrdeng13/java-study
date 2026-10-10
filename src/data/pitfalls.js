// 易错点考场：30 天 · 每天一组高频易错点 + 每天配套 2 道考查题（点击选项即时判分）
// pit: { day, stage, title, points: [易错点...], questions: [{q, options, answer(index), explain}] }

export const pitfallDays = [
  {
    day: 1, stage: 'Java 入门', title: '类型与运算陷阱',
    points: [
      '<code>10 / 3 = 3</code>：两个整数相除结果还是整数，直接截断小数，不是四舍五入。想要 3.33 得转成 double：<code>10 / 3.0</code>。',
      '<code>10 % -3 = 1</code>（不是 -1）：Java 取余符号跟<b>被除数</b>走。',
      '整型默认 int：写 <code>long a = 10000000000;</code> 编译报错，因为右边的字面量先按 int 处理已溢出，要写 <code>10000000000L</code>。',
      'char 能参与运算：<code>\'a\' + 1 = 98</code>（ASCII 码 97+1），想得 "b" 要强转 (char)。',
    ],
    questions: [
      { q: 'System.out.println(7 / 2 + 7 % 2); 输出什么？', options: ['4', '4.5', '5', '3.5'], answer: 0, explain: '7/2 整数除法=3，7%2=1，3+1=4。两步都是整数运算，不存在小数。' },
      { q: 'byte b = 127; b = b + 1; 会怎样？', options: ['b = -128', 'b = 128', '编译报错', '运行时异常'], answer: 2, explain: 'b+1 中 b 自动提升为 int，结果 128 是 int，不能自动赋回 byte，编译报错。即使 b += 1 可以（隐式强转），结果也会溢出成 -128。' },
    ],
  },
  {
    day: 2, stage: 'Java 入门', title: 'String 与相等性',
    points: [
      '<code>"abc" == "abc"</code> 为 true（常量池同一对象），但 <code>new String("abc") == "abc"</code> 为 false——new 一定创建堆里的新对象。',
      '比较字符串内容永远用 <code>equals()</code>，且把常量放前面防 NPE：<code>"admin".equals(input)</code>。',
      'String 拼接循环场景性能灾难：每次 + 都 new 新对象，循环 1 万次 = 1 万个对象，必须用 StringBuilder。',
      '<code>s.length() == 0</code> 与 <code>s == null</code> 是两回事：null 连 length() 都调不了直接 NPE。',
    ],
    questions: [
      { q: 'String s = new String("ab") + new String("cd"); 创建了几个对象？（常量池初始无 "ab" "cd"）', options: ['2 个', '3 个', '5 个', '6 个'], answer: 2, explain: '常量池 "ab"、堆 new "ab"、常量池 "cd"、堆 new "cd"、StringBuilder、最终 toString 的 "abcd"——共 6 个（若算上 StringBuilder）。经典刁难题，重点是理解 new 必建新对象。' },
      { q: '下列哪项是正确的空安全比较写法？', options: ['s.equals("x")', '"x".equals(s)', 's == "x"', 's.compare("x")'], answer: 1, explain: '把确定的常量放前面，s 为 null 时返回 false 而不是抛 NPE。' },
    ],
  },
  {
    day: 3, stage: '面向对象', title: '构造器与初始化顺序',
    points: [
      '类一写上<b>有参构造器</b>，默认无参构造器立刻消失，<code>new User()</code> 直接编译报错——手写有参必顺手补无参。',
      '初始化顺序（面试必背）：父类静态 → 子类静态 → 父类实例变量/代码块 → 父类构造器 → 子类实例变量/代码块 → 子类构造器。',
      '<code>this(...)</code> 构造器调用必须放第一行，且一个构造器只能调一个 this 或 super。',
      '构造器里调用可被重写的方法是危险行为：子类重写方法会在"子类字段还没赋值"时被父类构造器调到，读到零值。',
    ],
    questions: [
      { q: 'new 子类对象时，最先执行的是？', options: ['子类构造器', '父类构造器', '父类静态代码块', '子类静态代码块'], answer: 2, explain: '静态先于实例、父类先于子类。完整顺序：父静态→子静态→父实例→父构造→子实例→子构造。' },
      { q: 'class A { A() { print(); } void print(){} } class B extends A { int x = 5; void print(){ System.out.println(x); } }，new B() 输出？', options: ['5', '0', 'null', '编译报错'], answer: 1, explain: '父类构造器调用的是被重写的 print()（多态），此时子类 x 尚未赋值（还是默认值 0），输出 0。这就是"构造器里不要调可重写方法"的原因。' },
    ],
  },
  {
    day: 4, stage: '集合', title: '集合使用陷阱',
    points: [
      'Arrays.asList(...) 返回的列表<b>不支持 add/remove</b>（长度固定），硬调会 UnsupportedOperationException。',
      'foreach / 迭代中直接 list.remove() 抛 ConcurrentModificationException，要用 iterator.remove() 或 removeIf。',
      '<code>int[] arr</code> 直接 Arrays.asList(arr) 得到的是"一个元素的列表"（数组本身成为元素），基本类型数组要用 Stream.boxed()。',
      'HashSet 存自定义对象不去重：忘了重写 equals + hashCode，两个"相同"对象 hashCode 不同被分到不同桶。',
    ],
    questions: [
      { q: '在 foreach 遍历 ArrayList 时删除元素，正确做法是？', options: ['直接 list.remove(o)', '用 Iterator 的 remove()', '先把 list 变 null', '加个 try-catch'], answer: 1, explain: 'iterator.remove() 会同步 expectedModCount；直接 list.remove 只改 modCount，下一次 next() 就 fail-fast 抛异常。' },
      { q: '把两个内容相同的 User 对象放入 HashSet，size() = 2，最可能的原因是？', options: ['HashSet 有 bug', '没重写 equals 和 hashCode', '应该用 ArrayList', '对象内存地址不同没办法'], answer: 1, explain: '不重写就沿用 Object 默认实现：equals 比地址、hashCode 返回对象标识哈希，"内容相同"的两个对象自然各占一个桶。' },
    ],
  },
  {
    day: 5, stage: '集合', title: 'Map 深水区',
    points: [
      'HashMap 遍历顺序不确定；要插入序用 LinkedHashMap，要键排序用 TreeMap。',
      'get 不存在的 key 返回 null——但 value 类型是 int 等基本类型包装时，自动拆箱 <b>NPE</b>！用 getOrDefault。',
      'JDK7 HashMap 头插法并发扩容会链表成环 → CPU 100%；JDK8 改尾插但并发仍会丢数据，它依然不是线程安全的。',
      'computeIfAbsent / merge 是初始化嵌套集合的优雅写法，比 if-contains-else-put 少一次哈希查找。',
    ],
    questions: [
      { q: 'Map<String, Integer> map = new HashMap<>(); map.get("x") 的结果是？', options: ['0', 'null', 'NPE 异常', '"null"'], answer: 1, explain: 'get 返回 null 本身没问题。危险的是赋给 int：int v = map.get("x") 会触发拆箱 null.intValue() 抛 NPE。' },
      { q: '统计单词次数，JDK8+ 最推荐写法是？', options: ['if(map.containsKey(w)) map.put(w, map.get(w)+1); else map.put(w,1);', 'map.merge(w, 1, Integer::sum);', 'map.put(w, 1);', 'map.putIfAbsent(w, 1);'], answer: 1, explain: 'merge 一行搞定：不存在放 1，存在按函数累加。A 功能对但查两次哈希；D 只在不存在时放 1，统计不了次数。' },
    ],
  },
  {
    day: 6, stage: '并发', title: '多线程入门坑',
    points: [
      '调用 run() 不是开线程！只有 start() 才创建新线程，run() 只是普通方法调用。',
      'i++ 不是原子操作（读-改-写三步），volatile 也救不了，要用 AtomicInteger 或锁。',
      'sleep(1000) 不释放锁；wait() 必须在 synchronized 块里且会释放锁——两者最经典辨析。',
      '子线程抛出的异常主线程 try-catch 接不到：线程是独立执行栈，要用 UncaughtExceptionHandler 或 Future.get() 获取。',
    ],
    questions: [
      { q: '两个线程同时执行 count++（volatile int count）1000 次，最终 count 可能是？', options: ['一定是 2000', '一定小于 2000 且随机', '2000 或 1999', '报并发异常'], answer: 1, explain: 'volatile 只保证可见性不保证原子性，读-改-写交错会丢更新，结果 ≤ 2000 的随机值。' },
      { q: '关于 sleep 和 wait，正确的是？', options: ['都在 Object 类里', 'sleep 会释放锁', 'wait 必须在 synchronized 中且释放锁', '效果一样'], answer: 2, explain: 'wait 是 Object 方法、必须持锁调用且释放锁；sleep 是 Thread 静态方法、抱着锁睡。' },
    ],
  },
  {
    day: 7, stage: '并发', title: '线程池误用',
    points: [
      '禁止 Executors.newFixedThreadPool：无界队列堆积任务导致 OOM——阿里规约明令，手动 new ThreadPoolExecutor。',
      '核心线程未满时来了任务先开核心线程（不是先排队）；队列满了才开非核心线程——顺序和直觉相反。',
      'CallerRunsPolicy 是最友好的拒绝策略：让提交线程自己执行，天然起到反压限流作用。',
      '线程池里慎用 ThreadLocal：线程复用导致"上个任务的脏数据"串到下个任务，用完必须 remove。',
    ],
    questions: [
      { q: 'corePoolSize=2, maxPoolSize=5, queue=10。已有 2 核心线程忙，再来第 3 个任务会？', options: ['创建第 3 个线程', '进队列排队', '触发拒绝', '丢弃任务'], answer: 1, explain: '核心满 → 先入队；队列(10)也满了才会开非核心线程到 5；全满才拒绝。先排队后扩容是考点。' },
      { q: '线程池用 ThreadLocal 存用户信息，第二个任务读到了第一个任务的用户——原因是？', options: ['ThreadLocal 线程不安全', '线程复用且没 remove，残留了旧值', '内存溢出', 'ThreadLocal 是单例'], answer: 1, explain: '线程池的线程用完不销毁，ThreadLocalMap 跟着线程存活。必须在 finally 中 remove()。' },
    ],
  },
  {
    day: 8, stage: 'JVM', title: '内存与 GC 误区',
    points: [
      'GC Roots 可达性分析：不是"有引用就不回收"，而是"从 Roots 不可达才回收"——对象间互相引用但都不可达，照样回收。',
      '静态集合类是内存泄漏重灾区：往 static Map 里塞对象永不清理 = 永不回收。',
      'System.gc() 只是"建议"，GC 时机不受程序员控制——不要在代码里指望它释放内存。',
      '堆 OOM ≠ 内存泄漏，也可能是堆太小（-Xms -Xmx）或一次性加载超大文件/大查询。',
    ],
    questions: [
      { q: 'ObjA.obj = objB; ObjB.obj = objA; 除此之外无任何引用，这两个对象会被回收吗？', options: ['不会，互相引用着', '会，可达性分析判定不可达', '不会，引用计数为 2', '随机回收'], answer: 1, explain: 'JVM 用可达性分析不用引用计数，循环引用从 GC Roots 不可达照样回收——这是引用计数法的缺陷而 JVM 规避了它。' },
      { q: '线上服务慢慢变卡最终 OOM，最可能的原因是？', options: ['CPU 太慢', '内存泄漏（对象只进不出）', '磁盘满', '网络延迟'], answer: 1, explain: '渐进式卡顿到 OOM 是内存泄漏典型症状：静态集合、未关闭资源、ThreadLocal 残留都是常见源头。' },
    ],
  },
  {
    day: 9, stage: 'MySQL', title: 'SQL 基础易错',
    points: [
      '<code>WHERE COUNT(*) > 1</code> 直接报错：聚合结果过滤要用 <b>HAVING</b>——WHERE 过滤行，HAVING 过滤组。',
      'NULL 参与比较全是 UNKNOWN：<code>WHERE col != \'x\'</code> <b>查不出 col 为 NULL 的行</b>，要 IS NULL 显式处理。',
      '<code>COUNT(col)</code> 不统计该列 NULL 的行，<code>COUNT(*)</code> 统计所有行——结果可能不一样。',
      'SELECT 非聚合列必须出现在 GROUP BY 里（MySQL 宽松模式下不报错但结果不确定，是坑不是特性）。',
    ],
    questions: [
      { q: 'SELECT dept, COUNT(*) FROM emp WHERE salary > 5000 GROUP BY dept HAVING COUNT(*) > 10; 执行顺序是？', options: ['WHERE→GROUP→HAVING→SELECT', 'SELECT→WHERE→GROUP→HAVING', 'GROUP→WHERE→HAVING→SELECT', 'HAVING→WHERE→GROUP→SELECT'], answer: 0, explain: '标准顺序：FROM→WHERE(过滤行)→GROUP BY(分组)→HAVING(过滤组)→SELECT(投影)→ORDER BY→LIMIT。' },
      { q: '表里有 NULL 的 phone 行，SELECT COUNT(*), COUNT(phone) 的关系是？', options: ['一定相等', 'COUNT(*) ≥ COUNT(phone)', 'COUNT(*) ≤ COUNT(phone)', '都为 0'], answer: 1, explain: 'COUNT(*) 数行数（含 NULL 行），COUNT(phone) 跳过 NULL——所以 COUNT(*) ≥ COUNT(phone)。' },
    ],
  },
  {
    day: 10, stage: 'MySQL', title: '索引与性能',
    points: [
      '联合索引 (a,b,c)：查询必须从 a 开始连续命中，<code>WHERE b=1</code> 完全用不上索引（最左前缀）。',
      '范围查询会"断档"：<code>WHERE a=1 AND b>10 AND c=2</code>，c 用不上索引（b 是范围后 c 无序）。',
      'LIKE 前导 % 索引失效：<code>LIKE \'%关键字\'</code> 用不上索引；后缀形式 <code>LIKE \'关键字%\'</code> 不失效。',
      '索引列上做函数/运算必失效：<code>WHERE YEAR(dt)=2024</code> 改写成范围条件 <code>dt >= \'2024-01-01\' AND dt < \'2025-01-01\'</code>。',
    ],
    questions: [
      { q: '联合索引 (city, age)，以下哪个查询能完整用到索引？', options: ["WHERE age=20", "WHERE city='北京' AND age=20", "WHERE age=20 AND city LIKE '%京'", "WHERE city LIKE '%京%'"], answer: 1, explain: '最左前缀 + 等值连续匹配才能完整利用 (city, age)。A 缺最左列；C 的 LIKE 前导 % 失效；D 同理。' },
      { q: 'WHERE user_id + 0 = 100 没走索引，怎么改？', options: ['加 /+INDEX/ 提示', '改写为 WHERE user_id = 100', '换成 OR 条件', '重建表'], answer: 1, explain: '对索引列做运算导致失效，把运算移出列：user_id = 100 直接命中。核心原则：运算留右边，列保持"干净"。' },
    ],
  },
  {
    day: 11, stage: 'MySQL', title: '事务与锁',
    points: [
      'MySQL InnoDB 默认隔离级别是 RR（可重复读），不是 SQL 标准默认的 RC。',
      'RR 下快照读（普通 SELECT）靠 MVCC 防幻读；当前读（SELECT ... FOR UPDATE）靠临键锁防幻读。',
      '@Transactional 默认只回滚 RuntimeException——抛 IOException 不会回滚！务必 rollbackFor = Exception.class。',
      '同类自调用 @Transactional 方法不走代理、事务失效——拆到另一个 Bean 或注入自身代理。',
    ],
    questions: [
      { q: '事务方法 A 内部 catch 了 RuntimeException 没 rethrow，结果是？', options: ['回滚', '不回滚，正常提交', '编译报错', '抛出新异常'], answer: 1, explain: 'Spring 事务靠"异常穿过代理"触发回滚，异常被吃掉=事务无感知=照常提交。要回滚就 rethrow 或 TransactionAspectSupport 回滚标记。' },
      { q: 'UserService.update() 调用同类的 this.save()（@Transactional），save 的事务生效吗？', options: ['生效', '不生效，this 绕过了代理对象', '部分生效', '编译失败'], answer: 1, explain: 'AOP 事务的本质是代理对象包裹，this 调用是原始对象方法调用，切面根本不在场。解法：拆类 / 注入自身代理 / AopContext。' },
    ],
  },
  {
    day: 12, stage: 'Spring', title: 'IoC 与注入',
    points: [
      '@Autowired 按<b>类型</b>注入，同类型多个 Bean 启动报错 NoUniqueBeanDefinitionException——配合 @Qualifier("名字") 或 @Primary。',
      '@Resource 是 JDK 注解，按<b>名称</b>注入（先名字后类型）。',
      '构造器注入是官方推荐：依赖不可变、防止 NPE、便于测试；字段注入的坑：无法在构造时校验、隐藏依赖。',
      '单例 Bean 里放可变成员变量 = 并发灾难：Bean 无状态才线程安全。',
    ],
    questions: [
      { q: '接口 PayService 有 wxPay 和 aliPay 两个实现，@Autowired PayService 会？', options: ['随机注入一个', '注入第一个扫描的', '启动报错（除非加 @Primary/@Qualifier）', '注入代理集合'], answer: 2, explain: '按类型找到 2 个候选，无法决策直接启动失败。解法：@Primary 标默认、@Qualifier 指名、或注入 List<PayService> 做策略模式。' },
      { q: '以下哪种注入方式被 Spring 官方最推荐？', options: ['字段注入 @Autowired', 'setter 注入', '构造器注入', '静态变量持有'], answer: 2, explain: '构造器注入保证依赖不可变且非空、利于单元测试、暴露循环依赖。Spring 官方文档与阿里规约一致推荐。' },
    ],
  },
  {
    day: 13, stage: '前端/接口', title: 'HTTP 与接口易错',
    points: [
      'POST 不是"绝对安全"也不幂等；PUT 幂等、POST 不幂等——重复提交风险在 POST 上，要幂等设计。',
      'GET 参数有长度限制（浏览器 URL 约 2KB~8KB），大参数用 POST body。',
      '401 是"未认证"（没登录/Token 失效），403 是"已认证但无权限"——混用是接口设计常见错误。',
      '跨域是<b>浏览器行为</b>：Postman 不跨域，浏览器才管 CORS；解决靠后端响应 Access-Control-Allow-Origin 或网关代理。',
    ],
    questions: [
      { q: '用户已登录但访问无权限的资源，应返回？', options: ['401', '403', '404', '500'], answer: 1, explain: '401 Unauthorized=没登录或凭证失效；403 Forbidden=身份已知但权限不够。语义分清，前端才能正确引导（跳登录 vs 提示无权限）。' },
      { q: '前端 fetch 报 CORS 错误，但 Postman 请求同一接口正常，说明？', options: ['后端挂了', '跨域是浏览器同源策略行为，需后端配 CORS 头', 'Postman 破解了接口', '前端代码有 bug'], answer: 1, explain: '同源策略只在浏览器生效。解法：后端加 Access-Control-Allow-Origin / 网关统一处理 / dev 代理。' },
    ],
  },
  {
    day: 14, stage: 'Redis', title: '缓存易错',
    points: [
      'Redis 事务不回滚：MULTI/EXEC 中途出错已执行的命令不撤销——强一致回滚需求别指望 Redis。',
      'setnx 分布式锁必须带<b>唯一值 + Lua 原子解锁</b>：否则 A 超时误删 B 的锁是经典事故。',
      '大 key（10MB 的 value）删除会阻塞单线程：用 UNLINK 异步删、SCAN 代替 KEYS。',
      '缓存空值防穿透必须设<b>短过期时间</b>，否则脏数据永生。',
    ],
    questions: [
      { q: '锁 set(lockKey, clientId, NX, EX 10)，释放锁正确姿势是？', options: ['直接 DEL lockKey', 'Lua 脚本：GET 比对 clientId 相同才 DEL', 'EXPIRE 0', '等 10 秒自然过期'], answer: 1, explain: '直接 DEL 可能删掉别人的锁（A 执行慢锁已过期被 B 拿到）。GET+比对+DEL 必须原子，用 Lua。' },
      { q: '以下哪个场景最该给缓存 value 加"逻辑过期"？', options: ['全部商品缓存', '秒杀热点商品', '配置字典表', '用户 Session'], answer: 1, explain: '热点 key 物理过期瞬间的并发重建就是击穿。逻辑过期（不设 TTL，value 内带过期时间+异步刷新）专治热点。' },
    ],
  },
  {
    day: 15, stage: '工程化', title: 'Git 与 Linux 坑',
    points: [
      '<code>git pull</code> 默认 merge，冲突解决后要先 add 再 commit——rebase 方式则要 git rebase --continue。',
      '<code>git reset --hard</code> 会<b>永久丢弃</b>未提交修改，执行前先 stash 或确认。',
      '<code>rm -rf /</code> 级别事故：rm 命令没有回收站，路径先 pwd 确认再删；变量为空的 <code>rm -rf $dir/</code> 是删库根源。',
      'chmod 777 不是解决方案是埋雷；日志排查三板斧：tail -f、grep、less +F。',
    ],
    questions: [
      { q: '发现 git reset --hard 丢弃了未提交的代码，还有救吗？', options: ['彻底没了', 'git fsck --lost-found 捞 dangling blob 有机会找回', '重启电脑', '只能重写'], answer: 1, explain: 'Git 对象仍在 .git/objects 里成为悬空对象，git fsck --lost-found 或 IDE 的 Local History 能救回一部分——这也是"勤 commit"的理由。' },
      { q: '排查"服务占用 8080 端口"，命令组合是？', options: ['ls -l /var/log', 'lsof -i:8080 或 ss -tlnp | grep 8080', 'ps aux | grep java 即可', 'top'], answer: 1, explain: '按端口找进程：lsof -i:8080（mac）或 ss -tlnp | grep 8080（Linux），拿到 PID 再 kill。ps aux 按进程名搜不适合定位端口。' },
    ],
  },
  {
    day: 16, stage: 'Java 进阶', title: '泛型与类型',
    points: [
      '泛型是<b>编译期</b>检查，运行时擦除：<code>List&lt;String&gt;</code> 和 <code>List&lt;Integer&gt;</code> 的 Class 是同一个。',
      '<code>List&lt;Object&gt;</code> 不是 <code>List&lt;String&gt;</code> 的父类！泛型不协变，要用 <code>? extends</code> 通配。',
      '不能 new T()：泛型类型运行时不存在，需要 Class&lt;T&gt; 反射或传入工厂。',
      '包装类比较永远 equals：Integer 缓存 -128~127 的 == true 是陷阱不是福利。',
    ],
    questions: [
      { q: 'List<String> a = new ArrayList<>(); List<Integer> b = new ArrayList<>(); a.getClass() == b.getClass() 结果是？', options: ['true', 'false', '编译报错', '运行异常'], answer: 0, explain: '类型擦除：运行时都是 ArrayList.class，泛型参数只存在于编译期。这也是为什么反射能绕过泛型检查塞入异构元素。' },
      { q: 'Integer a = 100, b = 100; a == b 与 Integer c = 200, d = 200; c == d 的结果分别是？', options: ['true, true', 'true, false', 'false, false', 'true, 编译错误'], answer: 1, explain: 'IntegerCache 缓存 -128~127：100 在范围内是同一缓存对象 == 为 true；200 超范围各自 new，== 为 false。包装类永远用 equals。' },
    ],
  },
  {
    day: 17, stage: 'MyBatis', title: 'MyBatis 易错',
    points: [
      '<code>#{}</code> 预编译防注入，<code>${}</code> 字符串替换有注入风险——表名/排序字段必须白名单校验后再 ${}。',
      '模糊查询写法：<code>LIKE CONCAT(\'%\', #{kw}, \'%\')</code>，不要 <code>LIKE \'%${kw}%\'</code>。',
      'resultType 对不上字段名就静默为 null：开驼峰映射 mapUnderscoreToCamelCase 或用 resultMap。',
      'insert 后要拿自增 id：加 <code>useGeneratedKeys="true" keyProperty="id"</code>，否则对象里 id 一直是 null。',
    ],
    questions: [
      { q: '防止 SQL 注入，动态排序字段应如何处理？', options: ['直接 #{orderBy}', '${orderBy} 前加白名单校验', '前端传什么就排什么', '禁止排序'], answer: 1, explain: '#{} 会被加引号变成字符串导致 ORDER BY 失效，所以只能 ${}，但必须后端白名单限定可选列名，杜绝注入。' },
      { q: '查询结果某字段总是 null，数据库里明明有值，最可能原因是？', options: ['数据库坏了', 'Java 属性名与列名不匹配且未开驼峰映射', 'SQL 写错了', '事务未提交'], answer: 1, explain: 'user_name 列默认映射不到 userName 属性。开 map-underscore-to-camel-case=true 或写 resultMap 显式映射。' },
    ],
  },
  {
    day: 18, stage: '并发进阶', title: '锁的进阶坑',
    points: [
      '可重入：同一线程可重复获取自己持有的锁，否则递归/嵌套调用直接死锁。',
      '死锁四条件：互斥、持有等待、不可剥夺、循环等待——破坏任一即可预防（统一加锁顺序最常用）。',
      'synchronized 锁的对象换引用 = 换锁：<code>lock = new Object()</code> 后旧锁作废，两拨人两把锁。',
      '双重检查单例必须 volatile：防 new 的"分配-初始化-赋值"重排，别的线程拿到半成品。',
    ],
    questions: [
      { q: '线程 1 锁 A 再锁 B；线程 2 锁 B 再锁 A。会发生？', options: ['正常执行', '死锁（循环等待）', '自动回滚', '活锁'], answer: 1, explain: '互相持有对方要的锁并循环等待=死锁四条件齐活。预防：全局统一"先 A 后 B"的加锁顺序破坏循环等待。' },
      { q: 'DCL 单例中 instance 不加 volatile 的隐患是？', options: ['性能下降', '其他线程可能拿到未初始化完成的对象', '不能实例化', '内存泄漏'], answer: 1, explain: 'new 的三步可能重排为"先赋引用再初始化"，判空通过的线程拿到半成品对象开始用，诡异 NPE。volatile 禁止相关重排。' },
    ],
  },
  {
    day: 19, stage: 'JVM', title: '调参与排查',
    points: [
      '-Xms 和 -Xmx 设成一样：避免堆动态伸缩抖动。',
      'OOM 时堆转储：<code>-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=...</code>，事后用 MAT 分析支配树找泄漏源。',
      'CPU 100% 排查五步：top 找进程 → top -Hp 找线程 → printf %x 转十六进制 → jstack 抓栈 → 按 nid 定位代码行。',
      '频繁 Full GC 常见原因：内存泄漏、元空间不够、大对象直接进老年代、System.gc 被调用。',
    ],
    questions: [
      { q: 'jstack 输出中怎么定位目标线程？', options: ['按线程名搜索', '把 top -Hp 的线程 PID 转 16 进制比对 nid', '看最后 10 行', '按时间排序'], answer: 1, explain: 'jstack 的 nid=0x... 是十六进制线程 ID。top 找到吃 CPU 的十进制 PID → printf "%x" 转换 → 在栈里搜 0x...。' },
      { q: '-Xms4g -Xmx4g 的主要目的是？', options: ['加快 GC', '避免堆动态扩缩带来的抖动', '省内存', '规范写法好看'], answer: 1, explain: '初始=最大避免运行时向 OS 申请/归还内存，消除抖动让延迟平稳，生产标准配置。' },
    ],
  },
  {
    day: 20, stage: 'MySQL', title: '日志与主从',
    points: [
      'redo log 循环写（物理、InnoDB 层、崩溃恢复），binlog 追加写（逻辑、Server 层、复制/归档）——别搞混。',
      '两阶段提交（redo prepare → binlog → redo commit）保证两日志一致，否则主从数据分叉。',
      '主从延迟原因：从库单线程回放、大事务、从库机器差。缓解：并行复制、拆大事务、半同步。',
      '删库不用怕 binlog：用全量备份 + binlog 重放到误操作前一刻（前提：binlog 开着且格式 row）。',
    ],
    questions: [
      { q: '只写 redo log 不写 binlog 会导致？', options: ['无法崩溃恢复', '主从复制数据不一致', '查询变慢', '索引失效'], answer: 1, explain: 'redo 保证本机崩溃恢复，binlog 是复制与归档的载体，没有它从库就收不到变更。' },
      { q: '主从延迟过大，以下哪个不是有效缓解手段？', options: ['开启并行复制', '大事务拆小', '从库硬件升级', '把 binlog 格式改回 statement'], answer: 3, explain: 'statement 格式省日志但可能主从不一致（函数/now() 执行结果不同），row 才是可靠格式，改回去治标不治本还有害。' },
    ],
  },
  {
    day: 21, stage: 'Spring', title: 'Bean 与自动配置',
    points: [
      '自动配置的开关是 @Conditional 系：classpath 没有驱动类就不装配——所以引了 starter 不配 URL 会启动失败。',
      '自定义 Bean 会覆盖自动配置：@ConditionalOnMissingBean 是"你有我就让位"的机关。',
      'Bean 默认单例：注入 List&lt;X&gt; 拿到全部实现是策略模式标配，配合 Map&lt;String, X&gt; 按名取。',
      '@Value 拿不到配置的排查：配置文件位置、前缀拼写、@ConfigurationProperties 未加 @EnableConfigurationProperties。',
    ],
    questions: [
      { q: '自动配置类里 @Bean 方法常带 @ConditionalOnMissingBean，作用是？', options: ['防止重复启动', '用户自己定义了同类型 Bean 时让位，保证可定制', '加速启动', '循环依赖检测'], answer: 1, explain: '这是"默认配置可被覆盖"的机关：容器已有该类型 Bean 就跳过默认装配，实现约定优于配置又留足定制空间。' },
      { q: '同类接口多实现，最优的注入姿势是？', options: ['@Qualifier 硬编码', '注入 List<X> 或 Map<String, X> 遍历/按名取', '写 if-else new', '加 static'], answer: 1, explain: '注入集合天然收集所有实现，新增实现零改动；Map 的 key 是 Bean 名。这就是 Spring 里的策略模式落地。' },
    ],
  },
  {
    day: 22, stage: '前端', title: 'JS 与 Vue 易错',
    points: [
      'js 的 == 隐式转换天坑：\'1\' == 1 为 true、null == undefined 为 true——永远用 ===。',
      '深拷贝别用 JSON.parse(JSON.stringify(obj))：丢函数、丢 undefined、Date 变字符串；用 structuredClone 或库。',
      'Vue3 里 ref 在 script 要 .value，template 里自动解包——script 中忘 .value 是最高频 bug。',
      'props 是单向数据流：子组件直接改 props 不报错但不生效（对象内部属性改除外），要 emit 事件回传。',
    ],
    questions: [
      { q: 'console.log(0 == \'\', 0 === \'\') 输出？', options: ['true, true', 'true, false', 'false, false', 'false, true'], answer: 1, explain: '== 会把 \'\' 转成 0；=== 类型不同直接 false。规则：一律 ===，除 null 判断（x == null 可同时匹配 null/undefined）外。' },
      { q: 'const user = ref({name:\'a\'}); 想改名字，正确的是？', options: ['user.name = \'b\'', 'user.value.name = \'b\'', 'user = ref({name:\'b\'})', 'refUser(user)'], answer: 1, explain: 'script 中 ref 要 .value 拿到内部对象再改属性。整个替换也可以 user.value = {...}。A 少了 .value；C 丢响应性引用。' },
    ],
  },
  {
    day: 23, stage: 'MQ', title: '消息队列易错',
    points: [
      '消费失败别无限重试：设重试次数 + 死信队列，否则毒丸消息阻塞整个队列。',
      '顺序消息只能在"单队列单消费者"内保证，多分区并行天生无序——按业务 key 路由到同队列。',
      '消息幂等必须做：至少一次投递语义下重复不可避免，唯一索引/状态机/setnx 三选一。',
      '发送端本地消息表：业务与消息记录同事务落库，定时补偿扫描——防"业务成功但消息没发出去"。',
    ],
    questions: [
      { q: '某条消息格式非法导致消费永远失败，正确处理是？', options: ['无限重试直到成功', '重试 N 次后进死信队列人工处理', '直接丢弃不记录', '重启消费者'], answer: 1, explain: '"毒丸"消息无限重试会阻塞后续消息。有限重试 + 死信/人工干预是标准方案，丢弃要有日志与告警。' },
      { q: '订单状态流转消息要求同订单严格有序，怎么设计？', options: ['全局单队列单消费者', '按 orderId 哈希路由到固定分区，同分区单消费者', '消息里加时间戳排序', '发三遍取第一个'], answer: 1, explain: '按业务 key 路由同队列/分区，保证局部有序且保留并行度（不同订单互不阻塞）。全局串行性能太差。' },
    ],
  },
  {
    day: 24, stage: '网络', title: 'TCP/HTTP 深坑',
    points: [
      'TCP 三次握手缺一不可：防"历史重复连接请求"造成的资源浪费（两次握手即可建成失效连接）。',
      'TIME_WAIT 是主动关闭方 2MSL 等待：大量 TIME_WAIT 不是服务端 bug，是它主动关连接多（短连接架构病）。',
      'HTTP 1.1 的队头阻塞在 HTTP/2 用多路复用解决（TCP 层的还在，HTTP/3 换 QUIC/UDP）。',
      'HTTPS = HTTP + TLS：非对称交换密钥 → 对称加密通信；证书链验证防中间人。',
    ],
    questions: [
      { q: '服务端出现数万 TIME_WAIT，最合适的优化方向是？', options: ['调大文件描述符', '改长连接/连接复用（Keep-Alive、连接池）', '关闭防火墙', '升级 CPU'], answer: 1, explain: 'TIME_WAIT 堆积根因是频繁建断短连接。上连接池/Keep-Alive 从架构上减少握手次数才是治本。' },
      { q: 'HTTPS 握手后传输数据用的是？', options: ['非对称加密', '对称加密', '不加密', 'Base64'], answer: 1, explain: '非对称只用于交换会话密钥（慢），之后用对称密钥加密通信（快）。兼具安全与性能。' },
    ],
  },
  {
    day: 25, stage: '算法', title: '编码习惯坑',
    points: [
      '整型溢出：mid = (l + r) / 2 在 r 很大时溢出，写 <code>mid = l + (r - l) / 2</code>。',
      '字符串比较用 equals；字符判断 charAt 返回 char，用 == 比较 char 是对的（基本类型）。',
      '递归没写终止条件 = StackOverflowError；写对条件但没收敛（每层规模不减）同样爆栈。',
      ' HashMap 的 key 用可变对象（如数组）= 取不回来：hashCode 随内容变化，永远匹配不上。',
    ],
    questions: [
      { q: '二分查找中 mid = (left + right) / 2 的隐患是？', options: ['精度丢失', 'left+right 溢出为负', '死循环', '越界异常'], answer: 1, explain: '大数组 right 接近 Integer.MAX_VALUE 时相加溢出成负数。l + (r-l)/2 数学等价且不溢出，是面试手写规范。' },
      { q: '用 HashMap<int[], Integer> 以数组为 key 存"前缀和"，为什么取不到值？', options: ['HashMap 不支持数组 key', '数组 hashCode 随内容变，存取时哈希不一致', '数组太大', '自动装箱失败'], answer: 1, explain: 'Java 数组没有按内容重写 hashCode/equals，且内容一旦被改，查找时的哈希与放入时不同——用 String 或不可变对象做 key。' },
    ],
  },
  {
    day: 26, stage: '安全', title: '安全防线坑',
    points: [
      'SQL 注入唯一正解：参数化查询/预编译（MyBatis #{}），拼接 SQL 一律死刑。',
      'XSS 防御：输出转义 + CSP；富文本用白名单过滤（Jsoup sanitize）。',
      '密码存储：BCrypt（自带盐+慢哈希），禁止 MD5 裸存——彩虹表秒破。',
      'JWT 无法主动作废：登出/封号要让 Token 失效，需配合 Redis 黑名单或短过期+刷新 Token。',
    ],
    questions: [
      { q: '用户登录密码的正确存储方式是？', options: ['明文存库', 'MD5 加密存', 'BCrypt 加盐哈希存', 'Base64 编码存'], answer: 2, explain: 'MD5 速度太快可被彩虹表/ GPU 爆破。BCrypt/PBKDF2/Argon2 设计上就慢+自带盐，是密码哈希标准。' },
      { q: '用户点击"退出登录"后 JWT 仍可用一段时间，原因是？', options: ['JWT 有 bug', 'JWT 无状态自包含，服务端不存储无法直接作废', '浏览器缓存', 'HTTPS 问题'], answer: 1, explain: 'JWT 的优点（无状态）正是痛点：签发后无法吊销。方案：短 TTL + refresh token、Redis 黑名单、改用 Session。' },
    ],
  },
  {
    day: 27, stage: '接口设计', title: 'RESTful 与工程规约',
    points: [
      'URL 用名词复数：/users/1/orders，动词靠 HTTP 方法表达——/getUserById 是反模式。',
      '统一响应体 { code, message, data }：业务错误也返回 HTTP 200 + 业务码，是国内外主流实践（或严格 RESTful 用状态码，团队统一即可）。',
      '分页参数pageNum/pageSize，返回 total——不返回 total 的分页是残废。',
      '接口版本化：/api/v1/...，大改不破坏旧客户端。',
    ],
    questions: [
      { q: 'RESTful 风格下"给 ID 为 5 的订单取消"，最合理的是？', options: ['GET /cancelOrder?id=5', 'POST /orders/5/cancel', 'PUT /orders/5 status=cancelled', 'DELETE /orders/5'], answer: 2, explain: '取消本质是把订单状态改为 cancelled，PUT 更新资源语义最准；B 的 /cancel 是动词路径；D 会误删订单。' },
      { q: '分页接口响应里为什么必须返回 total？', options: ['好看', '前端计算总页数与"是否有下一页"，否则无法渲染分页控件', '协议要求', '性能优化'], answer: 1, explain: '没有 total 前端只能"盲翻页"。性能敏感场景可退化返回 hasNext 布尔（游标分页）——但这是权衡，不是省略理由。' },
    ],
  },
  {
    day: 28, stage: '分布式', title: '分布式入门坑',
    points: [
      'CAP 只能三选二：P 必选（网络分区必然存在），实际是 CP（ZK/etcd）与 AP（Eureka/Nacos AP 模式）的取舍。',
      '分布式 ID 别用自增：分库分表冲突 + 暴露业务量；用雪花算法（时钟回拨是坑）或号段模式。',
      '幂等是分布式的第一公民：超时重试无处不在，接口不幂等 = 数据灾难。',
      '分布式锁必须考虑：过期时间与业务时长的匹配、看门狗续期、锁的可重入性。',
    ],
    questions: [
      { q: '注册中心 Nacos（AP 模式）在分区时允许节点数据短暂不一致，符合 CAP 的？', options: ['CP', 'AP', 'CA', 'CAP 全满足'], answer: 1, explain: '注册中心要的是可用性（服务发现不能全挂），接受最终一致。ZK 选 CP：分区时拒绝写保证一致，选举期间不可用。' },
      { q: 'Redisson 看门狗（watchdog）解决什么问题？', options: ['锁竞争', '业务未执行完但锁过期被别人抢走——自动续期', '网络抖动', '内存回收'], answer: 1, explain: '固定 TTL 骑虎难下：设短了业务没完锁没了，设长了宕机等太久。看门狗后台定时续期，兼顾安全与活性。' },
    ],
  },
  {
    day: 29, stage: '数据库进阶', title: '优化实战坑',
    points: [
      '深分页 LIMIT 1000000,10 慢在"扫过前 100 万行再丢弃"：改游标 WHERE id > lastId LIMIT 10 或延迟关联。',
      'select * 三宗罪：回表取多余列、无法覆盖索引、网络传输大——明确列出需要的字段。',
      '大批量 insert：单条循环 10 万次 vs 批量 values 500 一批，差百倍性能；还要关自动提交。',
      'ONLINE DDL 注意：大表加字段也可能锁表（视算法与版本），生产变更用 gh-ost/pt-osc。',
    ],
    questions: [
      { q: 'SELECT * FROM orders ORDER BY id LIMIT 5000000, 10 优化，正确的是？', options: ['加内存', '先查 id：SELECT id ... LIMIT 5000000,10，再按 id IN 回查整行', '改用 OR 条件', '删索引'], answer: 1, explain: '延迟关联/覆盖索引：先在二级索引（或主键）上完成翻页拿到 id，再回表 10 行——把"扫 500 万行回表"变成"索引上滑过+回表 10 行"。' },
      { q: '为什么生产环境禁止 SELECT *？（不正确的理由是？）', options: ['无法利用覆盖索引', '传输多余数据', '可能触发回表代价', '会导致表锁'], answer: 3, explain: 'SELECT * 与表锁无关（InnoDB 行锁为主）。前三条都是真实代价：覆盖索引失效、IO/带宽浪费、回表成本。' },
    ],
  },
  {
    day: 30, stage: '面试冲刺', title: '面试表达坑',
    points: [
      '简历写"精通"必被往死里问：写"熟悉/掌握"，留活口。',
      '不会的题别硬编：说"这块我了解程度有限，但我理解原理是 X，可以往 Y 方向查证"——诚实+思路比编造强一百倍。',
      '项目介绍 STAR 法则：背景(S)→任务(T)→行动(A)→结果(R)带数字："QPS 从 200 优化到 3000"。',
      '反问环节别问"加不加班"先问"团队技术栈/导师制/业务方向"——展示技术热情。',
    ],
    questions: [
      { q: '面试官问到一个你完全不会的问题，最佳策略是？', options: ['瞎编蒙混', '沉默摇头', '坦诚不熟 + 给出基于已知知识的推理思路', '反问面试官'], answer: 2, explain: '面试考察的是解决问题的思维方式。坦诚边界+现场推理展示潜力，比一个错误答案有价值得多。' },
      { q: '介绍项目时最有说服力的是？', options: ['罗列用过的技术名词', '强调代码量与加班', 'STAR 结构：业务背景→技术挑战→你的方案→量化结果', '只讲架构图'], answer: 2, explain: '"QPS 3000、RT 50ms、事故率降 80%"这类量化结果 + 你个人的决策过程，才能证明这是"你的"项目。' },
    ],
  },

  /* ==================== V3 扩充：31~60 天（网络 / OS / MySQL / Redis 深入） ==================== */
  {
    day: 31, stage: '计算机网络', title: 'TCP 握手挥手坑',
    points: [
      '三次握手不是"三次通话"而是"三次报文"；SYN 消耗一个序号，SYN+ACK 也消耗——所以 ack=x+1。',
      'TIME_WAIT 一定在<b>主动关闭方</b>。压测机上几万 TIME_WAIT 是"你是客户端在大量短连接"，不是服务端问题。',
      '服务端大量 CLOSE_WAIT ≠ 网络问题，是<b>你的代码收到 FIN 后没调 close()</b>——九成是连接泄漏（没关流/连接池耗尽）。',
    ],
    questions: [
      { q: '服务端出现大量 CLOSE_WAIT，最可能的原因是？', options: ['被 SYN 攻击', '应用代码没有及时关闭连接（收到对方的 FIN 后未 close）', '带宽不足', 'TCP 版本太旧'], answer: 1, explain: 'CLOSE_WAIT 是"被动关闭方收到 FIN、自己还没 close"的状态。大量堆积=应用层泄漏，查代码里的资源关闭/连接池配置。' },
      { q: 'syncookie 的核心思想是？', options: ['加密 SYN 包', '不分配资源存连接，把连接信息编码进 ISN 返回，收到合法 ACK 再建', '提高队列长度', '直接拒绝所有连接'], answer: 1, explain: '把"半连接该记的信息"算进序号里发回客户端，服务端零存储——ACK 回来重新计算校验即可重建，队列打不满。' },
    ],
  },
  {
    day: 32, stage: '计算机网络', title: 'TCP 可靠性机制混淆点',
    points: [
      '滑动窗口是<b>流量控制</b>（管接收方），慢启动是<b>拥塞控制</b>（管网络），别混。',
      '快重传的触发条件是 <b>3 个重复 ACK</b>，不是 1 个——1 个可能只是乱序。',
      'RTO 超时比 3 个重复 ACK 严重得多：前者 cwnd 归 1 慢启动，后者减半快恢复。',
    ],
    questions: [
      { q: '收到 3 个重复 ACK 后，TCP 执行的是？', options: ['cwnd=1 重新慢启动', '快速重传丢失报文，ssthresh/cwnd 减半继续（快恢复）', '关闭连接', '窗口清零'], answer: 1, explain: '3 个重复 ACK=轻度丢包，温和处理。超时（RTO）才是重度：cwnd 归 1。' },
      { q: '接收方通告 rwnd=0 且窗口更新包丢失，靠什么机制避免死锁？', options: ['三次握手重来', '发送方的坚持定时器定期发零窗口探测报文', '直接断开', 'RST 复位'], answer: 1, explain: '零窗口后发送方启动 persist 定时器，周期性探测对方窗口是否恢复——打破"互相等待"的死锁。' },
    ],
  },
  {
    day: 33, stage: '计算机网络', title: 'HTTP 协议细节坑',
    points: [
      '301 是<b>永久</b>重定向（SEO 权重转移），302 临时（权重保留）——换域名要用 301。',
      '401 = 未认证（没登录），403 = 已认证但无权限——别答反。',
      'PUT 是幂等的（替换），POST 不幂等；DELETE 幂等但可能返回 404（第二次删没有了）。',
    ],
    questions: [
      { q: '接口返回 403，含义是？', options: ['没登录', '登录了但没有访问权限', '资源不存在', '服务器内部错误'], answer: 1, explain: '401 Unauthorized 实际是"未认证"，403 Forbidden 是"身份已知但拒绝"。语义别搞反，这是常见送分/送命题。' },
      { q: 'RESTful 设计中，把 POST /users/1/logout 改成更标准的写法是？', options: ['GET /logout?user=1', 'DELETE /sessions/1（删除会话，幂等语义）', 'POST /deleteLogout', 'PUT /users/1'], answer: 1, explain: 'REST 用资源思维：登出=删除会话资源。动词藏在 HTTP 方法里，URI 只放名词。' },
    ],
  },
  {
    day: 34, stage: '计算机网络', title: 'HTTPS/HTTP2 坑',
    points: [
      'HTTPS 证书验证的是"公钥属于该域名"，验证链是 网站证书→中间 CA→根 CA（浏览器内置）。',
      'TLS 1.2 握手 2-RTT、1.3 只要 1-RTT 且强制 ECDHE（前向安全）。',
      'HTTP/2 多路复用只解决 <b>HTTP 层</b>队头阻塞；TCP 丢包仍会卡所有流——所以有 HTTP/3。',
    ],
    questions: [
      { q: 'TLS 1.3 废弃 RSA 密钥交换的原因是？', options: ['RSA 太慢', 'RSA 不具备前向安全：私钥泄露后历史流量可被解密', 'RSA 不安全签名', '兼容问题'], answer: 1, explain: 'RSA 交换的会话密钥由公钥加密传输，私钥一泄，录下的历史流量全能解。ECDHE 的临时密钥每次独立，历史安全。' },
      { q: 'HTTP/2 服务端推送（Server Push）的正确理解是？', options: ['服务器可以主动给用户发消息', '在客户端请求 HTML 时，服务器预推其依赖资源（CSS/JS）减少往返', '实时聊天用', '推送通知'], answer: 1, explain: 'Push 是资源级别的预推，不是消息推送。实践效果不佳（浪费带宽），很多实现已移除——消息推送用 WebSocket/SSE。' },
    ],
  },
  {
    day: 35, stage: '计算机网络', title: 'DNS/CDN/URL 全流程坑',
    points: [
      'DNS 记录类型：A(IPv4)、AAAA(IPv6)、CNAME(别名)、MX(邮件)、NS(权威服务器)。',
      'CDN 调度发生在 <b>DNS 阶段</b>：CNAME 指向 CDN 的智能调度系统，按地理位置/负载返回边缘节点 IP。',
      '浏览器同源策略拦的是"响应"不是"请求"——请求发出去了，只是 JS 读不到响应。',
    ],
    questions: [
      { q: 'CNAME 记录的作用是？', options: ['把域名指向 IPv6', '把域名指向另一个域名（别名）', '设置邮件服务器', '反向解析'], answer: 1, explain: 'www.example.com CNAME → cdn.example.com → CDN 调度。IP 变动只改一处，所有别名生效。' },
      { q: '为什么服务器间的 HTTP 调用没有"跨域问题"？', options: ['服务器性能强', '同源策略是浏览器的安全机制，服务器间通信不经过浏览器', '服务器有特殊证书', '跨域只存在于 GET'], answer: 1, explain: 'CORS 拦截发生在浏览器。服务端互调（微服务 RPC/HTTP）不受此限——所以"用后端代理转发"也能绕过跨域。' },
    ],
  },
  {
    day: 36, stage: '操作系统', title: '进程线程通信坑',
    points: [
      '线程 crash（如空指针导致的段错误）会让<b>整个进程</b>挂掉——线程没有独立地址空间可逃。',
      '共享内存最快但<b>不同步</b>；消息队列自带格式但两次拷贝；管道 4MB 缓冲写满会阻塞。',
      'kill -9(SIGKILL) 不可被捕获，进程无法优雅退出；kill -15(SIGTERM) 才是优雅停机信号。',
    ],
    questions: [
      { q: '生产环境优雅停机应该用哪个信号？', options: ['kill -9', 'kill -15（SIGTERM），让进程执行 shutdown hook 释放资源', 'kill -1', '直接拔电源'], answer: 1, explain: 'SIGTERM 可捕获，应用可以处理完存量请求、刷缓冲、注销注册中心再退出。kill -9 跳过一切清理，可能丢数据/留下僵尸注册。' },
      { q: '两个进程通过共享内存交换数据，还需要什么配套机制？', options: ['什么都不需要', '信号量或互斥锁做同步互斥', '必须加 TLS', '必须每次重新 attach'], answer: 1, explain: '共享内存就是同一块物理内存，无内核介入保护。并发读写必须自己用信号量（P/V）或互斥锁协调。' },
    ],
  },
  {
    day: 37, stage: '操作系统', title: '内存管理坑',
    points: [
      'malloc 只分配<b>虚拟内存</b>；首次写入才缺页分配物理页——VIRT 大不等于真用了。',
      'TLB 是页表的缓存；进程切换换页表 → TLB 失效 → 这是进程切换贵的主因。',
      'free 后内存不一定归还 OS（glibc 的 ptmalloc 保留在进程堆里）——RSS 不降不是泄漏。',
    ],
    questions: [
      { q: '程序 malloc 了 4GB 但只写了 100MB，RES（物理驻留）大约是？', options: ['4GB', '约 100MB + 程序自身开销', '0', '2GB'], answer: 1, explain: '惰性分配：只写过的地方有物理页。RES≈实际触碰的页 + 代码/栈等。看内存泄漏要盯 RES 增长趋势。' },
      { q: 'Linux 查看某进程各线程 CPU 占用的命令是？', options: ['top（直接能看到）', 'top -Hp <pid> 或 ps -T -p <pid>', 'free -m', 'df -h'], answer: 1, explain: '-H 显示线程。找到高 CPU 线程后 printf "%x" 转十六进制，去 jstack dump 里搜 nid=0x... 定位代码。' },
    ],
  },
  {
    day: 38, stage: '操作系统', title: 'IO 多路复用坑',
    points: [
      'select 每次调用都要把 fd 集合<b>从用户态拷贝到内核态</b>并全量遍历——连接多时 O(n) 就是灾难。',
      'epoll 不是"一定比 select 快"：连接少且都活跃时差别不大；连接多活跃少时碾压。',
      'ET 模式必须配<b>非阻塞 fd + 循环读到 EAGAIN</b>；阻塞 fd 用 ET 会漏读。',
    ],
    questions: [
      { q: 'epoll 高效的根本原因是？', options: ['用了多线程', '红黑树注册免重复拷贝 + 事件回调就绪链表，只处理活跃 fd', 'fd 上限更大', '加密更快'], answer: 1, explain: '处理成本从"与总连接数成正比"降到"与活跃连接数成正比"——10 万连接 100 活跃只处理 100 个。' },
      { q: 'Redis 6.0 引入 IO 多线程后，命令执行是？', options: ['也多线程并行了', '仍然单线程串行执行（保住原子性），只把网络读写多线程化', '每个 key 一个线程', '变成协程'], answer: 1, explain: '瓶颈在网络包读写不在命令计算。IO Threads 并行收发包，执行仍串行——Redis 的原子性语义不变。' },
    ],
  },
  {
    day: 39, stage: '操作系统', title: '文件系统与零拷贝坑',
    points: [
      'PageCache 是内核的文件页缓存：读文件先查它，"写文件"默认也先写它（异步刷盘）——突然断电可能丢。',
      'sendfile 适合"文件→网卡"（Kafka/Nginx）；mmap 适合随机读写；两者都不适合所有场景。',
      'fsync 才是强制落盘；Java 的 FileChannel.force() 对应它——重要日志要显式调用。',
    ],
    questions: [
      { q: 'Kafka 消费消息快的原因组合是？', options: ['随机读+多线程', '顺序读 + sendfile 零拷贝 + PageCache 命中', '数据在内存数据库', '压缩算法'], answer: 1, explain: '日志段文件顺序追加+消费者顺序读，PageCache 命中率极高；sendfile 免用户态拷贝——单机百万级 TPS 的物理基础。' },
      { q: 'write() 返回成功，数据一定落盘了吗？', options: ['一定', '不一定，可能只在 PageCache，需 fsync 才强制落盘', '取决于文件名', '磁盘写永不缓存'], answer: 1, explain: 'write 到 PageCache 即返回（快但断电可能丢）。金融级日志/消息持久化必须 fsync（或依赖组件如 RocketMQ 的 SyncFlush）。' },
    ],
  },
  {
    day: 40, stage: 'MySQL 索引', title: '索引设计实战坑',
    points: [
      '区分度低的列（如性别）单独建索引意义不大——优化器可能弃用，回表比全表扫还慢。',
      '联合索引顺序原则：<b>最常用+区分度最高的放左边</b>；(a,b) 和 (b,a) 是两个不同索引。',
      '索引不是越多越好：每个索引都是一棵 B+ 树，写入要同步维护所有树，且占空间。',
    ],
    questions: [
      { q: '查询 WHERE gender=1 AND name=..., 最合理的联合索引是？', options: ['(gender, name)', '(name, gender)', '分别建两个单列', '(gender) 就够'], answer: 1, explain: 'gender 区分度极低放前面会先圈出一半数据；name 放左边先精确定位。若 (name, gender) 且只需 name 查询，还能兼做最左前缀。' },
      { q: '以下最不适合建索引的列是？', options: ['订单号（唯一）', '用户手机号', '性别字段', '创建时间'], answer: 2, explain: '性别只有两三个值，走索引过滤后仍剩近一半行，回表成本高于全表扫。低区分度列适合放进联合索引凑覆盖，不适合单建。' },
    ],
  },
  {
    day: 41, stage: 'MySQL 事务', title: '事务与锁实战坑',
    points: [
      '<b>死锁排查第一现场</b>：SHOW ENGINE INNODB STATUS 的 LATEST DETECTED DEADLOCK 段。',
      'UPDATE/DELETE 即使没 WHERE 命中行也会加锁范围放大（RR 下可能锁全表扫描路径）——条件必须走索引。',
      'SELECT ... FOR UPDATE 是当前读会加锁；普通 SELECT 是快照读不加锁——搞混就会"为什么我锁不住"。',
    ],
    questions: [
      { q: 'RR 级别下 UPDATE ... WHERE name=...（name 无索引），锁的范围是？', options: ['只锁命中的行', '几乎全表的所有行+间隙（扫过都锁）', '不锁任何行', '只锁表结构'], answer: 1, explain: '无索引条件走全表扫，RR 当前读会把扫过的记录和间隙都加上 Next-Key 锁。给条件列加索引能把锁缩到目标行——这就是"行锁升级表锁感"的真相。' },
      { q: '想防止"查不到就插入"的并发重复插入，可靠方案是？', options: ['先 SELECT 再 INSERT', '唯一索引 + 捕获 DuplicateKey 异常处理', '加长事务', '用 RC 隔离级别'], answer: 1, explain: '"查了再插"存在时间窗口，并发必出问题。数据库唯一约束是最后一道防线，冲突后走更新/返回已有记录逻辑。' },
    ],
  },
  {
    day: 42, stage: 'MySQL 日志', title: '三大日志坑',
    points: [
      'redo log 是<b>物理日志</b>（某页改了什么）、循环写；binlog 是<b>逻辑日志</b>（语句/行变更）、追加写。',
      'undo log 不只回滚：还是 MVCC 的版本链载体——别答"只用于回滚"。',
      '两阶段提交顺序：redo prepare → 写 binlog → redo commit。少了它崩溃后主从可能不一致。',
    ],
    questions: [
      { q: '崩溃恢复时使用的主要日志是？', options: ['binlog', 'redo log（重放物理修改恢复到崩溃前状态）', 'slow log', 'error log'], answer: 1, explain: '重启时 redo 重放保证已提交事务的修改不丢（D）；未提交的用 undo 回滚（A）。binlog 负责复制和按时间点恢复。' },
      { q: 'binlog 格式选 ROW 的最大好处是？', options: ['日志量最小', '主从数据一致性最可靠（记录行级前后镜像，不含不确定函数）', '可读性最好', '速度最快'], answer: 1, explain: 'STATEMENT 格式下 NOW()/UUID()/LIMIT 等在主从可能执行结果不同；ROW 记录实际变更行，安全但量大（配 binlog_row_image=MINIMAL 省空间）。' },
    ],
  },
  {
    day: 43, stage: 'MySQL 优化', title: '慢 SQL 排查坑',
    points: [
      'EXPLAIN 重点看四列：type（至少 range）、key（实际用的索引）、rows（预估扫描行数）、Extra（Using filesort/temporary 要警惕）。',
      '深分页 LIMIT 1000000,10 的优化：游标法 WHERE id > last_id LIMIT 10，或延迟关联。',
      'count(*) 大表慢是 MVCC 决定的（没有全局精确计数），别答"加索引"就完事。',
    ],
    questions: [
      { q: 'EXPLAIN 的 Extra 出现 Using filesort 表示？', options: ['磁盘坏了', '排序无法用索引完成，需要额外的排序步骤（内存/磁盘）', '文件被锁定', '用了全文索引'], answer: 1, explain: 'ORDER BY 列与索引顺序不一致时出现。优化：建符合排序的联合索引，或减少排序数据量。' },
      { q: '延迟关联优化深分页的核心思路是？', options: ['把表拆小', '先用覆盖索引只查主键 id 分页，再用 id 回表取整行数据', '加缓存', '调大 OFFSET'], answer: 1, explain: 'SELECT * FROM t JOIN (SELECT id FROM t WHERE ... LIMIT 100000,10) tmp USING(id)——子查询走覆盖索引不回表，最后只回表 10 行。' },
    ],
  },
  {
    day: 44, stage: 'MySQL 实战', title: '主从与高可用坑',
    points: [
      '主从延迟的常见根因：从库单线程回放（5.7 前）/大事务/从库机器差/从库在跑重查询。',
      '读写分离下"写后立即读"要读主库——框架方案：ShardingSphere 的强制路由/动态切换数据源。',
      '半同步复制（semi-sync）：至少一个从库收到 binlog 才返回成功——可用性换一致性。',
    ],
    questions: [
      { q: '用户改完头像刷新页面却显示旧头像（读写分离架构），最可能的原因与解法是？', options: ['浏览器坏了；换浏览器', '主从延迟：写后读走了从库；写后短窗口强制读主库', '缓存永远无法解决', '数据库坏了'], answer: 1, explain: '复制异步有延迟。方案：关键读走主库、延迟双删缓存、或更新后前端短时间读主。' },
      { q: '大事务对主从延迟的影响是？', options: ['没有影响', '主库执行 10 分钟的事务，binlog 传到从库还要再执行 10 分钟——延迟线性放大', '只会影响内存', '只影响磁盘'], answer: 1, explain: '从库回放同样耗时。拆小事务（批量改分批提交）是治理主从延迟的第一刀。' },
    ],
  },
  {
    day: 45, stage: 'Redis 数据结构', title: 'Redis 数据类型实战坑',
    points: [
      '存对象别用 JSON 大 String 覆盖写——用 Hash 做字段级更新，省带宽且避免并发覆盖。',
      'Set 的 SDIFF/SINTER/SUNION 直接支持"共同关注/推荐差集"运算——别拉到 Java 里算。',
      'INCR 是原子计数；想"计数+过期"要 EXPIRE 配合（注意 key 已存在时 EXPIRE 才生效）。',
    ],
    questions: [
      { q: '实现"点赞用户列表 + 判断是否点过 + 点赞总数"，最合适的类型组合是？', options: ['String 存 JSON', 'Set：SADD/SISMEMBER/SCARD 一套搞定', 'List 遍历判断', 'ZSet'], answer: 1, explain: 'Set 天然去重，SISMEMBER O(1) 判断，SCARD 计数，SINTER 还能求"共同点赞"。需求四连全兼容。' },
      { q: '用 Redis 统计"今日独立访客 UV"（亿级），最省内存的方案是？', options: ['Set 存全部 userId', 'HyperLogLog（PFADD/PFCOUNT，固定 12KB，误差 0.81%）', 'String 拼接', 'List'], answer: 1, explain: '亿级 userId 用 Set 要几 GB，HLL 只要 12KB。允许 1% 内误差的统计场景（UV/PV）它就是标准答案。精确去重才用 Set/BitMap。' },
    ],
  },
  {
    day: 46, stage: 'Redis 缓存', title: '缓存模式实战坑',
    points: [
      'Cache Aside 标准姿势：<b>先更新库，再删缓存</b>（不是更新缓存）——删是懒加载语义，避免写多读少白算。',
      '缓存空值防穿透要设<b>短过期</b>（如 60s），否则造过假数据后真数据也进不来。',
      '布隆过滤器只能"一定不存在/可能存在"，<b>误判率与位数组大小和哈希函数个数相关</b>，不能删除元素（计数布隆可以）。',
    ],
    questions: [
      { q: '为什么 Cache Aside 推荐"删除缓存"而不是"更新缓存"？', options: ['更新更快', '避免并发写导致缓存脏数据 + 写多读少场景白算成本', '删除更安全不会失败', '框架规定'], answer: 1, explain: '两个并发写按不同顺序到缓存会产生永久脏数据；删除让下次读时按库的最新值重建——把一致性交给懒加载。' },
      { q: '先删缓存再更新数据库的方案，并发下的漏洞是？', options: ['没有漏洞', '删除后、库更新前，读请求把旧值回填缓存——脏数据驻留到过期', '数据库会崩溃', '缓存会膨胀'], answer: 1, explain: '经典时序：删缓存→读 miss→读库旧值→回填→更新库→缓存永远是旧值。所以推荐"先更库再删缓存"+延迟双删兜底。' },
    ],
  },
  {
    day: 47, stage: 'Redis 高可用', title: '持久化与复制坑',
    points: [
      'RDB 的 fork 在<b>大实例（10GB+）</b>上会卡主线程（页表复制）——这就是大实例偏用 AOF/混合的原因之一。',
      'AOF everysec 不是"一秒必落盘"而是"最多丢一秒"；always 最安全但吞吐骤降。',
      '主从复制 backlog（环形缓冲）太小，从库断线稍久就退化为全量重同步——调大 repl-backlog-size。',
    ],
    questions: [
      { q: '生产 Redis 推荐的持久化配置是？', options: ['只用 RDB', '混合持久化：AOF 重写时先写 RDB 全量再追加增量（恢复快+丢失少）', '只用 AOF always', '关闭持久化'], answer: 1, explain: 'aof-use-rdb-preamble yes：文件头 RDB（载入快）+ 尾部增量 AOF（丢失少）。纯缓存场景可只 RDB。' },
      { q: '从库重连后执行了全量重同步（而不是增量），最可能的原因是？', options: ['从库磁盘坏了', '断线期间写入太多，replication offset 已被 backlog 环形覆盖', '主库重启过', '网络太慢'], answer: 1, explain: '增量复制要求从库的 offset 还在主库 backlog 里；写风暴会把旧 offset 冲掉。调大 backlog + 稳定网络避免全量风暴。' },
    ],
  },
  {
    day: 48, stage: 'Redis 实战', title: 'Redis 使用陷阱',
    points: [
      'KEYS * 会阻塞单线程——生产用 <b>SCAN</b> 游标分批遍历。',
      '大 key 删除用 <b>UNLINK</b>（异步）而不是 DEL；排查用 redis-cli --bigkeys。',
      'SETNX 锁必须配<b>过期时间+唯一值</b>：无 TTL 死锁，无唯一值会误删别人的锁。',
    ],
    questions: [
      { q: 'Redis 分布式锁"误删"场景的正确修复是？', options: ['加长过期时间到 1 小时', '锁值存唯一标识，释放时 Lua 脚本"判断是自己的才删"', '删除前 sleep 一秒', '用 DELEX 命令'], answer: 1, explain: '业务超时→锁过期→B 拿到锁→A 执行完 DEL 掉 B 的锁。Lua 原子"比对+删除"；根治用 Redisson 看门狗自动续期。' },
      { q: '需要遍历上千万个 key 统计特征，正确的命令选择是？', options: ['KEYS *', 'SCAN cursor MATCH ... COUNT 1000 循环游标', 'SMEMBERS 全部集合', '反复 RANDOMKEY'], answer: 1, explain: 'SCAN 分批+不阻塞，返回新游标直到 0。KEYS 会卡住整个实例——生产事故经典来源。' },
    ],
  },
  {
    day: 49, stage: '并发深入', title: 'AQS 与并发工具坑',
    points: [
      'AQS 核心就是一个 <b>volatile state + CLH 等待队列</b>：获取失败的线程入队挂起，释放时唤醒后继。',
      'CountDownLatch 是"等 N 件事完成"（一次性）；CyclicBarrier 是"N 个线程互相等"（可重用）。',
      'Semaphore 控制并发数（限流）；Exchanger 两线程交换数据——场景别混。',
    ],
    questions: [
      { q: '10 个线程各自算完子任务后，主线程汇总结果——用哪个最合适？', options: ['Semaphore(1)', 'CountDownLatch(10)，主线程 await 等 countDown 到 0', 'CyclicBarrier(10)', 'synchronized'], answer: 1, explain: '"一等多"用 CountDownLatch；"多互等"（每批都等齐再继续）才用 CyclicBarrier。' },
      { q: '限制数据库连接池最多 20 个并发访问，最贴切的工具是？', options: ['CountDownLatch(20)', 'Semaphore(20)：acquire/release 控制同时访问数', 'volatile', 'ThreadLocal'], answer: 1, explain: 'Semaphore 是"令牌桶"语义：拿不到令牌就阻塞，用完归还——连接池/限流的标准实现。' },
    ],
  },
  {
    day: 50, stage: '并发深入', title: '线程池调优坑',
    points: [
      '线程数不是越大越快：CPU 密集 ≈ 核数+1；IO 密集 ≈ 核数 × (1 + 等待时间/计算时间)。',
      '线程池参数要<b>有界队列+拒绝策略</b>：无界队列（如默认 LinkedBlockingQueue）会在堆积时 OOM。',
      '禁止用 Executors.newFixedThreadPool——队列无界；newCachedThreadPool——线程数无界。要手动 new ThreadPoolExecutor。',
    ],
    questions: [
      { q: '《阿里巴巴 Java 开发手册》禁止 Executors 创建线程池的根本原因是？', options: ['语法过时', 'FixedThreadPool 队列无界会 OOM，CachedThreadPool 线程无界会耗尽资源', '性能太差', '不支持 lambda'], answer: 1, explain: '手动 new ThreadPoolExecutor 显式指定核心数/队列上限/拒绝策略——把资源边界写死在代码里。' },
      { q: 'IO 密集型任务（接口调用平均等待 90ms，计算 10ms），8 核机器线程数建议约？', options: ['8', '约 8 × (1 + 90/10) = 80 左右，压测定参', '1000', '1'], answer: 1, explain: '等待占 90% 时 CPU 大量空闲，多开线程填满等待期。公式只是起点，最终以压测吞吐/RT 曲线为准。' },
    ],
  },
  {
    day: 51, stage: 'JVM 深入', title: 'GC 实战坑',
    points: [
      'GC 日志里的 "Full GC (Ergonomics)" / "Allocation Failure" 要能读懂来源：晋升过快/大对象/元空间不足。',
      '停顿和吞吐不可兼得：Parallel 吞吐优先，CMS/G1/ZGC 停顿优先——选型看业务（批处理 vs 在线服务）。',
      'OOM 不一定是堆：元空间（类加载器泄漏）、直接内存（NIO）、栈（无限递归）都会 OOM，报错信息不同。',
    ],
    questions: [
      { q: 'java.lang.OutOfMemoryError: Metaspace 的最常见原因是？', options: ['堆太小', '动态生成类过多且无法卸载（CGLIB 代理/热部署/反射滥用）', '线程太多', '缓存太大'], answer: 1, explain: 'Metaspace 存类元数据。每次代理都 new ClassLoader 或无缓存反射，类爆炸撑爆元空间——加参数治标，改代码才是治本。' },
      { q: '线上 JVM 排查"GC 频繁但回收效果差"（Full GC 后老年代仍 90%+），优先怀疑？', options: ['堆太小直接扩容', '内存泄漏：老年代被活对象占满，dump 分析大对象来源', 'CPU 不足', '磁盘慢'], answer: 1, explain: '回收不掉=对象还活着=泄漏（缓存无界/ThreadLocal 未清理/连接未关）。jmap dump + MAT 看支配树定位持有链。' },
    ],
  },
  {
    day: 52, stage: 'JVM 深入', title: 'JVM 参数实战坑',
    points: [
      '-Xms 和 -Xmx 设成一样：避免运行期堆动态伸缩带来的抖动。',
      'OOM 时自动 dump：-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=...——线上排查救命参数。',
      '-Xss 控制栈大小；递归过深的 StackOverflowError 调它治标，改算法治本。',
    ],
    questions: [
      { q: '生产 JVM 推荐把 -Xms 与 -Xmx 设为相同值的原因是？', options: ['显得专业', '避免堆扩容/缩容时的 GC 抖动和内存 recommit 开销', '节省磁盘', '提高 CPU 主频'], answer: 1, explain: '堆伸缩伴随 Full GC 与页分配。固定大小让行为可预测——容量规划做在发布前。' },
      { q: '以下哪个参数组合是线上服务"必备三件套"？', options: ['-Xmx、HeapDumpOnOutOfMemoryError、GC 日志', '-verbose、-Dfile.encoding、-Xss', '-agentlib、-Xshare、-Xverify', '随意配置'], answer: 0, explain: '容量上限 + 事故现场自动留证 + GC 行为可观测——出问题时有数据可查，而不是靠猜。' },
    ],
  },
  {
    day: 53, stage: 'Spring 深入', title: 'Spring 原理坑',
    points: [
      'Bean 生命周期口诀：实例化 → 属性注入 → Aware 回调 → BeanPostProcessor 前置 → <b>初始化方法</b> → 后置 → 使用 → 销毁。',
      'AOP 失效场景同事务：this 调用、方法非 public、final 方法（CGLIB 无法重写）。',
      '循环依赖三级缓存只解决<b>单例 + setter/字段注入</b>；构造器注入无法解决（对象还没造出来就互相要）。',
    ],
    questions: [
      { q: '@PostConstruct 注解方法的执行时机是？', options: ['类加载时', '属性注入完成后、Bean 对外可用前的初始化阶段', '容器关闭时', '每次调用时'], answer: 1, explain: '位于初始化阶段：依赖注入完毕 → @PostConstruct → afterPropertiesSet → init-method。做"依赖就绪后的检查/预热"正合适。' },
      { q: 'Spring Boot 2.6+ 默认禁止循环依赖的原因是？', options: ['性能问题', '循环依赖通常是设计缺陷的信号（职责不清），强制你重构而不是靠容器兜底', '内存问题', '兼容 JDK17'], answer: 1, explain: '官方立场：循环依赖是坏味道。开启 spring.main.allow-circular-references=true 只是逃生门，正解是拆分职责/引入中间层。' },
    ],
  },
  {
    day: 54, stage: 'Spring 深入', title: 'Spring Boot 自动配置坑',
    points: [
      '自动配置原理链：@EnableAutoConfiguration → 读取 META-INF/spring/...AutoConfiguration.imports → @Conditional 系列按条件装配。',
      'starter 的意义：依赖聚合 + 自动配置，让"引入即用"；自定义 starter 也是这两件套。',
      '配置优先级：命令行 > 环境变量 > application-{profile} > application.yml——排配置问题先想优先级。',
    ],
    questions: [
      { q: '@ConditionalOnClass 的作用是？', options: ['类存在才装配该自动配置（classpath 检测）', '方法存在才执行', '配置了才生效', '永远生效'], answer: 1, explain: '这是 starter"引了 jar 就自动生效、没引就不报错"的关键——按 classpath 有无某类决定装配。' },
      { q: '同一配置项在 application.yml 和命令行 --key=val 同时存在，生效的是？', options: ['yml', '命令行（优先级最高）', '随机', '报错'], answer: 1, explain: '优先级链的顶端是命令行参数，常用于不改文件临时覆盖配置（如 --server.port=8081）。' },
    ],
  },
  {
    day: 55, stage: '分布式', title: '分布式 ID 与锁坑',
    points: [
      'UUID 做主键的问题：无序页分裂 + 长；雪花算法 = 时间戳+机器id+序列，趋势递增但<b>依赖时钟</b>（回拨要处理）。',
      'ZK 锁：临时顺序节点 + 监听前驱——公平锁语义，CP 代价是性能低于 Redis。',
      'Redis 锁是 AP（主从切换可能丢锁）；RedLock 争议大；金融场景用 DB 唯一约束+乐观锁兜底。',
    ],
    questions: [
      { q: '雪花算法时钟回拨的处理思路不包括？', options: ['等待追上后再发号', '用上次时间戳兜底/报警拒发', '记录回拨区间跳过', '把机器时间改快'], answer: 3, explain: '改时间只会更乱。主流方案：检测回拨→小回拨等待/大回拨告警拒绝服务/备用位扩展。' },
      { q: 'Redis 主从切换导致锁丢失（客户端 A 在旧主加的锁没同步到新主），业界讨论的方案是？', options: ['RedLock 多实例多数派加锁（有争议，代价高）', '删掉所有锁', '把过期时间调大', '换 MySQL'], answer: 0, explain: 'RedLock 向 N 个独立实例同时加锁、半数以上成功才算持有——但 Martin Kleppmann 质疑其时钟假设，实践中常改用"fencing token + 资源端幂等"。' },
    ],
  },
  {
    day: 56, stage: '分布式', title: '限流算法坑',
    points: [
      '固定窗口计数器的缺陷：<b>窗口边界双倍突刺</b>（前窗末+后窗初合计可达 2 倍阈值）。',
      '滑动窗口把窗口切小格解决突刺；漏桶恒定速率"整流"；令牌桶允许突发（预存令牌）。',
      '单机限流用 Guava RateLimiter；分布式限流用 Redis+Lua（原子校验扣减）或 Sentinel 集群流控。',
    ],
    questions: [
      { q: '允许"突发流量、空闲攒额度"的限流算法是？', options: ['固定窗口', '漏桶', '令牌桶', '计数器'], answer: 2, explain: '令牌桶按速率放令牌、桶有容量：闲时攒、忙时批量消费。漏桶则是恒定流出，把突发整形成平滑流。' },
      { q: '分布式限流用 Redis 实现"每秒 100 次"，为什么要用 Lua？', options: ['Lua 更快', 'GET+判断+INCR+EXPIRE 多步操作需要原子执行，否则并发下计数错乱', 'Redis 只支持 Lua', '省内存'], answer: 1, explain: '多命令间会被其他客户端插入导致竞态。Lua 脚本在 Redis 单线程内原子执行——判断与扣减不可分割。' },
    ],
  },
  {
    day: 57, stage: '消息队列', title: 'MQ 进阶坑',
    points: [
      '消息堆积百万级的处理：先扩消费者（要能水平扩）→ 临时"搬运"转储 → 修复消费逻辑 → 追平后清理。',
      '顺序消息：Kafka 靠同 key 进同分区（分区内有序）；RocketMQ 靠 MessageQueueSelector + 单线程消费。',
      '延迟消息：RocketMQ 自带延迟级别/定时精度；Kafka 要自己造（时间轮+暂停分区）或用延迟主题。',
    ],
    questions: [
      { q: 'Kafka 保证"同一订单的消息被顺序消费"的正确做法是？', options: ['全局一个分区', '按订单 id 作为消息 key（同 key 进同分区，分区内 FIFO）', '消费者加锁', '提高 acks 参数'], answer: 1, explain: 'Kafka 只保证分区内有序。把相关消息路由到同一分区是标准做法——注意分区数扩容会打乱 key 映射，要提前规划。' },
      { q: '消费端处理逻辑有 bug 导致持续堆积，第一个动作是？', options: ['重启 MQ', '止血：修复或回滚消费逻辑；扩容消费者加速消化，必要时临时转储降级', '清空队列', '换 MQ'], answer: 1, explain: '先止损再治理。消费者组扩容受分区数上限约束（消费者数≤分区数），不够就临时搬家到新主题多分区并行处理。' },
    ],
  },
  {
    day: 58, stage: '系统设计', title: '短链/点赞/排行榜设计套路',
    points: [
      '短链生成：发号器（自增/雪花）+ 62 进制编码最稳；哈希+冲突重试也可；跳转 302（可统计）vs 301（缓存住）。',
      '排行榜 = ZSet：ZINCRBY 加分、ZREVRANGE 取榜、ZREVRANK 查名次——O(log n) 全搞定。',
      '点赞 = Set/HLL；计数 = INCR；防刷 = 限流 + 唯一约束。基础类型组合拳要熟。',
    ],
    questions: [
      { q: '短链服务选 302 而不是 301 重定向的主要原因是？', options: ['302 更快', '302 每次都经过服务端，可以统计点击、支持随时改目标地址', '301 不安全', '浏览器只支持 302'], answer: 1, explain: '301 会被浏览器永久缓存，改指向失效、统计丢失。短链平台要数据就要 302（牺牲一点跳转性能）。' },
      { q: '游戏积分榜要求"实时查我排第几 + 前 100 名"，最适合的 Redis 方案是？', options: ['List 定时排序', 'ZSet：分数做 score，ZREVRANK/ZREVRANGE 毫秒级返回', 'Hash 扫描计算', 'MySQL ORDER BY'], answer: 1, explain: 'ZSet 的排名查询是内置能力：ZREVRANGE top100、ZREVRANK 个人名次，更新用 ZINCRBY。百万级用户依然 O(log n)。' },
    ],
  },
  {
    day: 59, stage: '系统设计', title: '缓存/DB 一致性进阶',
    points: [
      '强一致做不到就<b>收敛</b>：延迟双删、binlog 订阅（Canal）异步删、过期时间兜底——三层防线。',
      '读多写少用 Cache Aside；写多读少考虑"写后短 TTL"或直接读库；一致性敏感的（余额）直接读主库。',
      '分布式事务日常首选：<b>本地消息表/MQ 事务消息</b>（最终一致）；TCC/Seata AT 留给强一致刚需。',
    ],
    questions: [
      { q: 'Canal 订阅 binlog 删缓存的方案优势是？', options: ['速度最快', '与业务代码解耦：数据变更由 binlog 驱动统一失效，不侵入业务', '省数据库', '免部署'], answer: 1, explain: '业务只管写库，缓存失效由独立的 binlog 消费端处理——漏删率低、新增表零成本接入。代价是多一个组件要运维。' },
      { q: '订单超时未支付自动取消，最适合的实现是？', options: ['定时任务每秒扫全表', 'RocketMQ 延迟消息/时间轮：支付创建时发 30 分钟延迟消息，到期检查状态', '用户手动取消', '数据库触发器'], answer: 1, explain: '扫表在订单量大时是灾难。延迟消息精确到单订单、无需扫表；到期待检查时用状态机防并发误取消（已支付就忽略）。' },
    ],
  },
  {
    day: 60, stage: '综合冲刺', title: '面试临场综合坑',
    points: [
      '场景题万能框架：<b>澄清需求 → 估算量级 → 分层设计（接入/服务/数据）→ 关键点深挖 → 权衡取舍</b>。',
      '答不上来时的降级话术："这个具体数字我记不准，但思路是……"——展示推理路径永远比硬编强。',
      '反问环节问"这个岗位当前最大的技术挑战"——既是信息收集也是展示态度。',
    ],
    questions: [
      { q: '面试官出"设计一个日活千万的签到系统"，第一步应该做什么？', options: ['直接写 Redis 方案', '澄清需求边界：签到粒度/要不要补签/统计什么/实时性要求，再估算存储量级', '问面试官答案', '从数据库建表开始'], answer: 1, explain: '不澄清就设计=闭卷乱写。日活千万×BitMap 也就 MB 级，需求不同方案天差地别——先对齐再动手是工程师素养。' },
      { q: '签到场景"记录某用户一年 365 天是否签到"最省内存的存储是？', options: ['365 行记录表', 'BitMap/BitSet：1 个 int 存 31 天，一年 12 个 int', 'JSON 数组', '文本拼接'], answer: 1, explain: '一天一位：365 bit ≈ 46 字节。Redis BITCOUNT 直接算连续签到，BITOP 做交集（都签过的天）——位运算的降维打击。' },
    ],
  },

  /* ==================== V5 扩充：61~90 天 ==================== */
  {
    day: 61, stage: '并发深入', title: 'volatile 与 JMM 坑',
    points: [
      'volatile 只保证可见性与有序性，<b>不保证原子性</b>——volatile int count + count++ 照样丢更新。',
      'DCL 单例必须配 volatile：防止"分配→初始化→赋引用"重排，别的线程拿到半初始化对象。',
      'happens-before 的"程序顺序规则"不是"指令不重排"，而是"单线程语义下结果一致"——别背反了。',
      'ThreadLocal 用完不 remove：线程池线程复用 → 下一个请求读到上个请求的值（串号事故）+ value 泄漏。',
    ],
    questions: [
      { q: 'volatile int count = 0，10 个线程各执行 1000 次 count++，最终结果？', options: ['一定是 10000', '一定小于等于 10000 且不确定', '一定大于 10000', '编译错误'], answer: 1, explain: 'count++ 是读-加-写三步，volatile 只保证读到最新值，不保证三步连续执行。并发丢失更新，结果 ≤ 期望值。要原子用 AtomicInteger。' },
      { q: 'DCL 单例中 instance 声明为 volatile 的原因是？', options: ['提高读取速度', '禁止 new 对象的指令重排，避免其他线程拿到未初始化完的对象', '保证线程互斥', '可以不加'], answer: 1, explain: 'new 不是原子操作：①分配内存 ②初始化 ③instance=引用。②③可能重排——线程 A 执行到③未②时，线程 B 判非空直接返回半成品。volatile 禁止该重排。' },
    ],
  },
  {
    day: 62, stage: '并发深入', title: '线程池参数坑',
    points: [
      '<b>Executors 直接创建是生产红线</b>：newFixedThreadPool/newSingleThreadExecutor 无界队列 OOM；newCachedThreadPool 线程数上限 Integer.MAX_VALUE 线程爆炸。',
      '线程池异常默认吞掉：任务抛异常后 worker 静默死亡重建，日志什么都看不见——必须 try-catch 包任务或用 Future.get() 收割。',
      '核心线程默认不回收（除非 allowCoreThreadTimeOut(true)）；池在 shutdown 前一直占着资源。',
      'ThreadLocal + 线程池 = 复用陷阱：每次任务开头 set、结尾 remove，或用阿里 TransmittableThreadLocal。',
    ],
    questions: [
      { q: '为什么生产环境禁止使用 Executors.newFixedThreadPool？', options: ['性能差', 'LinkedBlockingQueue 无界，任务堆积会 OOM', '创建太慢', '不支持超时'], answer: 1, explain: '队列无界 = 任务只进不出，堆积到内存耗尽。规范做法：ThreadPoolExecutor 手动建，队列给有界（如 1000）+ 拒绝策略明确。' },
      { q: '线程池里 submit 的任务抛了 NPE，最可能的现象是？', options: ['JVM 崩溃', '异常被 Future 吞着，没有任何日志，任务"静默失败"', '线程池自动重启任务', '其他任务失败'], answer: 1, explain: 'submit 包装成 Future，异常存进 Future 等人来 get——没人 get 就永远没人知道。解决方案：execute + try-catch、统一包装任务类记日志、或 afterExecute 钩子。' },
    ],
  },
  {
    day: 63, stage: '并发深入', title: '锁使用坑',
    points: [
      '锁的对象选错：<code>synchronized(this)</code> 在多实例 Bean 下锁不住；锁 String/int 常量（字符串字面量、Integer 缓存对象）会锁到全局共享对象，引发无关代码互斥。',
      '可重入锁忘记释放：ReentrantLock 必须 try/finally 里 unlock()——synchronized 自动释放，手写锁没有这个保险。',
      '锁粒度太粗（整个方法）→ 并发度骤降；事务里加锁 → 锁在事务提交前就释放，别的线程读到旧数据（锁范围与事务范围不一致）。',
      '读多写少用读写锁/StampedLock 优化；只读对象用不可变类（record/String）天然线程安全。',
    ],
    questions: [
      { q: 'synchronized(new Object()) 锁住代码块，效果是？', options: ['正常互斥', '等于没锁：每次 new 的对象都不同，锁对象不唯一', '编译错误', '锁全局'], answer: 1, explain: '锁的本质是"多个线程抢同一把锁对象"。每次 new 新对象，各线程锁各自的对象，互不冲突——锁形同虚设。锁对象必须是共享唯一实例。' },
      { q: '事务方法里 synchronized 锁住核心段，为什么仍可能超卖？', options: ['synchronized 不安全', '锁释放发生在事务提交之前：另一个线程拿到锁时读到的还是未提交前的旧库存', '数据库问题', 'CPU 太快'], answer: 1, explain: '顺序是：加锁 → 读库存 → 扣减 → 方法结束释放锁 → 事务才提交。第二个线程拿锁时读到的是"未提交的旧值"。方案：锁范围包住事务（外层加锁调内层事务方法）、或 DB 条件更新/乐观锁兜底。' },
    ],
  },
  {
    day: 64, stage: 'JVM 实战坑', title: 'OOM 与内存泄漏坑',
    points: [
      '堆 dump 时机：OOM 后再抓可能晚了大对象已被回收——启动加 <code>-XX:+HeapDumpOnOutOfMemoryError</code> 让 JVM 在崩溃瞬间留证据。',
      '静态集合只增不减是泄漏之王：static Map 当缓存不设上限 → Full GC 越来越频繁直到 OOM。',
      '连接池/流/HttpClient 不 close：连接对象不回收 → 既是资源泄漏也是内存泄漏。',
      'Metaspace OOM：CGLib/反射大量动态生成类不卸载（常见于频繁重启 Spring 上下文的测试代码）。',
    ],
    questions: [
      { q: '线上系统 Full GC 频率从每天 1 次涨到每 5 分钟 1 次，最该先看什么？', options: ['直接调大堆', 'dump 分析老年代里占比最大的对象是谁、被谁引用（MAT 支配树）', '升级 JDK', '换 GC 器'], answer: 1, explain: '频率变化说明有东西在缓慢堆积（泄漏）或流量变化。盲目调大堆只是延缓。MAT 看支配树定位"谁持有"——常见嫌疑：静态缓存、ThreadLocal、监听器未注销。' },
      { q: 'CPU 100% 但 jstack 里最忙的线程是 "GC task thread"，说明？', options: ['CPU 被业务计算占满', 'GC 在疯狂工作——大概率是内存问题（频繁 Full GC）', '线程死锁', '网络 IO 问题'], answer: 1, explain: 'GC 线程吃满 CPU = 老年代反复回收不下来 = 堆里塞满活对象或泄漏。排查方向立刻转向内存：jstat -gcutil 看 Old 区占比与回收后是否下降（不降 = 泄漏）。' },
    ],
  },
  {
    day: 65, stage: 'JVM 实战坑', title: 'GC 调优误区',
    points: [
      '误区：堆越大越好 → 大堆 = Full GC 停顿更长 + 容器内存超限 OOMKilled；8G 堆的 Full GC 可能秒级。',
      '误区：MaxGCPauseMillis 设得越小越好 → G1 为达标会缩小年轻代、提高 GC 频率，吞吐反而崩。',
      'System.gc() 会触发 Full GC：用 -XX:+DisableExplicitGC 关掉（但 DirectByteBuffer 的堆外回收依赖它，需配 -XX:+ExplicitGCInvokesConcurrent 并发触发）。',
      '没看 GC 日志就调参 = 算命。先 -Xlog:gc* / gceasy.io 分析，再动手。',
    ],
    questions: [
      { q: '容器限制 4G 内存，JVM 设 -Xmx4g，结果被 OOMKilled，原因是？', options: ['Xmx 设小了', '堆外还有元空间、线程栈、DirectMemory——堆吃满 4G 后其他区域直接超容器配额', 'K8s 配置错误', 'GC 器问题'], answer: 1, explain: '容器只认 cgroup 总量：堆 + Metaspace + 线程数×Xss + 堆外 ≈ 4G 必超。规范：堆 ≈ 容器内存 70%（或 MaxRAMPercentage=75），其余留给非堆。' },
      { q: '-XX:MaxGCPauseMillis=10 这种激进目标通常导致？', options: ['停顿真的变 10ms 且无副作用', 'GC 频率暴增、吞吐下降，甚至 young 区被压得过小', 'JVM 报错', '没有影响'], answer: 1, explain: 'G1 的停顿目标是通过调节年轻代大小实现的——目标太苛刻 → 年轻代被缩到很小 → Minor GC 秒触发。一般 200ms 是合理值。' },
    ],
  },
  {
    day: 66, stage: 'Spring 实战坑', title: '依赖注入与 Bean 坑',
    points: [
      '字段注入的坑：无法 final、隐藏依赖（构造器看不出需要什么）、脱离容器无法单测——改构造器注入。',
      '循环依赖：Spring Boot 2.6+ 默认直接启动报错——别再依赖三级缓存"救你"，出现循环依赖先反思设计。',
      '@Configuration 类里的 @Bean 方法互调走 CGLib 代理保证单例；改成 @Component + @Lazy 后互调就不再保证。',
      '@Value 读不到值：占位符拼错 / 配置文件没加载 / 用在 static 字段上（Spring 不注入 static）。',
    ],
    questions: [
      { q: '@Autowired 标在 static 字段上会怎样？', options: ['正常注入', '注入的是 null：Spring 注入发生在 Bean 实例上，static 字段属于类不归容器管', '启动报错', '自动转构造注入'], answer: 1, explain: 'Spring 依赖注入基于 Bean 实例，static 属性先于实例存在且被所有实例共享，容器不注入（不报错但值为 null，最阴险）。需要时用 @PostConstruct 里从实例字段转存。' },
      { q: '构造器注入相对字段注入的最大优势是？', options: ['代码更短', '依赖不可变（final）+ 依赖显式化 + 容器外可 new 出来直接单测，且启动期即暴露循环依赖', '性能更好', '支持更多注解'], answer: 1, explain: '字段注入的类离开 Spring 容器无法构造（字段全是 null），单测只能靠反射。构造器注入 final 保证状态安全、new 出来即完整。Spring 官方也推荐构造器注入。' },
    ],
  },
  {
    day: 67, stage: 'Spring 实战坑', title: '事务与 AOP 生效坑',
    points: [
      '事务失效全家桶：自调用（this 绕过代理）、方法非 public、异常被 catch 吞、抛 checked 异常（默认只回滚 RuntimeException）、多线程（事务绑定 ThreadLocal）、MyISAM 不支持事务。',
      '@Transactional 标在 private 方法上不生效——CGLib 无法覆写 private，代理拦不到。',
      'AOP 切面在 this 调用时同样失效——同根因：绕过代理对象。',
      '@Async 方法里抛异常，调用方感知不到——异常进了 AsyncUncaughtExceptionHandler。',
    ],
    questions: [
      { q: '同类中方法 A（无事务）调用方法 B（@Transactional），B 的事务？', options: ['正常生效', '不生效：this 调用走原始对象绕过了事务代理', '部分生效', '编译错误'], answer: 1, explain: '事务是 AOP 代理实现的。A 里 this.b() 用的是原始对象引用。解法：①注入自身代理（ObjectProvider）②AopContext.currentProxy()（开 exposeProxy）③把 B 挪到别的 Bean。' },
      { q: '@Transactional(rollbackFor = Exception.class) 的存在意义是？', options: ['加快事务', '默认只对 RuntimeException/Error 回滚，checked 异常默认提交——显式声明让 IOException 等也回滚', '开启只读', '改变隔离级别'], answer: 1, explain: 'Spring 默认回滚策略继承自 EJB：受检异常被视为"业务可预期"默认提交。大多数业务希望任何异常都回滚——所以规范模板里总带 rollbackFor = Exception.class。' },
    ],
  },
  {
    day: 68, stage: 'MySQL 实战坑', title: '索引与执行计划坑',
    points: [
      '联合索引 (a,b) 查 WHERE b = 1 完全走不到索引——最左前缀是硬约束，不是"可能走"。',
      '隐式类型转换使索引失效：phone 是 varchar，WHERE phone = 13800000000（数字）→ MySQL 给列加函数转换 → 索引废。',
      '区分度太低的列（如性别）建索引无意义：优化器算出回表成本超过全表扫描，直接不走。',
      'EXPLAIN 必看四列：type（至少 range，ALL 最差）、key（实际用的索引）、rows（预估扫描行数）、Extra（Using filesort/temporary 是坏信号）。',
    ],
    questions: [
      { q: 'status 是 tinyint，索引建好了，但 WHERE status = 1 仍全表扫描，最可能因为？', options: ['索引损坏', 'status 只有几个值（如 0/1/2），90% 数据都是 1，优化器判断全表扫描更快', 'MySQL 版本太低', '需要重启'], answer: 1, explain: '索引的价值在缩小范围。区分度低（基数/总行数极小）时，回表成本 > 全表扫描。这类"状态列"正确做法是联合进复合索引或改表设计。' },
      { q: 'EXPLAIN 输出 Extra 出现 "Using filesort"，含义是？', options: ['磁盘坏了', '排序无法利用索引完成，需要额外排序步骤（内存或磁盘）', '正在备份', 'SQL 写错'], answer: 1, explain: 'filesort 不是"文件排序失败"，是"排序没吃到索引红利"。优化方向：让 ORDER BY 列与 WHERE 列组合成联合索引对齐排序顺序。' },
    ],
  },
  {
    day: 69, stage: 'MySQL 实战坑', title: '事务与锁坑',
    points: [
      'RR 隔离级别的幻读只"半防"：快照读靠 MVCC 防幻读，当前读（for update）靠间隙锁——混用时照样出幻读。',
      'update 没走索引 = 锁全表（所有行+间隙）：WHERE 条件里的列必须有索引，否则行锁升级为事实上的表锁。',
      '死锁高发姿势：批量更新顺序不一致（A 先更 1 后更 2，B 先更 2 后更 1）→ 统一按主键排序更新。',
      'innodb_lock_wait_timeout 默认 50 秒：锁等待超时报错但不自动重试——应用层要有重试/熔断。',
    ],
    questions: [
      { q: 'update user set name=\'x\' where phone = \'138xxx\' 导致大量行锁，最可能的原因是？', options: ['行数太多必然锁全表', 'phone 列没有索引，InnoDB 无法定位具体行，锁住所有扫描过的行（全表）', '隔离级别太高', '字段太长'], answer: 1, explain: 'InnoDB 行锁锁的是索引项。无索引 → 全表扫描 → 每行都锁。线上规范：update/delete 的 WHERE 条件列必须走索引，CodeReview 必查。' },
      { q: 'RR 级别下，事务 A 两次普通 select（快照读）结果一致，期间 B 插入并提交了新行。A 第三次执行 select ... for update 会？', options: ['结果仍一致', '读到 B 插入的新行（幻读出现）：for update 是当前读，读最新已提交数据', '报错', '死锁'], answer: 1, explain: 'MVCC 只保护快照读。当前读绕过版本链读最新版本——若 B 的插入发生在间隙锁未覆盖的时间窗，幻读就出现了。这就是"RR 半防幻读"的含义。' },
    ],
  },
  {
    day: 70, stage: 'Redis 实战坑', title: '缓存一致性坑',
    points: [
      '先删缓存再更新库：删除后、更新前有读请求把<b>旧值</b>填回缓存 → 长期脏。标准姿势是"先更新库，再删缓存"。',
      '"先更新库再删缓存"也有极小脏窗口（读比写慢的罕见场景），配合过期时间兜底。',
      '删除缓存失败：重试队列 + binlog 订阅（Canal）异步删除双保险。',
      '延迟双删：更新库 → 删缓存 → 睡 N 毫秒 → 再删一次，覆盖"读旧值回填"窗口。',
    ],
    questions: [
      { q: '为什么推荐"先更新数据库，再删除缓存"而不是反向？', options: ['顺序无所谓', '反向（先删缓存）在删除与更新之间，读请求会把旧值重新写入缓存，脏数据长期存在；正向的脏读窗口极小且有超时兜底', '缓存更新更慢', '反向会报错'], answer: 1, explain: '反向的脏窗口 = 写库耗时（几十 ms，期间任何读都回填旧值且不过期）；正向的脏窗口 = 一次读比一次写慢的罕见场景。概率差几个数量级。' },
      { q: '删除缓存操作在 Redis 网络闪断时失败了，可靠的补救方案是？', options: ['不管它，等过期', '将失败的 key 写入消息队列异步重试；或用 Canal 订阅 binlog 统一驱动删除（彻底解耦）', '重启应用', '全量刷新缓存'], answer: 1, explain: '同步重试可能继续失败且阻塞主流程。MQ 异步重试有界重试；Canal 方案业务零侵入，是中大型系统标配。' },
    ],
  },
  {
    day: 71, stage: 'Redis 实战坑', title: 'Redis 使用姿势坑',
    points: [
      '禁用 KEYS *（O(N) 阻塞主线程）→ 用 SCAN 游标分批；同理避免超大集合的 HGETALL/SMEMBERS。',
      '大 key（value > 10KB 或集合百万级）：删除时阻塞主线程 → 用 UNLINK（异步删除）替代 DEL。',
      'SETNX 分布式锁没设过期时间：持锁进程崩溃 → 锁永久存在 → 全系统卡死。SET key val NX EX 30 必须原子一步。',
      '缓存 value 存整个对象 JSON：字段变更后反序列化不兼容 → 版本化 schema 或只存必要字段。',
    ],
    questions: [
      { q: '线上 Redis 单线程 CPU 突然打满，QPS 不高，最可能的原因是？', options: ['内存不足', '执行了 KEYS * / 删除大 key / 全量 HGETALL 等 O(N) 慢命令阻塞主线程', '网络抖动', '持久化损坏'], answer: 1, explain: 'Redis 单线程执行命令，一条慢命令拖住所有请求（其他命令排队）。排查：SLOWLOG GET 看慢命令记录；治理：SCAN 替代 KEYS、UNLINK 替代 DEL、大 key 拆分。' },
      { q: '分布式锁还没执行完锁就过期了，另一个进程拿到锁——正确的姿势是？', options: ['过期时间设长到 1 小时', '看门狗自动续期（Redisson 默认 30s 每 10s 续）+ value 存唯一 id，释放用 Lua 校验后再删', '不用过期时间', '加数据库锁'], answer: 1, explain: '过期时间设长只是降低概率、死锁风险上升。正确组合：自动续期保证"干活期间锁不过期"，唯一 id + Lua 原子释放保证"不删别人的锁"。' },
    ],
  },
  {
    day: 72, stage: '网络实战坑', title: 'HTTP 与接口联调坑',
    points: [
      'GET 带 body 部分网关/客户端会丢弃或报错——查询参数放 query string；POST 的 body 才是标准位置。',
      'Content-Type 不匹配：后端 @RequestBody 要 JSON，前端发 form-data → 415；POST 表单没设 multipart → 文件变二进制乱码。',
      'cookie 跨域：fetch/axios 跨域默认不带 cookie，需 withCredentials + 服务端 CORS 回显具体 origin + Allow-Credentials（此时不能用 *）。',
      'PUT/DELETE 被老网关/WAF 拦截 → RESTful 落地前先确认链路支持。',
    ],
    questions: [
      { q: 'CORS 配置 Access-Control-Allow-Origin: * 且 allowCredentials=true，浏览器行为是？', options: ['正常跨域', '报错拒绝：credentials 模式下 origin 不能是通配符，必须回显具体域名', '只拦截 POST', '自动转换域名'], answer: 1, explain: '带 cookie 的跨域是高敏场景，规范强制精确 origin。这是联调期最高频的报错之一。' },
      { q: '前端 axios post JSON，后端 400 且参数全 null，先检查什么？', options: ['数据库', '请求头 Content-Type 是否为 application/json，后端是否用 @RequestBody', 'JVM 内存', 'URL 长度'], answer: 1, explain: '@RequestBody 只解析 JSON 且要求 Content-Type 匹配；form 提交要用 @RequestParam/表单对象。前后端"各说各话"是联调第一坑。' },
    ],
  },
  {
    day: 73, stage: 'Linux 运维坑', title: '命令与权限坑',
    points: [
      'rm -rf 变量为空等于核弹：<code>rm -rf $DIR/</code> 当 DIR 未定义时变成 <code>rm -rf /</code>——脚本必须判空 + 绝对路径 + 禁 root 直接跑。',
      'kill -9 慎用：进程没有机会做清理（刷缓冲/释放锁/优雅下线）——先 kill -15（SIGTERM）等几秒再考虑强杀。',
      'chown/chmod -R 误伤系统目录 → 权限错乱到连 ssh 都进不去，只能重装。',
      'df 看磁盘满了但 du 找不到大文件：进程还握着已删除文件的句柄 → lsof | grep deleted 找到进程重启释放。',
    ],
    questions: [
      { q: 'df -h 显示磁盘 100%，但 du 加起来远小于磁盘容量，最可能因为？', options: ['du 统计错误', '有进程持有已删除文件（deleted 句柄），空间未真正释放，重启对应进程即可', '磁盘坏了', '文件系统只读'], answer: 1, explain: '文件删除只是断开目录项，inode 与数据在引用归零时才释放。日志被 rm 但应用还在写 → 空间一直占用。这也是"清日志用 truncate 而不是 rm"的原因。' },
      { q: '为什么线上服务优雅停机要用 kill -15 而不是 kill -9？', options: ['-9 权限不够', '-15 发送 SIGTERM 让进程有机会：停止接新请求 → 处理完存量 → 释放资源；-9 直接终止连注册中心注销都做不了', '速度一样', '-9 更安全'], answer: 1, explain: '-9 = SIGKILL 内核直接回收，进程无感知。后果：注册中心残留死实例、MQ 消息处理一半、文件锁未释放。先 -15 等 grace period，再 -9 兜底。' },
    ],
  },
  {
    day: 74, stage: '分布式实战坑', title: '分布式锁与幂等坑',
    points: [
      '分布式锁 value 不放唯一标识：A 超时后 B 拿到锁，A 醒来直接 DEL → 删掉了 B 的锁。value=UUID，释放用 Lua"比对+删除"。',
      '锁粒度错：锁整个方法 vs 锁业务键（如 orderId）——前者吞吐悬崖，后者才是正确姿势。',
      '幂等只做前端防抖不做后端兜底 = 等事故：网络重试永远存在，后端唯一索引/状态机才是最终防线。',
      'MQ 幂等消费：消费成功但 ack 丢失 → broker 重发；消费前查去重表必须做。',
    ],
    questions: [
      { q: '分布式锁的 value 为什么要放唯一标识？', options: ['性能更好', '防止误删他人的锁：A 锁超时被 B 抢走，A 恢复后只能删"还是自己 uuid 的锁"', '方便日志', '加密要求'], answer: 1, explain: '释放锁必须是 Lua 原子操作：GET 比对 value 是自己的才 DEL。否则出现"删掉别人的锁 → 第三个进程又拿到锁"的连环事故。' },
      { q: 'MQ 消费者处理完消息后 ack 网络失败，broker 重发同一条消息，业务侧的正确姿势是？', options: ['禁止 broker 重发', '消费逻辑天然幂等：业务唯一键约束/去重表先查后做，重复消息无副作用', '换一个 MQ', '关掉网络'], answer: 1, explain: '至少一次投递是 MQ 的默认承诺，重复不可避免。幂等三板斧：唯一索引（最硬）、去重表（Redis setnx+DB 兜底）、状态机更新。' },
    ],
  },
  {
    day: 75, stage: '设计题坑', title: '秒杀场景设计坑',
    points: [
      '只在 DB 扣库存：秒杀瞬间全打 DB → 挂。正确分层：前端防抖 → 网关限流 → Redis 预扣（Lua 原子）→ MQ 异步落库。',
      'Redis 预扣与 DB 扣减不一致：预扣成功但落库失败要回补库存（本地消息表/事务消息保证最终一致）。',
      '超卖兜底：DB 层 <code>UPDATE stock SET n=n-1 WHERE id=? AND n>0</code> 条件更新——无论上层怎么漏，DB 是最后防线。',
      '黄牛刷子：设备指纹+限流+风控名单；URL 提前暴露 → 动态 URL/加密 token。',
    ],
    questions: [
      { q: '秒杀系统中 Redis 预扣库存的 Lua 脚本解决的核心问题是？', options: ['加密', '原子性：查询库存与扣减在并发下必须不可分割，否则仍超卖', '持久化', '限流'], answer: 1, explain: 'GET 再 SET 两步之间有并发窗口（都读到 1 都扣成功）。Lua 在 Redis 单线程内原子执行"判断+扣减"，这是防超卖的第一道墙。' },
      { q: '秒杀前把商品详情页静态化放 CDN，目的是？', options: ['好看', '把 99% 的浏览流量挡在源站之外，只有下单请求进入业务系统——削减入口流量', '利于 SEO', '省 CDN 费'], answer: 1, explain: '秒杀流量模型：浏览:下单 ≈ 100:1。静态化 + 按钮置灰防重复点击，是"漏斗最上层"的削峰。' },
    ],
  },
  {
    day: 76, stage: '设计题坑', title: '订单与支付坑',
    points: [
      '订单号不能用自增（暴露量级+可遍历）——时间戳+机器+序列或雪花，且趋势递增利于 InnoDB 写入。',
      '支付回调必做：验签（防伪造）→ 幂等（同笔多次回调只处理一次）→ 状态机流转（只允许合法状态迁移）→ 主动查单兜底（回调会丢）。',
      '金额用分存 int：浮点 double 存金额有精度灾难（0.1+0.2≠0.3），BigDecimal 也要指定 scale 与 RoundingMode。',
      '退款与支付解耦：退款单独立建表走异步流程，失败重试+人工介入队列。',
    ],
    questions: [
      { q: '支付接口返回成功但回调通知丢失，订单永远停在"待支付"，兜底机制是？', options: ['等用户重付', '主动查单：定时任务对超时未回调的订单调用支付平台查单接口对账修正', '数据库手动改', '让用户截图'], answer: 1, explain: '网络通知不承诺必达，正规支付平台都提供查单 API。生产标配：回调（实时）+ 查单（兜底）+ 对账（T+1 终极兜底）三层。' },
      { q: '订单金额字段为什么禁止使用 float/double？', options: ['占用空间大', 'IEEE754 二进制无法精确表示 0.1 等十进制小数，累加产生舍入误差，对账差一分钱就是事故', '运算慢', 'MySQL 不支持'], answer: 1, explain: '0.1+0.2=0.30000000000000004。方案：整数分（bigint）、DECIMAL(10,2)、Java 层 BigDecimal（字符串构造，不用 double 构造）。' },
    ],
  },
  {
    day: 77, stage: '算法应试坑', title: '刷题方法论坑',
    points: [
      '只看不写 = 不会：看题解"懂了"和 20 分钟内白板写对是两回事——每题必须独立敲一遍跑通。',
      '刷题不复盘 = 白刷：错题按"套路"归档（双指针/滑窗/二分/DP…），三天后重写，写对才移出错题本。',
      '死磕 hard 两小时不如先把 medium 刷透：面试 80% 是 medium，hard 优先刷高频（LRU/K组翻转/接雨水/编辑距离）。',
      '写完不分析复杂度 = 半成品：面试官必追问时间/空间复杂度与优化空间。',
    ],
    questions: [
      { q: '面试手撕算法时最优先要做的是？', options: ['直接写代码抢时间', '先确认题意与边界（输入范围/特殊情况）+ 说清思路获面试官认可后再动手', '选最难解法炫技', '沉默思考'], answer: 1, explain: '面试考察"工程师协作"不只是答案：沟通澄清、确认边界、讲述思路再编码——写错方向 20 分钟就没了，方向确认只要 2 分钟。' },
      { q: '刷题巩固记忆最有效的节奏是？', options: ['一遍过永远不回头', '艾宾浩斯复习：当天 → 3 天 → 7 天 → 21 天重写错题，按套路归档', '一天刷 50 题只看题解', '只刷简单题攒信心'], answer: 1, explain: '刷题的本质是"套路的肌肉记忆"。100 题按模板吃透 > 500 题走马观花。每题给自己讲一遍"为什么用这个套路"。' },
    ],
  },
  {
    day: 78, stage: '面试表达坑', title: '自我介绍与项目介绍坑',
    points: [
      '自我介绍流水账 → 应该是"技术名片"：30 秒定位你 = 方向 + 亮点技术 + 量化成果。',
      '项目介绍讲需求不讲设计："我用 SpringBoot 写了个商城"毫无信息量——讲"并发量/难点/你的方案/结果数据"。',
      '"精通"二字是靶子：写精通 = 邀请面试官往死里问；用"熟悉/掌握"并准备好被问穿的深度。',
      '简历项目被人问倒（说不清架构图/为什么选型）= 直接 pass——简历上每一行都要能撑 3 层追问。',
    ],
    questions: [
      { q: '项目介绍的最优结构是？', options: ['按代码模块逐个讲', 'STAR：业务背景（什么问题）→ 技术挑战（难在哪）→ 你的方案（为什么这么选）→ 量化结果（QPS/耗时/稳定性）', '罗列所有技术名词', '只讲亮点不讲过程'], answer: 1, explain: '面试官要听的是"你解决了什么难题"而不是"你用了什么技术"。量化结果（RT 从 800ms 降到 50ms）是最有力的语言。' },
      { q: '简历写"精通 Java 并发"，被追问 AQS 源码答不上，最好的补救是？', options: ['硬编到底', '坦诚边界："AQS 我掌握到 CLH 队列层面，更深的实现我需要回去再深入"——诚实+展示已知深度', '转移话题', '反问面试官'], answer: 1, explain: '面试官对"背题"高度敏感，对"诚实+方法论"宽容。答不上时展示"我知道什么、不知道什么、怎么补"反而是加分项。' },
    ],
  },
  {
    day: 79, stage: 'Git 与协作坑', title: '版本管理坑',
    points: [
      'commit 信息写 "fix" "update" = 三个月后自己都看不懂 → 规范：feat/fix/refactor + 一句话说清"改了什么为什么"。',
      '在 master/main 直接开发 = 事故温床：feature 分支开发 → Code Review → 合并，是协作底线。',
      '.env/密码/密钥一旦 commit 就永久在历史里：换密码没用，历史还在——用 git-secrets 预防，泄露了要重写历史（BFG）。',
      'merge 冲突乱解决：只顾编译通过不管语义 → 逻辑静默损坏。冲突要理解双方意图再合并。',
    ],
    questions: [
      { q: '敏感配置误 commit 并 push 到远程，正确处理是？', options: ['删掉文件再 commit 一次就安全了', '立即改密码使其失效 + 从历史中清除（BFG/filter-repo）+ 团队通报——历史里的密码任何人都看得到', '不管它', '把仓库设为私有'], answer: 1, explain: 'Git 历史不可变：后续删除只影响最新版本，历史版本仍可 checkout 出密码。所以"改密码"永远是最急的第一步，然后才是历史清理。' },
      { q: '解决 merge 冲突时，最危险的做法是？', options: ['逐行理解双方改动后合并', '直接选择"使用我的版本"（--ours）一键解决所有冲突', '和同事讨论', '借助 IDE 三方对比工具'], answer: 1, explain: '一键 ours/theirs 会把对方的改动全部静默丢弃，编译照样通过但功能丢失——这是最难发现的事故类型。冲突必须逐个语义级确认。' },
    ],
  },
  {
    day: 80, stage: 'MyBatis 实战坑', title: 'ORM 使用坑',
    points: [
      '#{} 与 ${} 用混：ORDER BY ${column} 是注入重灾区——动态列名必须白名单映射。',
      'resultType 对象字段与查询列别名不匹配 → 悄悄返回 null 而不是报错（mapUnderscoreToCamelCase 要开）。',
      '批量插入用 for 循环单条 insert = N 次网络往返；用 <foreach> 拼批量 insert（注意单批数量防 SQL 超长）。',
      'PageHelper.startPage 忘了紧跟查询 → ThreadLocal 残留污染下一条 SQL（页码错乱）。',
    ],
    questions: [
      { q: 'PageHelper.startPage(1,10) 与查询之间插入了另一个查询，会发生什么？', options: ['报错', '分页参数作用到了插入的那条查询上（ThreadLocal 消费后清除），目标查询不分页', '两条都分页', '数据错乱无法预测'], answer: 1, explain: 'PageHelper 把分页参数放 ThreadLocal，被下一个 SQL 消费。中间插了别的查询 → 分页错位。规范：startPage 与目标查询紧贴。' },
      { q: 'MyBatis 查询返回的字段全为 null 但 SQL 有数据，最可能因为？', options: ['数据库坏了', '列名与实体属性不匹配（下划线 vs 驼峰）且没开驼峰映射或没起别名', '网络问题', '事务未提交'], answer: 1, explain: 'create_time → createTime 需要 map-underscore-to-camel-case=true 或 SQL 别名。MyBatis 匹配不到就静默 null，不报错。' },
    ],
  },
  {
    day: 81, stage: '消息队列实战坑', title: 'MQ 使用姿势坑',
    points: [
      '生产端不带业务 key 发消息 → 消费端无法幂等/无法保证同实体有序（Kafka 按 key 分区）。',
      '消费逻辑里做重活（调外部接口超时 30s）→ 消费堆积。MQ 只做"通知"，重活再异步化。',
      '死信队列不监控 = 消息黑洞：失败进死信没人看 → 业务悄悄丢数据。死信必须告警+人工处理台。',
      '顺序消息的消费端并发也会乱序：同 key 路由同分区后，消费端还要单线程/内存队列保序。',
    ],
    questions: [
      { q: 'Kafka 生产端发送订单消息时不指定 key，会导致？', options: ['发不出去', '消息轮询进各分区：同一订单的状态变更可能落不同分区，消费端无法保证该订单的顺序', '消息丢失', '消费变慢'], answer: 1, explain: 'Kafka 只保证分区内有序。需要"同一订单事件有序"就必须 key=orderId，让同订单消息进同一分区。' },
      { q: '死信队列（DLQ）的正确用法是？', options: ['直接删除死信', '监控告警 + 人工/定时任务介入处理：死信是"自动重试均失败"的信号，背后通常是需要人看的异常', '回原队列无限重试', '忽略'], answer: 1, explain: '死信 = 系统在喊救命。无限重试会把队列堵死；静默丢弃则丢业务数据。规范：有限重试 → 死信 → 告警 → 处理后重新投递。' },
    ],
  },
  {
    day: 82, stage: '微服务实战坑', title: '服务拆分与调用坑',
    points: [
      '拆分过细（一个接口一个服务）→ 链路长、排查难、分布式事务满天飞：按业务能力拆，够用就好。',
      '同步调用链路过长 → RT 相加、可用性相乘（每层 99.9% 四层就是 99.6%）：能用异步事件解耦就别串行同步。',
      '超时不设置或全局统一：下游恶化上游傻等 → 线程池打满雪崩。超时逐层递减 + 熔断降级。',
      '重试不加退避 = 重试风暴：下游抖动所有上游同时重试 → 雪上加霜。指数退避+抖动+熔断组合。',
    ],
    questions: [
      { q: '四个服务串行调用，每个可用性 99.9%，整条链路可用性约是？', options: ['99.9%', '99.6%（0.999⁴）——链路越长可用性越差', '100%', '90%'], answer: 1, explain: '可用性是相乘不是相加：0.999⁴ ≈ 0.996 = 年故障 35 分钟变 2.3 小时。这就是"能异步就异步"的数学依据。' },
      { q: '服务 B 偶发超时，服务 A 对 B 的调用重试策略应该是？', options: ['无限重试直到成功', '有限次数 + 指数退避 + 随机抖动，配合熔断器（连续失败达阈值后快速失败一段时间）', '加大线程池', '重试 100 次'], answer: 1, explain: '无脑重试 = DDoS 自己。退避（1s→2s→4s）+ 抖动避免同步踩踏；熔断让 A 在 B 恢复期间快速失败释放资源。' },
    ],
  },
  {
    day: 83, stage: '监控与告警坑', title: '可观测性建设坑',
    points: [
      '只看平均响应时间：平均数掩盖长尾——P99/P999 才是用户真实体验。',
      '告警风暴：阈值拍脑袋 → 半夜 50 条告警 → 麻木没人看。告警必须：有行动指南、分级、去重聚合。',
      '日志/指标/链路三件套缺一不可：指标发现"有问题"，链路定位"在哪一步"，日志分析"为什么"。',
      '没有基线 = 没有异常：先记录正常水位再谈告警。',
    ],
    questions: [
      { q: '接口平均 RT 50ms 但用户反馈"偶尔很卡"，该看什么指标？', options: ['平均值没问题就是快', 'P99/P999 分位数：可能 1% 请求 2s+（GC 停顿/慢 SQL/锁竞争），平均完全看不出来', 'CPU 使用率', '流量曲线'], answer: 1, explain: '长尾分布下平均无意义：99 个 10ms + 1 个 4s，平均才 49ms 但那个用户已经爆炸。分位数 + 直方图是接口监控标配。' },
      { q: '告警设计的核心原则是？', options: ['越敏感越好', '每条告警都必须可行动（收到知道该做什么）+ 分级 + 聚合去重，避免狼来了效应', '只发邮件', '全部打到群里'], answer: 1, explain: '告警疲劳是生产事故的温床：无效告警让团队麻木，真事故被淹没。按"用户影响面"分级：P0 电话、P1 群通知、P2 日报。' },
    ],
  },
  {
    day: 84, stage: '综合冲刺', title: 'Offer 谈判与选择坑',
    points: [
      '只看薪资不看成长：3 年后差距 = 平台业务复杂度 × 技术挑战 × 团队水平，首年薪资差 20% 远不值。',
      '加班文化不问清楚：面试反问"团队日常节奏/上线频率"——入职后发现 996 再跑成本极高。',
      '口头 offer 不算 offer：薪资/职级/期权/入职时间全部落到书面（邮件确认）再提离职。',
      '小公司 title 大 vs 大厂螺丝钉：0-3 年优先选"能学到体系化东西"的平台。',
    ],
    questions: [
      { q: '两个 offer：A 大厂规范但螺丝钉，B 创业公司高 30% 但技术栈老旧一人多岗，0-3 年更建议？', options: ['一定选钱多的 B', '看成长密度：若 A 有规范工程实践与 mentor 优先 A；技术老+无人带 = 用青春换钱，谨慎评估', '一定选大厂 A', '掷硬币'], answer: 1, explain: '0-3 年的核心资产是"正确工程习惯与技术视野"——在烂环境养成坏习惯，纠正成本极高。' },
      { q: '拿到口头 offer 后正确的做法是？', options: ['立即提离职', '确认关键条款书面化（薪资结构/职级/期权/绩效/入职时间），等背调与审批全部走完再提离职', '告诉所有人', '拒绝其他面试'], answer: 1, explain: '口头 offer 在审批/背调环节都可能变卦。铁律：书面确认 + 入职材料齐备后才提离职。' },
    ],
  },
  {
    day: 85, stage: '综合冲刺', title: '简历工程细节坑',
    points: [
      '技术栈罗列不写场景："熟悉 Redis" → 改成"用 Redis 实现分布式锁与热点缓存，解决 XX 场景超卖问题"。',
      '项目描述没有量级：加数字——日活/QPS/数据量/团队规模。',
      '格式花哨 → 技术简历黑白 PDF、单栏、关键词清晰（机筛友好），一页为佳。',
      '投递前跑一遍 JD 关键词：机筛靠关键词匹配，JD 里的技术词简历里没有直接被过滤。',
    ],
    questions: [
      { q: '简历中项目经验最有说服力的写法是？', options: ['负责全部开发工作', '动词开头 + 技术手段 + 量化结果："主导订单服务重构，引入分库分表与缓存，支撑 QPS 从 500 提升至 5000"', '粘贴源码链接', '写需求列表'], answer: 1, explain: '"动词+手段+量化结果"三要素让面试官 10 秒抓住你的价值。每个项目准备 3 条这样的 bullet，每条都能展开讲 5 分钟。' },
      { q: '大厂简历机筛（ATS）主要过滤什么？', options: ['照片颜值', 'JD 关键词命中率与基本硬条件（学历/年限/城市）——技术关键词不全会直接漏掉', '字体大小', 'GitHub 链接'], answer: 1, explain: '海投阶段先过机筛再到人眼。对策：针对性改简历（不是造假），把真实做过但没写出来的技术点按 JD 语言补齐。' },
    ],
  },
  {
    day: 86, stage: '综合冲刺', title: '背调与入职坑',
    points: [
      '离职原因说前司坏话 = 红灯："追求更大平台/技术挑战"是安全答案。',
      '背调查社保记录：履历时间造假必穿帮（社保连续性对不上），诚信问题直接 cancel offer。',
      '入职材料提前备：离职证明/体检/银行卡，离职证明丢了提前和前司 HR 沟通补开。',
      '试用期主动对齐预期（30/60/90 天目标），定期和 mentor 同步，别闷头干。',
    ],
    questions: [
      { q: '背调环节最致命的行为是？', options: ['薪资期望高', '履历时间造假或虚报职级——社保与银行流水可直接验证，属诚信红线', '话少', '离职原因一般'], answer: 1, explain: '能力不足可培养，诚信问题零容忍。正规公司背调必查社保连续性，"编造经历填补空窗"是最高频翻车点。空窗期如实说明即可。' },
      { q: '入职后 30/60/90 天计划的意义是？', options: ['形式主义', '主动与上级对齐预期：什么算做好、优先级是什么、何时 review——试用期通过率的最大保障', '给 HR 看的', '限制自己'], answer: 1, explain: '试用期挂人的主因是"预期错位"。主动定期对齐 = 把不确定性消灭在过程中。' },
    ],
  },
  {
    day: 87, stage: '综合冲刺', title: '持续成长坑',
    points: [
      '收藏 ≠ 学会：输入要有输出（博客/分享/开源 PR），输出倒逼理解。',
      '只追新框架不学原理：框架三年一换，原理（OS/网络/DB/分布式）十年不变——原理是"慢变量"。',
      '不写技术文档：写文档 = 强迫自己把模糊认知变清晰，团队里"能写清楚"的人晋升最快。',
      '每天 1 小时刻意学习（原理/英语/算法），复利三年 = 完全不同的职业曲线。',
    ],
    questions: [
      { q: '技术学习最高效的闭环是？', options: ['看视频收藏', '输入（文档/源码）→ 实践（项目/DEMO）→ 输出（博客/分享）→ 反馈修正', '报班被动学', '只看书不动手'], answer: 1, explain: '费曼学习法：能把概念讲给外行听懂 = 真正掌握。输出暴露理解漏洞，是最高效的查漏手段。' },
      { q: '技术选型学习上，更值得长期投入的是？', options: ['最新最热的框架', '慢变量：操作系统/网络/数据库原理/分布式理论——框架会过时，原理可迁移', 'UI 框架', '所有新语言都学一遍'], answer: 1, explain: '框架是原理的投影：懂 epoll 才真懂 Nginx/Redis/Netty 的差异；懂 B+ 树才能在任何数据库做优化。' },
    ],
  },
  {
    day: 88, stage: '综合冲刺', title: '高频遗忘点速记（考前一天）',
    points: [
      'Integer 缓存 -128~127（valueOf/自动装箱）；new Integer 永远新对象。',
      'String 不可变、常量池；StringBuilder 线程不安全快，StringBuffer 安全慢。',
      'HashMap：数组+链表+红黑树（链表长 8 且数组 ≥64 树化）；默认容量 16，负载 0.75，扩容 2n；线程不安全。',
      'ConcurrentHashMap 1.8：CAS+synchronized 锁桶头节点，size 用 CounterCell 分段计数。',
      'MySQL 默认隔离级别 RR（Oracle/PG 是 RC）；InnoDB 行锁+MVCC；MyISAM 表锁无事务。',
      'Redis 单线程（网络 IO 6.0 多线程）+ 内存操作所以快；过期策略惰性+定期，内存淘汰默认 noeviction。',
    ],
    questions: [
      { q: '链表长度达到 8 且数组长度 ≥ 64 时 HashMap 会？', options: ['直接扩容', '链表转红黑树，查询从 O(n) 到 O(logn)；节点数降到 6 退化回链表', '删除链表', '抛异常'], answer: 1, explain: '两个条件缺一不可：数组 <64 时优先扩容。树化阈值 8 是泊松分布下冲突概率极低的工程取舍。' },
      { q: 'Redis 6.0 引入多线程是为了？', options: ['命令执行并行化', '网络 IO（读写/协议解析）多线程——命令执行仍是单线程，保证原子性语义不变', '支持事务', '替代持久化'], answer: 1, explain: '瓶颈从 CPU 变网络 IO 后，6.0 把"读请求解析/写响应"交给多线程，执行器保持单线程——既提速又不破坏"单命令原子"。' },
    ],
  },
  {
    day: 89, stage: '综合冲刺', title: '面试时间线与心态',
    points: [
      '金三银四/金九银十：提前 1-2 个月刷题+背八股+打磨项目；应届生秋招比春招名额多一倍以上。',
      '面试顺序策略：先面 2-3 家不想去的练手攒经验，再面心仪公司——面试也是熟练度活。',
      '一面挂≠你菜：匹配度/HC/面试官偏好都影响结果，复盘"答不好的题"比沮丧有用。',
      '连续被拒的心态：把每次面试当"免费模拟考+行业情报收集"，问到的不会题记下来就是复习清单。',
    ],
    questions: [
      { q: '秋招投递的最优节奏是？', options: ['全部攒到最后一天投', '分梯队：提前批（免笔试直通）→ 第一批 → 补录；先练手后心仪，每场面试后立即复盘', '只投一家押注', '等春招'], answer: 1, explain: '提前批/早批次 HC 最充足、竞争比最低。面试状态需要热身：dream 公司放在第 3-5 场之后。' },
      { q: '面试被问倒时，下列哪种回应最减分？', options: ['"这块我了解不深，但我的理解思路是……"', '沉默或直接说"不知道"然后不再尝试', '请求提示', '关联到相近的知识点'], answer: 1, explain: '"直接躺平"暴露的是态度问题而非知识问题。正确姿势：承认边界 + 给出推理尝试 + 表达学习意愿。' },
    ],
  },
  {
    day: 90, stage: '综合冲刺', title: '毕业总结：全栈工程师的完整知识地图',
    points: [
      '<b>语言层：</b>Java 语法 → OOP → 集合 → 并发（JMM/线程池/锁/AQS）→ JVM（内存/GC/调优）。',
      '<b>框架层：</b>Spring（IoC/AOP/事务/MVC/Boot 自动装配）→ MyBatis → Spring Cloud（注册/配置/网关/熔断）。',
      '<b>数据层：</b>MySQL（索引/事务/MVCC/锁/日志/主从/分库分表）→ Redis（结构/持久化/缓存三问/集群/分布式锁）→ ES/MQ。',
      '<b>系统层：</b>网络（TCP/HTTP/HTTPS）→ OS（进程/内存/IO/epoll）→ Linux/Docker/K8s → 分布式理论（CAP/Raft）。',
      '<b>工程层：</b>Git → 单测 → CI/CD → 监控告警（Metrics/Tracing/Logging）→ 线上排错方法论。',
      '<b>软实力：</b>需求沟通 → 方案设计文档 → 复盘表达 → 面试谈判。以上 90 天全部覆盖，回到首页按章节查漏补缺。',
    ],
    questions: [
      { q: '这套课程的学习闭环顺序，最合理的是？', options: ['直接背八股文', '按"语言→框架→数据→中间件→系统→工程"主线推进，每章配测验/易错点/模拟考自测，最后图解原理收口', '先学分布式', '只做项目不学理论'], answer: 1, explain: '八股是"压缩包"需要解压：没有语言与系统层的地基，背了也撑不住追问。主线学习 + 测验自检 + 长文收口，才是正确打开方式。' },
      { q: '检验自己是否达到"全栈入门"的标准是？', options: ['能背出所有八股', '独立完成一个含登录/CRUD/缓存/消息/部署的完整项目，并能解释每个技术选型的"为什么"', '看过所有视频', '刷完所有题'], answer: 1, explain: '全栈的本质是"能对结果负责的完整交付能力"：从需求到上线到排错。项目是试金石，八股只是入场券。' },
    ],
  },
];

/* ---- 统计 ---- */
export const pitfallStats = (() => {
  let qCount = 0, pCount = 0;
  pitfallDays.forEach(d => { qCount += d.questions.length; pCount += d.points.length; });
  return { days: pitfallDays.length, questions: qCount, points: pCount };
})();
