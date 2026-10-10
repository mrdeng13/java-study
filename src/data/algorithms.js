// 力扣风格算法题库：10 道精选题（从易到难，覆盖高频题型）

export const algorithmProblems = [
  {
    id: 'algo1',
    difficulty: 'easy',
    difficultyLabel: '简单',
    tag: '数组 · 哈希表',
    leetcodeTag: 'LeetCode 1（变体）：两数之和',
    title: '两数之和',
    description: '给定一个整数数组 nums 和一个目标值 target，请找出数组中<b>和为目标值</b>的两个整数的下标。假设每组输入恰好有一个解，同一个元素不能使用两次。可以按任意顺序返回答案。',
    examples: [
      '输入：nums = [2, 7, 11, 15]，target = 9 → 输出：[0, 1]（因为 2 + 7 = 9）',
      '输入：nums = [3, 2, 4]，target = 6 → 输出：[1, 2]',
      '输入：nums = [3, 3]，target = 6 → 输出：[0, 1]',
    ],
    hints: [
      '暴力法：两层循环，枚举所有数对，时间复杂度 O(n²)——能做对，但面试不加分。',
      '优化：遍历数组时，对每个数字 x，我需要找的目标其实是 target - x。',
      '用 HashMap 记录"数字 → 下标"，每到一个新数字先查"它的搭档是否出现过"——一次遍历搞定。',
    ],
    solution: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // map: 数值 -> 下标
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];        // 我需要的搭档
            if (map.containsKey(need)) {
                return new int[]{map.get(need), i};
            }
            map.put(nums[i], i);                // 记录自己，供后面的数字查询
        }
        return new int[]{-1, -1};               // 题目保证有解，走不到这
    }
}`,
    complexity: '时间复杂度 O(n)：一次遍历；空间复杂度 O(n)：哈希表最多存 n 个元素。',
    keyPoint: '哈希表用"空间换时间"，把"查找搭档"从 O(n) 降到 O(1)。这是最经典的哈希表应用，务必默写。',
  },
  {
    id: 'algo2',
    difficulty: 'easy',
    difficultyLabel: '简单',
    tag: '链表',
    leetcodeTag: 'LeetCode 206：反转链表',
    title: '反转单向链表',
    description: '给你单链表的头节点 head，请你反转链表，并返回反转后的链表头节点。',
    examples: [
      '输入：1 → 2 → 3 → 4 → 5 → 输出：5 → 4 → 3 → 2 → 1',
      '输入：[] → 输出：[]',
    ],
    hints: [
      '画图！画三个指针 prev、curr、next，一步步模拟指针转向。',
      '核心动作只有一步：把 curr.next 指向 prev（原来它指向下一个节点）。',
      '注意顺序：先把 next 存下来，再转向，否则链表就"断"了。',
    ],
    solution: `// 链表节点定义
// public class ListNode {
//     int val;
//     ListNode next;
//     ListNode(int val) { this.val = val; }
// }

class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;           // 已反转部分的头
        ListNode curr = head;           // 当前处理的节点
        while (curr != null) {
            ListNode next = curr.next;  // 1. 先存后继，防止断链
            curr.next = prev;           // 2. 指针反转：指向前一个
            prev = curr;                // 3. prev 前进
            curr = next;                // 4. curr 前进
        }
        return prev;                    // 循环结束时 curr 是 null，prev 就是新头
    }
}`,
    complexity: '时间复杂度 O(n)：每个节点处理一次；空间复杂度 O(1)：只用三个指针。',
    keyPoint: '迭代版三指针是标配答案。进阶：递归写法 reverse(head.next) 也要会，面试官常追问"还能怎么写"。',
  },
  {
    id: 'algo3',
    difficulty: 'easy',
    difficultyLabel: '简单',
    tag: '栈',
    leetcodeTag: 'LeetCode 20：有效的括号',
    title: '有效的括号',
    description: '给定一个只包括 \'(\'，\')\'，\'{\'，\'}\'，\'[\'，\']\' 的字符串 s，判断字符串是否有效。有效需满足：左括号必须用相同类型的右括号闭合，且必须以正确的顺序闭合。',
    examples: [
      '输入：s = "()" → 输出：true',
      '输入：s = "()[]{}" → 输出：true',
      '输入：s = "(]" → 输出：false',
      '输入：s = "([)]" → 输出：false（交叉嵌套不合法）',
      '输入：s = "{[]}" → 输出：true',
    ],
    hints: [
      '括号匹配是"后进先出"——最后打开的括号必须最先关闭。这指向什么数据结构？',
      '遇到左括号就压栈；遇到右括号时，栈顶必须是它的配对左括号。',
      '字符串结束栈必须为空；右括号到来时栈为空或不匹配 → 无效。',
    ],
    solution: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();   // 推荐用 ArrayDeque 而非 Stack
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');       // 小技巧：压入"期待的右括号"
            else if (c == '[') stack.push(']');
            else if (c == '{') stack.push('}');
            else {
                // 右括号：栈空 或 栈顶不等于自己 → 无效
                if (stack.isEmpty() || stack.pop() != c) return false;
            }
        }
        return stack.isEmpty();   // "(((" 这种情况最后栈非空 → false
    }
}`,
    complexity: '时间复杂度 O(n)：遍历一次；空间复杂度 O(n)：最坏全是左括号全入栈。',
    keyPoint: '压入"期待的右括号"这个技巧让匹配逻辑从 6 分支减到 1 分支。栈的应用场景：括号匹配、浏览器前进后退、函数调用栈。',
  },
  {
    id: 'algo4',
    difficulty: 'easy',
    difficultyLabel: '简单',
    tag: '双指针',
    leetcodeTag: 'LeetCode 283：移动零',
    title: '移动零',
    description: '给定一个数组 nums，编写一个函数将所有 0 移动到数组末尾，同时保持非零元素的相对顺序。要求：<b>必须在不复制数组的情况下原地操作</b>。',
    examples: [
      '输入：nums = [0, 1, 0, 3, 12] → 输出：[1, 3, 12, 0, 0]',
      '输入：nums = [0] → 输出：[0]',
    ],
    hints: [
      '快慢双指针：slow 指向"下一个非零元素应该放的位置"，fast 负责扫描。',
      'fast 遇到非零元素就和 slow 交换，然后 slow++。',
      '数组被分成三段：[已处理非零区][零区][未处理区]。',
    ],
    solution: `class Solution {
    public void moveZeroes(int[] nums) {
        int slow = 0;                       // 下一个非零元素的目标位置
        for (int fast = 0; fast < nums.length; fast++) {
            if (nums[fast] != 0) {
                // 交换，把非零元素换到前面
                int tmp = nums[slow];
                nums[slow] = nums[fast];
                nums[fast] = tmp;
                slow++;
            }
        }
    }
}
// 变体：如果要求保持"覆盖法"也可以——先整体前移非零元素，再把尾部补 0`,
    complexity: '时间复杂度 O(n)：一次遍历；空间复杂度 O(1)：原交换地操作。',
    keyPoint: '快慢双指针模板题。同款套路：「移除元素」「删除有序数组重复项」「数组的第 N 个交换」——一次学会四道题。',
  },
  {
    id: 'algo5',
    difficulty: 'medium',
    difficultyLabel: '中等',
    tag: '链表 · 数学',
    leetcodeTag: 'LeetCode 2：两数相加',
    title: '两数相加',
    description: '给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照<b>逆序</b>方式存储的，并且每个节点只能存储一位数字。请你将两个数相加，并以相同形式返回一个表示和的链表。',
    examples: [
      '输入：l1 = [2, 4, 3]，l2 = [5, 6, 4]（表示 342 + 465）→ 输出：[7, 0, 8]（表示 807）',
      '输入：l1 = [0]，l2 = [0] → 输出：[0]',
      '输入：l1 = [9, 9, 9, 9, 9, 9, 9]，l2 = [9, 9, 9, 9] → 输出：[8, 9, 9, 9, 0, 0, 0, 1]',
    ],
    hints: [
      '逆序存储是天大的好事：个位在头节点，正好模拟我们小学列竖式从个位加起。',
      '每一位的和 = val1 + val2 + carry（进位），新节点值 = sum % 10，新进位 = sum / 10。',
      '两个链表可能不一样长：短的当 0 处理；循环结束后 carry > 0 还要补一个节点（别忘了这个 case！）。',
    ],
    solution: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);   // 哑节点：免去"头节点特殊处理"
        ListNode curr = dummy;
        int carry = 0;                      // 进位

        while (l1 != null || l2 != null || carry != 0) {  // carry 也要进循环！
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }

            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
        }
        return dummy.next;
    }
}`,
    complexity: '时间复杂度 O(max(m, n))：按更长的链表算；空间复杂度 O(1)（不含返回的新链表）。',
    keyPoint: '哑节点（dummy node）技巧：新建一个假头，返回 dummy.next，避免"新链表第一个节点"的 if 特判。几乎每道链表构造题都用它。',
  },
  {
    id: 'algo6',
    difficulty: 'medium',
    difficultyLabel: '中等',
    tag: '字符串 · 滑动窗口',
    leetcodeTag: 'LeetCode 3：无重复字符的最长子串',
    title: '无重复字符的最长子串',
    description: '给定一个字符串 s，请你找出其中不含有重复字符的<b>最长子串</b>的长度。（子串必须连续）',
    examples: [
      '输入：s = "abcabcbb" → 输出：3（最长子串是 "abc"）',
      '输入：s = "bbbbb" → 输出：1（最长子串是 "b"）',
      '输入：s = "pwwkew" → 输出：3（最长子串是 "wke"，注意答案必须是子串不是子序列）',
    ],
    hints: [
      '暴力：检查所有子串是否含重复字符，O(n³)，必超时。',
      '观察：窗口 [left, right] 无重复时，right 可以右扩；一旦出现重复，left 应该右移到重复字符消失。',
      '用 HashSet（或数组）记录窗口内的字符。right 每前进一格：若 s[right] 已存在，则不断右移 left 并移除 s[left]，直到不重复。',
    ],
    solution: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> window = new HashSet<>();
        int left = 0, maxLen = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            // 有重复 → 收缩左边界，直到把重复的那个字符挤出去
            while (window.contains(c)) {
                window.remove(s.charAt(left));
                left++;
            }
            window.add(c);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
    complexity: '时间复杂度 O(n)：left 和 right 各最多走 n 步；空间复杂度 O(min(n, 字符集大小))。',
    keyPoint: '滑动窗口万能模板：右指针扩张找可行解，左指针收缩优化解。"最小覆盖子串""长度最小的子数组"全是这个模板。',
  },
  {
    id: 'algo7',
    difficulty: 'medium',
    difficultyLabel: '中等',
    tag: '二叉树 · 递归',
    leetcodeTag: 'LeetCode 102：二叉树的层序遍历',
    title: '二叉树的层序遍历',
    description: '给你二叉树的根节点 root，返回其节点值的<b>层序遍历</b>（即逐层地，从左到右访问所有节点），结果按层分组。',
    examples: [
      '输入：root = [3, 9, 20, null, null, 15, 7] → 输出：[[3], [9, 20], [15, 7]]',
      '输入：root = [] → 输出：[]',
    ],
    hints: [
      '层序 = 广度优先（BFS），标配工具是队列（Queue）。',
      '关键：队列里怎么区分"哪一层的节点"？——每轮循环前记录当前队列大小 size，它恰好就是这一层的节点数。',
      '处理完 size 个节点，这一层结束，把收集的结果加入总列表。',
    ],
    solution: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int size = queue.size();            // 当前层的节点数
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {    // 只处理这一层
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null)  queue.offer(node.left);   // 下一层进队
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}`,
    complexity: '时间复杂度 O(n)：每个节点进出队各一次；空间复杂度 O(n)：队列最坏存一层（约 n/2 个节点）。',
    keyPoint: 'BFS 用队列 + 按层 size 分组是固定套路。变体：锯齿形遍历（偶数层反转）、右视图（每层最后一个）、最大深度（统计层数）——全是本题换皮。',
  },
  {
    id: 'algo8',
    difficulty: 'medium',
    difficultyLabel: '中等',
    tag: '动态规划',
    leetcodeTag: 'LeetCode 70：爬楼梯',
    title: '爬楼梯（斐波那契）',
    description: '你正在爬楼梯，需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶？',
    examples: [
      '输入：n = 2 → 输出：2（1+1 或 2）',
      '输入：n = 3 → 输出：3（1+1+1 / 1+2 / 2+1）',
    ],
    hints: [
      '想"最后一步"：到第 n 阶的前一步，要么从 n-1 阶爬 1 步，要么从 n-2 阶爬 2 步。',
      '所以 f(n) = f(n-1) + f(n-2) —— 这就是动态规划的状态转移方程！',
      '只依赖前两项：用两个变量滚动即可，不用数组，空间 O(1)。',
    ],
    solution: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;      // f(1)=1, f(2)=2
        for (int i = 3; i <= n; i++) {
            int cur = prev1 + prev2;    // f(i) = f(i-1) + f(i-2)
            prev2 = prev1;              // 滚动前进
            prev1 = cur;
        }
        return prev1;
    }
}
// 递归 + 无记忆化 = O(2^n) 超时；加 memo 数组 = O(n)；本解法最简 O(1) 空间`,
    complexity: '时间复杂度 O(n)；空间复杂度 O(1)。',
    keyPoint: '动态规划四步法：① 定义状态 f(i)；② 找转移方程；③ 初始化边界；④ 确定遍历顺序。爬楼梯是 DP 入门第一题，把它讲明白，就能handle"打家劫舍""最小花费爬楼梯"。',
  },
  {
    id: 'algo9',
    difficulty: 'medium',
    difficultyLabel: '中等',
    tag: '数组 · 排序',
    leetcodeTag: 'LeetCode 56：合并区间',
    title: '合并区间',
    description: '以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi]。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。',
    examples: [
      '输入：intervals = [[1, 3], [2, 6], [8, 10], [15, 18]] → 输出：[[1, 6], [8, 10], [15, 18]]（[1,3] 和 [2,6] 重叠，合并为 [1,6]）',
      '输入：intervals = [[1, 4], [4, 5]] → 输出：[[1, 5]]（端点相接也算重叠）',
    ],
    hints: [
      '无序区间没法判断——第一步：按区间左端点排序。',
      '排序后，重叠只可能发生在"相邻"区间：当前区间的 start ≤ 上一区间的 end。',
      '维护结果集最后一个元素：重叠就更新它的 end 为两者较大值；不重叠就把当前区间加进去。',
    ],
    solution: `class Solution {
    public int[][] merge(int[][] intervals) {
        // 1. 按左端点排序
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        for (int[] cur : intervals) {
            // 结果为空 或 当前区间与最后一个不重叠 → 直接入列
            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < cur[0]) {
                merged.add(cur);
            } else {
                // 重叠 → 扩展最后一个区间的右端点
                int[] last = merged.get(merged.size() - 1);
                last[1] = Math.max(last[1], cur[1]);
            }
        }
        return merged.toArray(new int[0][]);
    }
}`,
    complexity: '时间复杂度 O(n log n)：排序主导；空间复杂度 O(log n)（排序栈）+ O(n)（结果集）。',
    keyPoint: '"先排序，再线性扫描"是区间类问题的万能起手式。同款：插入区间、会议室（判断能否全部安排）。',
  },
  {
    id: 'algo10',
    difficulty: 'hard',
    difficultyLabel: '困难',
    tag: '链表 · 分治',
    leetcodeTag: 'LeetCode 25：K 个一组翻转链表',
    title: 'K 个一组翻转链表',
    description: '给你链表的头节点 head，每 k 个节点一组进行翻转，请你返回修改后的链表。节点总数不是 k 的整数倍时，最后剩余的节点保持原有顺序。要求：<b>只能使用常数级的额外空间</b>，不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。',
    examples: [
      '输入：head = [1, 2, 3, 4, 5]，k = 2 → 输出：[2, 1, 4, 3, 5]',
      '输入：head = [1, 2, 3, 4, 5]，k = 3 → 输出：[3, 2, 1, 4, 5]',
    ],
    hints: [
      '大问题拆小：每组的翻转 = 你已经会的"反转链表"（本题库第 2 题）。',
      '每轮先"探路"：从当前组头走 k-1 步，如果不足 k 个就不翻转，直接结束。',
      '用哑节点连住总头部；每组记录 prevGroupEnd（上一组尾）和 groupEnd（本组尾，翻转后成为新头），翻转后重新接缝。',
    ],
    solution: `class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head);
        ListNode prevGroupEnd = dummy;

        while (true) {
            // 1. 探路：找到本组的最后一个节点
            ListNode groupEnd = prevGroupEnd;
            for (int i = 0; i < k && groupEnd != null; i++) {
                groupEnd = groupEnd.next;
            }
            if (groupEnd == null) break;   // 不足 k 个，不翻转，结束

            // 2. 记录断点
            ListNode groupStart = prevGroupEnd.next;
            ListNode nextGroupStart = groupEnd.next;

            // 3. 断开本组，单独翻转
            groupEnd.next = null;
            prevGroupEnd.next = reverse(groupStart);   // 复用第 2 题的函数！
            groupStart.next = nextGroupStart;           // 原头变尾，接回后面

            // 4. 移动到下一组
            prevGroupEnd = groupStart;
        }
        return dummy.next;
    }

    private ListNode reverse(ListNode head) {         // 就是第 2 题
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
    complexity: '时间复杂度 O(n)：每个节点被探路和翻转各访问常数次；空间复杂度 O(1)：只用了几个指针。',
    keyPoint: '困难题的秘诀是"分解成你会的子问题"：探路 + 复用反转 + 重新接缝。这也是真实工程里处理复杂问题的方法论——面试中能清晰说出分解思路，比背答案更加分。',
  },

  /* ==================== 扩充 20 题（11~30）：二叉树/双指针/二分/DP/单调栈/回溯/堆 ==================== */

  {
    id: 'algo11', difficulty: 'easy', difficultyLabel: '简单', tag: '二叉树 · 递归',
    leetcodeTag: 'LeetCode 104：二叉树的最大深度', title: '二叉树的最大深度',
    description: '给定一棵二叉树的根节点 root，返回它的<b>最大深度</b>——即从根节点到最远叶子节点的最长路径上的<b>节点数</b>。',
    examples: [
      '输入：root = [3,9,20,null,null,15,7] → 输出：3',
      '输入：root = [1,null,2] → 输出：2',
      '输入：root = [] → 输出：0',
    ],
    hints: [
      '递归思维：整棵树的最大深度 = max(左子树深度, 右子树深度) + 1。',
      '递归出口：空节点深度为 0。',
      '这是"后序遍历"思想：先算左右孩子的答案，再汇总自己。',
    ],
    solution: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;          // 递归出口：空树深度 0
        int left = maxDepth(root.left);      // 左子树最深能到几层
        int right = maxDepth(root.right);    // 右子树最深能到几层
        return Math.max(left, right) + 1;    // 自己这一层 +1
    }
}`,
    complexity: '时间 O(n)：每个节点访问一次；空间 O(h)：递归栈深 = 树高，最坏 O(n)（链状树），平衡树 O(log n)。',
    keyPoint: '二叉树递归三步曲：①明确函数定义（"算出以 root 为根的最大深度"）②相信递归返回值是对的 ③只处理当前层逻辑（max+1）。90% 的树题都套这个框架。',
  },
  {
    id: 'algo12', difficulty: 'easy', difficultyLabel: '简单', tag: '二叉树 · 层序遍历',
    leetcodeTag: 'LeetCode 637：层序平均值', title: '二叉树的层序平均值',
    description: '给定非空二叉树，返回<b>每一层节点值的平均值</b>组成的数组。BFS 分层是必会基本功。',
    examples: [
      '输入：root = [3,9,20,15,7] → 输出：[3.0, 14.5, 11.0]（第一层 [3]，第二层 [9,20] 平均 14.5，第三层 [15,7] 平均 11）',
    ],
    hints: [
      '队列 + size 技巧：每轮循环开始时记录当前队列大小 = 本层节点数。',
      '内层循环只处理 size 个节点——出队的同时把它们的孩子入队（属于下一层）。',
      '每层累加求和除以 size，就是本层平均。',
    ],
    solution: `class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> res = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();          // 关键：锁定本层节点数
            double sum = 0;
            for (int i = 0; i < size; i++) {  // 只处理本层
                TreeNode node = queue.poll();
                sum += node.val;
                if (node.left != null)  queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            res.add(sum / size);              // 本层平均
        }
        return res;
    }
}`,
    complexity: '时间 O(n)、空间 O(w)（w 为最大层宽，最坏 O(n)）。',
    keyPoint: '"size 快照"是所有"按层处理"题目的万能钥匙：右视图、之字形遍历、每层最大值，全是同一个套路换汤不换药。',
  },
  {
    id: 'algo13', difficulty: 'easy', difficultyLabel: '简单', tag: '双指针',
    leetcodeTag: 'LeetCode 283：移动零', title: '移动零',
    description: '给定数组 nums，将所有 0 移动到末尾，同时<b>保持非零元素的相对顺序</b>。要求：必须原地操作，不能复制数组，尽量减少操作次数。',
    examples: [
      '输入：[0,1,0,3,12] → 输出：[1,3,12,0,0]',
      '输入：[0] → 输出：[0]',
    ],
    hints: [
      '快慢双指针：slow 指向"下一个非零元素应该放的位置"。',
      'fast 扫全数组，遇到非零就往 slow 位置放，slow++。',
      'fast 扫完后，slow 之后的格子全部填 0。',
    ],
    solution: `class Solution {
    public void moveZeroes(int[] nums) {
        int slow = 0;
        for (int fast = 0; fast < nums.length; fast++) {
            if (nums[fast] != 0) {
                nums[slow++] = nums[fast];   // 非零元素前移
            }
        }
        while (slow < nums.length) {
            nums[slow++] = 0;                // 尾部补零
        }
    }
}`,
    complexity: '时间 O(n) 一趟；空间 O(1)。',
    keyPoint: '快慢指针的本质："slow 左边永远是处理好的区域"。同类题：删除有序数组重复项、移除元素。',
  },
  {
    id: 'algo14', difficulty: 'easy', difficultyLabel: '简单', tag: '栈 · 设计',
    leetcodeTag: 'LeetCode 155：最小栈', title: '最小栈',
    description: '设计一个支持 push、pop、top 操作，并能在<b>常数时间 O(1)</b> 内检索到最小元素的栈。实现 MinStack 类：push(x)、pop()、top()、getMin()。',
    examples: [
      '依次 push(-2), push(0), push(-3) → getMin() = -3；pop() → top() = 0；getMin() = -2',
    ],
    hints: [
      '难点：pop 之后最小值可能变。单个变量存 min 会"回不去"。',
      '用辅助栈：与主栈同步出入，辅助栈栈顶永远是"当前状态下的最小值"。',
      'push 时，新元素和辅助栈顶比，较小的入辅助栈。',
    ],
    solution: `class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> minStack = new ArrayDeque<>();  // 每一时刻的最小值

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        } else {
            minStack.push(minStack.peek());   // 重复压入当前最小，保持同步
        }
    }
    public void pop() { stack.pop(); minStack.pop(); }
    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}`,
    complexity: '每个操作都是 O(1)；空间 O(n)（辅助栈）。',
    keyPoint: '"空间换时间"的经典范式。进阶优化：辅助栈只在"新值 ≤ 当前最小"时才压入（pop 时相等才弹出），省重复空间——面试被追问空间优化时这样答。',
  },
  {
    id: 'algo15', difficulty: 'medium', difficultyLabel: '中等', tag: '数组 · 区间',
    leetcodeTag: 'LeetCode 56：合并区间', title: '合并区间',
    description: '给定区间数组 intervals，其中 intervals[i] = [start, end]，合并所有重叠的区间，返回不重叠的区间数组。',
    examples: [
      '输入：[[1,3],[2,6],[8,10],[15,18]] → 输出：[[1,6],[8,10],[15,18]]（[1,3] 和 [2,6] 重叠合并）',
      '输入：[[1,4],[4,5]] → 输出：[[1,5]]（端点相接也算重叠）',
    ],
    hints: [
      '先按区间起点排序——重叠只可能发生在排序后的相邻区间。',
      '维护结果集最后一个区间：新区间起点 ≤ 它的终点就重叠。',
      '重叠时终点 = max(旧终点, 新终点)（注意 [1,8] 和 [2,3] 的包含情况）。',
    ],
    solution: `class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));  // 按起点排序
        List<int[]> merged = new ArrayList<>();
        for (int[] cur : intervals) {
            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < cur[0]) {
                merged.add(cur);                        // 不重叠，新区间
            } else {
                int[] last = merged.get(merged.size() - 1);
                last[1] = Math.max(last[1], cur[1]);    // 重叠，扩展右端
            }
        }
        return merged.toArray(new int[0][]);
    }
}`,
    complexity: '时间 O(n log n)（排序主导）；空间 O(log n)~O(n)。',
    keyPoint: '"先排序再线性扫"是区间类问题总纲（会议室、插入区间同理）。注意边界：起点相等、包含关系、端点相接——测试用例必须覆盖。',
  },
  {
    id: 'algo16', difficulty: 'medium', difficultyLabel: '中等', tag: '二分查找',
    leetcodeTag: 'LeetCode 33：搜索旋转排序数组', title: '搜索旋转排序数组',
    description: '升序数组在某个点被旋转了，如 [0,1,2,4,5,6,7] → [4,5,6,7,0,1,2]。给你旋转后的数组和 target，若存在返回下标，否则 -1。要求 <b>O(log n)</b>。',
    examples: [
      '输入：nums = [4,5,6,7,0,1,2], target = 0 → 输出：4',
      '输入：nums = [4,5,6,7,0,1,2], target = 3 → 输出：-1',
      '输入：nums = [1], target = 0 → 输出：-1',
    ],
    hints: [
      '旋转后数组有一个性质：从中点切开，<b>必有一半是有序的</b>。',
      '先判断哪半有序（nums[left] ≤ nums[mid] 则左半有序），再看 target 在不在有序的那半里。',
      '在有序半边 → 标准二分；不在 → 去另一半。递归/迭代均可。',
    ],
    solution: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {           // 左半 [left..mid] 有序
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;                 // target 在有序左半
                } else {
                    left = mid + 1;
                }
            } else {                                  // 右半 [mid..right] 有序
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;                  // target 在有序右半
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }
}`,
    complexity: '时间 O(log n)：每轮排除一半；空间 O(1)。',
    keyPoint: '二分的高阶玩法："二分答案所在的分段"而不是"二分有序数组"。判断条件里的 <= 位置（nums[left] <= nums[mid]）是易错点，用 [3,1] target=1 手推一遍验证。',
  },
  {
    id: 'algo17', difficulty: 'medium', difficultyLabel: '中等', tag: '二叉树 · BFS 变形',
    leetcodeTag: 'LeetCode 199：二叉树的右视图', title: '二叉树的右视图',
    description: '站在树的右侧，从上到下返回能看到的节点值（即每层最右边的节点）。',
    examples: [
      '输入：root = [1,2,3,null,5,null,4] → 输出：[1,3,4]',
      '输入：root = [1,null,3] → 输出：[1,3]',
    ],
    hints: [
      '层序遍历（第 12 题 size 技巧）基础上改一行：每层循环里最后一个出队的节点就是"最右"。',
      '也可以 DFS 根-右-左遍历：每层第一次到达的节点记录。',
    ],
    solution: `class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (i == size - 1) res.add(node.val);   // 本层最后一个 = 最右
                if (node.left != null)  queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }
        return res;
    }
}`,
    complexity: '时间 O(n)；空间 O(w)。',
    keyPoint: '和第 12 题对比着记：同一个 BFS 骨架，"i == size-1 取最右 / i == 0 取最左 / 内层 max 取每层最大"——一层骨架吃掉一类题。',
  },
  {
    id: 'algo18', difficulty: 'medium', difficultyLabel: '中等', tag: '链表 · 双指针',
    leetcodeTag: 'LeetCode 142：环形链表 II', title: '环形链表入口',
    description: '给定链表头结点，判断是否有环；<b>如果有环，返回入环的第一个节点</b>；无环返回 null。要求 O(1) 空间。',
    examples: [
      '输入：head = [3,2,0,-4]，尾部节点连回下标 1 的节点 → 输出：下标 1 的节点',
      '输入：head = [1,2]，尾部连回下标 0 → 输出：下标 0 的节点',
      '输入：head = [1]（无环）→ 输出：null',
    ],
    hints: [
      '快慢指针判环：slow 走 1 步、fast 走 2 步，相遇则有环。',
      '数学推导：head 到入口距离 a，入口到相遇点 b，环剩余 c。相遇时 slow 走 a+b，fast 走 a+b+n(b+c)。因 fast 是 2 倍速：a+b+n(b+c) = 2(a+b) → a = c + (n-1)(b+c)。',
      '结论：相遇后，一个指针从头出发，另一个从相遇点出发，同速前进，再次相遇点 = 入口。',
    ],
    solution: `public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {              // 相遇：有环
                ListNode p = head;
                while (p != slow) {          // 双指针同速前进
                    p = p.next;
                    slow = slow.next;
                }
                return p;                    // 再次相遇 = 入口
            }
        }
        return null;
    }
}`,
    complexity: '时间 O(n)；空间 O(1)——哈希表法（存走过的节点）虽然直观但要 O(n) 空间，面试官常要求 O(1)。',
    keyPoint: '第二段的数学推导（a = c + (n-1)(b+c)）建议面试时主动写在纸上——把"背结论"升级成"推结论"，直接区分度拉满。',
  },
  {
    id: 'algo19', difficulty: 'medium', difficultyLabel: '中等', tag: '动态规划',
    leetcodeTag: 'LeetCode 53：最大子数组和', title: '最大子数组和',
    description: '给定整数数组，找出<b>和最大的连续子数组</b>（至少一个元素），返回其最大和。',
    examples: [
      '输入：[-2,1,-3,4,-1,2,1,-5,4] → 输出：6（子数组 [4,-1,2,1]）',
      '输入：[5,4,-1,7,8] → 输出：23（整个数组）',
      '输入：[-1] → 输出：-1',
    ],
    hints: [
      'DP 定义：dp[i] = 以 nums[i] 结尾的最大子数组和。',
      '转移：dp[i] = max(nums[i], dp[i-1] + nums[i])——要么接上前面的，要么另起炉灶。',
      '"以 i 结尾"是关键设定，保证连续性；答案 = 所有 dp[i] 的最大值。',
    ],
    solution: `class Solution {
    public int maxSubArray(int[] nums) {
        int cur = nums[0], best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            cur = Math.max(nums[i], cur + nums[i]);  // 接上 or 另起
            best = Math.max(best, cur);              // 全局最优
        }
        return best;
    }
}`,
    complexity: '时间 O(n)；空间 O(1)（滚动变量）。',
    keyPoint: 'DP 定义里"以 i 结尾/以 i 为终"是常见技巧（最长上升子序列同理）。这题还有分治解法（线段树思想，维护四个量）O(n log n)，面试提一嘴即可。',
  },
  {
    id: 'algo20', difficulty: 'medium', difficultyLabel: '中等', tag: '动态规划',
    leetcodeTag: 'LeetCode 198：打家劫舍', title: '打家劫舍',
    description: '一排房屋，每个房子有一定现金。相邻两间不能同时偷（触发警报）。求能偷到的<b>最高金额</b>。',
    examples: [
      '输入：[1,2,3,1] → 输出：4（偷 1 号和 3 号：1+3）',
      '输入：[2,7,9,3,1] → 输出：12（偷 0、2、4 号）',
    ],
    hints: [
      '对每间房只有两种决策：偷 or 不偷。',
      'dp[i] = 考虑前 i 间房的最大收益。偷第 i 间 → dp[i-2]+nums[i]；不偷 → dp[i-1]。',
      'dp[i] = max(dp[i-1], dp[i-2] + nums[i])。',
    ],
    solution: `class Solution {
    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;        // dp[i-2], dp[i-1]
        for (int x : nums) {
            int cur = Math.max(prev1, prev2 + x);  // 不偷 vs 偷
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
    complexity: '时间 O(n)；空间 O(1)。',
    keyPoint: '"选与不选"型 DP 模板题。进阶：打家劫舍 II（首尾相邻）→ 环形问题拆成两个线性问题（不偷第一间/不偷最后一间）取大。',
  },
  {
    id: 'algo21', difficulty: 'medium', difficultyLabel: '中等', tag: '双指针 · 贪心',
    leetcodeTag: 'LeetCode 11：盛最多水的容器', title: '盛最多水的容器',
    description: '给定 n 个非负整数表示每条垂线的高度，找两条线使它们与 x 轴构成的容器<b>装水最多</b>。面积 = min(高度) × 宽度。',
    examples: [
      '输入：[1,8,6,2,5,4,8,3,7] → 输出：49（取下标 1 和 8：min(8,7)×7=49）',
      '输入：[1,1] → 输出：1',
    ],
    hints: [
      '暴力 O(n²) 枚举所有线对会超时。',
      '双指针从两端开始，面积 = min(h[l], h[r]) × (r-l)。',
      '移动哪边？移动<b>矮的那边</b>——宽度已经在缩小，只有换掉矮边才可能让 min 变大。',
    ],
    solution: `class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, best = 0;
        while (l < r) {
            int area = Math.min(height[l], height[r]) * (r - l);
            best = Math.max(best, area);
            if (height[l] < height[r]) l++;   // 矮的往里挪
            else r--;
        }
        return best;
    }
}`,
    complexity: '时间 O(n)；空间 O(1)。',
    keyPoint: '贪心正确性论证是本题灵魂：移动矮边后，"矮边与更远边"的组合只会更差，所以丢弃矮边是安全的。面试能说出这句，比代码本身值钱。',
  },
  {
    id: 'algo22', difficulty: 'medium', difficultyLabel: '中等', tag: '二叉树 · LCA',
    leetcodeTag: 'LeetCode 236：二叉树的最近公共祖先', title: '最近公共祖先（LCA）',
    description: '给定二叉树和树中两个节点 p、q，找它们的<b>最近公共祖先</b>（既是 p/q 的祖先，且深度最大；节点可以是自身的祖先）。',
    examples: [
      '输入：root=[3,5,1,6,2,0,8,null,null,7,4], p=5, q=1 → 输出：3',
      '输入：同上, p=5, q=4 → 输出：5（祖先可以是自身）',
    ],
    hints: [
      '递归定义：lowestCommon(root, p, q) 返回 p 或 q 或公共祖先。',
      '递归左右子树：左子树找到 p/q，右子树也找到 p/q → root 就是答案。',
      '一边找到、另一边没找到 → 答案就是找到的那一边（p、q 在同一侧）。',
    ],
    solution: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;  // 命中/到底
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;  // 分居两侧 → 我是LCA
        return left != null ? left : right;              // 同侧，向上传递
    }
}`,
    complexity: '时间 O(n)；空间 O(h) 递归栈。',
    keyPoint: '把"找什么"写进递归函数的定义里，代码自然浮现。BST 的 LCA 有简化版：第一个值夹在 p、q 之间的节点就是（利用有序性，不用遍历全树）。',
  },
  {
    id: 'algo23', difficulty: 'medium', difficultyLabel: '中等', tag: '数组 · 抽象转化',
    leetcodeTag: 'LeetCode 287：寻找重复数', title: '寻找重复数（弗洛伊德判圈）',
    description: 'n+1 个整数都在 [1, n] 范围内，<b>至少存在一个重复数</b>。找出它。要求：不改数组、O(1) 空间。',
    examples: [
      '输入：[1,3,4,2,2] → 输出：2',
      '输入：[3,1,3,4,2] → 输出：3',
    ],
    hints: [
      '神来之笔：把数组看做链表——下标 i 指向 nums[i]，因为值域和下标域重合且有重复值，一定成环。',
      '重复数 = 环的入口！直接套第 18 题快慢指针。',
      '快指针 = nums[nums[fast]]（跳两步），慢指针 = nums[slow]（跳一步）。',
    ],
    solution: `class Solution {
    public int findDuplicate(int[] nums) {
        int slow = nums[0], fast = nums[0];
        do {
            slow = nums[slow];             // 一次一步
            fast = nums[nums[fast]];       // 一次两步
        } while (slow != fast);
        slow = nums[0];
        while (slow != fast) {             // 找环入口
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}`,
    complexity: '时间 O(n)；空间 O(1)，且不修改数组。',
    keyPoint: '本题是"把数组抽象成链表"的巅峰案例：i → nums[i] 建边、重复值导致两个入边 = 环入口。能讲清这个抽象，算法思维直接封神。',
  },
  {
    id: 'algo24', difficulty: 'medium', difficultyLabel: '中等', tag: '动态规划 · 完全背包',
    leetcodeTag: 'LeetCode 322：零钱兑换', title: '零钱兑换',
    description: '给定不同面额硬币 coins 和总金额 amount，计算凑成总金额所需的<b>最少硬币个数</b>。凑不出返回 -1。每种硬币数量无限。',
    examples: [
      '输入：coins = [1,2,5], amount = 11 → 输出：3（5+5+1）',
      '输入：coins = [2], amount = 3 → 输出：-1',
      '输入：coins = [1], amount = 0 → 输出：0',
    ],
    hints: [
      '贪心不行！coins=[1,3,4], amount=6，贪心 4+1+1=3 枚，最优 3+3=2 枚。',
      '完全背包：dp[i] = 凑出金额 i 的最少硬币数，dp[0]=0。',
      '转移：dp[i] = min(dp[i-c]) + 1，遍历每种硬币。',
    ],
    solution: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);       // 初始化为"不可能"
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int c : coins) {
                if (c <= i) {
                    dp[i] = Math.min(dp[i], dp[i - c] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    complexity: '时间 O(amount × 硬币种数)；空间 O(amount)。',
    keyPoint: '"最少硬币"用贪心是经典错误——面试官常先诱导你说贪心再打脸。涉及"最优组合"先想 DP。零钱兑换 II（求方案数）转移变成累加 dp[i] += dp[i-c]，对比着记。',
  },
  {
    id: 'algo25', difficulty: 'medium', difficultyLabel: '中等', tag: '数组 · 前缀和',
    leetcodeTag: 'LeetCode 560：和为 K 的子数组', title: '和为 K 的子数组',
    description: '给定整数数组和整数 k，统计并返回该数组中<b>和恰好为 k 的连续子数组的个数</b>（数组可能含负数）。',
    examples: [
      '输入：nums = [1,1,1], k = 2 → 输出：2（[1,1] 出现两次）',
      '输入：nums = [1,2,3], k = 3 → 输出：2（[1,2] 和 [3]）',
    ],
    hints: [
      '定义前缀和 prefix[i] = 前 i 个元素之和。子数组 [j+1..i] 的和 = prefix[i] - prefix[j]。',
      '要 sum = k，即找 prefix[j] = prefix[i] - k 的个数。',
      '边扫边用哈希表记录"每个前缀和出现的次数"，一次遍历完成。',
    ],
    solution: `class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        count.put(0, 1);                    // 前缀和本身=k 的情况（空前缀）
        int prefix = 0, ans = 0;
        for (int x : nums) {
            prefix += x;
            ans += count.getOrDefault(prefix - k, 0);  // 有多少前缀和=prefix-k
            count.merge(prefix, 1, Integer::sum);      // 记录当前前缀和
        }
        return ans;
    }
}`,
    complexity: '时间 O(n)；空间 O(n)。',
    keyPoint: '<b>前缀和 + 哈希表</b>是"子数组和"类问题的万能钥匙（含负数时滑动窗口失效，只能用前缀和）。注意 count.put(0,1) 这个初始化陷阱。',
  },
  {
    id: 'algo26', difficulty: 'hard', difficultyLabel: '困难', tag: '数组 · 双指针',
    leetcodeTag: 'LeetCode 42：接雨水', title: '接雨水',
    description: '给定 n 个非负整数表示柱子高度图，计算下雨之后能接多少水。',
    examples: [
      '输入：[0,1,0,2,1,0,1,3,2,1,2,1] → 输出：6',
      '输入：[4,2,0,3,2,5] → 输出：9',
    ],
    hints: [
      '每个位置能接的水 = min(左边最高, 右边最高) - 自身高度。',
      '预处理：leftMax[i]（含自身的左前缀最大值）和 rightMax[i] 各扫一遍，O(n)/O(n)。',
      '双指针优化到 O(1) 空间：谁矮处理谁，矮侧的水位由矮侧 max 决定。',
    ],
    solution: `class Solution {
    public int trap(int[] height) {
        int l = 0, r = height.length - 1;
        int lMax = 0, rMax = 0, water = 0;
        while (l < r) {
            lMax = Math.max(lMax, height[l]);
            rMax = Math.max(rMax, height[r]);
            if (lMax <= rMax) {            // 左侧较矮：水面由 lMax 决定
                water += lMax - height[l];
                l++;
            } else {
                water += rMax - height[r];
                r--;
            }
        }
        return water;
    }
}`,
    complexity: '双指针：时间 O(n)、空间 O(1)；预处理数组版：O(n)/O(n)。面试先写好懂的预处理版，再升级双指针。',
    keyPoint: '核心洞察："某格水位 = 两侧最高墙的较小值"。lMax <= rMax 时，左边格子的水位只由 lMax 决定（右边有更高的墙兜底）——这就是"谁矮处理谁"的数学依据。',
  },
  {
    id: 'algo27', difficulty: 'hard', difficultyLabel: '困难', tag: '动态规划 · 二维',
    leetcodeTag: 'LeetCode 72：编辑距离', title: '编辑距离',
    description: '给你两个单词 word1 和 word2，返回把 word1 转换成 word2 所需的<b>最少操作数</b>。操作：插入、删除、替换一个字符。',
    examples: [
      '输入：word1 = "horse", word2 = "ros" → 输出：3（horse→rorse 替换 h，→rose 删 r，→ros 删 e）',
      '输入：word1 = "intention", word2 = "execution" → 输出：5',
    ],
    hints: [
      '二维 DP：dp[i][j] = word1 前 i 个字符变成 word2 前 j 个字符的最少操作数。',
      '边界：dp[i][0]=i（全删）、dp[0][j]=j（全插）。',
      '转移：字符相等 dp[i][j]=dp[i-1][j-1]；不等 = min(替换 dp[i-1][j-1], 删除 dp[i-1][j], 插入 dp[i][j-1]) + 1。',
    ],
    solution: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;   // 删除 i 次
        for (int j = 0; j <= n; j++) dp[0][j] = j;   // 插入 j 次
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];      // 相同：不用操作
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],  // 替换
                              Math.min(dp[i - 1][j], dp[i][j - 1]));  // 删/插
                }
            }
        }
        return dp[m][n];
    }
}`,
    complexity: '时间/空间 O(m×n)；空间可滚动数组优化到 O(n)。',
    keyPoint: '二维 DP 鼻祖题：三个转移方向分别对应"对 word1 插、删、换"的操作语义——理解方向映射，字符串 DP 一通百通（最长公共子序列是它的减配版）。',
  },
  {
    id: 'algo28', difficulty: 'hard', difficultyLabel: '困难', tag: '单调栈',
    leetcodeTag: 'LeetCode 84：柱状图中最大的矩形', title: '柱状图中最大的矩形',
    description: '给定柱状图中各个柱子的高度（非负整数），找出能排列成矩形的最大面积。',
    examples: [
      '输入：[2,1,5,6,2,3] → 输出：10（下标 2~3 的 5,6 组成高5宽2矩形）',
      '输入：[2,4] → 输出：4',
    ],
    hints: [
      '枚举法：对每根柱子找"左右第一根比它矮的位置"——宽度就确定了。',
      '单调递增栈：入栈前若新柱子比栈顶矮，弹栈并结算面积（此时弹出柱子的左右边界都知道了）。',
      '技巧：在数组末尾加哨兵高度 0，强制栈清空，代码更简洁。',
    ],
    solution: `class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length, best = 0;
        Deque<Integer> stack = new ArrayDeque<>();   // 存下标，对应高度单调递增
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];       // 末尾哨兵
            while (!stack.isEmpty() && heights[stack.peek()] >= h) {
                int cur = stack.pop();               // 以 cur 为高的矩形
                int left = stack.isEmpty() ? -1 : stack.peek();  // 左边界
                int width = i - left - 1;
                best = Math.max(best, heights[cur] * width);
            }
            stack.push(i);
        }
        return best;
    }
}`,
    complexity: '时间 O(n)——每根柱子最多入栈出栈各一次；空间 O(n)。',
    keyPoint: '<b>单调栈的适用信号：</b>"找左边/右边第一个比它大（小）的元素"。模板记法：维护单调性 → 弹栈时结算。同类：每日温度、下一个更大元素。',
  },
  {
    id: 'algo29', difficulty: 'hard', difficultyLabel: '困难', tag: '回溯',
    leetcodeTag: 'LeetCode 51：N 皇后', title: 'N 皇后',
    description: 'n×n 棋盘放 n 个皇后，要求任意两个皇后<b>不同行、不同列、不同对角线</b>。返回所有合法布局。',
    examples: [
      '输入：n = 4 → 输出：2 种解（[".Q..","...Q","Q...","..Q."] 及其镜像）',
      '输入：n = 1 → 输出：1 种解（["Q"])',
    ],
    hints: [
      '按行递归：每行只放一个皇后，天然排除同行冲突。',
      '需要三个标记集合：列 cols、主对角线（row-col 相同）、副对角线（row+col 相同）。',
      '放皇后 → 标记三个集合 → 递归下一行 → 回溯取消标记。',
    ],
    solution: `class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        int[] queens = new int[n];                 // queens[row] = col
        boolean[] cols = new boolean[n];
        boolean[] diag1 = new boolean[2 * n];      // row - col + n
        boolean[] diag2 = new boolean[2 * n];      // row + col
        backtrack(0, n, queens, cols, diag1, diag2, res);
        return res;
    }
    private void backtrack(int row, int n, int[] q, boolean[] cols,
                           boolean[] d1, boolean[] d2, List<List<String>> res) {
        if (row == n) {                            // n 行都放满，收集解
            List<String> board = new ArrayList<>();
            for (int r = 0; r < n; r++) {
                char[] line = new char[n];
                Arrays.fill(line, '.');
                line[q[r]] = 'Q';
                board.add(new String(line));
            }
            res.add(board);
            return;
        }
        for (int col = 0; col < n; col++) {
            if (cols[col] || d1[row - col + n] || d2[row + col]) continue;  // 剪枝
            q[row] = col;
            cols[col] = d1[row - col + n] = d2[row + col] = true;
            backtrack(row + 1, n, q, cols, d1, d2, res);
            cols[col] = d1[row - col + n] = d2[row + col] = false;  // 回溯
        }
    }
}`,
    complexity: '时间 O(n!) 级（剪枝后远小于此）；空间 O(n) 递归与标记。',
    keyPoint: '回溯三件套：<b>选择 → 递归 → 撤销</b>。对角线标记技巧（row-col+n、row+col）是本题唯一"魔法"，用 4×4 手推一遍就懂。全排列、组合、子集全是同一模板的简化版。',
  },
  {
    id: 'algo30', difficulty: 'hard', difficultyLabel: '困难', tag: '堆 · TopK',
    leetcodeTag: 'LeetCode 347：前 K 个高频元素', title: '前 K 个高频元素',
    description: '给定整数数组 nums 和整数 k，返回其中出现频率前 k 高的元素。要求时间复杂度<b>优于 O(n log n)</b>。',
    examples: [
      '输入：nums = [1,1,1,2,2,3], k = 2 → 输出：[1,2]',
      '输入：nums = [1], k = 1 → 输出：[1]',
    ],
    hints: [
      '第一步：哈希表统计每个数字的频率。',
      '第二步：求"前 K 个最大"，用<b>容量为 K 的小顶堆</b>（反直觉：要最大的 K 个，反而维护小顶堆）。',
      '堆满后，新元素只有比堆顶（当前第 K 大）大才入堆。最终堆里就是答案。复杂度 O(n log k)。',
    ],
    solution: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.merge(x, 1, Integer::sum);

        // 小顶堆按频率排序：堆顶是 K 个里频率最小的
        PriorityQueue<Integer> heap =
            new PriorityQueue<>((a, b) -> freq.get(a) - freq.get(b));

        for (int key : freq.keySet()) {
            heap.offer(key);
            if (heap.size() > k) heap.poll();    // 挤掉最小的
        }
        int[] res = new int[k];
        for (int i = k - 1; i >= 0; i--) res[i] = heap.poll();
        return res;
    }
}`,
    complexity: '时间 O(n log k)（优于 O(n log n)）；空间 O(n)。另有桶排序 O(n) 解法：按频率分桶，从高桶往低桶收集。',
    keyPoint: 'TopK 三板斧：①容量 K 的小顶堆（通用）②桶排序（频率有限范围）③快速选择 O(n) 平均。会写堆法+说出另外两种，本题就满分——这是面试"性能优化讨论"的最爱场景。',
  },

  /* ==================== V4 扩充 20 题（31~50） ==================== */

  {
    id: 'algo31', difficulty: 'medium', difficultyLabel: '中等', tag: '链表 · 快慢指针',
    leetcodeTag: 'LeetCode 19：删除链表的倒数第 N 个结点', title: '删除链表的倒数第 N 个结点',
    description: '给定一个链表的头节点 head，删除链表的<b>倒数第 n 个</b>节点，并返回链表的头节点。要求<b>一趟扫描</b>实现。',
    examples: [
      '输入：head = [1,2,3,4,5], n = 2 → 输出：[1,2,3,5]',
      '输入：head = [1], n = 1 → 输出：[]',
      '输入：head = [1,2], n = 1 → 输出：[1]',
    ],
    hints: [
      '朴素法：先遍历一遍算长度 len，再走 len - n 步删除——两趟，不满足进阶要求。',
      '快慢指针法：fast 先走 n+1 步，然后 slow/fast 同速走。',
      'fast 到 null 时，slow 正好停在"倒数第 n+1 个"（前驱）位置——因为 fast 领先 n+1。用虚拟头节点统一处理"删头"边界。',
    ],
    solution: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);   // 虚拟头，统一删头/删中间
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;  // fast 先走 n+1 步
        while (fast != null) {                    // 同速走到尾
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;               // 删除倒数第 n 个
        return dummy.next;
    }
}`,
    complexity: '时间 O(L) 一趟遍历；空间 O(1)。',
    keyPoint: '虚拟头节点（dummy）是链表题的万能垫脚石——把"删除头节点"变成"删除中间节点"，省掉特判。快慢指针间隔 n+1 = "让 slow 停在前驱"是本题唯一的心智难点。',
  },
  {
    id: 'algo32', difficulty: 'medium', difficultyLabel: '中等', tag: '链表 · 环',
    leetcodeTag: 'LeetCode 142：环形链表 II', title: '环形链表 II（找入环点）',
    description: '给定一个链表的头节点 head，返回链表<b>开始入环的第一个节点</b>。如果链表无环，则返回 null。<b>不允许修改链表</b>，进阶：能否用 O(1) 空间？',
    examples: [
      '输入：head = [3,2,0,-4]，尾节点指向下标 1 → 输出：入环点（下标 1 的节点）',
      '输入：head = [1,2]，1 指向 2，2 指向 1 → 输出：下标 0 的节点',
      '输入：head = [1] → 输出：null（无环）',
    ],
    hints: [
      '判环：快慢指针，fast 每次 2 步、slow 每次 1 步，相遇则有环。',
      '数学：设头到入环点距离 a，入环点到相遇点 b，环剩余 c。相遇时 slow 走 a+b，fast 走 a+b+n(b+c)。',
      '由 2(a+b) = a+b+n(b+c) 推出 a = c + (n-1)(b+c)：从头和从相遇点同速出发，必在入环点相遇。',
    ],
    solution: `public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;          // 每次一步
            fast = fast.next.next;     // 每次两步
            if (slow == fast) {        // 有环：找入环点
                ListNode p = head;     // 从头出发
                while (p != slow) {    // 同速走，必在入环点相遇
                    p = p.next;
                    slow = slow.next;
                }
                return p;
            }
        }
        return null;                   // fast 到尾 = 无环
    }
}`,
    complexity: '时间 O(n)；空间 O(1)。哈希表法 O(n) 空间也能做但面试不加分。',
    keyPoint: 'Floyd 判圈算法两部分：判环（快慢相遇）+ 找入口（数学推导 a = c + (n-1)(b+c)）。面试能推公式 = 区分度拉满。该思想也是"数组找重复数（LC287）"的解法基础。',
  },
  {
    id: 'algo33', difficulty: 'medium', difficultyLabel: '中等', tag: '链表 · 重排',
    leetcodeTag: 'LeetCode 143：重排链表', title: '重排链表',
    description: '给定单链表 L: L0→L1→…→Ln-1→Ln，重新排列为：<b>L0→Ln→L1→Ln-1→L2→Ln-2→…</b>。不能只修改值，必须实际改变节点指向。',
    examples: [
      '输入：head = [1,2,3,4,5] → 输出：[1,5,2,4,3]',
      '输入：head = [1,2,3,4] → 输出：[1,4,2,3]',
    ],
    hints: [
      '三个经典链表操作组合拳：找中点 + 反转后半段 + 合并两段。',
      '找中点用快慢指针（fast 一次两步）；反转用三指针迭代。',
      '合并：交替衔接——l1 取一个接 l2 取一个，直到两段耗尽。',
    ],
    solution: `class Solution {
    public void reorderList(ListNode head) {
        // 1. 快慢指针找中点（slow 最终在前半段尾部）
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        // 2. 反转后半段
        ListNode second = slow.next;
        slow.next = null;
        ListNode prev = null;
        while (second != null) {
            ListNode next = second.next;
            second.next = prev;
            prev = second;
            second = next;
        }
        // 3. 交替合并两段
        ListNode l1 = head, l2 = prev;
        while (l2 != null) {
            ListNode n1 = l1.next, n2 = l2.next;
            l1.next = l2;
            l2.next = n1;
            l1 = n1;
            l2 = n2;
        }
    }
}`,
    complexity: '时间 O(n)；空间 O(1)（三步全指针操作）。',
    keyPoint: '复合题 = 已知套路串联（中点/反转/合并全是原题零件）。面试遇到大题不要慌：拆成你会的子问题逐个击破，这正是本题存在的意义。',
  },
  {
    id: 'algo34', difficulty: 'medium', difficultyLabel: '中等', tag: '栈 · 设计',
    leetcodeTag: 'LeetCode 155：最小栈', title: '最小栈（O(1) 取最小）',
    description: '设计一个支持 <code>push</code>、<code>pop</code>、<code>top</code> 操作，并能在<b>常数时间</b>内检索到<b>最小元素</b>的栈。各函数的调用次数不限。',
    examples: [
      '依次 push(-2), push(0), push(-3) → getMin() 返回 -3',
      'pop() 后 → top() 返回 0，getMin() 返回 -2',
    ],
    hints: [
      '用一个辅助栈同步维护"当前状态下的最小值"。',
      'push x 时：辅助栈压入 min(x, 辅助栈顶)——即"截至目前的最小值"。',
      'pop 时两栈同步弹出，getMin 直接看辅助栈顶。空间换时间的经典。',
    ],
    solution: `class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> minStack = new ArrayDeque<>();  // 存"历史最小值快照"

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);        // 更小才压（或用 min(val, 栈顶) 同步压）
        }
    }
    public void pop() {
        int v = stack.pop();
        if (v == minStack.peek()) minStack.pop();  // 弹的是当前最小才同步弹
    }
    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}`,
    complexity: '所有操作时间 O(1)；空间 O(n)。',
    keyPoint: '"每个状态对应一个最小值快照"是核心洞察——最小值随弹出回退历史版本。追问变体：如何 O(1) 支持取最大值（同理 maxStack）？如何设计"最小队列"（难度升级，用双栈模拟）？',
  },
  {
    id: 'algo35', difficulty: 'medium', difficultyLabel: '中等', tag: '栈 · 序列验证',
    leetcodeTag: '剑指 Offer 31：栈的压入、弹出序列', title: '栈的压入、弹出序列（验证合法性）',
    description: '输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否可能为该栈的弹出顺序。假设压入栈的所有数字均不相等。',
    examples: [
      '输入：pushed = [1,2,3,4,5], popped = [4,5,3,2,1] → true（压1压2压3压4，弹4；压5，弹5；弹3弹2弹1）',
      '输入：pushed = [1,2,3,4,5], popped = [4,3,5,1,2] → false（1 不能在 2 之前弹出）',
    ],
    hints: [
      '直接模拟：辅助栈 + 一个指针指向 popped。',
      '每压入一个数，就循环检查：栈顶等于 popped 当前元素则弹出并后移指针。',
      '全部压完后，栈为空则 popped 合法。',
    ],
    solution: `class Solution {
    public boolean validateStackSequences(int[] pushed, int[] popped) {
        Deque<Integer> stack = new ArrayDeque<>();
        int i = 0;                                  // popped 指针
        for (int x : pushed) {
            stack.push(x);
            while (!stack.isEmpty() && stack.peek() == popped[i]) {
                stack.pop();                        // 按弹出序列逐个弹
                i++;
            }
        }
        return stack.isEmpty();                     // 弹不干净 = 序列非法
    }
}`,
    complexity: '时间 O(n)：每个元素至多入栈出栈各一次；空间 O(n)。',
    keyPoint: '模拟是"验证类"题的万能思路——与其推理规则不如直接跑一遍。追问变体：给出合法弹出序列有多少种（卡特兰数 C(2n,n)/(n+1)）；判断是否为合法出队序列（队列则只有一种）。',
  },
  {
    id: 'algo36', difficulty: 'easy', difficultyLabel: '简单', tag: '位运算',
    leetcodeTag: 'LeetCode 136：只出现一次的数字', title: '只出现一次的数字（异或妙用）',
    description: '给定一个非空整数数组，除某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。要求<b>不使用额外空间</b>。',
    examples: [
      '输入：nums = [2,2,1] → 输出：1',
      '输入：nums = [4,1,2,1,2] → 输出：4',
      '输入：nums = [1] → 输出：1',
    ],
    hints: [
      '哈希表统计频率：O(n) 空间，不满足进阶。',
      '异或三大性质：x^x=0、x^0=x、交换结合律。',
      '全部数字异或在一起：成对的全变 0，只剩出现一次的那个。',
    ],
    solution: `class Solution {
    public int singleNumber(int[] nums) {
        int ans = 0;
        for (int x : nums) ans ^= x;   // a^b^a = b：成对的抵消
        return ans;
    }
}`,
    complexity: '时间 O(n)；空间 O(1)。',
    keyPoint: '异或是位运算题之母。追问变体：①两个数出现一次其余两次（LC260：先全异或得 x^y，按最低不同位分组再各异或）；②一个数出现一次其余三次（LC137：逐位统计 mod 3）——三连问是位运算面试标准套餐。',
  },
  {
    id: 'algo37', difficulty: 'medium', difficultyLabel: '中等', tag: '二叉树 · 路径',
    leetcodeTag: 'LeetCode 112：路径总和', title: '路径总和',
    description: '给定二叉树根节点 root 和整数 targetSum，判断是否存在<b>根节点到叶子节点</b>的路径，使路径上所有节点值之和等于 targetSum。',
    examples: [
      '输入：root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22 → true（5+4+11+2=22）',
      '输入：root = [1,2,3], targetSum = 5 → false（两条路：1+2=3、1+3=4）',
      '输入：root = [], targetSum = 0 → false（空树无路径）',
    ],
    hints: [
      '递归定义：从 root 出发是否存在路径使和为 target。',
      '每经过一个节点，问题转化为：子树中是否存在路径使和为 target - node.val。',
      '递归出口：叶子节点时判断 targetSum 是否等于当前值；注意"必须有叶子"，空节点不算路径终点。',
    ],
    solution: `class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) return false;          // 空节点不是路径
        if (root.left == null && root.right == null) {
            return targetSum == root.val;        // 叶子：判断剩余目标
        }
        int rest = targetSum - root.val;         // 扣减当前节点
        return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
    }
}`,
    complexity: '时间 O(n) 每节点访问一次；空间 O(h) 递归栈（最坏 O(n)）。',
    keyPoint: '"根到叶"类题的关键是叶子判定（left==null && right==null）——只判 root==null 会把单孩子节点的空边误判为路径。变体：路径总和 II（收集所有路径，回溯模板）。',
  },
  {
    id: 'algo38', difficulty: 'medium', difficultyLabel: '中等', tag: '二叉树 · 最近公共祖先',
    leetcodeTag: 'LeetCode 236：二叉树的最近公共祖先', title: '二叉树的最近公共祖先（LCA）',
    description: '给定二叉树以及树中两个节点 p 和 q，找到它们的<b>最近公共祖先</b>节点（LCA：两节点深度最大的公共祖先，节点可以是自己的祖先）。',
    examples: [
      '输入：root = [3,5,1,6,2,0,8,null,null,7,4], p=5, q=1 → 输出：3',
      '输入：p=5, q=4 → 输出：5（节点可以是自己的祖先）',
    ],
    hints: [
      '递归定义：lowestCommonAncestor(root, p, q) 返回 root 子树中 p/q 的 LCA 或 null。',
      '分情况：当前节点等于 p 或 q → 直接返回自己；左右子树递归。',
      '左右都不空 → 当前节点就是 LCA；只有一边不空 → 返回不空的那边（说明目标都在那边）。',
    ],
    solution: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;  // p、q 分布两侧
        return left != null ? left : right;              // 同侧向上传递
    }
}`,
    complexity: '时间 O(n)；空间 O(h) 递归栈。',
    keyPoint: 'LCA 的后序递归是"自底向上汇报"的典范：null 表示这边没找到，非 null 表示找到了往上送。变体：BST 的 LCA（利用有序性一次遍历）、父指针版（先求深度再上提，或记录路径求分叉）。',
  },
  {
    id: 'algo39', difficulty: 'medium', difficultyLabel: '中等', tag: '矩阵 · 原地标记',
    leetcodeTag: 'LeetCode 73：矩阵置零', title: '矩阵置零（O(1) 空间）',
    description: '给定 m×n 矩阵，如果一个元素为 0，则将其所在行列所有元素设为 0。请使用<b>原地算法</b>（进阶：O(m+n) 甚至 O(1) 额外空间）。',
    examples: [
      '输入：matrix = [[1,1,1],[1,0,1],[1,1,1]] → 输出：[[1,0,1],[0,0,0],[1,0,1]]',
      '输入：matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]] → 输出：[[0,0,0,0],[0,4,5,0],[0,3,1,5]]',
    ],
    hints: [
      '朴素：用两个标记数组记录哪些行/列有 0，空间 O(m+n)。',
      'O(1) 空间技巧：用第一行、第一列自身做标记（因为它们本来就要被处理）。',
      '注意第一行/列的 0 需要先用两个布尔变量提前记录，否则标记会被覆盖丢失。',
    ],
    solution: `class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstRow = false, firstCol = false;
        // 1. 先记录第一行/列本身是否有 0
        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRow = true;
        for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstCol = true;
        // 2. 用第一行/列做其余区域的标记
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
        // 3. 根据标记置零（跳过第一行列）
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
        // 4. 最后处理第一行/列
        if (firstRow) for (int j = 0; j < n; j++) matrix[0][j] = 0;
        if (firstCol) for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
}`,
    complexity: '时间 O(mn)；空间 O(1)。',
    keyPoint: '原地标记题的核心是"借已有空间存信息，且处理顺序不破坏信息"。本题难点在第一行/列的信息要提前抢救。同族题：旋转图像（先转置再翻转）、螺旋矩阵（边界收缩）。',
  },
  {
    id: 'algo40', difficulty: 'medium', difficultyLabel: '中等', tag: '二分 · 答案空间',
    leetcodeTag: 'LeetCode 875：爱吃香蕉的珂珂', title: '爱吃香蕉的珂珂（二分答案）',
    description: 'n 堆香蕉 piles，警卫离开 h 小时。珂珂决定她的吃香蕉速度 k（根/小时）。每小时选一堆吃 k 根（不足 k 根则该堆吃完且本小时不再吃）。求能在 h 小时内吃完全部香蕉的<b>最小速度 k</b>。',
    examples: [
      '输入：piles = [3,6,7,11], h = 8 → 输出：4',
      '输入：piles = [30,11,23,4,20], h = 5 → 输出：30',
      '输入：piles = [30,11,23,4,20], h = 6 → 输出：23',
    ],
    hints: [
      '直接求 k 很难，反过来：给定 k，判断 h 小时够不够吃——这是个简单的模拟。',
      'k 越大越容易吃完（单调性！）→ 对 k 做"二分答案"。',
      '答案空间 [1, max(piles)]；耗时 = Σ ceil(pile/k)，二分找最小的可行 k。',
    ],
    solution: `class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int lo = 1, hi = 0;
        for (int p : piles) hi = Math.max(hi, p);
        while (lo < hi) {                    // 二分答案空间
            int mid = lo + (hi - lo) / 2;
            if (canFinish(piles, h, mid)) hi = mid;      // 够吃：试探更小
            else lo = mid + 1;                            // 不够：提速
        }
        return lo;
    }
    private boolean canFinish(int[] piles, int h, int k) {
        long hours = 0;
        for (int p : piles) hours += (p + k - 1L) / k;   // 上取整技巧
        return hours <= h;
    }
}`,
    complexity: '时间 O(n log(max))；空间 O(1)。注意 hours 用 long 防溢出。',
    keyPoint: '"二分答案"是二分的进阶形态：答案有单调性就能二分——求最小的最大/最大的最小都是它的标志语。同族：LC410 分割数组最大值（hard）、LC1011 运送包裹。面试见到"最小化最大值"直接条件反射二分答案。',
  },
  {
    id: 'algo41', difficulty: 'medium', difficultyLabel: '中等', tag: '双指针 · 区间',
    leetcodeTag: 'LeetCode 11：盛最多水的容器', title: '盛最多水的容器',
    description: '给定整数数组 height，第 i 条线两端点在 (i,0) 和 (i,height[i])。找两条线与 x 轴构成的容器能容纳<b>最多水</b>，返回最大面积。',
    examples: [
      '输入：height = [1,8,6,2,5,4,8,3,7] → 输出：49（线 8 与线 7，宽 7 × 高 7）',
      '输入：height = [1,1] → 输出：1',
    ],
    hints: [
      '暴力 O(n²) 枚举所有线对——超时。',
      '双指针从两端开始，面积 = 宽 × min(左高, 右高)。',
      '移动哪边？<b>移动较矮的那边</b>——宽度已经在缩小，只有换掉矮的才可能让高度变大，否则必然更差。',
    ],
    solution: `class Solution {
    public int maxArea(int[] height) {
        int lo = 0, hi = height.length - 1;
        int best = 0;
        while (lo < hi) {
            int h = Math.min(height[lo], height[hi]);
            best = Math.max(best, h * (hi - lo));
            if (height[lo] < height[hi]) lo++;   // 移矮的：保住唯一可能的改进
            else hi--;
        }
        return best;
    }
}`,
    complexity: '时间 O(n)；空间 O(1)。',
    keyPoint: '对撞双指针的核心是"每次移动后排除不可能的状态"——移动矮边丢掉的候选都严格不优于当前，所以正确性有保证。能讲清这一点（而不是背模板）就是面试亮点。同族：接雨水（相向/前缀最大值）、三数之和。',
  },
  {
    id: 'algo42', difficulty: 'medium', difficultyLabel: '中等', tag: '前缀和 + 哈希',
    leetcodeTag: 'LeetCode 560：和为 K 的子数组', title: '和为 K 的子数组',
    description: '给定整数数组 nums 和整数 k，统计并返回该数组中<b>和恰好为 k 的连续子数组</b>的个数。注意：数组可能含负数。',
    examples: [
      '输入：nums = [1,1,1], k = 2 → 输出：2（[1,1] 出现两次：下标 0-1 和 1-2）',
      '输入：nums = [1,2,3], k = 3 → 输出：2（[1,2] 和 [3]）',
    ],
    hints: [
      '前缀和：sum[j] - sum[i] = 区间 (i, j] 的和。找 pair 使差为 k。',
      '"两数之差为 k" → 遍历 j 时查"sum[j] - k 出现过几次"——哈希表计数。',
      '负数存在 → 滑动窗口不适用（无单调性），必须前缀和。',
    ],
    solution: `class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> preCount = new HashMap<>();
        preCount.put(0, 1);              //空前缀：处理从头开始的子数组
        int sum = 0, ans = 0;
        for (int x : nums) {
            sum += x;
            ans += preCount.getOrDefault(sum - k, 0);  // 有多少前缀和为 sum-k
            preCount.merge(sum, 1, Integer::sum);      // 记录当前前缀和
        }
        return ans;
    }
}`,
    complexity: '时间 O(n)；空间 O(n)。',
    keyPoint: '前缀和 + 哈希 = "子数组和类"万能钥匙。三个细节：①初始放 (0,1) 兜底；②必须含负数时滑窗失效的原因（窗口和不再单调）；③变体：LC974 可被 K 整除的子数组（前缀和 mod K）、LC1248 优美子数组（前缀奇偶计数）——套路完全一致。',
  },
  {
    id: 'algo43', difficulty: 'medium', difficultyLabel: '中等', tag: '动态规划 · 打家劫舍',
    leetcodeTag: 'LeetCode 198：打家劫舍', title: '打家劫舍（入门 DP）',
    description: '沿街排列的房屋，每间有一定现金 nums[i]。相邻两间不能同时偷（会触发警报）。求能偷到的<b>最高金额</b>。',
    examples: [
      '输入：nums = [1,2,3,1] → 输出：4（偷 1 和 3 号房）',
      '输入：nums = [2,7,9,3,1] → 输出：12（偷 0、2、4 号房）',
    ],
    hints: [
      '状态：dp[i] = 考虑前 i 间房能偷的最大金额。',
      '转移：第 i 间要么偷（dp[i-2] + nums[i]），要么不偷（dp[i-1]）。',
      'dp[i] = max(dp[i-1], dp[i-2] + nums[i])。初值：dp[0]=0, dp[1]=nums[0]（按"前 i 间"定义）。',
    ],
    solution: `class Solution {
    public int rob(int[] nums) {
        int prev = 0, cur = 0;         // prev=dp[i-2], cur=dp[i-1]
        for (int x : nums) {
            int next = Math.max(cur, prev + x);  // 偷或不偷取大
            prev = cur;
            cur = next;
        }
        return cur;
    }
}`,
    complexity: '时间 O(n)；空间 O(1)（两个滚动变量）。',
    keyPoint: 'DP 入门第一课：定义状态 → 写转移 → 滚动优化空间。变体链：打家劫舍 II（环形：拆两次线性）、III（树形 DP：偷/不偷两种状态上树）——同一条状态设计思路从线性推到树形，面试爱考这条演化线。',
  },
  {
    id: 'algo44', difficulty: 'medium', difficultyLabel: '中等', tag: '动态规划 · 完全背包',
    leetcodeTag: 'LeetCode 322：零钱兑换', title: '零钱兑换（最少硬币数）',
    description: '不同面额硬币 coins 和总金额 amount，计算凑成总金额所需的<b>最少硬币个数</b>。每种硬币数量无限。无法凑出返回 -1。',
    examples: [
      '输入：coins = [1,2,5], amount = 11 → 输出：3（5+5+1）',
      '输入：coins = [2], amount = 3 → 输出：-1',
      '输入：coins = [1], amount = 0 → 输出：0',
    ],
    hints: [
      '完全背包变体：dp[i] = 凑出金额 i 的最少硬币数，初值 INF（表示不可达），dp[0] = 0。',
      '转移：dp[i] = min(dp[i - coin] + 1) 遍历所有 coin。',
      '贪心为何不对？——面额 [1,3,4] 凑 6：贪心 4+1+1=3 枚，正确 3+3=2 枚。',
    ],
    solution: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int INF = amount + 1;                       // 哨兵：不可能超过 amount 枚
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++)           // 外层金额
            for (int c : coins)                      // 内层硬币（完全背包顺序）
                if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    complexity: '时间 O(amount × n)；空间 O(amount)。',
    keyPoint: '完全背包三问一句区分：最少个数（本题 min）、组合数（LC518 计数，外层硬币内层金额）、能否凑出（boolean dp）。BFS 解法也能过（每层=多用一枚硬币），能说出口展示思路广度。',
  },
  {
    id: 'algo45', difficulty: 'medium', difficultyLabel: '中等', tag: '动态规划 · 子序列',
    leetcodeTag: 'LeetCode 300：最长递增子序列', title: '最长递增子序列（LIS）',
    description: '整数数组 nums，找到其中<b>最长严格递增子序列</b>的长度。子序列可以不连续（相对顺序不变）。',
    examples: [
      '输入：nums = [10,9,2,5,3,7,101,18] → 输出：4（[2,3,7,101] 或 [2,5,7,101] 等）',
      '输入：nums = [7,7,7,7] → 输出：1（严格递增）',
    ],
    hints: [
      'O(n²) 解法：dp[i] = 以 nums[i] 结尾的 LIS 长度，转移枚举前面所有比它小的位置。',
      'O(n log n) 解法：维护 tails 数组——tails[k] = 长度 k+1 的 LIS 的最小结尾值。',
      'tails 单调递增 → 对每个新数在 tails 中二分找第一个 ≥ 它的位置替换；比尾巴大则追加。',
    ],
    solution: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];  // tails[k]: 长度k+1的最小结尾
        int size = 0;
        for (int x : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {                // 二分找第一个 >= x 的位置
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < x) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = x;                   // 替换或追加
            if (lo == size) size++;
        }
        return size;
    }
}`,
    complexity: 'O(n²) DP：时间/空间均 O(n²)/O(n)；贪心+二分：时间 O(n log n)、空间 O(n)。',
    keyPoint: 'LIS 是"定义换一下就简单"的经典：以 i 结尾（而不是前 i 个）才能写出转移。tails 数组的直觉：同样长度的递增子序列，结尾越小越有潜力续接。变体：LC673 最长递增子序列个数（多记一个 counts 数组）、LC354 俄罗斯套娃（二维降维打击：宽排序+高 LIS）。',
  },
  {
    id: 'algo46', difficulty: 'medium', difficultyLabel: '中等', tag: 'DFS · 岛屿',
    leetcodeTag: 'LeetCode 200：岛屿数量', title: '岛屿数量（连通块计数）',
    description: '二维网格 \'1\'（陆地）和 \'0\'（水），计算岛屿数量。岛屿 = 相邻（上下左右）陆地组成的区域，四周都是水。',
    examples: [
      '输入：grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]] → 输出：1',
      '输入：grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]] → 输出：3',
    ],
    hints: [
      '遍历每个格子，遇到 \'1\' 计数 +1，并把它连着的整片陆地"淹掉"。',
      '"淹掉"用 DFS/BFS 标记：把访问过的 \'1\' 改成 \'0\'（原地标记，省 visited 数组）。',
      '最终计数 = 连通块个数。',
    ],
    solution: `class Solution {
    public int numIslands(char[][] grid) {
        int count = 0, m = grid.length, n = grid[0].length;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (grid[i][j] == \'1\') {      // 发现新岛屿
                    count++;
                    dfs(grid, i, j);            // 淹掉整片
                }
        return count;
    }
    private void dfs(char[][] g, int i, int j) {
        if (i < 0 || i >= g.length || j < 0 || j >= g[0].length) return;
        if (g[i][j] != \'1\') return;            // 水/已访问
        g[i][j] = \'0\';                         // 标记已访问
        dfs(g, i + 1, j); dfs(g, i - 1, j);     // 上下左右
        dfs(g, i, j + 1); dfs(g, i, j - 1);
    }
}`,
    complexity: '时间 O(mn) 每格至多访问两次；空间 O(mn) 最坏递归深度（全陆地蛇形）。',
    keyPoint: '网格 DFS 三件套：越界判断 → 目标判断 → 标记已访问。变体全家桶：岛屿最大面积（DFS 返回面积）、被围绕的区域（从边界反向 DFS）、 Pacific/Atlantic 水流（双向反向流）、并查集解法（动态加边）——网格图题面试出镜率极高。',
  },
  {
    id: 'algo47', difficulty: 'medium', difficultyLabel: '中等', tag: 'BFS · 最短步数',
    leetcodeTag: 'LeetCode 994：腐烂的橘子', title: '腐烂的橘子（多源 BFS）',
    description: '网格中：0 空格、1 新鲜橘子、2 烂橘子。每分钟烂橘子向四周扩散一圈。返回<b>所有橘子腐烂的最小分钟数</b>；若有橘子永远烂不掉返回 -1。',
    examples: [
      '输入：grid = [[2,1,1],[1,1,0],[0,1,1]] → 输出：4',
      '输入：grid = [[1,2,1]] → 输出：-1（左边的永远烂不到）',
      '输入：grid = [[0,2]] → 输出：0（没有新鲜橘子）',
    ],
    hints: [
      '这不是单源 BFS：所有烂橘子<b>同时</b>扩散 → 多源 BFS：全部烂橘子一起入队。',
      'BFS 按层处理：每扩散一圈分钟数 +1，层数就是最短时间。',
      '结束后检查是否还有 1 残留（隔离的新鲜橘子）。',
    ],
    solution: `class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        Deque<int[]> queue = new ArrayDeque<>();
        int fresh = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) queue.offer(new int[]{i, j});
                else if (grid[i][j] == 1) fresh++;
            }
        if (fresh == 0) return 0;               // 没有新鲜橘子
        int minutes = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!queue.isEmpty() && fresh > 0) {
            minutes++;                          // 一圈一分钟
            int size = queue.size();
            for (int s = 0; s < size; s++) {    // 按层扩散
                int[] cur = queue.poll();
                for (int[] d : dirs) {
                    int ni = cur[0] + d[0], nj = cur[1] + d[1];
                    if (ni < 0 || ni >= m || nj < 0 || nj >= n) continue;
                    if (grid[ni][nj] == 1) {
                        grid[ni][nj] = 2;       // 腐烂
                        fresh--;
                        queue.offer(new int[]{ni, nj});
                    }
                }
            }
        }
        return fresh == 0 ? minutes : -1;
    }
}`,
    complexity: '时间 O(mn)；空间 O(mn) 队列上限。',
    keyPoint: '多源 BFS = 把所有源点当作"超级源点"的邻接点同时入队，一次求出全局最短。核心套路："最短时间/最少步数"条件反射想 BFS（BFS 天然按层最短）。变体：01 矩阵（每个 1 到最近 0 的距离）、墙壁与门。',
  },
  {
    id: 'algo48', difficulty: 'medium', difficultyLabel: '中等', tag: '排序 · 手写',
    leetcodeTag: 'LeetCode 912：排序数组', title: '手写快排（面试手撕标配）',
    description: '给定整数数组 nums，将其升序排序。要求能手写快速排序（含随机化优化），并能口头分析复杂度与退化场景。',
    examples: [
      '输入：nums = [5,2,3,1] → 输出：[1,2,3,5]',
      '输入：nums = [5,1,1,2,0,0] → 输出：[0,0,1,1,2,5]',
    ],
    hints: [
      '快排三步：选 pivot → partition（小于去左大于去右）→ 递归两侧。',
      'partition 用 Lomuto 或 Hoare；单边指针法最好背：j 记"小于区边界"。',
      '递归深度 O(log n)；最坏 O(n²)（已排序数组选首元素为 pivot）→ 随机化 pivot 规避。',
    ],
    solution: `class Solution {
    public int[] sortArray(int[] nums) {
        quickSort(nums, 0, nums.length - 1);
        return nums;
    }
    private void quickSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int p = partition(a, lo, hi);
        quickSort(a, lo, p - 1);
        quickSort(a, p + 1, hi);
    }
    private int partition(int[] a, int lo, int hi) {
        int rand = lo + (int) (Math.random() * (hi - lo + 1));
        swap(a, rand, hi);                       // 随机 pivot 换到末尾
        int pivot = a[hi], boundary = lo;        // boundary: 小于区的右边界
        for (int j = lo; j < hi; j++) {
            if (a[j] < pivot) swap(a, boundary++, j);
        }
        swap(a, boundary, hi);                   // pivot 归位
        return boundary;
    }
    private void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
}`,
    complexity: '平均时间 O(n log n)；最坏 O(n²)（随机化后概率极低）；空间 O(log n) 递归栈。不稳定排序。',
    keyPoint: '手撕快排考察三层：①写对 partition；②说出退化场景与随机化；③对比归并（稳定/O(n) 辅助/链表友好）与堆排（O(1) 空间/缓存不友好）。追问：快排为什么比同复杂度的堆排快（缓存友好、常数小）、三大 O(nlogn) 排序各自适用场景。',
  },
  {
    id: 'algo49', difficulty: 'medium', difficultyLabel: '中等', tag: '滑动窗口 · 进阶',
    leetcodeTag: 'LeetCode 76：最小覆盖子串', title: '最小覆盖子串（滑动窗口天花板）',
    description: '字符串 s 和 t，返回 s 中<b>涵盖 t 所有字符（含重复次数）的最短子串</b>。不存在返回空串。进阶：O(|s| + |t|) 时间。',
    examples: [
      '输入：s = "ADOBECODEBANC", t = "ABC" → 输出："BANC"',
      '输入：s = "a", t = "a" → 输出："a"',
      '输入：s = "a", t = "aa" → 输出：""（a 不够两个）',
    ],
    hints: [
      '需求：窗口包含 t 的全部字符及个数 → 用 needs 计数表 + valid 计数（满足需求的字符种类数）。',
      '右扩：每入窗一个字符，若是需要的且窗口数恰好达标，valid++。',
      'valid == needs.size() 时尝试左缩：记录答案后左移，出窗字符若是需要的且数量跌破需求，valid--。',
    ],
    solution: `class Solution {
    public String minWindow(String s, String t) {
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
        int left = 0, valid = 0, start = 0, minLen = Integer.MAX_VALUE;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (need.containsKey(c)) {
                need.merge(c, -1, Integer::sum);
                if (need.get(c) == 0) valid++;          // 恰好达标
            }
            while (valid == need.size()) {              // 窗口已覆盖：收缩
                if (right - left + 1 < minLen) {        // 记录更短的
                    start = left;
                    minLen = right - left + 1;
                }
                char d = s.charAt(left++);
                if (need.containsKey(d)) {
                    if (need.get(d) == 0) valid--;      // 即将跌破需求
                    need.merge(d, 1, Integer::sum);
                }
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
    }
}`,
    complexity: '时间 O(|s| + |t|)：左右指针各走一遍；空间 O(|t|) 字符集大小（ASCII 可用数组优化）。',
    keyPoint: '滑动窗口终极模板：需求表 + valid 计数 + "右扩找可行、左缩求最优"。掌握本题 = 掌握整个窗口家族（LC438 找所有字母异位词、LC567 排列子串、LC3 无重复最长子串都是它的减配版）。面试手写成功率是硬指标，务必默写过。',
  },
  {
    id: 'algo50', difficulty: 'hard', difficultyLabel: '困难', tag: '归并 · 分治',
    leetcodeTag: 'LeetCode 315：计算右侧小于当前元素的个数', title: '计算右侧小于当前元素的个数（归并统计）',
    description: '整数数组 nums，返回新数组 counts，其中 counts[i] 表示 nums[i] <b>右侧</b>严格小于 nums[i] 的元素个数。',
    examples: [
      '输入：nums = [5,2,6,1] → 输出：[2,1,1,0]',
      '输入：nums = [-1] → 输出：[0]',
      '输入：nums = [-1,-1] → 输出：[0,0]',
    ],
    hints: [
      '暴力 O(n²)——大数据量会超时，需要 O(n log n)。',
      '归并排序在"合并两段"时：右半段元素先落位，说明左半段中剩下的元素都有一批"右侧比它小的"。',
      '用"逆序对"思想：合并时右段每弹出（落位）一个元素，左段当前指针之后的全部元素都比它大，即对它们的 count 各 +1。需要索引数组同步归并（值带原下标）。',
    ],
    solution: `class Solution {
    private int[] index, temp, tempIndex, count;

    public List<Integer> countSmaller(int[] nums) {
        int n = nums.length;
        index = new int[n]; temp = new int[n]; tempIndex = new int[n]; count = new int[n];
        for (int i = 0; i < n; i++) index[i] = i;       // 归并的是下标
        mergeSort(nums, 0, n - 1);
        List<Integer> res = new ArrayList<>();
        for (int c : count) res.add(c);
        return res;
    }
    private void mergeSort(int[] nums, int lo, int hi) {
        if (lo >= hi) return;
        int mid = lo + (hi - lo) / 2;
        mergeSort(nums, lo, mid);
        mergeSort(nums, mid + 1, hi);
        merge(nums, lo, mid, hi);
    }
    private void merge(int[] nums, int lo, int mid, int hi) {
        int i = lo, j = mid + 1, p = lo;
        while (i <= mid && j <= hi) {
            if (nums[index[i]] <= nums[index[j]]) {     // 左边小：直接落位
                temp[p] = nums[index[i]];
                tempIndex[p++] = index[i++];
            } else {                                     // 右边小：先落位
                temp[p] = nums[index[j]];
                tempIndex[p] = index[j];
                count[index[j]] += mid - i + 1;          // 关键：左段剩余个数
                p++; j++;
            }
        }
        while (i <= mid) { temp[p] = nums[index[i]]; tempIndex[p++] = index[i++]; }
        while (j <= hi)  { temp[p] = nums[index[j]]; tempIndex[p++] = index[j++]; }
        for (int k = lo; k <= hi; k++) {               // 写回：按 index 语义同步还原
            nums[index[k]] = temp[k];
            index[k] = tempIndex[k];
        }
    }
}`,
    complexity: '时间 O(n log n)（归并模板代价）；空间 O(n)（下标+临时数组）。树状数组/线段树解法同样 O(n log n)。',
    keyPoint: '"归并排序统计类"是困难题套路：排序过程天然给出左右有序性，落位瞬间可统计逆序关系。本题是逆序对（剑指51）的加强版：不是数总对数，而是按元素归集。树状数组解法：从右往左插入，query(小于当前值的已插入数)——两种都值得掌握思路。',
  },

  /* ==================== V6 扩充：纯困难题 10 道（51~60） ==================== */

  {
    id: 'algo51', difficulty: 'hard', difficultyLabel: '困难', tag: '链表 · 归并',
    leetcodeTag: 'LeetCode 23：合并 K 个升序链表', title: '合并 K 个升序链表',
    description: '给你一个链表数组，每个链表都已经按<b>升序</b>排列。请将所有链表合并到一个升序链表中，返回合并后的链表头节点。要求认真分析时间复杂度。',
    examples: [
      '输入：lists = [[1,4,5],[1,3,4],[2,6]] → 输出：[1,1,2,3,4,4,5,6]',
      '输入：lists = [] → 输出：[]',
      '输入：lists = [[]] → 输出：[]',
    ],
    hints: [
      '朴素法：K 个指针每次找最小节点接到结果——K 条链共 n 个节点，每步 O(K) 找最小，总 O(n·K)，K 大时太慢。',
      '优化一：小顶堆（PriorityQueue）维护 K 个当前头节点，每次弹出最小、压入它的 next——每步 O(log K)，总 O(n log K)。',
      '优化二：分治，两两合并。第 1 轮 K→K/2 条，第 2 轮 K/2→K/4……共 log K 轮，每轮总工作量 O(n)，同样 O(n log K)，且常数更小、无堆开销。',
    ],
    solution: `class Solution {
    // 解法一：小顶堆（推荐背熟）
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode head : lists)
            if (head != null) heap.offer(head);     // 各链头节点入堆
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!heap.isEmpty()) {
            ListNode min = heap.poll();             // 全局最小节点
            tail.next = min; tail = min;
            if (min.next != null) heap.offer(min.next); // 它的下一位补进堆
        }
        return dummy.next;
    }

    // 解法二：分治两两合并（面试加分写法）
    public ListNode mergeDivide(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        return mergeRange(lists, 0, lists.length - 1);
    }
    private ListNode mergeRange(ListNode[] ls, int lo, int hi) {
        if (lo == hi) return ls[lo];
        int mid = (lo + hi) >>> 1;
        ListNode l = mergeRange(ls, lo, mid);
        ListNode r = mergeRange(ls, mid + 1, hi);
        return mergeTwo(l, r);                      // 复用「合并两个有序链表」
    }
    private ListNode mergeTwo(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), t = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { t.next = a; a = a.next; }
            else { t.next = b; b = b.next; }
            t = t.next;
        }
        t.next = (a != null) ? a : b;
        return dummy.next;
    }
}`,
    complexity: '堆解法：时间 O(n log K)，空间 O(K)（堆）。分治：时间 O(n log K)，空间 O(log K)（递归栈）。逐个合并的朴素法 O(nK) 必挂大用例。',
    keyPoint: '「K 路归并」四大场景通用模板：合并K链表、多路有序文件外排、也是 373 查找和最小的K个数字对的基础。面试先给堆解法（快、准），再主动提分治——展示你对「合并两个」这个子问题复用的敏感度。',
  },

  {
    id: 'algo52', difficulty: 'hard', difficultyLabel: '困难', tag: '栈 · 动态规划',
    leetcodeTag: 'LeetCode 32：最长有效括号', title: '最长有效括号',
    description: '给你一个只包含 \'(\' 和 \')\' 的字符串，找出<b>最长有效（格式正确且连续）</b>括号子串的长度。空串返回 0。',
    examples: [
      '输入：s = "(()" → 输出：2（最长有效子串是 "()"）',
      '输入：s = ")()())" → 输出：4（最长有效子串是 "()()"）',
      '输入：s = "" → 输出：0',
    ],
    hints: [
      '暴力：检查所有子串 O(n³) 或枚举+计数剪枝 O(n²)——都会超时。',
      '栈解法：栈底永远放「最后一个未被匹配的位置」作为基准，栈里存下标。遇到 \'(\' 压下标；遇到 \')\' 先弹——弹完栈空说明这个 \')\' 无法匹配（更新基准），否则当前下标减去新栈顶 = 以 i 结尾的有效长度。',
      'DP 解法：dp[i] = 以 s[i] 结尾的最长有效长度。s[i]=\')\' 且 s[i-1]=\'(\' → dp[i]=dp[i-2]+2；s[i-1]=\')\' 且 s[i-dp[i-1]-1]=\'(\' → dp[i]=dp[i-1]+2+dp[i-dp[i-1]-2]（接上前一段）。',
    ],
    solution: `class Solution {
    // 解法一：栈（下标法，一次遍历）
    public int longestValidParentheses(String s) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(-1);                       // ★ 哨兵：初始基准位置
        int ans = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                stack.push(i);                // 左括号：下标入栈待匹配
            } else {
                stack.pop();                  // 弹出一个（可能弹掉 '('，也可能弹掉基准）
                if (stack.isEmpty()) {
                    stack.push(i);            // 栈空：当前 ')' 是新的「未匹配基准」
                } else {
                    ans = Math.max(ans, i - stack.peek()); // i - 基准 = 当前有效段长
                }
            }
        }
        return ans;
    }

    // 解法二：计数器双向扫描（O(1) 空间，很妙）
    public int twoPass(String s) {
        int ans = 0, left = 0, right = 0;
        for (int i = 0; i < s.length(); i++) {          // 从左往右：')' 多于 '(' 则清零
            if (s.charAt(i) == '(') left++; else right++;
            if (left == right) ans = Math.max(ans, 2 * right);
            else if (right > left) { left = right = 0; }
        }
        left = right = 0;
        for (int i = s.length() - 1; i >= 0; i--) {     // 从右往左：处理 "(()" 型左余
            if (s.charAt(i) == '(') left++; else right++;
            if (left == right) ans = Math.max(ans, 2 * left);
            else if (left > right) { left = right = 0; }
        }
        return ans;
    }
}`,
    complexity: '栈解法：时间 O(n)，空间 O(n)。DP：O(n)/O(n)。双向计数：O(n) 时间 O(1) 空间。',
    keyPoint: '本题是「栈存下标而不是存值」的经典示范——下标才能算长度。哨兵 -1 的作用是统一「栈空」边界。双向扫描的思想来自「从左到右无法发现多余 \'(\'，从右到左无法发现多余 \')\'，各扫一次补盲区」——这种「两个方向各来一遍」是处理不对称匹配问题的通用武器。',
  },

  {
    id: 'algo53', difficulty: 'hard', difficultyLabel: '困难', tag: '栈 · 单调栈',
    leetcodeTag: 'LeetCode 84：柱状图中最大的矩形', title: '柱状图中最大的矩形',
    description: '给定 n 个非负整数表示柱状图中各柱子的高度，每根柱子彼此相邻且宽度为 1。求在该柱状图中能勾勒出来的矩形的<b>最大面积</b>。',
    examples: [
      '输入：heights = [2,1,5,6,2,3] → 输出：10（第 3~4 根柱子组成 5×2）',
      '输入：heights = [2,4] → 输出：4',
      '输入：heights = [0] → 输出：0',
    ],
    hints: [
      '暴力：对每根柱子，向左右扩展到高度小于它的边界，面积 = 高 × 宽——O(n²) 超时。',
      '关键洞察：以每根柱子为「最矮柱」的最大矩形 = 它的高度 × (右边第一个更矮的位置 - 左边第一个更矮的位置 - 1)。这就是「两侧最近更小元素」问题。',
      '单调递增栈一次遍历同时求出两侧边界：当前柱比栈顶矮时，栈顶的右边界就是 i，左边界就是弹出后的新栈顶。',
      '处理边界：末尾加一个高度 0 的哨兵，保证所有柱子最终都被弹出结算。',
    ],
    solution: `class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        int[] h = new int[n + 1];                 // 末尾哨兵 0：逼栈内柱子全部结算
        for (int i = 0; i < n; i++) h[i] = heights[i];

        Deque<Integer> stack = new ArrayDeque<>(); // 单调递增栈：存下标
        int ans = 0;
        for (int i = 0; i <= n; i++) {
            while (!stack.isEmpty() && h[i] < h[stack.peek()]) {
                int top = stack.pop();            // top 的右边界 = i（第一个更矮）
                int left = stack.isEmpty() ? -1 : stack.peek(); // 左边界 = 新栈顶（第一个更矮）
                int width = i - left - 1;         // 开区间宽
                ans = Math.max(ans, h[top] * width);
            }
            stack.push(i);
        }
        return ans;
    }
}`,
    complexity: '时间 O(n)：每根柱子入栈一次、出栈一次；空间 O(n)（栈）。',
    keyPoint: '单调栈三板斧之「两侧最近更小/更大」。判断口诀：<b>求两侧更小 → 递增栈；求两侧更大 → 递减栈</b>；出栈时结算。本题是 LeetCode 85（最大矩形，二维转每行的高度数组）的前置必学题——面试常连环问。',
  },

  {
    id: 'algo54', difficulty: 'hard', difficultyLabel: '困难', tag: '滑动窗口 · 哈希',
    leetcodeTag: 'LeetCode 76：最小覆盖子串', title: '最小覆盖子串',
    description: '给你一个字符串 s、一个字符串 t。返回 s 中<b>涵盖 t 所有字符（含重复）</b>的最短子串。如果不存在，返回空串 ""。保证答案唯一。',
    examples: [
      '输入：s = "ADOBECODEBANC", t = "ABC" → 输出："BANC"',
      '输入：s = "a", t = "a" → 输出："a"',
      '输入：s = "a", t = "aa" → 输出：""（t 有重复字符，s 中必须包含两个 a）',
    ],
    hints: [
      '暴力：枚举所有子串 O(n²)，每个再验证 O(n)——O(n³) 必超时。',
      '滑动窗口：右指针扩张直到窗口覆盖 t（need 计数全满足），然后左指针收缩求最短。',
      '用 need[128] 记 t 的字符需求，window[128] 记窗口内计数，valid 记「已满足需求的字符种数」——valid == needCount 即全覆盖，避免每次全表比对。',
    ],
    solution: `class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128], window = new int[128];
        for (char c : t.toCharArray()) need[c]++;     // 需求表
        int needKinds = 0;
        for (int v : need) if (v > 0) needKinds++;    // 需要的字符种数

        int left = 0, valid = 0, start = 0, len = Integer.MAX_VALUE;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (need[c] > 0) {                        // 是需要的字符才统计
                window[c]++;
                if (window[c] == need[c]) valid++;    // 该字符种数达标
            }
            while (valid == needKinds) {              // ★ 全覆盖：尝试收缩
                if (right - left + 1 < len) {         // 更新最短
                    start = left;
                    len = right - left + 1;
                }
                char d = s.charAt(left);
                if (need[d] > 0) {
                    if (window[d] == need[d]) valid--;// 收缩导致某字符不达标
                    window[d]--;
                }
                left++;
            }
        }
        return len == Integer.MAX_VALUE ? "" : s.substring(start, start + len);
    }
}`,
    complexity: '时间 O(|s| + |t|)：左右指针各走一遍，窗口内操作 O(1)；空间 O(128) = O(1)。',
    keyPoint: '滑动窗口万能模板：「右扩到满足，左缩到不满足，中途打最值」。valid 计数避免 O(26/128) 的全表比较是性能关键。同模板题：438 找所有字母异位词、567 排列、3 无重复最长子串——背会一题等于带走五题。',
  },

  {
    id: 'algo55', difficulty: 'hard', difficultyLabel: '困难', tag: '堆 · 双堆',
    leetcodeTag: 'LeetCode 295：数据流的中位数', title: '数据流的中位数',
    description: '中位数是有序整数列表中的中间值。如果列表长度为偶数，中位数是中间两个值的平均值。设计一个支持以下两种操作的数据结构：<br>• <b>addNum(int num)</b> - 从数据流中添加一个整数<br>• <b>findMedian()</b> - 返回目前所有元素的中位数。要求 addNum 和 findMedian 的总复杂度优于 O(n)。',
    examples: [
      '输入：["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]<br>[[],[1],[2],[],[3],[]]<br>输出：[null,null,null,1.5,null,2.0]',
      '输入：["MedianFinder","addNum","findMedian"]<br>[[],[-1],[]]<br>输出：[null,-1.0,-1.0]',
    ],
    hints: [
      '数组排序：add O(n log n)、插入 O(n)——能过但不是最优解，面试不给满分。',
      '对顶堆：一个大顶堆存较小的一半，一个小顶堆存较大的一半，中位数必在堆顶附近。',
      '关键在不变式维护：① 两个堆元素数相等或大顶堆多 1；② 大顶堆所有元素 ≤ 小顶堆所有元素。add 时「先入一边、再平衡」三步走。',
    ],
    solution: `class MedianFinder {
    private PriorityQueue<Integer> maxHalf; // 大顶堆：较小的一半（堆顶=该半最大）
    private PriorityQueue<Integer> minHalf; // 小顶堆：较大的一半（堆顶=该半最小）

    public MedianFinder() {
        maxHalf = new PriorityQueue<>((a, b) -> b - a);
        minHalf = new PriorityQueue<>();
    }

    public void addNum(int num) {
        // ★ 三步走：进 A → 调整 → 平衡大小
        maxHalf.offer(num);                     // 1. 先丢进大顶堆
        minHalf.offer(maxHalf.poll());          // 2. 把大顶堆顶（该半最大）给小顶堆 → 保证有序性
        if (minHalf.size() > maxHalf.size())    // 3. 小顶堆若比大顶堆多 → 归还一个
            maxHalf.offer(minHalf.poll());
        // 不变式：maxHalf.size() == minHalf.size() 或多 1；maxHalf.peek() <= minHalf.peek()
    }

    public double findMedian() {
        if (maxHalf.size() > minHalf.size()) return maxHalf.peek();
        return (maxHalf.peek() + minHalf.peek()) / 2.0;   // 偶数：两堆顶平均
    }
}`,
    complexity: 'addNum O(log n)（最多三次堆操作）；findMedian O(1)；空间 O(n)。进阶：FollowUp 问「数据流 1~100 范围」→ 计数排序桶 O(1) 均摊；「99% 是 0~100」→ 桶 + 溢出双堆混合。',
    keyPoint: '对顶堆模式是「动态中位数/动态第 K 大」的标准解。为什么平衡步骤固定写「maxHalf → minHalf → 归还」而不是判断大小分别入堆？——因为统一流程少写分支就少错，且自动维持两条不变式。FollowUp 的桶计数思路是高频追问，务必主动提。',
  },

  {
    id: 'algo56', difficulty: 'hard', difficultyLabel: '困难', tag: '设计 · 双向链表 + 哈希',
    leetcodeTag: 'LeetCode 146：LRU 缓存（困难版要求 O(1)）', title: 'LRU 缓存',
    description: '请你设计并实现一个满足 <b>LRU（最近最少使用）</b>约束的数据结构：get、put 都要 <b>O(1)</b> 平均时间复杂度。<br>• LRUCache(int capacity) 以正整数容量初始化<br>• get(key)：存在返回值并<b>提升为最近使用</b>，否则 -1<br>• put(key, value)：存在则改值并提升；不存在插入，若容量超限<b>淘汰最久未使用的 key</b>。',
    examples: [
      '输入：["LRUCache","put","put","get","put","get","put","get","get","get"]<br>[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]<br>输出：[null,null,null,1,null,-1,null,-1,3,4]',
    ],
    hints: [
      'O(1) get → 哈希表。O(1) 插入/删除+维护使用顺序 → 双向链表。二者合体 = LinkedHashMap（Java 已造好轮子）。',
      '手写版：Node{key, value, prev, next}，用 dummy head/tail 哨兵简化边界；哈希表存 key → Node。',
      '容易漏的细节：put 更新已有 key 时也要「提升为最近使用」；淘汰时要同时从<b>链表和哈希表</b>删（所以 Node 里要存 key）。',
    ],
    solution: `class LRUCache {
    class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0);  // 哨兵头：head.next 是最新
    private final Node tail = new Node(0, 0);  // 哨兵尾：tail.prev 是最旧
    private final int cap;

    public LRUCache(int capacity) {
        cap = capacity;
        head.next = tail; tail.prev = head;    // 首尾互连
    }

    public int get(int key) {
        Node n = map.get(key);
        if (n == null) return -1;
        moveToFront(n);                        // ★ 访问即提升
        return n.value;
    }

    public void put(int key, int value) {
        Node n = map.get(key);
        if (n != null) {                       // 已存在：改值 + 提升
            n.value = value;
            moveToFront(n);
            return;
        }
        if (map.size() >= cap) {               // ★ 满了先淘汰最旧
            Node oldest = tail.prev;
            unlink(oldest);
            map.remove(oldest.key);            // Node 必须存 key 的原因
        }
        Node fresh = new Node(key, value);
        map.put(key, fresh);
        addToFront(fresh);
    }

    private void unlink(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void addToFront(Node n) {
        n.next = head.next; n.prev = head;
        head.next.prev = n; head.next = n;
    }
    private void moveToFront(Node n) { unlink(n); addToFront(n); }
}`,
    complexity: 'get/put 均 O(1)（哈希 + 链表指针操作）；空间 O(capacity)。',
    keyPoint: 'LRU 是后端面试出现率第一的设计题：Redis 近似 LRU、操作系统页面置换、数据库 buffer pool 全是它的变体。三条铁律：① 哈希 + 双向链表才能双 O(1)；② Node 里必须存 key（淘汰时反查哈希表）；③ 访问（含 get 和 put 更新）都要提升。写完主动说「生产上 Java 直接继承 LinkedHashMap(accessOrder=true) + removeEldestEntry 10 行搞定」——展示源码理解（见集合源码专篇）。',
  },

  {
    id: 'algo57', difficulty: 'hard', difficultyLabel: '困难', tag: '二叉树 · 递归',
    leetcodeTag: 'LeetCode 124：二叉树中的最大路径和', title: '二叉树中的最大路径和',
    description: '二叉树中的<b>路径</b>被定义为一条节点序列，序列中每对相邻节点之间都存在一条边。同一个节点在一条路径序列中<b>至多出现一次</b>，该路径<b>至少包含一个</b>节点，且不一定经过根节点。<b>路径和</b>是路径中各节点值的总和。给你二叉树的根节点 root，返回其<b>最大路径和</b>（节点值可能为负）。',
    examples: [
      '输入：root = [1,2,3] → 输出：6（路径 2 → 1 → 3）',
      '输入：root = [-10,9,20,null,null,15,7] → 输出：42（路径 15 → 20 → 7）',
      '输入：root = [-3] → 输出：-3',
    ],
    hints: [
      '「路径」可以理解为：在某个节点「拐弯」——左子树贡献一条向上的链 + 自己 + 右子树贡献一条向上的链。',
      '递归函数含义要定义清楚：gain(node) = 「从 node 出发只能选一条分支向下走」的最大贡献（可为 0 表示不选，但只向下）。',
      '答案更新与返回值是两码事：在 node 处更新 ans = max(ans, node.val + 左gain + 右gain)（拐弯形态），但返回给父亲的只能是 node.val + max(左gain, 右gain)（不能拐弯）。',
    ],
    solution: `class Solution {
    private int ans = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        gain(root);
        return ans;
    }

    // 返回：以 node 为起点、只能选一侧往下走时的最大贡献（负贡献直接放弃记 0）
    private int gain(TreeNode node) {
        if (node == null) return 0;
        int left  = Math.max(gain(node.left),  0);  // 左贡献，负则不要
        int right = Math.max(gain(node.right), 0);  // 右贡献，负则不要

        // ★ 「拐弯」形态只在此处结算（全局唯一机会）
        ans = Math.max(ans, node.val + left + right);

        // 返回给父亲：只能延伸一条边，选贡献大的一侧（或都不选=0）
        return node.val + Math.max(left, right);
    }
}`,
    complexity: '时间 O(n)：每个节点访问一次；空间 O(h) 递归栈，最坏 O(n) 链状树。',
    keyPoint: '树形 DP 的「答案在过程中、贡献在返回值」分离范式——124、543 直径、687 最长同值路径三道题完全同构：都定义「单侧向下延伸」的 gain，都在节点处结算「经过该节点」的全局答案。区分不清「路径能拐弯」和「递归只能直着向上」就写不对——这是本题最大的思维门槛。',
  },

  {
    id: 'algo58', difficulty: 'hard', difficultyLabel: '困难', tag: '动态规划 · 区间',
    leetcodeTag: 'LeetCode 312：戳气球', title: '戳气球',
    description: '有 n 个气球，编号 0 到 n-1，每个气球上标着一个数字（数组 nums）。戳破气球 i 可以获得 <b>nums[left] × nums[i] × nums[right]</b> 个硬币（left/right 是相邻剩余气球）。求戳破所有气球能获得的<b>最多</b>硬币数。两端可视作虚拟气球，值为 1，且不能戳破。',
    examples: [
      '输入：nums = [3,1,5,8] → 输出：167<br>解释：戳 1 得 3×1×5=15，再戳 5 得 3×5×8=120，再戳 3 得 1×3×8=24，最后戳 8 得 1×8×1=8，合计 167',
      '输入：nums = [1,5] → 输出：35',
    ],
    hints: [
      '正向思考「先戳哪个」→ 子区间被戳破后边界互相影响，状态定义不出来。反向思考：<b>最后一个</b>被戳破的气球是 k——它戳破时左右边界是完整区间的两端！',
      '定义 dp[i][j] = 开区间 (i, j)（不含边界）内气球全部戳完的最大硬币数。转移：枚举区间内「最后戳破」的 k，dp[i][j] = max(dp[i][k] + dp[k][j] + nums[i]×nums[k]×nums[j])。',
      '在数组前后加虚拟气球 1，把边界情况统一掉；按区间长度从 2 到 n 递增遍历（小区间先算）。',
    ],
    solution: `class Solution {
    public int maxCoins(int[] nums) {
        int n = nums.length;
        int[] pts = new int[n + 2];            // 前后加虚拟气球 1
        pts[0] = pts[n + 1] = 1;
        for (int i = 0; i < n; i++) pts[i + 1] = nums[i];

        int m = n + 2;
        int[][] dp = new int[m][m];            // dp[i][j]：开区间(i,j)全戳完的最大收益

        for (int len = 2; len <= m - 1; len++) {       // 区间长度：从最小开始
            for (int i = 0; i + len <= m - 1; i++) {
                int j = i + len;
                for (int k = i + 1; k < j; k++) {      // k = 开区间内最后一个被戳的气球
                    int coins = dp[i][k] + dp[k][j] + pts[i] * pts[k] * pts[j];
                    if (coins > dp[i][j]) dp[i][j] = coins;
                }
            }
        }
        return dp[0][m - 1];                   // (0, n+1) 开区间 = 全部真气球
    }
}`,
    complexity: '时间 O(n³)（区间 n² 个 × 转移点 n 个）；空间 O(n²)。',
    keyPoint: '「正着不行反着想」是区间 DP 的灵魂：最后一步的选择若能让左右两侧互不干扰，状态就可分解。同套路题：375 猜数字大小 II、546 消消乐、1000 合并石头的最低成本。记忆钩子：<b>区间 DP = 枚举长度 → 枚举左端点 → 枚举分界点</b>三层循环，一眼识别。',
  },

  {
    id: 'algo59', difficulty: 'hard', difficultyLabel: '困难', tag: '二分答案',
    leetcodeTag: 'LeetCode 4：寻找两个正序数组的中位数', title: '寻找两个正序数组的中位数',
    description: '给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请找出并返回这两个正序数组的<b>中位数</b>。要求算法的时间复杂度为 <b>O(log (m+n))</b>。',
    examples: [
      '输入：nums1 = [1,3], nums2 = [2] → 输出：2.00000',
      '输入：nums1 = [1,2], nums2 = [3,4] → 输出：2.50000',
      '输入：nums1 = [], nums2 = [1] → 输出：1.00000',
    ],
    hints: [
      '合并后取中位 O(m+n)——不满足对数复杂度要求，面试只能算及格线。',
      '中位数的本质：「把所有元素分成等长两半，左半最大 ≤ 右半最小」。在短数组上二分它的分割线 i，长数组分割线 j = (m+n+1)/2 - i 可直接算出。',
      '判定条件：nums1[i-1] ≤ nums2[j] 且 nums2[j-1] ≤ nums1[i]（两条分割线左半的最大都 ≤ 对方右半的最小）。不满足就调整 i——这就是二分。',
      '用正无穷/负无穷处理分割线在端点的情况；总数为奇数时中位数 = 左半最大，偶数 = (左半最大 + 右半最小)/2。',
    ],
    solution: `class Solution {
    public double findMedianSortedArrays(int[] a, int[] b) {
        if (a.length > b.length) return findMedianSortedArrays(b, a); // ★ 保证在短数组上二分
        int m = a.length, n = b.length;
        int half = (m + n + 1) / 2;            // 左半应含的元素数（奇偶通吃）

        int lo = 0, hi = m;
        while (lo <= hi) {
            int i = (lo + hi) >>> 1;           // a 的分割线：左半取 a 的前 i 个
            int j = half - i;                  // b 的分割线随之确定
            int aL = (i == 0) ? Integer.MIN_VALUE : a[i - 1];  // 左半最大（端点用 ±∞）
            int aR = (i == m) ? Integer.MAX_VALUE : a[i];
            int bL = (j == 0) ? Integer.MIN_VALUE : b[j - 1];
            int bR = (j == n) ? Integer.MAX_VALUE : b[j];

            if (aL <= bR && bL <= aR) {        // ★ 分割线合法
                if (((m + n) & 1) == 1) return Math.max(aL, bL);        // 奇：左半最大
                return (Math.max(aL, bL) + Math.min(aR, bR)) / 2.0;     // 偶：中间两数平均
            } else if (aL > bR) {
                hi = i - 1;                    // a 拿多了 → 分割线左移
            } else {
                lo = i + 1;                    // a 拿少了 → 分割线右移
            }
        }
        throw new IllegalArgumentException("输入非有序");
    }
}`,
    complexity: '时间 O(log min(m, n))：只在短数组上二分；空间 O(1)。',
    keyPoint: '本题是「二分查找分割线而非元素」的巅峰题，也是「二分答案」家族的最高频困难题。核心思想迁移：把「找中位数」翻译成「找一种把两数组切成等长两半且有序性不被破坏的方案」，再对方案参数二分。同思想题：1231 分享巧克力、410 分割数组最大值——「答案有单调性 → 二分答案 + 贪心验证」。',
  },

  {
    id: 'algo60', difficulty: 'hard', difficultyLabel: '困难', tag: '动态规划 · 编辑距离',
    leetcodeTag: 'LeetCode 72：编辑距离', title: '编辑距离',
    description: '给你两个单词 word1 和 word2，请返回将 word1 转换成 word2 所使用的<b>最少操作数</b>。可以对一个单词进行三种操作：插入一个字符、删除一个字符、替换一个字符。',
    examples: [
      '输入：word1 = "horse", word2 = "ros" → 输出：3<br>解释：horse → rorse（替换 h）→ rose（删 r）→ ros（删 e）',
      '输入：word1 = "intention", word2 = "execution" → 输出：5',
      '输入：word1 = "", word2 = "abc" → 输出：3（全插入）',
    ],
    hints: [
      '定义 dp[i][j] = word1 前 i 个字符变成 word2 前 j 个字符的最少操作数。这是「两个字符串」型 DP 的祖师爷。',
      '状态转移核心在末尾字符：word1[i-1] == word2[j-1] → dp[i][j] = dp[i-1][j-1]（白嫖，不花操作）；否则三种操作取最小 +1：dp[i-1][j-1]（替换）、dp[i-1][j]（删除 word1 末位）、dp[i][j-1]（插入）。',
      '初始化即「边界语义」：dp[i][0] = i（全删）、dp[0][j] = j（全插）。填表顺序：逐行从左到右，依赖左、上、左上。',
    ],
    solution: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        // dp[i][j]：word1 前 i 个 → word2 前 j 个的最少操作
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) dp[i][0] = i;   // 边界：word2 空，全删
        for (int j = 1; j <= n; j++) dp[0][j] = j;   // 边界：word1 空，全插

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];          // 尾字符相同：免费继承
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j - 1],                 // 替换 word1[i-1] 成 word2[j-1]
                        Math.min(dp[i - 1][j],            // 删除 word1[i-1]
                                 dp[i][j - 1]));          // 插入 word2[j-1]
                }
            }
        }
        return dp[m][n];
    }
}`,
    complexity: '时间 O(m×n)；空间 O(m×n)，可滚动数组优化到 O(min(m, n))。',
    keyPoint: '编辑距离是字符串 DP 的「母题」：LCS（1143）、最小 ASCII 删除和（712）、正则匹配（10）、通配符匹配（44）全是它的近亲。三个操作的语义映射：<b>dp[i-1][j]=删、dp[i][j-1]=插、dp[i-1][j-1]=替换/匹配</b>——理解了这行注释，这一族题就全通了。面试若问优化：滚动数组省空间；若问应用：拼写检查、DNA 序列比对、git diff 的底层思想。',
  },
];

