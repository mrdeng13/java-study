// 图解原理专栏 · Java 集合源码级专篇（原创深度长文：源码逐行解读 + 图解 + 面试连环问）
// 与 topics-network-os / topics-mysql-redis 同构：{ id, icon, tag, title, desc, blocks }

export const topicsCollections = [
  {
    id: 'top-arraylist', icon: '📦', tag: '集合源码', title: 'ArrayList 源码级剖析：扩容机制与 fail-fast',
    desc: '为什么查询快增删慢？扩容为什么是 1.5 倍？RandomAccess 接口有什么用？remove 遍历为什么踩坑？源码级答案全在这。',
    blocks: [
      { t: 'h', html: '一、核心字段：一个数组 + 一个 size，仅此而已' },
      { t: 'code', lang: 'java', title: 'ArrayList 核心字段（JDK8+）', code: 'public class ArrayList<E> extends AbstractList<E>\n        implements List<E>, RandomAccess, Cloneable, java.io.Serializable {\n\n    private static final int DEFAULT_CAPACITY = 10;      // 默认初始容量\n    private static final Object[] EMPTY_ELEMENTDATA = {}; // 空数组（有参构造且 size=0 时用）\n    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {}; // 无参构造用\n\n    transient Object[] elementData;  // 真正存数据的地方（transient：序列化时跳过，自定义 writeObject 按 size 序列化，省空间）\n    private int size;                // 实际元素个数（注意：不是数组容量！）\n}' },
      { t: 'warn', html: '<b>面试重灾区：</b>无参构造 <code>new ArrayList&lt;&gt;()</code> 在 JDK8 之后<b>并不会立刻创建长度 10 的数组</b>，而是指向空数组 <code>DEFAULTCAPACITY_EMPTY_ELEMENTDATA</code>，第一次 add 时才扩到 10——这就是著名的「懒初始化」优化（JDK6 是构造时就分配 10）。' },

      { t: 'h', html: '二、add 与 grow：1.5 倍扩容的完整链路' },
      { t: 'code', lang: 'java', title: 'add → ensureCapacityInternal → grow（源码精简版）', code: 'public boolean add(E e) {\n    ensureCapacityInternal(size + 1);  // 先确保装得下\n    elementData[size++] = e;           // 再赋值，size 后移\n    return true;\n}\n\nprivate void grow(int minCapacity) {\n    int oldCapacity = elementData.length;\n    int newCapacity = oldCapacity + (oldCapacity >> 1);  // ★ 1.5 倍：old + old/2（位运算）\n    if (newCapacity - minCapacity < 0)\n        newCapacity = minCapacity;                        // 1.5 倍还不够就直接用所需值\n    if (newCapacity - MAX_ARRAY_SIZE > 0)\n        newCapacity = hugeCapacity(minCapacity);          // 溢出保护\n    elementData = Arrays.copyOf(elementData, newCapacity); // ★ 底层 System.arraycopy 整体搬移\n}' },
      { t: 'steps', html: '第一次 add(1) 的完整时间线：', items: [
        'elementData 是空数组（长度 0）→ minCapacity = max(10, 0+1) = 10（DEFAULTCAPACITY_EMPTY_ELEMENTDATA 才有这个 max(…, 10) 逻辑）',
        'grow：oldCapacity = 0，newCapacity = 0 + 0 = 0 < 10 → 取 10，Arrays.copyOf 分配新数组',
        'elementData[0] = 1，size 变为 1',
        '第 11 次 add：minCapacity = 11 > 10 → grow：10 + (10>>1) = 15 → 之后 22、33、49…（每次 ×1.5）',
      ] },
      { t: 'qa', q: '为什么是 1.5 倍而不是 2 倍或固定增量？', a: '① <b>1.5 倍的空间换时间平衡点</b>：增长太慢（如固定 +10）扩容频繁均摊成本高；增长太快（如 2 倍、4 倍）浪费内存且老数组 copyOf 一次性开销大。② <b>oldCapacity + (oldCapacity >> 1)</b> 位运算比乘法快，且 1.5 倍已能保证均摊 O(1)。③ 对照记忆：HashMap 扩容是 2 倍——因为它要求容量是 2 的幂（hash & (n-1) 取模优化），两者约束不同，别混。' },

      { t: 'h', html: '三、get/set 与 remove：随机访问 O(1)、删除 O(n) 的根源' },
      { t: 'code', lang: 'java', title: 'get 与 remove 源码', code: 'public E get(int index) {\n    rangeCheck(index);\n    return elementData(index);        // ★ 就是数组下标寻址：内存地址 = 首地址 + index × 元素大小\n}                                     //    这就是「查询快」的全部秘密——O(1)\n\npublic E remove(int index) {\n    rangeCheck(index);\n    modCount++;\n    E oldValue = elementData(index);\n    int numMoved = size - index - 1;\n    if (numMoved > 0)\n        System.arraycopy(elementData, index + 1, elementData, index, numMoved); // ★ 后面的元素整体前移\n    elementData[--size] = null;       // ★ 置 null 让 GC 回收（防止内存泄漏，细节！）\n    return oldValue;\n}' },
      { t: 'p', html: '<b>删除慢的真相：</b>不是「找得慢」而是「挪得慢」——删除中间元素要把后面所有元素整体前移一位，O(n)。同理尾部 add 均摊 O(1)，但中间/头部插入也是 O(n)。' },

      { t: 'h', html: '四、modCount 与 fail-fast：并发修改异常的源码机制' },
      { t: 'code', lang: 'java', title: 'iterator 里的 fail-fast 检查', code: 'protected transient int modCount = 0;   // 结构性修改次数（add/remove 都会 ++）\n\nprivate class Itr implements Iterator<E> {\n    int expectedModCount = modCount;    // 创建迭代器时快照\n\n    public E next() {\n        checkForComodification();       // 每次取元素前校验\n        ...\n    }\n    final void checkForComodification() {\n        if (modCount != expectedModCount)\n            throw new ConcurrentModificationException(); // ★ fail-fast：立刻抛异常，宁可出错也不带病运行\n    }\n}' },
      { t: 'qa', q: '遍历时删除元素的正确姿势？', a: '三种安全方式：① <b>iterator.remove()</b>（它会同步 expectedModCount = modCount，所以不炸）；② <b>removeIf</b>：list.removeIf(x -> x &lt; 3)（JDK8，底层也是标记+批量删，还更快）；③ <b>倒序 for 循环按下标删</b>（删后面不影响前面未遍历的下标）。<b>错误方式：</b>foreach（底层就是 iterator）里直接 list.remove()——抛 ConcurrentModificationException；正序按下标删——会漏元素（删掉 i 后，后面的元素顶上来，i++ 跳过了下一个）。' },

      { t: 'h', html: '五、速记总结' },
      { t: 'list', items: [
        '底层 Object[] 数组；无参构造 JDK8+ 懒初始化，首次 add 才分配 10',
        '扩容 1.5 倍（old + old >> 1），copyOf 整体搬移，均摊 O(1)',
        'get O(1)；中间增删 O(n)（arraycopy 挪移）；实现 RandomAccess 标记接口',
        'modCount + expectedModCount 实现 fail-fast；安全删除用 iterator.remove / removeIf / 倒序下标',
        'transient + 自定义 writeObject：只序列化实际元素，不序列化预留空位',
        '线程不安全。替代：Collections.synchronizedList（全表锁）或 CopyOnWriteArrayList（读多写少）',
      ] },
    ],
  },

  {
    id: 'top-linkedlist', icon: '🔗', tag: '集合源码', title: 'LinkedList 源码级剖析：双向链表、双端队列与「伪随机访问」',
    desc: 'JDK 里 LinkedList 同时实现了 List 和 Deque——源码里 first/last 双指针、node(int) 的「二分走位」小聪明，以及它为什么被 Algorithm 教科书除名。',
    blocks: [
      { t: 'h', html: '一、结构：双向链表 + first/last 双指针' },
      { t: 'code', lang: 'java', title: 'LinkedList 核心结构', code: 'public class LinkedList<E>\n    extends AbstractSequentialList<E>\n    implements List<E>, Deque<E>, Cloneable, java.io.Serializable {\n\n    transient int size = 0;\n    transient Node<E> first;   // 头指针\n    transient Node<E> last;    // 尾指针（★ 头尾操作都是 O(1) 的关键）\n\n    private static class Node<E> {\n        E item;            // 数据\n        Node<E> next;      // 后继\n        Node<E> prev;      // 前驱\n        Node(Node<E> prev, E element, Node<E> next) { ... }\n    }\n}' },
      { t: 'code', lang: 'text', title: '内存形态', code: 'null ← [A] ⇄ [B] ⇄ [C] → null\n first↑            ↑last\n\n每个元素都要额外维护 prev/next 两个引用：\n64 位 JVM 压缩指针下，一个 Node 额外开销 ≈ 16 字节\n—— 这就是 LinkedList 内存不友好的根源（ArrayList 每个槽位只是一个引用 4B）' },

      { t: 'h', html: '二、node(int index)：源码里的「二分走位」优化' },
      { t: 'code', lang: 'java', title: '按 index 找节点——官方源码原味', code: 'Node<E> node(int index) {\n    // assert isElementIndex(index);\n    if (index < (size >> 1)) {          // ★ 前半段：从头走\n        Node<E> x = first;\n        for (int i = 0; i < index; i++)\n            x = x.next;\n        return x;\n    } else {                            // ★ 后半段：从尾走\n        Node<E> x = last;\n        for (int i = size - 1; i > index; i--)\n            x = x.prev;\n        return x;\n    }\n}' },
      { t: 'qa', q: '既然 LinkedList 声称「增删快」，为什么 get(i) 是 O(n)？「二分走位」把它变成 O(log n) 了吗？', a: '① get(i) 必须从 first/last 一步步 next/prev 走过去，平均 O(n)——所谓「查询慢」。② size >> 1 判断只是把<b>最坏</b>情况减半（走 n/4~n/2 步），仍是 O(n)，<b>不是二分查找</b>（二分要求随机访问，链表恰恰没有）。③ 「增删快」也是<b>限定条件</b>的：拿到节点后改指针 O(1)；但「按值/按下标找到再删」整体还是 O(n)。面试要说全：O(1) 只发生在你<b>已经持有节点引用</b>时。' },

      { t: 'h', html: '三、Deque 门面：它其实是「双端队列 + 栈」三合一' },
      { t: 'table', headers: ['API 风格', '方法', '对应语义'], rows: [
        ['List', 'add/get/remove(index)', '线性表（性能差，不推荐）'],
        ['队列 Queue', 'offer / poll / peek', '尾进头出（FIFO）'],
        ['双端 Deque', 'offerFirst/offerLast、pollFirst/pollLast', '两端进出（滑动窗口题常用）'],
        ['栈 Stack', 'push / pop / peek', 'Deque 接口的默认实现（官方推荐代替 Stack 类）'],
      ] },
      { t: 'info', html: '📚 <b>冷知识（面试加分）：</b>JDK 老类 <code>Stack</code> 继承自 Vector，全表 synchronized 且允许在底部插元素破坏栈语义——官方 Javadoc 明确建议用 <code>Deque&lt;Integer&gt; stack = new ArrayDeque&lt;&gt;()</code> 代替。而 ArrayDeque 用循环数组实现，性能优于 LinkedList 的链式 Deque——所以「用 LinkedList 当队列」在性能上也通常不是最优解。' },

      { t: 'h', html: '四、ArrayList vs LinkedList 决胜局（面试标准答案）' },
      { t: 'table', headers: ['维度', 'ArrayList', 'LinkedList'], rows: [
        ['底层', '动态数组', '双向链表'],
        ['随机访问 get(i)', 'O(1) 下标寻址', 'O(n) 顺链走位'],
        ['尾部增删', '均摊 O(1)', 'O(1)'],
        ['中间增删', 'O(n)（arraycopy 挪移）', 'O(n)（遍历找位置）+ O(1)（改指针）'],
        ['内存', '连续 + 预留空位（扩容浪费）', '每节点多 2 个引用，碎片化，缓存不友好'],
        ['CPU 缓存友好度', '★ 极高（顺序内存预取）', '差（指针跳转 cache miss 多）'],
        ['实际选型', '★ 默认之选（实测几乎全场景更快）', '仅头尾频繁进出（且不如 ArrayDeque）'],
      ] },
      { t: 'warn', html: '<b>颠覆认知的结论：</b>由于 CPU 缓存预取 + 数组内存连续性，实测中 <b>ArrayList 在绝大多数场景（含中间插入）都跑赢 LinkedList</b>。Joshua Bloch（《Effective Java》作者、Java 集合框架之父）自己都说「LinkedList 只有 1% 的场景有意义」。面试敢说这句，直接和其他候选人拉开差距。' },
    ],
  },

  {
    id: 'top-hashmap', icon: '🗺️', tag: '集合源码', title: 'HashMap 源码级剖析：从 put 一行行读到红黑树',
    desc: '面试出现率第一的类。capacity 为什么必须是 2 的幂？hash 为什么高 16 位异或？树化阈值为什么是 8？resize 拆链表的 (e.hash & oldCap) == 0 是什么魔法？',
    blocks: [
      { t: 'h', html: '一、先记四个常量，整篇源码都围绕它们' },
      { t: 'code', lang: 'java', title: 'HashMap 关键常量与字段', code: 'static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;  // 默认容量 16（必须是 2 的幂）\nstatic final int MAXIMUM_CAPACITY = 1 << 30;         // 最大 10.7 亿\nstatic final float DEFAULT_LOAD_FACTOR = 0.75f;      // 默认负载因子\nstatic final int TREEIFY_THRESHOLD = 8;              // 单链表长度 ≥8 且表长 ≥64 → 树化\nstatic final int UNTREEIFY_THRESHOLD = 6;            // 扩容拆树（split）时 ≤6 退化为链表\nstatic final int MIN_TREEIFY_CAPACITY = 64;          // 树化的表长门槛\n\ntransient Node<K,V>[] table;   // 哈希桶数组\ntransient int size;            // 实际键值对数\nint threshold;                 // 扩容阈值 = capacity × loadFactor' },

      { t: 'h', html: '二、put 全流程（JDK8）——背下这六步' },
      { t: 'code', lang: 'java', title: 'putVal 精简骨架', code: 'public V put(K key, V value) {\n    return putVal(hash(key), key, value, false, true);\n}\n\nstatic final int hash(Object key) {\n    int h;\n    // ★ 扰动函数：高 16 位异或低 16 位\n    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);\n}\n\nfinal V putVal(int hash, K key, V value, ...) {\n    Node<K,V>[] tab; Node<K,V> p; int n, i;\n    if ((tab = table) == null || (n = tab.length) == 0)\n        n = (tab = resize()).length;                    // ① 表为空 → resize 初始化（懒初始化，同 ArrayList 思想）\n    if ((p = tab[i = (n - 1) & hash]) == null)          // ② 定位桶：i = (n-1) & hash，空桶直接放\n        tab[i] = newNode(hash, key, value, null);\n    else {\n        // ③ 桶非空：p 是桶头。依次判断\n        if (p.hash == hash && (key 相等))\n            e = p;                                       // 头节点就是目标 → 覆盖\n        else if (p instanceof TreeNode)\n            e = ((TreeNode)p).putTreeVal(...);           // 红黑树插入\n        else {\n            for (int binCount = 0; ; ++binCount) {\n                if ((e = p.next) == null) {\n                    p.next = newNode(...);               // ★ 尾插法（JDK7 是头插）\n                    if (binCount >= TREEIFY_THRESHOLD - 1)\n                        treeifyBin(tab, hash);           // 链长 ≥8 → 尝试树化\n                    break;\n                }\n                if (key 相等) break;                     // 链上已有目标 → 覆盖\n                p = e;\n            }\n        }\n        if (e != null) { V old = e.value; e.value = value; return old; }  // ④ 覆盖旧值\n    }\n    ++modCount;\n    if (++size > threshold) resize();                    // ⑤ size 超阈值 → 扩容 2 倍\n    return null;                                         // ⑥ 新增成功\n}' },
      { t: 'qa', q: '为什么容量必须是 2 的幂？hash 为什么要高 16 位异或？', a: '① 取模定位桶用 <code>(n-1) & hash</code>：当 n 是 2 的幂时 n-1 是「全 1 掩码」（如 16-1=1111），与运算等价于取模且<b>位运算远快于 %</b>。② hashCode 是 32 位，若容量 16 只用低 4 位——高 16 位参与不进来，碰撞概率大增。③ <code>h ^ (h >>> 16)</code> 让高 16 位「折叠」进低 16 位，一异或一次搞定，<b>代价最小地让高位也参与散列</b>。这是 Doug Lea/方腾飞们反复推敲的性价比设计。' },

      { t: 'h', html: '三、resize：JDK8 扩容拆链表的「神仙算法」' },
      { t: 'code', lang: 'java', title: 'resize 里的两个关键判断', code: 'do {\n    next = e.next;\n    // ★ 核心魔法：e.hash & oldCap 只可能得 0 或 oldCap（oldCap 是 2 的幂，只有最高位是 1）\n    if ((e.hash & oldCap) == 0)\n        loTail.next = e;  → 保持原下标 newTab[j]\n    else\n        hiTail.next = e;  → 新下标 = 原下标 + oldCap（如 5 → 5+16=21）\n} while ((e = next) != null);' },
      { t: 'qa', q: '(e.hash & oldCap) == 0 到底在判断什么？', a: '扩容后掩码从 n-1 变成 2n-1，比原来<b>多看 hash 的一位</b>——就是 oldCap 对应的那一位。该位是 0 → 新掩码结果不变 → 留原位；是 1 → 结果多出 oldCap → 挪到「原下标 + oldCap」。这样<b>一次遍历、按位分流</b>，不用重新计算每个元素的桶下标，也不用像 JDK7 那样倒序头插（JDK7 头插在并发 resize 会形成环形链表 → get 死循环 CPU 100%，JDK8 改尾插后解决了环，但 HashMap 依然线程不安全——会丢数据、size 不一致）。' },

      { t: 'h', html: '四、树化的三个阈值：为什么是 8 和 6？' },
      { t: 'qa', q: '链表转红黑树的阈值为什么是 8？退化为什么是 6？', a: '① 官方注释给了统计学依据：<b>理想散列下，桶内节点数服从泊松分布，λ≈0.5 时单个桶出现 8 个节点的概率仅约 0.00000006（亿分之六）</b>——树化是「散列质量已经崩了」的兜底保险，而不是常态。② 选 8 还有个巧妙契合：红黑树要求树高 ≤ 2·log₂(n+1)，链长 8 时 O(n)=8 次 vs 树 O(log8)≈3 次，同时 TreeNode 占用内存约是 Node 的 2 倍——不值得为小概率事件常驻。③ 退化阈值 6 而不是 7：留出缓冲带，防止节点在 7↔8 之间反复横跳导致链表↔红黑树来回转换抖动。' },

      { t: 'h', html: '五、连环追问终点站' },
      { t: 'qa', q: 'HashMap 的 key 可以是对象吗？有什么要求？为什么 String 适合做 key？', a: '可以。要求：<b>正确重写 equals 和 hashCode</b>（成对！否则 get 找不到）。String 适合：① final 不可变 → hashCode 可缓存（String 里 hash 字段懒计算后缓存），get 时不用重算；② equals/hashCode 稳定一致；③ 内部 char[] 也是 final，防止 key 在 map 里被改。追问「为什么重写 equals 必须重写 hashCode」→ 因为 HashMap 先比 hash 再比 equals，hash 不等直接判不等，两个 equals 相等但 hash 不同的对象会存成两份，语义崩塌。' },
      { t: 'list', items: [
        '懒初始化；容量 2 的幂；(n-1)&hash 定位；扰动函数折叠高 16 位',
        'JDK8 尾插；链长 ≥8 且表长 ≥64 树化，split 时 ≤6 退链',
        'size > capacity×0.75 扩容 2 倍；(hash & oldCap) 按位分流免重算',
        '并发问题：JDK7 头插成环死循环；JDK8 丢数据——多线程用 ConcurrentHashMap',
        'key 为 null 存在 0 号桶（table[0]）；value 可为 null',
      ] },
    ],
  },

  {
    id: 'top-chm', icon: '🛡️', tag: '集合源码', title: 'ConcurrentHashMap 源码级剖析：JDK7 分段锁 → JDK8 CAS+synchronized',
    desc: '为什么弃用 Segment？size 怎么统计才线程安全？get 为什么不需要加锁？1.8 源码里的 CAS 空桶初始化、forwarding 帮助扩容，一文读透。',
    blocks: [
      { t: 'h', html: '一、两代架构对比：为什么抛弃分段锁' },
      { t: 'table', headers: ['维度', 'JDK7 Segment 分段锁', 'JDK8 Node + CAS + synchronized'], rows: [
        ['锁粒度', '段（默认 16 段，并发度=段数）', '单个桶头节点'],
        ['数据结构', 'Segment[] → HashEntry[] 链表', 'Node[] 链表 + 红黑树（与 HashMap 同构）'],
        ['写并发度', '最多 16 线程同时写', '理论等于桶数量，冲突更少'],
        ['寻址', '两次 hash（先段后桶）', '一次 hash'],
        ['淘汰原因', '并发度固定、内存翻倍、查询两次寻址', '—（JDK8 方案全面更优）'],
      ] },

      { t: 'h', html: '二、putVal 源码：三种情况三种锁' },
      { t: 'code', lang: 'java', title: 'JDK8 ConcurrentHashMap.putVal 关键段', code: 'final V putVal(K key, V value, boolean onlyIfAbsent) {\n    if (key == null || value == null) throw new NullPointerException(); // ★ 与 HashMap 不同：禁止 null\n    int hash = spread(key.hashCode());          // 扰动：HIGH^ (h>>>16) 同思想\n    int binCount = 0;\n    for (Node<K,V>[] tab = table;;) {           // ★ 死循环 + CAS：失败重来\n        Node<K,V> f; int n, i, fh;\n        if (tab == null || (n = tab.length) == 0)\n            tab = initTable();                  // ① 懒初始化（CAS sizeCtl 保证只有一个线程建表）\n        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {\n            if (casTabAt(tab, i, null, new Node<>(hash, key, value)))\n                break;                          // ② 空桶 → CAS 插入，无锁！失败则循环重试\n        }\n        else if ((fh = f.hash) == MOVED)\n            tab = helpTransfer(tab, f);         // ③ 桶头是 ForwardingNode → 表在扩容，先帮忙迁移\n        else {\n            synchronized (f) {                  // ④ 锁住桶头节点（粒度=单桶）\n                if (tabAt(tab, i) == f) {       //    双重检查：锁前头节点没被换掉\n                    // 链表尾插 / 红黑树插入（逻辑同 HashMap）\n                }\n            }\n            if (binCount != 0)\n                if (binCount >= TREEIFY_THRESHOLD) treeifyBin(tab, i);\n            break;\n        }\n    }\n    addCount(1L, binCount);                     // ⑤ CAS 更新 baseCount + CounterCell 分散计数\n    return null;\n}' },
      { t: 'qa', q: '为什么 JDK8 用 synchronized 而不是 ReentrantLock？', a: '① <b>锁竞争极小</b>：只锁单个桶头，碰撞概率低，JDK6 后 synchronized 优化（偏向锁→轻量级→自适应自旋）后无竞争场景开销接近原子操作；② <b>省内存</b>：ReentrantLock 每个桶一个对象（AQS 队列+state）内存爆炸，synchronized 只用对象头 mark word；③ JVM 内建锁可持续优化（逃逸分析、锁消除）。面试还可补：空桶用 CAS 无锁化，只有真冲突才升级到 synchronized——整体是一套「CAS 乐观 → synchronized 悲观」的渐进锁策略。' },

      { t: 'h', html: '三、size() 怎么算的：LongAdder 思想的计数分散' },
      { t: 'code', lang: 'java', title: 'addCount 与 baseCount/CounterCell', code: 'transient volatile long baseCount;             // 无竞争时的计数器\nprivate transient volatile CounterCell[] counterCells; // 有竞争时的分散计数槽\n\n// 计数逻辑（等价 LongAdder）：\nif (CAS 更新 baseCount 成功) → 完事\nelse\n    → 往 counterCells 随机选一个槽 CAS 累加   // ★ 把一个热点拆成 N 个槽，用空间换无争用\n\n// size() = sumCount() = baseCount + Σ counterCells[i].value  （非精确瞬时值！）' },
      { t: 'info', html: '💡 <b>为什么 size 不是精确值：</b>要精确就得全表加锁或全局原子计数——前者毁并发、后者热点瓶颈。官方取舍：把 size 定义为「并发达成过程中的估计值」，换取写入路径几乎零计数开销。这与 LongAdder 战胜 AtomicLong 是同一个思想：<b>热点分离</b>。' },

      { t: 'h', html: '四、get 为什么不用加锁？' },
      { t: 'code', lang: 'java', title: 'get 源码关键点', code: 'public V get(Object key) {\n    Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;\n    int h = spread(key.hashCode());\n    if ((tab = table) != null && (n = tab.length) > 0 &&\n        (e = tabAt(tab, (n - 1) & h)) != null) {\n        if ((eh = e.hash) == h) ...        // 直接比较\n        else if (eh < 0)                   // ★ hash<0：ForwardingNode(MOVED) 或 TreeBin\n            return (p = e.find(h, key)) != null ? p.val : null;\n        while ((e = e.next) != null) { ... }  // 链表顺序找\n    }\n    return null;\n}\n// 安全的三件套：① Node.val 和 next 都被 volatile 修饰（可见性+禁止重排）\n//              ② tabAt 用 Unsafe.getObjectVolatile 保证读到最新桶头\n//              ③ 扩容时 ForwardingNode.find 会「转场」去新表找' },
      { t: 'list', items: [
        'JDK7：Segment 分段锁（16 段）、两次寻址；JDK8：CAS 空桶 + synchronized 桶头 + volatile 读',
        '禁止 null key/value：并发下 get 返回 null 无法区分「不存在」和「值就是 null」（二义性）',
        'size 非精确：baseCount + CounterCell 分散计数（LongAdder 思想）',
        '扩容：多线程 helpTransfer 协助迁移，ForwardingNode 路标',
        '1.8 里 CHM 树化阈值同 HashMap（8/6），但树化用的是 TreeBin 包装（锁的是 TreeBin 不是根节点）',
      ] },
    ],
  },

  {
    id: 'top-lhm-tm', icon: '🎚️', tag: '集合源码', title: 'LinkedHashMap 与 TreeMap 源码：一个有插入序，一个有比较序',
    desc: 'LinkedHashMap 怎么用「双向链表串起所有 Entry」实现顺序？accessOrder 怎么变身 LRU？TreeMap 的红黑树 put 后为什么要 fixAfterInsertion？',
    blocks: [
      { t: 'h', html: '一、LinkedHashMap：HashMap + 一条贯穿的双向链表' },
      { t: 'code', lang: 'java', title: '核心结构（继承 HashMap）', code: 'public class LinkedHashMap<K,V> extends HashMap<K,V> {\n    transient LinkedHashMap.Entry<K,V> head;  // 双向链表头（最旧）\n    transient LinkedHashMap.Entry<K,V> tail;  // 双向链表尾（最新）\n    final boolean accessOrder;                // false=插入序（默认） true=访问序（LRU 基础）\n\n    static class Entry<K,V> extends HashMap.Node<K,V> {\n        Entry<K,V> before, after;             // ★ 每个 Entry 多挂两个指针，串成链\n    }\n    // HashMap 留的钩子：putVal 成功后回调\n    void afterNodeAccess(Node<K,V> e) { ... }   // accessOrder=true 且 e 不是尾 → 移到链尾\n    void afterNodeInsertion(boolean evict) {\n        LinkedHashMap.Entry<K,V> first;\n        if (evict && (first = head) != null && removeEldestEntry(first)) {\n            removeNode(hash(first.key), ...);   // ★ LRU 淘汰点：新插入后删掉链头最旧元素\n        }\n    }\n}' },
      { t: 'code', lang: 'java', title: '经典应用：10 行写一个 LRU 缓存（LeetCode 146 同款思路）', code: 'class LRUCache<K, V> extends LinkedHashMap<K, V> {\n    private final int maxEntries;\n    LRUCache(int cap) {\n        super(cap, 0.75f, true);              // ★ accessOrder = true：按访问排序\n        this.maxEntries = cap;\n    }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n        return size() > maxEntries;           // 超容量淘汰链头（最久未访问）\n    }\n}\n// get/put 都会触发 afterNodeAccess 把刚访问的 Entry 挪到链尾 → 链头永远是「该杀」的' },
      { t: 'qa', q: 'LinkedHashMap 是线程安全的吗？LinkedHashSet 和它什么关系？', a: '① 不安全，同 HashMap（1.8 前后问题一样）。② LinkedHashSet 继承 HashSet，而 HashSet 内部就是包了一个 LinkedHashMap（HashSet 源码：map = new LinkedHashMap&lt;&gt;()）——「不重复 + 插入有序」白嫖自双向链表。追问链：HashSet 里的 PRESENT 是什么 → 一个共享的静态 final Object 占位 value，因为 Set 只要 key 不要 value。' },

      { t: 'h', html: '二、TreeMap：红黑树落地实现，按 key 排序' },
      { t: 'code', lang: 'java', title: 'put → fixAfterInsertion（红黑树修正）', code: 'public V put(K key, V value) {\n    ...\n    int cmp; Entry<K,V> parent;\n    if (cpr != null) {                        // 有 Comparator\n        do { parent = t; cmp = cpr.compare(key, t.key);\n             if (cmp < 0) t = t.left; else if (cmp > 0) t = t.right; else return t.setValue(value);\n        } while (t != null);                  // ★ BST 二分下潜找到插入父节点\n    } else { /* key.compareTo 同理；null key 直接 NPE */ }\n    Entry<K,V> e = new Entry<>(key, value, parent);\n    if (cmp < 0) parent.left = e; else parent.right = e;\n    fixAfterInsertion(e);                     // ★ 插入后修正：变色+旋转，恢复红黑五条性质\n    size++; modCount++;\n    return null;\n}' },
      { t: 'p', html: '红黑树五条性质（背）：① 节点非红即黑；② 根必黑；③ 叶子（NIL）是黑；④ 红节点的两个孩子必黑（<b>红不相邻</b>）；⑤ 任意节点到其所有叶子的路径含相同数量黑节点（<b>黑高一致</b>）。由 ④⑤ 推出：<b>最长路径 ≤ 2×最短路径</b>，树高 ≤ 2·log₂(n+1)，增删查 O(log n)。fixAfterInsertion 的三种情形（叔叔红→变色上推、叔叔黑且三角形→旋转成直线、叔叔黑且直线→换色+单旋）配合图理解最牢。' },
      { t: 'table', headers: ['能力', 'LinkedHashMap', 'TreeMap'], rows: [
        ['顺序语义', '插入序 / 访问序', 'key 自然序 / Comparator 定制序'],
        ['底层', 'HashMap + 双向链表', '红黑树'],
        ['get/put/containsKey', 'O(1)', 'O(log n)'],
        ['范围操作', '无', 'firstKey/lastKey/floorKey/ceilingKey/headMap/tailMap/subMap（全部 O(log n)）★'],
        ['典型场景', 'LRU 缓存、保序去重', '排行榜范围查询、时间轴区间检索、有序去重'],
      ] },
      { t: 'warn', html: '<b>高频坑：</b>TreeMap 判断「相同 key」只靠 compare/compareTo 返回 0——不调用 equals！自定义 Comparator 只比较了部分字段时，会误判相等导致元素被<b>覆盖丢失</b>；key 是可变对象且 put 后修改了参与比较的字段，也会「查无此 key」。' },
    ],
  },

  {
    id: 'top-coll-fw', icon: '🧩', tag: '集合源码', title: '集合框架全景与源码彩蛋：fail-fast vs fail-safe、Arrays.asList 四大坑、Collections 增强',
    desc: '把零散知识串成体系：Iterator 模式的骨架、modCount 彩蛋遍历、Arrays.asList 的定长陷阱、Collections.unmodifiable 的真面目、CopyOnWrite 原理。',
    blocks: [
      { t: 'h', html: '一、框架全景图（一张图记住继承树）' },
      { t: 'code', lang: 'text', title: '集合框架继承体系', code: '                 Iterable\n                    ↑ iterator()\n                Collection\n           ┌────────┴────────┐\n          List               Set                       Map（独立体系，不继承 Collection）\n    ┌─────┼─────┐      ┌────┼─────┐             ┌──────┼────────┐\n ArrayList  Vector  LinkedList  HashSet  SortedSet   HashMap   SortedMap\n              ↑          ↑        ↑   ↑        ↑          ↑\n          Stack    (Deque接口)  LinkedHashSet  TreeMap  LinkedHashMap\n                                    (TreeSet)\n\n线程安全家族：Vector/Hashtable(古董) → Collections.synchronizedXxx(全表锁)\n           → ConcurrentHashMap/CopyOnWriteArrayList/ConcurrentLinkedQueue(JUC 现代方案)' },

      { t: 'h', html: '二、fail-fast vs fail-safe：两种迭代器哲学' },
      { t: 'table', headers: ['类型', '机制', '代表', '代价'], rows: [
        ['fail-fast（快速失败）', '迭代时校验 modCount 快照，不一致立刻抛 ConcurrentModificationException', 'ArrayList/HashMap 等所有 java.util 集合', '不能并发改，但错误早暴露'],
        ['fail-safe（安全失败）', '在副本上遍历（快照），或无锁并发结构上遍历', 'CopyOnWriteArrayList（遍历旧数组）、ConcurrentHashMap（弱一致性迭代器）', '不保证读到最新数据；COW 复制内存开销大'],
      ] },
      { t: 'qa', q: 'modCount 不够严谨：单线程下 foreach 里 list.set(i, x) 会抛异常吗？', a: '不会。modCount 只统计<b>结构性修改</b>（size 变化的 add/remove），set 是「替换不换长」，不动 modCount。这个细节能反推出源码设计意图：fail-fast 只针对「遍历过程中结构变动导致迭代器下标失效」的风险，替换值是安全的。' },

      { t: 'h', html: '三、Arrays.asList 四大坑（生产事故高发区）' },
      { t: 'code', lang: 'java', title: '坑位演示', code: '// 坑1：定长——add/remove 直接 UnsupportedOperationException\nList<String> list = Arrays.asList("a", "b");\n// list.add("c");   // 💥 UOE：底层是 Arrays 的内部 ArrayList（≠java.util.ArrayList）！\n\n// 坑2：改动会穿透——set 会写回原数组\nString[] arr = {"a", "b"};\nList<String> l = Arrays.asList(arr);\nl.set(0, "X");            // arr[0] 也变成 "X"\n\n// 坑3：基本类型数组被当成一个元素\nint[] nums = {1, 2, 3};\nList<int[]> wrong = Arrays.asList(nums);   // size()==1 ！泛型不能是 int\nList<Integer> ok = Arrays.stream(nums).boxed().collect(Collectors.toList());\n\n// 坑4：null 元素行为不明 / 与 toList() 的差异\n// 正确姿势（JDK8+ 需要可变 List）：\nList<String> good = new ArrayList<>(Arrays.asList("a", "b"));\n// JDK9+：List.of("a","b")  → 不可变（add 抛 UOE，且禁止 null）' },

      { t: 'h', html: '四、Collections 工具类与 CopyOnWrite 原理' },
      { t: 'qa', q: 'Collections.synchronizedList 和 CopyOnWriteArrayList 怎么选？', a: '① <b>synchronizedList</b>：所有方法套 synchronized(this) 全表锁——读写全互斥，读多场景吞吐差；迭代时仍需手动加锁否则 fail-fast。② <b>CopyOnWriteArrayList</b>：写时复制整个新数组 + volatile 替换引用 + Lock 控制写写互斥——读完全无锁（读的是当前引用指向的数组），<b>读多写极少</b>（白名单、监听器列表）性能碾压；但写 O(n) 复制、内存翻倍、读到的可能是旧快照（弱一致）。③ 写多读少或读写均衡 → synchronizedList 也不行，应该考虑分段/无锁结构或换业务方案。一句话：<b>读多写少 COW，其余场景都别用「伪安全集合」硬扛</b>。' },
      { t: 'list', items: [
        'Iterator 是迭代器模式的 JDK 实现；Iterable 是「可被 for-each」的标记能力',
        'fail-fast 靠 modCount；COW/CHM 迭代器是弱一致（fail-safe）',
        'Arrays.asList：定长、穿透修改、基本类型数组灾难；可变 List 用 new ArrayList&lt;&gt;() 包装',
        'Collections.emptyList()/singletonList()：零开销不可变工具，返回类型注意别再 add',
        'HashSet→LinkedHashMap、TreeSet→TreeMap、LinkedHashSet→LinkedHashMap：Set 家族全是 Map 的马甲',
      ] },
    ],
  },
];
