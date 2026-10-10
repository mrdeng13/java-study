// 面试八股文题库：高频真题 + 标准答案 + 加分点 + 追问链
// 按面试官习惯分组：每题都有"标准答案"和"加分回答"，追问链模拟面试官连环发问

export const baguwenCategories = [
  {
    id: 'bw-java', icon: '☕', name: 'Java 基础',
    desc: '面试前 15 分钟的"热身区"，答得漂亮能给整场定调。',
    items: [
      {
        q: 'JDK、JRE、JVM 三者的区别和联系？',
        a: '<b>JVM</b> 是 Java 虚拟机，负责执行字节码，是"一次编写、到处运行"的关键；<b>JRE</b> = JVM + Java 核心类库，是运行 Java 程序的最小环境；<b>JDK</b> = JRE + 开发工具（javac 编译器、jdb 调试器、jconsole 等），是开发完整工具包。<b>包含关系：JDK ⊃ JRE ⊃ JVM。</b>类比：JVM 是发动机，JRE 是整辆车（能开），JDK 是 4S 店的全套（能开还能修）。',
        plus: '可以补一句：字节码 + JVM 的架构让 Java 相比 C++ 牺牲了一点性能，换来了跨平台和自动内存管理（GC）。',
        followups: ['为什么 Java 能跨平台而 C 不行？', 'javac 和 java 两个命令分别干了什么？'],
      },
      {
        q: '== 和 equals 的区别？为什么重写 equals 必须重写 hashCode？',
        a: '<b>==</b> 比较基本类型的值，或引用类型的内存地址（是否同一个对象）；<b>equals</b> 默认（Object 里）也是比地址，但 String 等类重写后比较内容。<br><b>必须成对重写的原因：</b>hashCode 约定是"equals 相等的两个对象，hashCode 必须相等"。如果只重写 equals，两个"内容相同"的对象 equals 为 true 但 hashCode 不同——放进 HashMap 时会被分到不同桶里，出现"两个相等的 key 同时存在"的诡异 bug。<br><b>经典陷阱：</b>Integer 缓存 -128~127，此范围内 == 比较为 true，超出就为 false，所以永远用 equals 比。',
        plus: '提到阿里规约明确要求：重写 equals 必须重写 hashCode；String 已重写所以字符串能直接作 HashMap 的 key。',
        followups: ['两个对象 hashCode 相同，equals 一定为 true 吗？（不一定，哈希冲突）', 'String 为什么设计成不可变的？'],
      },
      {
        q: 'String、StringBuilder、StringBuffer 的区别与底层原理？',
        a: '<b>String 不可变</b>：内部用 final char[]（JDK9 后是 byte[]）存储，任何修改都产生新对象——好处是线程安全、可以缓存 hashCode、字符串常量池能复用。<br><b>StringBuilder 可变</b>：非线程安全，性能最好，单线程拼字符串必用；<b>StringBuffer</b> = StringBuilder + synchronized，线程安全但慢。<br><b>性能对比：</b>循环拼接 1 万次，String 每次都新建对象（O(n²)），StringBuilder 是 O(n)，差距是数量级的。',
        plus: '补充编译器优化：a + "b" + "c" 编译期会合并；new String("abc") 可能创建 1 或 2 个对象（常量池没有 "abc" 时是 2 个）。',
        followups: ['字符串常量池在 JVM 哪个区域？', 'intern() 方法的作用？'],
      },
      {
        q: '面向对象三大特性是什么？分别举个实际开发的例子。',
        a: '<b>封装：</b>隐藏内部细节，只暴露接口。例：实体类属性用 private + getter/setter，外部不能直接改余额字段。<br><b>继承：</b>子类复用父类的属性行为并扩展。例：BaseEntity 抽出 id/createTime，所有表实体继承它。<br><b>多态：</b>父类引用指向子类对象，运行时决定调谁的方法。例：<code>List&lt;PayService&gt; services</code> 里放微信/支付宝实现，调 <code>service.pay()</code> 自动走对应实现——这也是策略模式的基础。<br><b>加分补充第四特性"抽象"：</b>忽略细节提取共性，抽象类和接口都是它的体现。',
        plus: '多态的三个必要条件：继承/实现、重写、父类引用指向子类对象。可以主动提运行时多态靠动态绑定实现。',
        followups: ['重载和重写的区别？', 'Java 为什么不支持多继承？（菱形问题，用接口 default 解决）'],
      },
      {
        q: '接口和抽象类的区别？什么时候用哪个？',
        a: '<b>语法层面：</b>抽象类是"半成品类"（可有构造器、成员变量、具体方法），单继承；接口是"行为契约"（JDK8 前只有常量和抽象方法，8 后有 default/static 方法），可多实现。<br><b>设计层面（本质区别）：</b>抽象类表示 <b>is-a</b>（"是不是"），提取同类共性，如 Dog is-a Animal；接口表示 <b>can-do</b>（"有没有某种能力"），如 Comparable、Serializable。<br><b>选择原则：</b>要复用代码骨架选抽象类（模板方法模式）；只定义能力规范、期望多继承效果选接口。',
        plus: '举例：Spring 的 Dao 支持类体系既有接口定规范又有抽象类给骨架代码（JdbcDaoSupport）。',
        followups: ['JDK8 接口 default 方法解决什么问题？', '抽象类能有构造方法吗？（能，供子类 super 调用）'],
      },
      {
        q: 'final、finally、finalize 有什么区别？（经典文字游戏题）',
        a: '三者毫无关系，纯粹长得像：<br><b>final</b> 修饰符：类不可继承、方法不可重写、变量不可重新赋值（引用不可变 ≠ 对象内容不可变）；<br><b>finally</b>：try/catch 的收尾块，<b>几乎总执行</b>，用于释放资源；例外：System.exit(0)、JVM 崩溃、线程被杀；<br><b>finalize</b>：Object 的方法，GC 前的"临终遗言"，JDK9 已废弃——因为它执行时机不确定、可能复活对象，资源释放应改用 try-with-resources。',
        plus: '经典笔试题：try 里 return 了 finally 还执行吗？——执行，且在 return 表达式求值之后、真正返回之前；finally 里改返回值会影响结果（基本类型 vs 引用类型行为不同）。',
        followups: ['try-with-resources 原理是什么？', 'finally 里写 return 会怎样？'],
      },
      {
        q: 'Java 的异常体系？受检异常和非受检异常怎么选？',
        a: 'Throwable 下两大分支：<br><b>Error</b>：严重错误，程序不该捕获，如 OutOfMemoryError、StackOverflowError；<br><b>Exception</b>：① 受检异常（IOException、SQLException）：编译器强制 try/catch 或 throws，用于"可预期可恢复"的外部问题；② 运行时异常 RuntimeException（NPE、数组越界、ClassCastException）：编译器不管，多为程序 bug，应修代码而不是捕获了事。<br><b>实践原则：</b>不要用异常做业务流程控制；自定义业务异常继承 RuntimeException + 全局异常处理器统一处理。',
        plus: '说出 NPE 防御三板斗：Objects.requireNonNull、Optional、StringUtils 判空，面试官眼前一亮。',
        followups: ['finally 一定执行吗？', 'OOM 一定能被 try-catch 捕获吗？（能捕获但没意义，应排查内存泄漏）'],
      },
    ],
  },
  {
    id: 'bw-collect', icon: '📦', name: '集合框架',
    desc: '面试出场率第一的模块，HashMap 一道题就能问 20 分钟。',
    items: [
      {
        q: 'ArrayList 和 LinkedList 的区别？谁的性能一定好？',
        a: '<b>底层结构：</b>ArrayList 是动态数组（Object[]），LinkedList 是双向链表。<br><b>性能对比：</b>① 随机访问：ArrayList O(1) 完胜，LinkedList O(n)；② 头部插入删除：LinkedList O(1) 占优，ArrayList 要整体后移 O(n)；③ 尾部插入：两者都近似 O(1)（ArrayList 扩容均摊后仍是 O(1)）。<br><b>颠覆认知的真相：</b>实际开发几乎无脑用 ArrayList——因为 CPU 缓存对连续内存极其友好（缓存行预加载），LinkedList 每个节点都是分散对象还带前后指针，即使理论上"O(1) 插入"的场景，实测也常输给 ArrayList。',
        plus: '说出 ArrayList 扩容机制：默认容量 10（懒加载，第一次 add 才分配），1.5 倍扩容（oldCapacity + oldCapacity >> 1），用 Arrays.copyOf 迁移——体现你读过源码。',
        followups: ['ArrayList 扩容是几倍？为什么不是 2 倍？', '线程安全的 List 有哪些？（Vector、CopyOnWriteArrayList、Collections.synchronizedList）'],
      },
      {
        q: 'HashMap 的底层数据结构？put 一个元素的完整流程？',
        a: '<b>结构：</b>数组 + 链表 + 红黑树（JDK8 起）。数组是主干，哈希冲突挂链表，链表长度 ≥ 8 且数组长度 ≥ 64 时树化，退化阈值 6。<br><b>put 流程（必须背熟）：</b>① 计算 key 的 hash：<code>(h = key.hashCode()) ^ (h >>> 16)</code>——高 16 位异或低 16 位，让高位也参与运算减少冲突；② (n-1) & hash 定位桶下标（n 是数组长度，这也是长度必须是 2 的幂的原因）；③ 桶为空直接放入；④ 有值则比较：key 相同覆盖，否则挂链表尾部（尾插法，JDK7 是头插会成环）；⑤ 链表超阈值树化；⑥ size 超过 <code>容量 × 0.75</code> 触发扩容翻倍并重新分布。',
        plus: '主动对比 JDK7/8 差异：7 是数组+链表、头插法（并发扩容会死循环）、先扩容后插入；8 改尾插修复此 bug。',
        followups: ['为什么容量是 2 的幂？', '为什么树化阈值是 8？（泊松分布，冲突到 8 的概率约千万分之一）', 'HashMap 是线程安全的吗？并发会出什么问题？'],
      },
      {
        q: 'HashMap、HashTable、ConcurrentHashMap 三者对比？',
        a: '<b>HashMap：</b>线程不安全，允许 null key/value，性能最好；<br><b>HashTable：</b>古老类，所有方法 synchronized（锁整张表），线程安全但性能极差，不允许 null，已淘汰；<br><b>ConcurrentHashMap：</b>并发神器——JDK7 用分段锁（16 段 Segment，并发度 16）；JDK8 抛弃分段锁，改用 <b>CAS + synchronized 锁单个桶头节点</b>：桶为空用 CAS 插入（无锁），有冲突才 synchronized 该桶——锁粒度从"整表"细化到"桶"，并发度大幅提升；size 用 CounterCell 分段计数（类似 LongAdder）。',
        plus: '补充：ConcurrentHashMap 的 key/value 都不允许 null（因为并发环境下 get 返回 null 无法区分"不存在"还是"值为 null"，会有二义性）。',
        followups: ['JDK8 的 ConcurrentHashMap size() 怎么统计的？', 'CopyOnWriteArrayList 适用什么场景？（读多写极少，如监听器列表）'],
      },
      {
        q: 'fail-fast 和 fail-safe 机制是什么？',
        a: '<b>fail-fast（快速失败）：</b>ArrayList、HashMap 等在迭代时如果被结构性修改，next() 时立刻抛 ConcurrentModificationException。原理是迭代器内部记录 expectedModCount，与集合的 modCount 比对发现被改就报错——注意：<b>单线程下用 list.remove() 也会触发</b>，正确做法是用 iterator.remove() 或 removeIf。<br><b>fail-safe（安全失败）：</b>CopyOnWriteArrayList、ConcurrentHashMap 在副本或弱一致性视图上遍历，不抛异常，但代价是看不到最新修改。',
        plus: '说出经典陷阱：遍历中删除倒数第二个元素不报错（因为 next 检查的是游标位置），这是 modCount 机制的巧合不是特性。',
        followups: ['为什么阿里巴巴规约禁止在 foreach 里删除元素？', 'removeIf 的底层实现？'],
      },
    ],
  },
  {
    id: 'bw-concurrent', icon: '🧵', name: '并发编程',
    desc: '大厂面试的"第二战场"，线程池参数必须能默写。',
    items: [
      {
        q: '线程的创建方式有哪几种？start() 和 run() 的区别？',
        a: '<b>创建方式：</b>① 继承 Thread；② 实现 Runnable（推荐，避免单继承限制）；③ 实现 Callable + FutureTask（有返回值、可抛异常）；④ 线程池提交任务。<br><b>start() vs run()：</b>调 run() 只是普通方法调用，<b>不会创建新线程</b>，还是主线程在执行；调 start() 才会真正向操作系统申请创建线程，由新线程执行 run()。且 start() 不能对同一 Thread 对象调两次（会抛 IllegalThreadStateException）。',
        plus: '提一句线程状态机：NEW → RUNNABLE → (BLOCKED/WAITING/TIMED_WAITING) → TERMINATED，面试官常让现场画。',
        followups: ['Java 线程和操作系统线程什么关系？（1:1 内核线程映射）', '线程有哪几种状态？'],
      },
      {
        q: 'synchronized 原理？锁升级过程说一下。',
        a: '<b>用法三态：</b>修饰实例方法（锁 this）、静态方法（锁 Class 对象）、代码块（锁指定对象）。<br><b>底层原理：</b>基于对象头的 Mark Word + monitor（monitorenter/monitorexit 字节码指令）。<br><b>锁升级（JDK6 优化，单向不可逆）：</b>无锁 → <b>偏向锁</b>（只有一个线程访问，Mark Word 记线程 ID，近乎免费）→ <b>轻量级锁</b>（第二个线程来了，CAS 自旋抢锁，适合持锁时间极短的场景）→ <b>重量级锁</b>（自旋失败次数多，升级为 monitor，线程阻塞挂起，涉及内核态切换成本高）。JDK15 起偏向锁被废弃（维护成本大于收益）。',
        plus: '对比 ReentrantLock：synchronized 是 JVM 关键字自动释放锁；ReentrantLock 是 API 层面，要手动 unlock、支持公平锁/可中断/多条件变量 Condition。',
        followups: ['synchronized 和 ReentrantLock 怎么选？', '什么是可重入锁？为什么设计成可重入？'],
      },
      {
        q: 'volatile 是干什么的？能保证线程安全吗？',
        a: '<b>两大语义：</b>① <b>可见性</b>：写 volatile 变量立即刷回主内存，读时强制从主内存加载，禁用 CPU 缓存导致的"脏读"；② <b>禁止指令重排</b>：通过内存屏障实现，经典案例是双重检查锁单例里的 <code>private static volatile Singleton instance</code>——不加 volatile，<code>new</code> 的三步（分配内存→初始化→赋值引用）可能被重排为 1→3→2，另一线程拿到未初始化完的对象。<br><b>不能保证原子性！</b>i++ 是"读-改-写"三步操作，volatile 管不了，仍要用 AtomicInteger 或 synchronized。',
        plus: '深入到 JMM（Java 内存模型）和 happens-before 规则，是区分初级和高级的关键。',
        followups: ['双重检查锁单例为什么要 volatile？现场写一个。', 'CAS 是什么？ABA 问题怎么解决？'],
      },
      {
        q: '线程池的核心参数有哪些？工作流程？为什么不用 Executors 快速创建？',
        a: '<b>七大参数（核心 7 记 4）：</b>① corePoolSize 核心线程数；② maximumPoolSize 最大线程数；③ keepAliveTime + unit 非核心线程空闲存活时间；④ workQueue 任务队列；⑤ threadFactory 线程工厂；⑥ handler 拒绝策略。<br><b>工作流程（高频考）：</b>提交任务 → 核心线程未满则建核心线程 → 满了进队列 → 队列满了才建非核心线程 → 达到最大线程数后触发拒绝策略（Abort 抛异常/CallerRuns 调用者执行/Discard 丢弃/DiscardOldest 丢最老）。<b>注意顺序：先队列再扩线程</b>，和直觉相反。<br><b>禁用 Executors 的原因：</b>newFixedThreadPool/newSingleThreadExecutor 的队列是无界 LinkedBlockingQueue，任务堆积会 OOM；newCachedThreadPool 最大线程数是 Integer.MAX_VALUE，线程爆炸。<b>必须手动 new ThreadPoolExecutor 明确所有参数。</b>',
        plus: '给出参数设置经验：CPU 密集型 = 核数 + 1；IO 密集型 = 核数 × 2 或 核数 × (1 + 等待时间/计算时间)。',
        followups: ['线程池怎么优雅关闭？shutdown 和 shutdownNow 区别？', '核心线程会被回收吗？（默认不会，allowCoreThreadTimeOut 可改）'],
      },
      {
        q: 'ThreadLocal 是什么？内存泄漏是怎么回事？',
        a: '<b>作用：</b>线程级变量隔离——每个线程有自己独立副本，互不干扰。典型场景：存当前登录用户、SimpleDateFormat（它线程不安全）、数据库连接绑定。<br><b>原理：</b>每个 Thread 内有一个 ThreadLocalMap，key 是 ThreadLocal 的<b>弱引用</b>，value 是强引用。<br><b>内存泄漏链路：</b>ThreadLocal 外部引用消失 → 弱引用 key 被 GC → entry 变成 (null, value)，value 永远无法访问却强引用着 → 线程池线程存活很久，value 就一直泄漏。<b>解法：用完必须 remove()，放进 finally 里。</b>（InheritableThreadLocal / TransmittableThreadLocal 可解决父子线程传递，线程池场景要后者。）',
        plus: '说清"为什么 key 设计成弱引用"：这是补救措施而不是泄漏根源——至少 key 能被回收，且 set/get 时会顺手清理 stale entry。',
        followups: ['线程池 + ThreadLocal 为什么会串数据？', 'TransmittableThreadLocal 解决什么问题？'],
      },
    ],
  },
  {
    id: 'bw-jvm', icon: '🖥️', name: 'JVM 虚拟机',
    desc: '初级与中级的分水岭，答好 JVM 直接决定薪资档位。',
    items: [
      {
        q: 'JVM 内存区域有哪些？哪些会 OOM？',
        a: '运行时数据区五大块：<br>① <b>堆（Heap）</b>：对象实例的家，线程共享，GC 主战场，分新生代（Eden + 2 个 Survivor）和老年代；<br>② <b>虚拟机栈</b>：线程私有，方法调用的栈帧（局部变量表、操作数栈），递归太深 StackOverflowError；<br>③ <b>本地方法栈</b>：native 方法用；<br>④ <b>程序计数器</b>：记录当前执行的字节码行号，唯一不会 OOM 的区域；<br>⑤ <b>方法区/元空间（Metaspace，JDK8 起）</b>：类信息、常量、静态变量。JDK8 用元空间取代永久代，改用本地内存，默认无上限（可配 MaxMetaspaceSize）。<br><b>会 OOM 的：</b>堆（对象过多/内存泄漏）、元空间（动态生成类过多如 CGLib）、栈（-Xss 太小+深递归是 SOE）。',
        plus: '现场举例：new 一个大对象 → 堆 OOM；CGLib 动态代理狂生成类 → Metaspace OOM。说明你能把理论和故障对上号。',
        followups: ['对象一定分配在堆上吗？（逃逸分析 + 栈上分配/标量替换）', '永久代为什么被元空间替代？'],
      },
      {
        q: '对象什么时候会被 GC？常见垃圾回收算法和垃圾回收器？',
        a: '<b>判断对象死亡：</b>可达性分析法——从 GC Roots（栈帧局部变量、静态变量、常量、JNI 引用等）向下搜索，不可达即可回收（引用计数法有循环引用缺陷，JVM 不用）。<br><b>三大算法：</b>① 标记-清除：简单但产生内存碎片；② 标记-复制：新生代标配（Eden:S0:S1 = 8:1:1），无碎片但浪费空间；③ 标记-整理：老年代标配，无碎片但移动对象成本高。<br><b>回收器演进线：</b>CMS（并发标记清除，低停顿但有碎片，已废）→ <b>Parallel GC</b>（吞吐量优先，JDK8 默认）→ <b>G1</b>（Region 分区、可预测停顿，JDK9+ 默认）→ ZGC/Shenandoah（亚毫秒级停顿）。',
        plus: '说出 G1 的核心创新：把堆切成等大 Region，垃圾多的 Region 优先回收（Garbage First 名字由来），停顿时间目标是用户设定的软指标。',
        followups: ['Minor GC 和 Full GC 的触发条件？', '什么情况对象会直接进老年代？（大对象、Survivor 年龄 15、动态年龄判断）'],
      },
      {
        q: '类加载机制和双亲委派模型？为什么需要双亲委派？',
        a: '<b>类加载五阶段：</b>加载（读字节码生成 Class 对象）→ 验证 → 准备（静态变量分配内存设零值，注意此时还没赋初始值）→ 解析（符号引用转直接引用）→ 初始化（执行 <code>&lt;clinit&gt;</code>，静态变量真正赋值 + static 块）。<br><b>双亲委派：</b>类加载器分层：AppClassLoader → Platform/ExtClassLoader → BootstrapClassLoader。收到加载请求先逐级委托给父加载器，父加载器搞不定才自己加载。<br><b>为什么（背三个理由）：</b>① 安全：防止核心类被篡改（自己写个 java.lang.String 不会被加载）；② 避免重复加载（父加载器加载过的类子加载器不再加载，保证类唯一性）；③ 层次清晰符合"越基础的类由越高层加载器加载"的架构直觉。<b>打破场景：</b>Tomcat 隔离应用、SPI（线程上下文类加载器）、热部署。',
        plus: '经典笔试题：<code>static { x = 2; } static int x = 1;</code> 输出 x 是 1——因为准备阶段先零值，clinit 按代码顺序执行。',
        followups: ['tomcat 怎么打破双亲委派的？', '一个类能被加载两次吗？'],
      },
    ],
  },
  {
    id: 'bw-spring', icon: '🍃', name: 'Spring / Spring Boot',
    desc: '做 Java 后端就是做 Spring，原理答不上会显得"只会用不会想"。',
    items: [
      {
        q: '什么是 IoC 和 DI？有什么好处？不用 Spring 行不行？',
        a: '<b>IoC（控制反转）</b>是思想：对象的创建和依赖关系的管理从程序员手动 new 反转给容器。<b>DI（依赖注入）</b>是实现手段：容器把依赖"注入"进来（构造器/setter/字段）。<br><b>好处：</b>① 解耦：Service 依赖接口而非具体实现，换实现类不改代码；② 便于测试（mock 注入）；③ 生命周期统一管理。<br><b>不用行不行？</b>行，小项目 new 就够了。但对象一多、依赖关系一复杂（A 依赖 B，B 依赖 C…），手动管理就是灾难——IoC 本质是解决"对象图"的自动化装配问题。<br><b>底层三板斧：</b>反射 + 工厂模式 + 解析注解/配置（BeanDefinition 先注册，再经 BeanFactory 创建）。',
        plus: '说出 Bean 生命周期关键节点：实例化 → 属性填充 → Aware 回调 → BeanPostProcessor 前置 → 初始化（InitializingBean/init-method）→ 后置（<b>AOP 代理在这生成</b>）→ 使用 → 销毁，瞬间高级。',
        followups: ['@Autowired 和 @Resource 的区别？', 'Bean 默认单例会有什么线程安全问题？'],
      },
      {
        q: 'AOP 是什么？Spring AOP 和 AspectJ 的区别？动态代理的两种方式？',
        a: '<b>AOP（面向切面）</b>：把日志、事务、权限等"横切关注点"从业务代码中抽离，统一织入。核心概念：切点 Pointcut（在哪切）、通知 Advice（切了干什么：@Before/@After/@Around）、切面 Aspect = 切点 + 通知。<br><b>动态代理两板斧：</b>JDK 动态代理（基于<b>接口</b>，反射实现，目标类必须实现接口）；CGLib（基于<b>继承</b>，字节码生成子类，不能代理 final 类/方法）。<b>Spring Boot 默认 CGLib</b>（proxy-target-class=true）。<br><b>Spring AOP vs AspectJ：</b>Spring AOP 运行时动态代理，只支持方法级；AspectJ 是编译期/类加载期织入，支持字段/构造器，功能更强但需要额外编译器。',
        plus: '经典实战坑：<b>同类内部方法调用不走代理</b>（this 调用绕过代理对象），@Transactional 自调用失效就是这么来的。',
        followups: ['为什么 Spring Boot 默认用 CGLib？', 'AOP 在项目里做过什么？（日志、接口耗时监控、防重复提交）'],
      },
      {
        q: 'Spring Bean 的作用域有哪些？单例 Bean 是线程安全的吗？',
        a: '<b>作用域：</b>singleton（默认，容器里一个实例）、prototype（每次获取新建）、request（每个 HTTP 请求一个）、session、application、websocket（后几个 Web 环境才有）。<br><b>单例线程安全吗？</b>——<b>Spring 不管，取决于你自己。</b>Bean 无状态（只有方法、没有可变成员变量）就安全；有可变成员变量（如类上放一个 private int count 累加）就必然出并发问题。<br><b>解法：</b>① 改成无状态（变量放方法内/ThreadLocal）；② 加锁（性能差）；③ 改 prototype 作用域（慎用）。',
        plus: '补一个高频坑：单例 Bean 注入 prototype Bean，prototype 也只会被创建一次——要用 @Lookup 或 ObjectFactory。',
        followups: ['Bean 生命周期说说？', '循环依赖怎么解决的？'],
      },
      {
        q: '@Transactional 事务在哪些情况下会失效？（超级高频）',
        a: '<b>至少背 6 种：</b>① <b>自调用失效</b>：同类里 methodA() 直接调 methodB()（带注解），走的是 this 不是代理，事务不生效——解法：拆类、或注入自己/用 AopContext.currentProxy()；② 方法不是 public；③ <b>异常被 catch 吃掉</b>：方法内 try/catch 了异常没抛，事务感知不到；④ 抛的是<b>受检异常</b>：默认只回滚 RuntimeException 和 Error，IOException 不回滚——要配 <code>rollbackFor = Exception.class</code>；⑤ 数据库引擎不支持事务（MyISAM）；⑥ 类没被 Spring 管理（没加 @Service 等）。<br><b>传播行为加分项：</b>REQUIRED（默认，有就加入没有就新建）、REQUIRES_NEW（挂起当前开新事务）、NESTED（嵌套/保存点）——说明你知道"一个方法里多个事务怎么组合"。',
        plus: '说出底层原理一句话：@Transactional 本质是 AOP 环绕通知，方法前开事务、正常提交、遇指定异常回滚——把"事务失效"全部归因到"没走代理"，逻辑就通了。',
        followups: ['REQUIRED 和 REQUIRES_NEW 使用场景？', '大事务有什么危害怎么优化？'],
      },
      {
        q: 'Spring Boot 自动配置原理？（装配灵魂拷问）',
        a: '<b>一句话主线：</b>@SpringBootApplication 复合了 @EnableAutoConfiguration，它通过 <code>AutoConfigurationImportSelector</code> 读取所有 jar 包里的 <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code> 文件（Boot 2.7 前是 spring.factories），拿到全量自动配置类列表 → 经过 @Conditional 系列注解按条件过滤（@ConditionalOnClass 类路径有这个类、@ConditionalOnMissingBean 容器没有才配、@ConditionalOnProperty 配置开关）→ 满足条件的配置类里的 @Bean 注册进容器。<br><b>举例：</b>classpath 有 HikariCP + 配了数据源 URL → DataSourceAutoConfiguration 生效，自动创建连接池 Bean——所以"开箱即用"。<br><b>starter 本质：</b>依赖聚合（拉齐一堆依赖版本）+ 自动配置（条件化装配），自己也能写自定义 starter。',
        plus: '说出 @ConditionalOnMissingBean 的意义：默认配置可以"被用户自定义 Bean 覆盖"，这是"约定优于配置"还能灵活定制的机关。',
        followups: ['自定义一个 starter 要写什么？', 'spring.factories 和新的 imports 文件区别？'],
      },
    ],
  },
  {
    id: 'bw-mysql', icon: '🗄️', name: 'MySQL 数据库',
    desc: '索引和事务是两大必考主线，答不透很难过二面。',
    items: [
      {
        q: '为什么 MySQL 用 B+ 树做索引，而不是哈希表、B 树或红黑树？（必考 TOP1）',
        a: '逐个击破：<br><b>vs 哈希表：</b>哈希只支持等值查询，<b>不支持范围查询和排序</b>（WHERE age &gt; 18、ORDER BY 直接抓瞎）；<br><b>vs 红黑树/AVL：</b>二叉树层数太深，100 万数据约 20 层，磁盘 IO 20 次；B+ 树 3~4 层就够——<b>树矮胖是核心，每次 IO 是毫秒级，层数就是 IO 次数</b>；<br><b>vs B 树：</b>B 树每个节点都存数据，单页放的键少、树更高；且范围查询要中序回溯。B+ 树<b>数据全在叶子节点且叶子间有双向链表</b>——范围查询顺着链表扫就行，非叶子节点只存键、一页能存更多索引项。<br><b>补一记绝杀：</b>MySQL 页默认 16KB，bigint 键 + 指针约 12B，非叶子节点一页能放 ~1170 个键，3 层 B+ 树可存约 2000 万行数据——"为什么单表建议不超过 2000 万"就出自这。',
        plus: '顺带说聚簇索引：InnoDB 主键索引叶子存整行数据（数据即索引），二级索引叶子存主键值所以需要回表——把树和存储结构串起来讲，碾压 90% 候选人。',
        followups: ['什么是回表？怎么避免？（覆盖索引）', '为什么主键要自增？什么是页分裂？'],
      },
      {
        q: '哪些情况索引会失效？',
        a: '<b>背熟这 8 条：</b>① 违反<b>最左前缀</b>：联合索引 (a,b,c) 不带 a 直接查 b；② 对索引列做<b>运算或函数</b>：WHERE YEAR(create_time)=2024、WHERE id+1=10；③ <b>隐式类型转换</b>：varchar 字段用数字查（WHERE phone = 138xxx）；④ <b>前导模糊</b>：LIKE 以 % 开头失效（后缀 %xx 不失效）；⑤ <b>OR 连接了非索引列</b>；⑥ <b>NOT IN / != / IS NOT NULL</b>（视优化器成本，可能不走）；⑦ 优化器判断<b>全表扫描更快</b>（回表数据量太大，如查 30% 以上的行）；⑧ 字符集/排序规则不一致（关联查询时）。<br><b>万能验证法：</b>EXPLAIN 看 type（至少 range）和 key 列，别背结论凭工具说话。',
        plus: '补一句"索引不是越多越好"：写操作要同步维护索引、占磁盘、优化器选择成本上升。',
        followups: ['EXPLAIN 你重点看哪些字段？', '什么是覆盖索引和索引下推？'],
      },
      {
        q: '事务的 ACID？隔离级别有哪些？MySQL 默认级别解决了什么？',
        a: '<b>ACID：</b>原子性（undo log 回滚实现）、一致性（目的，由其他三者+约束共同保证）、隔离性（锁 + MVCC）、持久性（redo log 刷盘实现）。<br><b>三种读异常：</b>脏读（读到别人未提交）、不可重复读（两次读值不同——别人 update）、幻读（两次读行数不同——别人 insert）。<br><b>四大隔离级别：</b>读未提交（啥也不防）→ 读已提交 RC（防脏读）→ 可重复读 RR（防不可重复读）→ 串行化（全防但并发废）。<b>MySQL InnoDB 默认 RR</b>，且通过 <b>MVCC（快照读）+ 临键锁 Next-Key Lock（当前读）</b>把幻读也基本防住了——这是 MySQL RR 比 SQL 标准强的点。',
        plus: '说出 MVCC 一句话原理：每行有隐藏的 trx_id 和回滚指针，ReadView 判断版本可见性——RC 每次读新建 ReadView，RR 复用第一次的，这就是"可重复读"的实现本质。',
        followups: ['RC 和 RR 在 MVCC 实现上的区别？', 'MySQL 怎么选隔离级别？（互联网公司常用 RC，减小锁冲突）'],
      },
      {
        q: '一条 SQL 慢，你怎么排查和优化？（开放场景题）',
        a: '<b>排查链路（展示方法论）：</b>① 找到慢 SQL：开启慢查询日志（slow_query_log，long_query_time 阈值）或监控平台；② EXPLAIN 分析：看 type 是否 ALL（全表扫）、key 是否命中索引、rows 扫描行数、Extra（Using filesort/Using temporary 是坏信号）；③ 定位原因：没索引/索引失效/数据量大/深分页/JOIN 无索引/返回字段太多。<br><b>优化手段分层：</b><b>SQL 层</b>：加索引、改写（select 具体字段、深分页改游标 WHERE id &gt; x LIMIT n、大事务拆小）；<b>架构层</b>：读写分离、缓存热点数据；<b>数据层</b>：分库分表（单表 2000 万经验值）、冷热分离、归档历史数据。<br><b>收尾一句：</b>"先定位再优化，量都小就没必要分库分表，避免过度设计。"',
        plus: '给出深分页优化实例：SELECT * FROM t LIMIT 1000000,10 改成先查 id：SELECT id FROM t LIMIT 1000000,10 再用 id IN 回查——利用覆盖索引。',
        followups: ['count(*)、count(1)、count(id) 谁快？', 'limit 100 万页为什么慢？'],
      },
      {
        q: 'InnoDB 的 redo log、undo log、binlog 各是干什么的？',
        a: '三大日志各司其职：<br><b>redo log（重做日志）</b>：InnoDB 独有，物理日志，保证<b>崩溃恢复/持久性</b>——"WAL 先写日志再刷数据页"，顺序写快；循环写。<br><b>undo log（回滚日志）</b>：逻辑日志，保证<b>原子性（回滚）</b>，同时是实现 <b>MVCC 版本链</b>的基石。<br><b>binlog（归档日志）</b>：Server 层，逻辑日志，用于<b>主从复制和数据恢复</b>，追加写。<br><b>两阶段提交（高频追问）：</b>更新时先写 redo log（prepare）→ 写 binlog → redo log commit。为什么？保证两份日志一致：若 binlog 写完而 redo 没提交时崩溃，主库没这条数据但从库有，主从不一致。',
        plus: '对比总结句："redo 保证 crash-safe，binlog 保证复制与归档，undo 保证回滚与 MVCC。"',
        followups: ['binlog 三种格式区别？（statement/row/mixed）', '主从延迟怎么产生的怎么缓解？'],
      },
    ],
  },
  {
    id: 'bw-redis', icon: '⚡', name: 'Redis / 缓存',
    desc: '缓存三大问题是铁三角必考，一致性是高频场景题。',
    items: [
      {
        q: 'Redis 为什么快？单线程为什么还这么强？',
        a: '<b>快的原因四件套：</b>① 纯<b>内存操作</b>（纳秒级 vs 磁盘毫秒级）；② <b>IO 多路复用 + epoll</b>（单线程管成千上万连接，不为每个连接建线程）；③ <b>单线程模型避免上下文切换和锁竞争</b>（注意：是"网络 IO 和命令执行单线程"，6.0 后网络 IO 多线程化，命令执行仍单线程）；④ 高效数据结构专门优化（SDS 动态字符串、跳表、压缩列表等）。<br><b>单线程还能强的前提：</b>Redis 的瓶颈是内存和网络带宽，不是 CPU——所以多线程没用武之地。',
        plus: '能说出"跳表"为什么用于 ZSet：实现简单、范围查询 O(log n)，对比红黑树在范围操作和实现复杂度上占优，加分明显。',
        followups: ['Redis 6.0 的多线程用在哪？', '大 key 问题怎么处理？'],
      },
      {
        q: '缓存穿透、击穿、雪崩的区别和解决方案？（铁三角必背）',
        a: '<b>穿透（查不存在的数据）</b>：恶意请求 id=-1 这种库里根本没有的数据，缓存永远不命中，全打到数据库。方案：① 缓存空值（短 TTL）；② <b>布隆过滤器</b>前置拦截（说它可能误判、不能删除是加分点）；③ 接口层参数校验/风控。<br><b>击穿（热点 key 过期瞬间）</b>：某个高热 key 恰好过期，万级并发同时打到 DB。方案：① 互斥锁（只放一个线程去重建缓存，其他等待）；② 逻辑过期（物理永不过期，value 里带过期时间异步刷新）；③ 热点永不过期。<br><b>雪崩（大面积 key 同时失效或 Redis 宕机）</b>：方案：① 过期时间加随机值打散；② Redis 高可用（哨兵/集群）；③ 服务端限流+熔断降级兜底。<br><b>记忆口诀：穿透是"查没有"，击穿是"一个热点"，雪崩是"一片热点"。</b>',
        plus: '说清布隆过滤器原理：多个 hash 函数置位，"不存在则一定不存在，存在可能误判"——这一句是面试官最想听的。',
        followups: ['布隆过滤器能删除元素吗？', '互斥锁方案里拿不到锁的线程怎么办？'],
      },
      {
        q: '缓存和数据库的一致性怎么保证？先删缓存还是先更新数据库？',
        a: '<b>主流方案：Cache Aside 旁路缓存 —— 读：先读缓存，没有读 DB 并回填；写：先更新数据库，再删除缓存（而不是更新缓存）。</b><br><b>为什么删不更新？</b>避免并发写覆盖和写入冷数据浪费。<br><b>为什么先库后删？</b>反过来"先删缓存再更库"：删除后、更新前有个读请求把旧值回填，脏数据直到过期。<br><b>先库后删也有缺口：</b>更新库成功但删缓存失败。兜底：① 缓存设置过期时间兜底（最终一致）；② 删除失败进消息队列重试；③ 强一致场景用 <b>binlog 订阅（Canal）异步删缓存</b>。<br><b>结论话术：</b>"没有绝对强一致，业务上一般接受短暂不一致 + 过期兜底；要求高就上 Canal + 消息队列。"',
        plus: '能主动提"延迟双删"（删缓存→更新库→延迟几百毫秒再删一次）并说出它治的是读写并发的脏回填，属于高分回答。',
        followups: ['延迟双删的延迟时间怎么定？', 'Canal 的工作原理？'],
      },
      {
        q: 'Redis 过期删除和内存淘汰策略有哪些？',
        a: '<b>过期删除（针对设置了 TTL 的 key）：</b>惰性删除（访问时检查过期才删）+ 定期删除（每 100ms 随机抽样清理）组合，兼顾 CPU 和内存。<br><b>内存淘汰（内存满 maxmemory 时）：</b>noeviction（默认，写报错）、allkeys-lru（<b>最常用</b>，全量 key 里淘汰最久未用）、volatile-lru（只淘汰带 TTL 的）、allkeys-lfu/lfu 变体（4.0+，按访问频率，适合热点数据）、random/ttl 变体。<br><b>选型建议：</b>纯缓存用 allkeys-lru；缓存+持久数据混存用 volatile 系列；有明显冷热分层用 lfu。',
        plus: '说出 LRU 在 Redis 里是"近似 LRU"（随机采样而非全局链表，省内存），4.0 后 LFU 用 16bit 计数器衰减实现，直接封神。',
        followups: ['主从复制原理？', '持久化 RDB 和 AOF 怎么选？'],
      },
    ],
  },
  {
    id: 'bw-mq-scene', icon: '📮', name: '消息队列 & 场景设计',
    desc: 'MQ 三连问 + 场景设计题，考察真实工程思维。',
    items: [
      {
        q: '为什么用消息队列？三大价值和代价？',
        a: '<b>三大价值（背熟）：</b>① <b>异步</b>：下单主流程 3 个本地操作 + 2 个下游调用，把发短信、发优惠券丢进 MQ，RT 从 500ms 降到 100ms；② <b>解耦</b>：订单系统只发事件，下游谁要消费谁订阅，加系统不用改订单代码；③ <b>削峰</b>：秒杀 10 万 QPS 直接写库会崩，先进 MQ，消费端按自己的节奏拉取处理——把"脉冲"变"平流"。<br><b>代价（主动说是高级信号）：</b>系统复杂度上升、可用性依赖 MQ、一致性问题（消息丢失/重复）、排查成本提高。<br><b>选型一句话：</b>RabbitMQ（轻量、管理界面好、中小并发）、RocketMQ（阿里系、事务消息/延迟消息强、Java 技术栈友好）、Kafka（超高吞吐、日志流处理、大数据生态）。',
        plus: '面试官反问"你项目里怎么用的"，务必结合具体业务讲：例如"下单成功后发订单事件，积分、库存、通知三个系统各自消费"。',
        followups: ['怎么保证消息不丢失？', '重复消费怎么处理？'],
      },
      {
        q: '怎么保证消息不丢失？（消息可靠性三段论）',
        a: '<b>三个环节逐段保证：</b>① <b>生产端不丢</b>：发送确认机制（RabbitMQ confirm / Kafka acks=all + retries），失败重试 + 本地消息表兜底；② <b>存储端不丢</b>：RabbitMQ 开持久化（交换机/队列/消息三者都要）、Kafka 设置副本数 ≥ 3 且 min.insync.replicas ≥ 2；③ <b>消费端不丢</b>：关闭自动 ack，<b>业务逻辑处理成功后再手动 ack</b>（处理失败 nack 重回队列或进死信）。<br><b>加分总结：</b>"生产端 confirm、服务端持久化+副本、消费端手动 ack——三段各管一段，缺一不可。"',
        plus: '提"本地消息表"方案：业务数据和消息记录同库一个事务落库，定时任务扫描未发送的消息补发——主动说出这个，说明你懂"跨系统最终一致"。',
        followups: ['死信队列是干什么的？', '消息堆积了几百万条怎么处理？'],
      },
      {
        q: '重复消费怎么避免？幂等性怎么设计？',
        a: '<b>先说结论：MQ 只能保证"至少一次"（at-least-once），重复不可避免，所以消费端必须幂等。</b>重复来源：生产者重发、消费者处理完没来得及 ack 就宕机。<br><b>幂等四板斧：</b>① <b>唯一业务 ID + 去重表</b>：消息带 orderId，消费前查/插去重表（唯一索引兜底），插不进说明消费过；② <b>数据库唯一约束</b>：insert 天然幂等（重复插入报错忽略）；③ <b>状态机</b>：UPDATE orders SET status=PAID WHERE id=x AND status=UNPAID，重复执行影响行数为 0 无副作用；④ <b>Redis setnx</b>：消费前 setnx(msgId) 抢占，TTL 防死锁。<br><b>选型口诀：</b>强一致用数据库唯一约束，高性能用 Redis，带状态流转用状态机。',
        plus: '主动给出一个完整例子：支付回调场景用"订单号 + 状态机"双保险，即使回调重放也不会重复加钱。',
        followups: ['去重表和业务操作怎么保证原子？', 'Redis 幂等和数据库幂等冲突怎么办？'],
      },
      {
        q: '场景题：10 万人同时抢 1000 件商品，你怎么设计？（秒杀）',
        a: '<b>分层削漏（自上而下讲）：</b>① <b>前端</b>：按钮置灰防连点、静态资源 CDN、答题/验证码打散请求；② <b>网关层</b>：Nginx 限流（漏桶/令牌桶）、黑名单、单用户频次限制——大部分流量挡在这里；③ <b>应用层</b>：库存预热进 Redis，<b>Redis + Lua 脚本原子扣减</b>（防超卖），扣减失败直接返回"已抢完"；④ <b>异步下单</b>：扣减成功的请求发 MQ，订单服务慢慢消费落库，用户轮询结果；⑤ <b>数据库层</b>：乐观锁兜底（WHERE stock &gt; 0）防极端超卖。<br><b>核心思想一句话：</b>"把万级并发层层过滤成千级，数据库只承受它扛得住的量。"<br><b>补充亮点：</b>防黄牛（同用户/同 IP 限购）、订单超时未支付回补库存（延迟消息）、热点商品分桶（库存拆 10 份并行扣）。',
        plus: '主动提"库存显示的精度可以牺牲（显示余 99 实际 97 没关系），但超卖绝对不能发生"——体现业务思维。',
        followups: ['Redis 扣减后宕机了怎么办？', '怎么防止超卖的，具体说说 Lua 脚本逻辑？'],
      },
    ],
  },

  {
    id: 'bw-network', icon: '🌐', name: '计算机网络',
    desc: 'TCP/HTTP/HTTPS 高频三件套，配合「图解原理」专栏食用更佳。',
    items: [
      {
        q: 'OSI 七层和 TCP/IP 四层分别是什么？每层的代表协议？',
        a: '<b>OSI 七层（背）：</b>物理→数据链路→网络→传输→会话→表示→应用。<b>TCP/IP 四层（用）：</b>网络接口层→网络层→传输层→应用层。<b>对齐记忆：</b>物理+链路（以太网/WiFi，MAC 地址）、网络（IP/ICMP/ARP，跨网络寻址路由）、传输（TCP/UDP，端口到端口）、应用（HTTP/DNS/SSH，业务语义）。<br><b>数据流转：</b>发送方逐层加头（封装），接收方逐层拆头（解封装），中间路由器只工作到网络层。',
        plus: '说一句"ARP 把 IP 解析成 MAC，ICMP 是 ping 的底层"体现细节掌握。',
        followups: ['交换机和路由器分别工作在哪层？', 'ping 用的是 TCP 还是 UDP？'],
      },
      {
        q: 'TCP 和 UDP 的区别？分别什么场景用？',
        a: '<b>连接：</b>TCP 面向连接（三次握手），UDP 无连接直接发；<b>可靠性：</b>TCP 确认重传/有序/不丢不重，UDP 尽力而为；<b>数据形态：</b>TCP 字节流（无消息边界，可能粘包），UDP 数据报（有边界）；<b>头部：</b>TCP 20 字节起，UDP 固定 8 字节；<b>拥塞控制：</b>TCP 有（慢启动等），UDP 无。<br><b>场景：</b>TCP——HTTP/HTTPS、文件传输、数据库连接、邮件；UDP——DNS 解析、视频直播/语音（丢一帧无所谓，重传反而延迟）、DHCP、游戏实时同步、QUIC（HTTP/3 的底座）。',
        plus: '补充"TCP 粘包怎么处理：定长、分隔符、长度字段+body（最常用）"——高频追问。',
        followups: ['TCP 粘包/拆包怎么解决？', '视频通话为什么用 UDP 而不是 TCP？'],
      },
      {
        q: '从输入 URL 到页面展示，中间发生了什么？（终极综合题）',
        a: '<b>按 8 步走：</b>① <b>DNS 解析</b>：浏览器缓存→系统缓存→hosts→本地 DNS→根→顶级域→权威域，最终拿到 IP（递归+迭代查询）；② <b>TCP 连接</b>：与服务器三次握手；③ <b>TLS 握手</b>（HTTPS）：协商密钥，1~2 RTT；④ <b>发送 HTTP 请求</b>：方法+路径+头+体；⑤ <b>服务端处理</b>：负载均衡→网关→应用→可能查缓存/DB→返回响应；⑥ <b>浏览器解析</b>：HTML 构建 DOM，CSS 构建 CSSOM，合并成渲染树；⑦ <b>布局与绘制</b>：Layout 计算位置 → Paint 绘制 → 合成显示；⑧ <b>加载子资源</b>：JS 执行（可能阻塞 DOM），图片/CSS 异步加载。<br><b>面试技巧：</b>主动说"这里面每一步都能深挖，您想听哪段？"——DNS/TCP/HTTPS/渲染任一段都可能是后续考点。',
        plus: '说出"强缓存/协商缓存命中可以省掉 ⑤ 之后的所有步骤；CDN 在 DNS 阶段就把请求引到边缘节点"是高级信号。',
        followups: ['DNS 为什么用 UDP？什么时候用 TCP？', '浏览器渲染为什么 JS 会阻塞 DOM 解析？'],
      },
      {
        q: 'DNS 解析的完整过程？为什么 DNS 用 UDP？',
        a: '<b>递归+迭代结合：</b>主机问本地 DNS（递归：你给我最终答案）→ 本地 DNS 问根域名服务器（迭代：我不知道，你去问 .com）→ 问顶级域 → 问权威域 → 拿到 IP 逐级返回并缓存（TTL）。<br><b>为什么 UDP：</b>查询报文小（一问一答），UDP 无连接开销低、延迟低、服务器压力小。<b>什么时候用 TCP：</b>响应超过 512B（区域传送、DNSSEC、大报文）；现代还有 DoT/DoH（DNS over TLS/HTTPS）加密防劫持。',
        plus: '提"HTTPDNS：绕过运营商 Local DNS 的劫持和调度不准问题，App 直接 HTTP 问权威 DNS"是移动端亮点。',
        followups: ['CDN 是怎么工作的？', '怎么实现一个域名解析的灰度切换？'],
      },
      {
        q: 'Cookie、Session、Token(JWT) 的区别与演进？',
        a: '<b>Cookie</b>：浏览器存储、自动随同域请求携带的小文本（4KB），可存会话 id；<b>Session</b>：状态存<b>服务端</b>，Cookie 只放 sessionId——安全但集群下要粘性会话或共享存储（Redis）；<b>Token/JWT</b>：状态存<b>客户端</b>，JWT = Header.Payload.Signature（签名防篡改），服务端无状态、天然适合分布式/跨域，但<b>无法主动失效</b>（要配 Redis 黑名单）、payload 明文可见（不能放敏感信息）。<br><b>演进逻辑：</b>单体 Cookie+Session → 集群 Session 共享（Spring Session）→ 前后端分离/微服务 JWT 或不透明 token+Redis。',
        plus: '说出"JWT 退出登录问题的主流解法：短期 access token + 长期 refresh token，黑名单只存 access"是实战信号。',
        followups: ['JWT 被截获了怎么办？', '分布式 Session 怎么实现？'],
      },
      {
        q: '什么是跨域？CORS 怎么解决的？',
        a: '浏览器<b>同源策略</b>：协议+域名+端口任一不同即跨域，XHR/fetch 响应会被浏览器拦截（请求发出去了，响应不让看）。<b>CORS 流程：</b>① 简单请求（GET/POST/HEAD + 安全头）：直接发，服务端回 <code>Access-Control-Allow-Origin</code> 等头，浏览器检查放行；② 复杂请求（带自定义头/PUT 等）：先发 <b>OPTIONS 预检</b>问"允不允许"，允许了才发真请求。解决：服务端配置响应头；开发期用 devServer 代理（vite proxy）绕过。',
        plus: '区分"CSRF 与跨域"：CSRF 是利用 Cookie 自动携带发起攻击，防法是 CSRF Token/SameSite；跨域是浏览器行为，服务器间调用没有跨域问题。',
        followups: ['预检请求能缓存吗？', 'JSONP 是什么，为什么淘汰了？'],
      },
    ],
  },

  {
    id: 'bw-os', icon: '🖥️', name: '操作系统',
    desc: '进程线程/内存/IO 复用，后端面试的第二块底层基石。',
    items: [
      {
        q: '进程和线程的区别？（标准框架 + 类比）',
        a: '<b>资源：</b>进程是资源分配单位（独立地址空间/文件描述符），线程是 CPU 调度单位（共享进程资源，私有栈和寄存器）；<b>开销：</b>进程创建切换重（换页表，TLB 失效），线程轻；<b>通信：</b>进程要 IPC（管道/共享内存/消息队列/Socket），线程直接读写共享变量（需加锁）；<b>稳定性：</b>进程隔离好，一个线程崩溃整个进程死。<br><b>类比：</b>进程=不同工厂（各用各的车间），线程=同厂不同工人（共享车间和原料，协作快但会抢料）。<br><b>场景：</b>要隔离用多进程（Chrome 每个 tab 一个进程），要高并发轻量用线程/协程。',
        plus: '主动提协程：用户态调度、纳秒级切换、单线程百万个，Go/Kotlin 都在用——体现知识面。',
        followups: ['什么是上下文切换？开销在哪？', '一个进程最多能开多少线程？'],
      },
      {
        q: 'select、poll、epoll 的区别？为什么 epoll 高性能？',
        a: '<b>select</b>：fd 集合上限 1024，每次调用全量拷贝进内核 + 线性遍历 O(n)；<b>poll</b>：链表去上限，但依然全量拷贝 + O(n) 遍历；<b>epoll</b>：① <code>epoll_ctl</code> 注册一次（内核红黑树管理，不重复拷贝）；② 事件到达由<b>回调</b>放进就绪链表；③ <code>epoll_wait</code> 只返回就绪 fd——处理量只和活跃连接数相关，与总连接数无关。<br><b>结论：</b>连接多但活跃少（典型 Web 服务）时 epoll 完胜；这就是 Redis/Nginx/Netty 的基石。',
        plus: '补充 LT/ET：LT 反复通知编程简单（Redis），ET 只通知一次必须循环读干配非阻塞 fd（Nginx 高并发模式）。',
        followups: ['Redis 单线程为什么快？', '边缘触发漏读数据会怎样？'],
      },
      {
        q: '什么是虚拟内存？有什么好处？缺页中断是什么？',
        a: '每个进程看到的是独立的<b>虚拟地址空间</b>，由 MMU 查<b>页表</b>翻译成物理地址。<b>好处：</b>① 进程隔离安全；② 地址空间统一连续简化编程；③ <b>物理内存超卖</b>：按需加载，冷数据可换出到磁盘（swap）。<br><b>缺页中断：</b>访问的页不在物理内存 → 触发中断 → OS 从磁盘调入，内存不够则按 LRU 近似算法淘汰页面。访问一次缺页数据比命中内存慢千倍——这也是大堆 JVM 应用换页抖动（GC 后 RSS 回不去）的根因。',
        plus: '提 TLB 缓存翻译结果、多级页表省内存，展示底层深度。',
        followups: ['malloc 之后物理内存就分配了吗？', 'top 里的 VIRT 和 RES 什么区别？'],
      },
      {
        q: '零拷贝是什么？Kafka/Nginx 为什么快？（含 sendfile）',
        a: '<b>传统读文件发网络：</b>4 次拷贝（磁盘→内核缓冲→用户缓冲→socket 缓冲→网卡）+ 4 次上下文切换。<br><b>零拷贝：</b>① <code>mmap</code>：把文件映射进用户空间，少一次拷贝；② <code>sendfile</code>：数据直接 内核缓冲→(可 DMA 直接到网卡)，完全不经过用户态——Kafka 消费消息、Nginx 发静态文件、Tomcat sendfile 都靠它；③ PageCache 还能顺带提升后续读命中率。<br><b>效果：</b>CPU 占用降、延迟降、吞吐升，这就是 Kafka 单机百万级 TPS 的原因之一。',
        plus: '区分"零拷贝"不是没有拷贝，而是没有 CPU 参与的数据拷贝——DMA 完成的拷贝不算。',
        followups: ['PageCache 是什么？', 'Kafka 顺序写为什么快？'],
      },
      {
        q: '死锁产生的条件？怎么避免和排查？',
        a: '<b>四个必要条件（同时成立才死锁）：</b>互斥、持有并等待、不可剥夺、循环等待。<b>预防：</b>破坏任一条件——最常用<b>按固定顺序加锁</b>（破坏循环等待）、一次性申请所有资源、tryLock 带超时自动放弃。<b>排查：</b>Java 用 <code>jstack</code>，直接输出 "Found one Java-level deadlock" 及互相持锁的线程；OS 层 pstack/top -Hp。<b>生产预防：</b>锁超时 + 监控告警 + 减小锁粒度 + 用无锁结构（CAS/队列）替代。',
        plus: '举例经典转账死锁：A→B 和 B→并发转，加锁顺序不一致——"按账户 id 排序后加锁"一行代码修复，展示工程能力。',
        followups: ['synchronized 和 ReentrantLock 谁更容死锁？', '数据库死锁怎么排查？'],
      },
    ],
  },

  {
    id: 'bw-mybatis', icon: '🔧', name: 'MyBatis & 设计模式 & 分布式理论',
    desc: '框架执行原理、高频设计模式、CAP/BASE 一网打尽。',
    items: [
      {
        q: 'MyBatis 中 #{} 和 ${} 的区别？（必考且必错）',
        a: '<code>#{}</code> 是<b>预编译占位符</b>：生成 <code>?</code>，值经 PreparedStatement 参数设置，<b>防 SQL 注入</b>（值只当数据不当语法）；<code>${}</code> 是<b>字符串直接拼接</b>：值原样嵌入 SQL，有注入风险。<br><b>使用规则：</b>传值一律 #{}；<b>只有表名/列名/ORDER BY 列名等 SQL 结构部分</b>无法参数化时才用 ${}，且必须用白名单校验（如只允许枚举内的排序字段）。<br>示例：<code>ORDER BY ${column}</code> 若 column 来自前端 → 注入点；应改为后端映射排序键。',
        plus: '说出"预编译还带来性能收益：同 SQL 模板只编译一次，参数复用执行计划"是加分项。',
        followups: ['MyBatis 一级/二级缓存区别？', '模糊查询 LIKE 怎么写防注入？'],
      },
      {
        q: 'MyBatis 的工作流程和 Mapper 接口为什么不用写实现类？',
        a: '<b>流程：</b>① 启动解析 Mapper.xml / 注解，把每个 SQL 封装成 MappedStatement 存进 Configuration；② 调用时 <code>SqlSession.getMapper(UserMapper.class)</code> 用 <b>JDK 动态代理</b>生成接口实现；③ 代理拦截方法调用 → 拼出 statement id（接口全限定名+方法名）→ 找到 SQL → 参数处理 → 执行器 Executor 执行 JDBC → 结果集按映射规则转对象。<br><b>所以不写实现类的原因：</b>运行时代理 + "接口名.方法名 = SQL id" 的约定，把方法调用路由到对应 SQL。',
        plus: '提"$ 和 # 之外，动态 SQL 标签 if/where/foreach 底层是 OGNL 表达式求值拼接"体现源码级理解。',
        followups: ['MyBatis 怎么做分页？PageHelper 原理？', '一级缓存为什么默认开启又常被说有害？'],
      },
      {
        q: '你用过哪些设计模式？结合 Spring/MyBatis 说（别背定义）',
        a: '<b>单例</b>：Spring Bean 默认作用域（注册表+双重检查锁）；<b>工厂</b>：BeanFactory/SqlSessionFactory；<b>代理</b>：AOP（JDK 接口代理/CGLIB 子类代理）、MyBatis Mapper；<b>模板方法</b>：JdbcTemplate 把"获取连接→执行→清理"固定，SQL 回调可变；<b>策略</b>：Spring Resource 加载策略、线程池拒绝策略；<b>观察者</b>：Spring 事件 ApplicationEvent；<b>责任链</b>：Servlet Filter、Interceptor 拦截器链；<b>适配器</b>：SpringMVC HandlerAdapter 让不同类型 Controller 统一调用。<br><b>答法示范：</b>"以 AOP 为例：日志切面不改业务代码，本质是 JDK 动态代理在方法前后插入逻辑——我在项目里用它做了接口耗时监控。"',
        plus: '一定带一个自己项目里的例子（如策略模式消除 if-else 分支），纯背定义=低分。',
        followups: ['JDK 代理和 CGLIB 的区别？', 'Spring 怎么解决循环依赖的？三级缓存是什么？'],
      },
      {
        q: 'CAP 定理和 BASE 理论讲什么？分布式下怎么取舍？',
        a: '<b>CAP：</b>分布式系统最多同时满足 C（一致性）、A（可用性）、P（分区容错性）两个——而网络分区不可避免（P 必选），所以实际是 <b>CP 还是 AP 的选择</b>：ZooKeeper/etcd 选 CP（分区时拒绝服务保一致），Eureka/Nacos(AP 模式) 选 AP（分区时先服务后收敛）。<br><b>BASE：</b>基本可用（流量大时降级）、软状态（允许中间态，如"转账处理中"）、最终一致（延迟对账/消息补偿收敛）。<br><b>选型答法：</b>金融转账用 CP（强一致优先）；电商购物车/用户信息用 AP+最终一致；订单支付链路用"本地消息表/MQ 事务消息"实现最终一致。',
        plus: '说出"Paxos/Raft 是 CP，Gossip 是 AP"以及 Nacos 可切换 CP/AP 展示广度。',
        followups: ['Raft 选举是怎么做的？', '分布式事务：2PC/TCC/本地消息表怎么选？'],
      },
      {
        q: '接口幂等性怎么设计？（高频场景题）',
        a: '<b>为什么需要：</b>网络重试、用户重复点击、MQ 重复投递都会造成重复请求。<b>方案矩阵：</b>① <b>唯一索引/唯一约束</b>：订单号唯一，重复插入报错（最强）；② <b>防重 Token</b>：进页面先领 token，提交带上，Redis setnx 校验+删除原子防重；③ <b>状态机</b>：<code>UPDATE ... WHERE status=预期状态</code>，影响行数=0 即重复；④ <b>乐观锁版本号</b>：WHERE version=n；⑤ <b>分布式锁</b>：Redis/ZK 锁住业务键串行处理。<br><b>组合拳示例：</b>支付回调 = 接口层 token/签名 + 落库唯一索引 + 状态机三重保险。',
        plus: '说明"幂等的本质：任意次执行的效果与一次相同"，并区分幂等与防重的细微差别。',
        followups: ['接口限流有哪些算法？', '分布式锁有哪些实现？各自问题？'],
      },
    ],
  },

  {
    id: 'bw-jvm2', icon: '🧠', name: 'JVM 进阶（区分题）',
    desc: '校招二面/社招高级岗的"深水区"，答出这些能明显拉开差距。',
    items: [
      {
        q: 'JVM 运行时数据区各部分存什么？哪些线程共享？',
        a: '<b>线程私有：</b>① 程序计数器（当前字节码行号，唯一不会 OOM）；② 虚拟机栈（栈帧=局部变量表+操作数栈+动态链接+返回地址，StackOverflowError）；③ 本地方法栈（native 方法）。<b>线程共享：</b>④ 堆（对象实例，GC 主战场，分新生代 Eden+2*Survivor / 老年代）；⑤ 方法区（类信息、常量、静态变量，JDK8 起由元空间 Metaspace 实现，用本地内存）。<br>另有<b>直接内存</b>（NIO DirectByteBuffer，不受堆大小限制但受机器内存限制）。',
        plus: '追问"为什么 JDK8 用元空间替换永久代"：永久代大小固定易 OOM、与 HotSpot 耦合，元空间用本地内存可动态扩容（默认无上限，可 -XX:MaxMetaspaceSize 限制）。',
        followups: ['栈溢出和堆溢出分别怎么模拟和排查？', '为什么程序计数器是线程私有的？'],
      },
      {
        q: '如何判断对象可以被回收？引用计数法为什么不行？',
        a: '<b>JVM 用可达性分析</b>：从 GC Roots（虚拟机栈引用的对象、静态变量、常量、JNI 引用等）出发，不可达的对象可回收。<b>引用计数法的坑：</b>循环引用（A 引用 B、B 引用 A）永远不归零——所以 JVM 不用它（Python 用它+额外处理）。<br><b>补充：</b>真正回收前还有"自救"机会：重写了 finalize() 且未执行过，会被放入 F-Queue 执行一次（不保证执行完，官方不建议用）。',
        plus: '说出四大引用与 GC 行为的对应关系，展示完整知识链。',
        followups: ['GC Roots 具体包括哪些？', 'finalize 为什么被废弃（JDK9+ deprecated）？'],
      },
      {
        q: 'Minor GC、Major GC、Full GC 的区别与触发条件？',
        a: '<b>Minor GC（Young GC）：</b>清理新生代，Eden 满时触发，复制存活对象到 Survivor/晋升老年代，STW 短且频繁。<b>Major GC：</b>通常指老年代收集（术语混乱区，CMS 的 Concurrent Collection），常伴随至少一次 Minor GC。<b>Full GC：</b>整堆+方法区回收，STW 长，应尽量避免。触发：老年代空间不足、元空间不足、System.gc()（建议式）、晋升担保失败、空间分配担保失败。<br><b>对象晋升规则：</b>年龄阈值（默认 15）、大对象直接进老年代（-XX:PretenureSizeThreshold）、动态年龄判断（Survivor 中同龄对象总大小超一半）。<br><b>空间分配担保：</b>Minor GC 前检查老年代最大可用连续空间 > 新生代对象总大小或历次晋升平均大小，失败则 Full GC。',
        plus: '说一句"线上调优的第一原则：尽量避免频繁 Full GC"，并给出常用参数 -Xms=-Xmx 避免堆动态抖动。',
        followups: ['对象什么时候直接进入老年代？', '怎么排查谁在频繁触发 Full GC？'],
      },
      {
        q: '垃圾收集器全景：CMS 和 G1 的区别？ZGC 强在哪？',
        a: '<b>CMS（标记-清除，老年代，并发）：</b>初始标记(STW短)→并发标记→重新标记(STW)→并发清除。优点停顿短；缺点：CPU 敏感、浮动垃圾、内存碎片、并发失败退化 Serial Old。<b>G1（Region 分区，标记-整理+复制）：</b>面向服务端，可预测停顿（MaxGCPauseMillis），优先回收垃圾占比高的 Region；Humongous 区存大对象；JDK9+ 默认。<b>ZGC（JDK11 实验/15 生产/21 分代）：</b>染色指针+读屏障，停顿 <1ms 且与堆大小无关（TB 级堆），并发整理。三色标记+读屏障/增量更新（CMS）/SATB（G1）是打破"标记时引用变化"的三大方案。',
        plus: '记住选择口诀：JDK8 用 CMS/Parallel，8→11 升 G1，超大堆低延迟要 ZGC；面试能画 CMS 四阶段时序图是加分项。',
        followups: ['三色标记算法的漏标和多标问题？', 'G1 的 Remembered Set / 卡表是干嘛的？'],
      },
      {
        q: '线上 OOM 怎么排查？CPU 飙高怎么排查？（经典排错题）',
        a: '<b>OOM 排查：</b>① 启动加 -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=xxx 拿 dump；② jmap -dump:live,format=b,file=heap.hprof <pid> 手动抓；③ MAT/JProfiler 分析：看支配树找最大对象、按类聚合看谁持有最多引用、查不可达对象；④ 常见根因：大查询没分页、集合只增不减、ThreadLocal 没清、连接/流未关。<b>CPU 飙高：</b>① top 找进程；② top -Hp <pid> 找线程；③ printf "%x" 线程 id 转 16 进制；④ jstack <pid> | grep 0x十六进制 -A 20 定位栈帧；⑤ 判断是业务死循环还是 GC 线程（GC 疯狂跑 → 转内存问题，jstat -gcutil 看回收频率）。',
        plus: '补充：jstat -gcutil 1000 看 GC 频率与老年代占比；arthas（thread -n 3 / dashboard / heapdump）是把上述过程产品化的神器，提一句就是加分。',
        followups: ['频繁 Full GC 但内存没满，可能是什么原因？', 'Metaspace 溢出一般是什么代码导致的？'],
      },
      {
        q: '常用 JVM 调优参数与通用调优思路？',
        a: '<b>内存类：</b>-Xms/-Xmx（初始/最大堆，生产设相等避免抖动）、-Xmn（新生代）、-XX:MetaspaceSize、-XX:MaxDirectMemorySize。<b>GC 类：</b>-XX:+UseG1GC、-XX:MaxGCPauseMillis=200、-XX:G1HeapRegionSize。<b>诊断类：</b>-XX:+HeapDumpOnOutOfMemoryError、-Xlog:gc*（JDK9+统一日志）/ -Xloggc。<b>通用思路（不是背参数是方法论）：</b>① 明确目标：吞吐优先 or 延迟优先；② 观察：GC 日志 + jstat + 监控，找到停顿/频率异常；③ 假设-调整-验证闭环：一次只改一个变量；④ 常见手段：合理新生代老年代比例（避免对象过早晋升）、大对象直接进老年代、堆大小让 Full GC 频率降到小时级。',
        plus: '强调"没有通用最优参数，只有基于监控的针对性调整"——这句话本身就是面试官想听的工程素养。',
        followups: ['-Xss 设置过小或过大会怎样？', '如何估算一个服务的合理堆大小？'],
      },
      {
        q: '反射是什么？性能问题与框架中的应用？',
        a: '<b>反射 = 运行时动态获取类信息并操作（构造方法/字段/方法）</b>，绕过编译期检查。入口三种：类名.class、对象.getClass()、Class.forName("全限定名")。<b>框架基石：</b>Spring IoC 按 BeanDefinition 反射实例化、@Autowired 反射注入字段；MyBatis 反射映射结果集到实体；Jackson/Gson 反射序列化；JDK 动态代理本质也是反射调用。<b>性能与优化：</b>反射调用比直接调用慢（方法查找、参数装箱、无法内联），热点调用经 Inflation 机制：默认 15 次后 JDK 动态生成字节码委托类（GeneratedMethodAccessor）转原生调用。优化手段：缓存 Method/Field 对象、setAccessible(true) 跳过检查、高频路径改 MethodHandle/字节码生成。',
        plus: '提"为什么 Spring AOP 的 CGLib 代理无法代理 private/final 方法"呼应反射与字节码的边界。',
        followups: ['JDK 动态代理和 CGLib 的区别？', '反射能破坏单例吗？怎么防？'],
      },
      {
        q: 'JDK 动态代理与 CGLib 的区别？Spring AOP 怎么选？',
        a: '<b>JDK 动态代理：</b>基于接口，运行时生成 $Proxy0 implements 接口，反射调用 InvocationHandler；目标必须有接口。<b>CGLib：</b>基于继承，生成目标类子类并重写方法（FastClass 机制避免反射索引调用）；不能代理 final/private/static 方法。<b>Spring 选择：</b>有接口默认 JDK 代理；可强制 proxyTargetClass=true 用 CGLib；Spring Boot 2.x 起默认 CGLib（避免"没有接口就报错/类型不匹配"的困惑）。<b>代理失效场景：</b>this 自调用、private 方法、final 方法——本质都是绕过了代理对象。',
        plus: '说出"AOP 代理在 Bean 后置处理阶段生成，Spring Boot 默认 CGLib 是工程务实的选择"。',
        followups: ['为什么自调用事务会失效？怎么解决？', '手写一个 JDK 动态代理的最小示例？'],
      },
      {
        q: '为什么重写 equals 必须重写 hashCode？（源码级答案）',
        a: '<b>规范（Object 约定）：</b>equals 相等 → hashCode 必须相等；hashCode 相等 equals 不必相等。<b>不重写的后果：</b>只重写 equals：两个内容相同的对象 hashCode 不同 → HashSet 去重失效（可能存入两个"相同"对象）；HashMap：put 时找不到桶（hash 不同定位不同），get 返回 null；remove 删不掉。<b>原理：</b>HashMap 先用 hash 定位桶，桶内再 equals 逐个比对——hashCode 决定"进哪个抽屉"，equals 决定"是不是同一封信"。',
        plus: '追问变体：String 重写了 hashCode（31 进制折叠）；为什么选 31（质数分布均匀，且 31*i = (i<<5)-i 位运算优化）。',
        followups: ['==、equals、hashCode 三者关系？', '把可变对象放进 HashSet 后修改其字段会怎样？'],
      },
      {
        q: 'String s = new String("abc") 创建了几个对象？+ 拼接与常量池',
        a: '<b>答案：1 或 2 个。</b>若 "abc" 已在字符串常量池：仅堆上 new 一个；若没有：常量池一个 + 堆一个。字符串常量池 JDK7+ 在堆中。<b>拼接陷阱：</b>编译期可确定的常量拼接（"a"+"b"）编译器直接合并入池；含变量的拼接（s1+s2）底层 StringBuilder，结果是<b>新堆对象</b>，不等于常量池对象；intern() 把堆字符串尝试放入常量池并返回池内引用。<b>面试经典对比：</b>String a="ab"; String b="a"+"b"; a==b 为 true（编译期合并）；String c="a"; a==c+"b" 为 false（运行期 StringBuilder 新建）。',
        plus: '扩展：String 不可变的三大理由（常量池复用、hashCode 缓存做 HashMap 键、线程安全）；JDK9 Compact Strings 用 byte[] 省内存。',
        followups: ['为什么 String 设计成不可变？', 'Integer 缓存 -128~127 与 == 的坑（顺带复习自动装箱）'],
      },
      {
        q: '异常体系：Error 与 Exception、受检与非受检、最佳实践？',
        a: '<b>Throwable 分两支：</b>Error（严重错误不该捕获：OOM、StackOverflowError、NoClassDefFoundError）；Exception 分受检异常（编译器强制处理：IOException、SQLException）与非受检 RuntimeException（空指针、越界、ClassCastException）。<b>最佳实践：</b>① 捕获后必须处理或上抛，禁止空 catch；② 用异常区分"可恢复业务异常"与"系统异常"；③ 自定义异常继承 RuntimeException + 全局异常处理器兜底；④ 不要用异常控制流程（异常栈开销大）；⑤ finally 里别 return（会吞掉异常和返回值）；⑥ try-with-resources 替代手动关闭。<br><b>面试坑题：</b>throws 和 throw 的区别；finally 一定执行吗（System.exit / JVM 崩溃除外）。',
        plus: '说出"异常影响性能的点在填充栈快照 fillInStackTrace，高频热路径可重写为无栈异常"。',
        followups: ['NoClassDefFoundError 和 ClassNotFoundException 的区别？', '全局异常处理器怎么设计返回给前端的结构？'],
      },
    ],
  },

  {
    id: 'bw-spring2', icon: '🍃', name: 'Spring 进阶（源码与实战）',
    desc: '二面面试官最爱追问的"为什么"，附源码级解释。',
    items: [
      {
        q: 'Spring Bean 的作用域有哪些？默认单例有什么注意点？',
        a: '<b>五种常用作用域：</b>singleton（默认，容器一个实例）、prototype（每次获取新实例）、request（Web，每请求）、session（每会话）、application（ServletContext）。<b>单例注意点：</b>① 单例 Bean 必须无状态（不要用成员变量存请求相关数据，线程不安全）；② singleton 引用 prototype 时 prototype 也会"退化"（只注入一次），解决 @Lookup 或 ObjectProvider/Provider；③ @Scope("prototype") 的销毁回调由使用者负责。<br><b>线程安全答法：</b>Controller/Service 无状态所以安全；若含可变成员变量则不安全（换 ThreadLocal/无状态/加锁）。',
        plus: '追问变体：@Async 的 Bean 为什么拿不到注入的代理字段值（同 self-injection 问题）。',
        followups: ['为什么说无状态的 Bean 才是线程安全的？', 'prototype Bean 的 @PreDestroy 会被调用吗？'],
      },
      {
        q: 'BeanFactory 与 FactoryBean 的区别？（送分还是送命题）',
        a: '<b>BeanFactory：</b>IoC 容器的顶层接口，负责 Bean 的创建与管理（DefaultListableBeanFactory 是核心实现）。<b>FactoryBean：</b>一个特殊 Bean——它本身是"生产 Bean 的工厂"，getObject() 返回的才是真正暴露的 Bean。用途：复杂第三方对象的装配（MyBatis 的 SqlSessionFactoryBean、Feign 的 FeignClientFactoryBean、Dubbo 的 ReferenceBean）。<br><b>获取区别：</b>getBean("name") 拿 getObject() 产物；getBean("&name")（带 & 前缀）拿 FactoryBean 本身。',
        plus: '说"MyBatis 没有 FactoryBean 就没法把 SqlSession 体系融入 Spring 生命周期"体现理解深度。',
        followups: ['FactoryBean 的 isSingleton 有什么用？', 'Spring 如何处理 FactoryBean 的循环依赖？'],
      },
      {
        q: 'Spring 事件机制是什么？什么场景用？',
        a: '<b>三大件：</b>ApplicationEvent（事件）、ApplicationListener / @EventListener（监听器）、ApplicationEventPublisher（发布器，ApplicationContext 自己就是）。<b>核心机制：</b>发布-订阅解耦；@EventListener 默认同步执行（同一线程、同事务！），加 @Async 才异步。<b>典型场景：</b>订单创建后发 OrderCreatedEvent → 积分、通知、统计各自监听，避免主流程堆满非核心逻辑；Spring 内部也在用（ContextRefreshedEvent 等）。<br><b>坑：</b>同事务内事件抛异常会回滚主流程；需要"事务提交后才执行"用 @TransactionalEventListener(phase = AFTER_COMMIT)。',
        plus: '举"下单成功发事件做积分/短信，监听器失败不影响下单"并用 AFTER_COMMIT 解决时序坑。',
        followups: ['事件机制和 MQ 的边界：什么时候该升级为 MQ？', '@TransactionalEventListener 默认 phase 是什么？'],
      },
      {
        q: 'Spring Boot 启动流程概览？（自动装配 + 内嵌容器）',
        a: '<b>主链路：</b>@SpringBootApplication（= @SpringBootConfiguration + @EnableAutoConfiguration + @ComponentScan）→ SpringApplication.run() → ① 推断应用类型（Servlet/Reactive）② 加载 SpringApplicationRunListener ③ 准备 Environment（配置文件/环境变量，profile 激活）④ 创建 ApplicationContext ⑤ prepareContext（加载主类 BeanDefinition）⑥ <b>refresh() 核心</b>：invokeBeanFactoryPostProcessors（ConfigurationClassPostProcessor 解析自动配置 imports）→ onRefresh() 创建内嵌 Tomcat → finishBeanFactoryInitialization 实例化非懒加载单例 ⑦ 回调 Runner（ApplicationRunner/CommandLineRunner）。<br><b>自动装配落地：</b>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports（2.7+ 新文件）列出配置类 → @Conditional 条件筛选 → 生效的 @Bean 注册容器。',
        plus: '答出 refresh() 的 12 个方法名不现实，但"先走 BeanFactoryPostProcessor 解析配置类，再 BeanPostProcessor 织入 AOP，最后实例化"这条主线必须有。',
        followups: ['@ConditionalOnMissingBean 的顺序问题（自定义配置为什么能覆盖默认）？', '自定义一个 starter 的步骤？'],
      },
      {
        q: 'Spring 的循环依赖：什么能解决、什么不能？',
        a: '<b>能解决：</b>单例 + 字段/Setter 注入的循环依赖（三级缓存 + 提前暴露引用）。<b>不能：</b>① 构造器注入循环（实例化都完成，没机会提前暴露）→ 报 BeanCurrentlyInCreationException；② prototype 作用域（不缓存，每次新建）；③ @Async 导致的循环（代理生成时机不同，需 Lazy/改结构）。<b>通用解决：</b>加 @Lazy（注入代理，首次用时才真正解析）、重构分层（循环依赖往往是职责不清的信号）。<br><b>为什么需要三级不是两级：</b>只有两级时，AOP 场景要么提前生成代理（违背"初始化后代理"的设计），要么暴露原始对象（与最终 Bean 不一致）。三级缓存的 ObjectFactory 保证代理只生成一次且引用一致。',
        plus: 'Spring Boot 2.6+ 默认禁止循环依赖（启动报错），说明"官方态度：循环依赖是坏味道，应改设计"。',
        followups: ['@Lazy 的实现原理？', '三级缓存能解决构造器循环依赖吗？为什么？'],
      },
      {
        q: 'Spring AOP 的通知顺序与切面表达式？',
        a: '<b>五种通知：</b>@Around（功能最强，可控制是否执行目标）、@Before、@After（finally）、@AfterReturning、@AfterThrowing。<b>顺序：</b>同一 Aspect 内 Spring 5.2.7+：Around → Before → 目标方法 → After → AfterReturning/AfterThrowing（旧版本 After 先于 AfterReturning 无争议，Before/Around 的相对顺序 5.x 有过调整，答"以 Around 包裹一切"最稳）。<b>切点表达式：</b>execution(修饰符 返回值 包.类.方法(参数))，常用 execution(* com.x.service..*.*(..))（.. 匹配子包与任意参数）；另有 @annotation(自定义注解)——注解驱动切面是业务最常用姿势（如 @LogRecord、@RateLimit）。<br><b>原理：</b>AnnotationAwareAspectJAutoProxyCreator（BeanPostProcessor）在初始化后匹配切点 → 生成 JDK/CGLib 代理；拦截器链 ReflectiveMethodInvocation 递归执行（责任链）。',
        plus: '现场写出 @annotation 注解切面的三段式（注解定义 + 切面 + 使用）是高频手写题。',
        followups: ['多个切面的执行顺序怎么控制（@Order/Ordered）？', 'Around 忘记 proceed() 会发生什么？'],
      },
      {
        q: 'Spring 如何整合 MyBatis 的？（框架整合原理）',
        a: '<b>关键三件：</b>① SqlSessionFactoryBean（FactoryBean）：解析配置与 Mapper XML，产出 SqlSessionFactory；② MapperScannerConfigurer / @MapperScan：扫描接口，为每个接口注册 MapperFactoryBean（又是 FactoryBean）；③ MapperFactoryBean.getObject()：getMapper 返回 JDK 动态代理对象——接口没有实现类，代理把"接口方法 → statement id → SqlSession 执行 → 结果映射"串起来。<br><b>生命周期打通：</b>Mapper 代理作为 Spring Bean 纳管（可 @Autowired）；SqlSession 由 SqlSessionTemplate 管理（线程安全，实际是代理委托给事务绑定的 session），事务提交回滚随 Spring 事务走。',
        plus: '答出"两个 FactoryBean + 一个动态代理"这个口诀，面试官基本不再追问。',
        followups: ['Mapper 接口为什么能注入？它是什么类型的 Bean？', '多数据源下 SqlSessionFactory 怎么配？'],
      },
    ],
  },

  {
    id: 'bw-pattern', icon: '🧩', name: '设计模式（结合场景）',
    desc: '不背 UML，答"模式 + 解决什么问题 + JDK/Spring 里的真身"。',
    items: [
      {
        q: '单例模式的正确写法有哪几种？为什么推荐静态内部类/枚举？',
        a: '<b>五种写法：</b>① 饿汉式（类加载即建，线程安全但可能浪费）；② 懒汉式 + synchronized（安全但每次加锁）；③ 双重检查锁 DCL：两次判空 + <b>必须 volatile</b>（防止"分配内存→初始化→赋引用"重排导致他线程拿到半初始化对象）；④ <b>静态内部类</b>：利用类加载机制天然线程安全 + 懒加载（内部类首次使用才加载）；⑤ <b>枚举</b>：Effective Java 推荐，防反射（Constructor.newInstance 对枚举直接抛异常）防反序列化。<br>JDK 真身：Runtime.getRuntime()（饿汉）、Spring 单例注册表（Bean 容器本质是单例池）。',
        plus: '主动画 DCL 的两行判断+volatile 一并写出，是高频手写题。',
        followups: ['DCL 为什么要 volatile？', '序列化破坏单例怎么防（readResolve）？'],
      },
      {
        q: '工厂方法与抽象工厂的区别？Spring 里怎么体现？',
        a: '<b>简单工厂：</b>一个工厂 + 参数分支创建（不满足开闭）。<b>工厂方法：</b>每个产品一个工厂类，新增产品加新工厂（符合开闭，类多）。<b>抽象工厂：</b>一个工厂创建一族相关产品（如 MySQL 工厂产出 MySQL 的 Connection/Statement 族）。<b>Spring 体现：</b>BeanFactory 是工厂方法思想；FactoryBean 是定制工厂的扩展点；getBean 按类型/名字创建即"工厂 + 单例池"。<br><b>实战场景：</b>支付渠道工厂（微信/支付宝各实现 PayHandler，工厂按渠道码路由）；日志 SDK（slf4j LoggerFactory 工厂返回具体实现）。',
        plus: '说"策略 + 工厂 + Spring 注入 List<策略> 自动路由"是业务代码最常见的组合拳，面试直接加分。',
        followups: ['用 Spring 如何优雅实现策略模式（Map 注入）？', '简单工厂违反开闭为什么还到处在用？'],
      },
      {
        q: '策略模式解决什么问题？结合 Spring 谈最佳实践？',
        a: '<b>问题：</b>消灭 if-else 大分支：把每种算法/渠道封装成独立策略类，运行期按类型路由，新增策略不改老代码（开闭）。<b>Spring 最佳实践：</b>① 定义策略接口 + 各实现类标 @Component；② 注入 Map<String, PayHandler>（Spring 自动按 Bean 名装配）或 List 后收集成 Map；③ 路由器根据渠道 key 直接取。<b>JDK 真身：</b>Comparator（策略）、ThreadPoolExecutor 的拒绝策略（Abort/Caller/Discard/Requeue 四策略）。',
        plus: '给出代码骨架：Map 注入后 handlerMap.get(channel).pay(ctx)，并提"策略太多时可用枚举路由省类"。',
        followups: ['策略模式和状态模式的区别？', '策略 + 模板方法如何组合使用？'],
      },
      {
        q: '模板方法模式与回调（Callback）的关系？',
        a: '<b>模板方法：</b>父类定骨架（final 方法固定流程），子类填差异步骤。JDBC 的经典流程：获取连接 → 执行 → 清理，差异只在 SQL 与结果映射。<b>JdbcTemplate：</b>是模板方法 + 回调的混合——流程骨架在 JdbcTemplate，差异通过 StatementCallback/RowMapper 回调传入（比继承更灵活）。<b>其他真身：</b>Spring 的 refresh() 骨架 + 各后置处理器扩展点；AQS 的 acquire 骨架 + tryAcquire 钩子；Servlet 的 service 分发 doGet/doPost。<br><b>对比：</b>模板方法用继承（编译期），回调用组合（运行期），回调更符合"组合优于继承"。',
        plus: '说"RedisTemplate、RestTemplate、TransactionTemplate 全家桶都是这一招"展示阅读量。',
        followups: ['钩子方法是什么？和模板方法的区别？', '为什么 AQS 把 tryAcquire 定义成 protected 抛异常？'],
      },
      {
        q: '观察者模式与发布订阅模式的区别？',
        a: '<b>观察者：</b>Subject 直接维护 Observer 列表并通知（耦合在一方容器里），同步居多——Spring 事件机制、GUI 监听。<b>发布订阅：</b>中间有<b>事件通道/代理</b>（Broker），发布者与订阅者互不知道对方（空间解耦 + 时间解耦，可异步、可持久化）——MQ、Redis Pub/Sub。<br><b>一句话：</b>观察者 = 点对点推送；发布订阅 = 经过中介的广播。选型：进程内轻量通知用 Spring 事件；跨服务、削峰、可靠投递用 MQ。',
        plus: '提"ZooKeeper Watcher 是观察者、Kafka ConsumerGroup 是发布订阅"具象化。',
        followups: ['Guava EventBus 属于哪种？', 'Redis Pub/Sub 消息会丢吗（对比 Stream）？'],
      },
      {
        q: '责任链模式的应用：Filter、拦截器、网关过滤器链？',
        a: '<b>思想：</b>请求沿处理器链依次传递，每个节点可处理或放行，节点顺序可编排、可插拔。<b>真身：</b>Servlet Filter → Spring MVC HandlerInterceptor → Spring Security 的 SecurityFilterChain（十几个 Filter 串联）→ Netty Pipeline → 网关（Gateway Filter / Sentinel Slot 链）。<br><b>业务场景：</b>订单校验链（登录校验 → 黑名单 → 风控 → 库存），比 if-else 嵌套清晰且好扩展。',
        plus: '对比 Filter（Servlet 规范，粗粒度）与 Interceptor（Spring，能拿 Handler 信息、能读 IoC Bean）。',
        followups: ['责任链中断传播怎么做（Filter 的 chain.doFilter 不调用会怎样）？', 'Sentinel 的 Slot 链是什么模式？'],
      },
      {
        q: '代理模式、适配器、装饰器三兄弟怎么区分？',
        a: '<b>代理：</b>控制访问（权限/日志/事务/懒加载），接口与目标一致，调用方无感知——Spring AOP。<b>装饰器：</b>动态增强功能，层层包裹（同类接口）——Java IO：new BufferedReader(new FileReader(f))。<b>适配器：</b>接口不兼容的转换桥接，让两个已有接口协同——Spring MVC 的 HandlerAdapter（不同类型 Controller 统一适配）、slf4j 桥接包。<br><b>口诀：</b>代理管"能不能用"，装饰管"强不强"，适配管"接得上吗"。',
        plus: 'JDK 真身连报：Proxy、BufferedInputStream、Spring HandlerAdapter。',
        followups: ['静态代理和动态代理的区别？', 'InputStream 装饰器链为什么要设计成可嵌套？'],
      },
    ],
  },

  {
    id: 'bw-scene2', icon: '🎬', name: '高频场景设计题（二）',
    desc: '二面场景题进阶：每题都给"需求澄清 → 核心矛盾 → 方案 → 权衡"四段式。',
    items: [
      {
        q: '如何设计一个支持千万用户的签到系统？',
        a: '<b>澄清：</b>签到粒度（日）、要不要补签/连续统计、榜单实时性。<b>核心矛盾：</b>亿级记录的存储与统计成本。<b>方案：</b>① 存储用 Redis BitMap：key=sign:{uid}:{yyyyMM}，SETBIT day 1；一年 365bit≈46B，千万用户年存储 GB 内；② 签到写：SETBIT + 返回当天状态；③ 连续签到：BITPOS/逐日查 + 月度；④ 补签：常规订单表（低频功能别过度设计）；⑤ 榜单：ZSet 月度累计（INCR）+ 定时校准；⑥ 大促防刷：签到接口限流 + 行为风控。<br><b>权衡：</b>BitMap 换取极致存储与位运算统计，代价是"仅布尔状态"，复杂状态回表存储。',
        plus: '给出量级估算过程（1000w×365bit）比直接甩方案更加分。',
        followups: ['Redis BitMap 底层是什么数据结构？', '怎么统计"本月全勤"的用户数（BITOP AND）？'],
      },
      {
        q: '如何实现一个延迟任务系统（订单 30 分钟超时关闭）？',
        a: '<b>方案对比：</b>① 定时轮询扫表：简单但全表扫、延迟不精确（量大不可用）；② JDK DelayQueue：单机内存，重启丢；③ Redis：ZSet（score=到期时间戳）轮询取到期任务，或键空间通知（不可靠）；④ <b>时间轮</b>（Netty HashedWheelTimer）：单机高效；⑤ <b>RocketMQ 延迟消息</b>（18 个等级/5.0 任意延迟）：可靠、分布式的首选。<b>生产架构：</b>下单发 30min 延迟消息 → 消费时检查订单状态 → 未支付则关单（状态机 UPDATE 防并发）→ 触发退款/回补库存。<br><b>兜底：</b>消息可能丢/延迟，补一个低频扫表任务（如每 5 分钟扫临近超时单）双保险。',
        plus: '强调"任何方案都要有对账兜底"，这是分布式系统的基本素养。',
        followups: ['Redis ZSet 实现延迟队列怎么保证消费原子性（ZPOPMIN/Lua）？', '时间轮为什么是 O(1)？'],
      },
      {
        q: '如何设计一个分布式环境下的全局序列号/订单号生成服务？',
        a: '<b>需求澄清：</b>趋势递增（利于 InnoDB 顺序插入）、不重复、高 QPS、长度可控。<b>方案：</b>① UUID：无序不适合聚簇索引且 36 位太长，出局；② DB 号段模式：批量取号段（如每次 1000 个）内存分配，双 buffer 预加载防抖（美团 Leaf-segment）；③ <b>雪花算法</b>：64 位时间戳+机器 id+序列号，趋势递增、本地生成无网络开销；问题=时钟回拨与机器 id 分配；④ Redis INCR：简单但强依赖 Redis 可用性。<b>生产选型：</b>Leaf/美团方案 = 号段 + 雪花双模式，时钟回拨用"等待 + 备用 workerId + 告警"。',
        plus: '说出"为什么不用 UUID 做主键：随机写导致页分裂、索引膨胀"体现数据库理解。',
        followups: ['雪花算法 workerId 怎么分配（ZK/DB 自增/K8s StatefulSet 序号）？', '号段模式的双 buffer 怎么实现？'],
      },
      {
        q: '线上一个接口突然从 50ms 涨到 2s，如何排查？（通用排错框架）',
        a: '<b>先定位层级再深入：</b>① 看监控定位段：网关耗时/应用耗时/DB 耗时/外部调用耗时（链路追踪直接看瀑布图）；② <b>应用层：</b>线程池打满？（jstack 看线程状态：大量 WAITING 在获取连接/锁）；Full GC？（jstat -gcutil，GC 日志）；CPU 上下文切换高？③ <b>DB 层：</b>慢 SQL（EXPLAIN）、锁等待（show engine innodb status）、连接池耗尽；④ <b>外部依赖：</b>下游 RT 上升/Redis 慢命令（KEYS？大 key？）/MQ 堆积；⑤ <b>环境变化：</b>是否有发布、流量突增、定时任务撞车、网络抖动。<b>修复优先级：</b>止血（扩容/降级/限流）→ 根因（代码/SQL/配置）→ 复盘（加监控告警）。',
        plus: '用"时间线对比（发布记录 vs 故障时间）"开口，立刻区别于背题选手。',
        followups: ['线程池打满的表现与根因排查？', '如何设计接口耗时监控与告警阈值？'],
      },
      {
        q: '如何设计一个支持高并发的计数服务（点赞数/阅读数）？',
        a: '<b>矛盾：</b>写极频繁（热帖每秒千赞）但强一致要求低。<b>方案：</b>① 读：Redis 计数（INCR）+ 热点多级缓存；② 写：<b>合并写</b>——先 Redis 累加，定时/定量（如每 1000 次或每秒）批量刷回 DB（UPDATE count = count + n），把随机写变批量写；③ 一致性：允许短暂误差（阅读数无所谓）；点赞需防重（Set/BitMap 记录谁点过）；④ 极端热点：分片计数（count:{id}:1~10 随机片，读时聚合）防单 key 热；⑤ 持久化可靠性：Redis 异步落库 + 对账任务修复。<br><b>延伸：</b>微博/feed 的计数体系有专门 counter 服务（SSD 缓存冷数据），说明"计数独立服务化"是大厂标配。',
        plus: '区分两类计数：精确计数（点赞要防重）与近似计数（阅读量可容忍），需求决定架构。',
        followups: ['Redis INCR 后宕机怎么保证不丢太多？', '如何防止刷赞/刷阅读？'],
      },
      {
        q: '如何设计配置中心（如 Nacos/Apollo）的核心机制？',
        a: '<b>核心三问：</b>① 配置怎么存：配置中心集群存储（DB + 内存缓存），按 namespace/group/dataId 组织；② 客户端怎么感知变更：<b>长轮询</b>（Nacos：客户端 30s 长轮询，服务端有变更立即返回；避免纯轮询浪费与纯推送的连接维护复杂度）或长连接 gRPC（Nacos 2.x）；③ 怎么做到容灾：客户端<b>本地快照</b>——配置中心全挂也能用最后一份配置启动；发布灰度、变更审计、回滚。<br><b>热更新落地：</b>@RefreshScope Bean 在变更事件时销毁重建，@ConfigurationProperties 自动重绑定。',
        plus: '对比 Apollo（长轮询+推送结合、多环境治理强）与 Nacos（配置+注册一体），说明选型。',
        followups: ['长轮询和 WebSocket 推送怎么选？', '配置中心挂了应用还能启动吗？'],
      },
    ],
  },

  {
    id: 'bw-ops', icon: '🛠️', name: '部署、运维与线上问题',
    desc: '社招必问"你上线过吗"，用这些题证明生产经验。',
    items: [
      {
        q: '应用服务器的 JVM 参数怎么配置？给出生产模板并解释。',
        a: '<b>G1 模板（4C8G 容器，堆 4G）：</b>-Xms4g -Xmx4g（相等防抖动）-XX:+UseG1GC -XX:MaxGCPauseMillis=200（目标停顿，勿设过小导致频繁 GC）-XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m（防动态扩容抖动）-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/data/dump/（OOM 留证据）-Xlog:gc*:file=/data/logs/gc.log:time（JDK11+；JDK8 用 -XX:+PrintGCDetails -Xloggc）-XX:+ParallelRefProcEnabled。<br><b>容器注意：</b>JDK10+ 原生感知 cgroup 限制；JDK8u191+ 用 -XX:+UseContainerSupport（默认开）；MaxRAMPercentage=75.0 按容器内存百分比给堆，留空间给元空间/线程栈/堆外。',
        plus: '讲出"容器里给堆 100% 内存必 OOMKill：堆 + 元空间 + 线程栈 + DirectMemory 都吃容器配额"。',
        followups: ['容器里 OOMKilled 和 Java OOM 的区别？', '线程数过多导致栈内存耗尽怎么调？'],
      },
      {
        q: 'Docker/K8s 部署 Java 应用的最佳实践？',
        a: '<b>镜像：</b>多阶段构建（builder 层 mvn package → runtime 层只拷 jar，镜像从 1G 降到 200M）；基础镜像选 jre 而非 jdk；分层缓存优化（先 COPY pom 下依赖再 COPY src，代码变更不重拉依赖）；.dockerignore 排除 target/.git。<b>资源：</b>requests/limits 合理设置；JVM 用 MaxRAMPercentage；健康检查：livenessProbe（存活，接口 /actuator/health/liveness）+ readinessProbe（就绪，依赖就绪才接流量）。<b>优雅停机：</b>terminationGracePeriodSeconds + Spring graceful shutdown（收到 SIGTERM 停止接新请求，处理完存量再退），preStop sleep 10s 配合下线注册（Nacos 主动注销）防流量打到已死实例。<b>日志：</b>输出 stdout 由采集器收集，不打进容器文件（容器易失）。',
        plus: '说出"readiness 不通过自动摘流量 = 零成本灰度回滚的基础"。',
        followups: ['镜像分层为什么要先 COPY pom.xml？', 'Pod 频繁重启（CrashLoopBackOff）怎么查？'],
      },
      {
        q: '生产环境日志规范与排错技巧？',
        a: '<b>规范：</b>① 级别使用正确：ERROR=需要人介入、WARN=可自愈异常、INFO=关键链路节点、DEBUG=细节（生产关）；② 格式带上下文：traceId、userId、耗时；禁止打印密码/token/身份证（合规红线）；③ 异常日志打印完整堆栈：log.error("msg, key={}", key, e)（slf4j 把最后一个 Throwable 当异常）；④ 异步日志（Log4j2 Async / Logback AsyncAppender）防日志拖垮接口；⑤ 滚动策略：按天+按大小，保留期合规要求。<b>排错三板斧：</b>grep traceId 串起全链路 → tail -f 配合复现 → awk 统计（如 awk \'/ERROR/{print $5}\' | sort | uniq -c | sort -rn 找 Top 错误）。',
        plus: '提"日志也是性能问题：同步日志磁盘 IO、日志量过大挤爆磁盘都是真实事故"。',
        followups: ['traceId 是怎么跨服务传递的（MDC + header 透传）？', '磁盘突然写满，第一反应查什么（df -h → 大日志/dump）？'],
      },
      {
        q: 'MySQL 主从延迟很大，业务上如何应对？',
        a: '<b>先治本：</b>① 大事务拆小（一个事务改 10w 行 → slave 回放慢）；② 从库机器规格对齐、开启并行复制（MTS：slave_parallel_workers）；③ 单核回放瓶颈 → 表按行并行；④ 网络带宽/磁盘 IO 检查。<b>业务侧兼容：</b>① 写后立即读的场景强制走主库（ShardingSphere hint / 动态数据源），其余读走从库；② 会话内一致性读：写后 N 秒内该用户读主（Redis 记录用户最近写时间）；③ 半同步复制（semi-sync）：至少一个从库收到 binlog 才返回成功，牺牲一点写性能换安全；④ 关键业务（支付）不依赖读从库。<br><b>监控：</b>Seconds_Behind_Master 告警阈值 + pt-heartbeat 精准测量（Seconds_Behind_Master 不准）。',
        plus: '指出"Seconds_Behind_Master 只对比本机事件时间，网络堵塞时可能为 0"——细节分。',
        followups: ['主从复制的原理（binlog → relay log → SQL 线程回放）？', 'binlog 三种格式怎么选（row/statement/mixed）？'],
      },
      {
        q: '什么是灰度发布？怎么做无损发布？',
        a: '<b>灰度发布：</b>新版本先接小流量验证（1%→10%→100%），出问题影响面可控。实现：① 网关按权重/用户标签路由到新版本实例；② K8s Deployment 滚动更新 + readiness 门控；③ 服务网格/注册中心元数据路由（按 header 分流）。<b>无损发布要点：</b>① 发布前主动从注册中心下线 → 等待存量请求处理完（平滑窗口）→ 再停进程（配合 graceful shutdown）；② 数据库变更向后兼容（先加列后用列，双写过渡，禁止一步删字段）；③ 消费者发布：先停消费再切代码，防消息处理一半；④ 回滚预案：镜像回退 + 配置回退演练过才叫有预案。',
        plus: '提"DB 变更与代码发布解耦：兼容式三步发布（加列→双写切读→清理）是免事故关键"。',
        followups: ['蓝绿部署、滚动发布、金丝雀的区别？', '如何验证新版本接口的正确性（影子流量/对比）？'],
      },
      {
        q: '接口被恶意刷量/CC 攻击，如何防护？',
        a: '<b>分层防线：</b>① 接入层：CDN/WAF 挡明显攻击（UA/频率/黑 IP 库），Nginx limit_req 限流；② 应用层：登录/核心接口加验证码、滑块（人机识别）；令牌桶限流（网关 Sentinel/Redis + Lua 分布式限流）；③ 业务层：行为风控（设备指纹、签名时间戳防重放、同一用户/设备/IP 多维频控）；④ 数据层：热点 key 单独防护；写接口幂等 + 风控降级开关。<b>应急处理：</b>发现攻击 → 先限流/黑名单止血 → 分析日志提取攻击特征 → 加规则 → 复盘补监控（QPS 突增告警）。<br><b>签名防篡改：</b>appId + timestamp + nonce + 参数排序 + secret 做 HMAC，服务端校验时间窗与 nonce 去重——防重放与参数篡改。',
        plus: '答出"nonce 去重为什么必须（时间窗内重放）"和"限流阈值基于压测容量而非拍脑袋"。',
        followups: ['分布式限流怎么实现（Redis + Lua 令牌桶）？', '验证码的体验与安全如何平衡？'],
      },
      {
        q: '如何做容量评估与压测？（大促前准备）',
        a: '<b>容量评估四步：</b>① 目标推算：日活/PV → 峰值 QPS = 日请求 × 二八法则集中度 ÷ 有效时长（例：1 亿请求、80% 挤在 4h → 约 5600 QPS，×3 余量 ≈ 1.7w）；② 拆解到各层：网关/应用/缓存/DB/下游依赖各自需承受值；③ 资源估算：单机压测基准容量 → 实例数 = 峰值/单机容量 × 冗余；④ 数据存储：增长曲线 + 保留策略。<b>压测：</b>环境（等比缩放的生产影子环境/线上影子流量）；JMeter/JMH/全链路压测平台；关注 RT 分位数（P99 而非平均）、错误率、资源水位；找到拐点后留 30-50% buffer。<b>预案：</b>限流阈值、降级开关、扩容 SOP 全部演练过才算数。',
        plus: '说出"压测数据要隔离（影子表/影子队列），别把营销短信真实发给用户"——真实事故级细节。',
        followups: ['P99 和平均值为什么差很多（长尾）？', '全链路压测的流量染色怎么做？'],
      },
    ],
  },
];

/* ---- 统计 ---- */
export const baguwenStats = (() => {
  let count = 0;
  baguwenCategories.forEach(c => count += c.items.length);
  return { total: count, categoryCount: baguwenCategories.length };
})();
