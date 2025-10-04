export const trainPairs: ReadonlyArray<readonly [string, string]> = [
  [
    'what is big o notation',
    'Big-O notation expresses the upper bound of time/space complexity as input size grows. Common classes: O(1), O(log n), O(n), O(n log n), O(n^2).'
  ],
  [
    'difference between time and space complexity',
    'Time complexity measures running time; space complexity measures memory used. Both depend on input size growth rate.'
  ],
  [
    'amortized analysis',
    'Amortized analysis averages cost over a sequence of operations. Example: dynamic array resizing — occasional O(n) cost, but O(1) amortized per insert.'
  ],
  [
    'binary search edge cases',
    'Binary search edges: empty array, single element, all same values, target less/greater than all, mid overflow via l + (r-l)//2.'
  ],
  [
    'merge sort explanation',
    'Merge sort divides array into halves, recursively sorts, then merges. Always O(n log n) time, O(n) space, stable.'
  ],
  [
    'quick sort algorithm',
    'Quicksort picks pivot, partitions smaller on left larger on right, then recurses. Avg O(n log n), worst O(n^2).'
  ],
  [
    'heap sort explanation',
    'Heap sort builds a max-heap, then repeatedly extracts the max and rebuilds heap. O(n log n) time, O(1) space, not stable.'
  ],
  [
    'counting sort',
    'Counting sort counts occurrences of elements. Works for small integer ranges. O(n+k) time, O(k) space, stable.'
  ],
  [
    'radix sort',
    'Radix sort sorts digits from LSD to MSD using counting sort. O(nk) time for k-digit numbers, stable.'
  ],
  [
    'bucket sort',
    'Bucket sort divides range into buckets, sorts each (often via insertion sort), and merges. Good for uniform data.'
  ],
  [
    'stack and queue difference',
    'Stack: LIFO (last in, first out). Queue: FIFO (first in, first out). Used for recursion vs task scheduling respectively.'
  ],
  [
    'linked list vs array',
    'Linked list: dynamic size, O(1) insertion/deletion but O(n) access. Array: fixed size, O(1) access but costly insertion/deletion.'
  ],
  [
    'circular linked list use case',
    'Circular linked list connects tail to head, good for round-robin scheduling or buffering.'
  ],
  [
    'doubly linked list advantage',
    'Doubly linked lists allow O(1) backward traversal and deletion with a reference to the node.'
  ],
  [
    'hash map collision handling',
    'Handled by chaining (linked lists) or open addressing (linear, quadratic, double hashing).'
  ],
  [
    'when to use trie',
    'Trie stores strings by shared prefixes. Used for autocomplete, spell check, and prefix searches.'
  ],
  [
    'heap applications',
    'Heaps are used in priority queues, Dijkstra, median finding, and scheduling tasks.'
  ],
  [
    'difference between bst and avl tree',
    'BST may become skewed; AVL self-balances with rotations, keeping height O(log n).'
  ],
  [
    'segment tree use',
    'Segment Tree answers range queries (sum/min/max) and updates in O(log n).'
  ],
  [
    'fenwick tree or binary indexed tree',
    'BIT efficiently supports prefix sums and updates in O(log n) using binary indexing.'
  ],

  // graphs
  [
    'difference bfs dfs',
    'BFS explores level by level using a queue. DFS goes deep using recursion or a stack.'
  ],
  [
    'detect cycle in directed graph',
    'Use DFS with recursion stack or Kahn’s topological sort checking leftover nodes.'
  ],
  [
    'detect cycle in undirected graph',
    'Use DFS with parent tracking or Union-Find (Disjoint Set).'
  ],
  [
    'dijkstra algorithm',
    'Dijkstra finds shortest paths from source to all nodes with non-negative weights using a priority queue. O((V+E) log V).'
  ],
  [
    'bellman ford algorithm',
    'Bellman-Ford finds shortest paths allowing negative weights. O(VE) time, detects negative cycles.'
  ],
  [
    'floyd warshall algorithm',
    'Floyd-Warshall finds all-pairs shortest paths. O(n^3) time, works with negative weights (no cycles).'
  ],
  [
    'topological sort',
    'Orders DAG nodes so edges go from earlier to later. Done via DFS or Kahn’s algorithm.'
  ],
  [
    'kruskal algorithm',
    'Kruskal builds MST by sorting edges and using Union-Find to avoid cycles. O(E log E).'
  ],
  [
    'prim algorithm',
    'Prim builds MST by adding smallest edge from current tree to new vertex. O(E log V) with heap.'
  ],
  [
    'tarjan algorithm',
    'Tarjan’s algorithm finds strongly connected components using DFS timestamps. O(V+E).'
  ],

  // DP & Greedy
  [
    'dynamic programming concept',
    'DP solves overlapping subproblems using optimal substructure, via memoization or tabulation.'
  ],
  [
    'knapsack problem types',
    '0/1 Knapsack uses DP; fractional knapsack uses greedy sorting by value/weight ratio.'
  ],
  [
    'longest common subsequence',
    'LCS between strings A and B found using DP table. O(n*m) time and space.'
  ],
  [
    'longest increasing subsequence',
    'LIS finds max length of increasing subsequence. O(n log n) using binary search.'
  ],
  [
    'edit distance problem',
    'Finds min operations (insert, delete, replace) to convert string A to B using DP. O(n*m).'
  ],
  [
    'coin change problem',
    'DP problem finding number of ways or min coins to make amount. O(n*amount).'
  ],
  [
    'kadane algorithm',
    'Kadane’s algorithm finds maximum subarray sum in O(n) time using running sum tracking.'
  ],
  [
    'sliding window technique',
    'Used for subarray/substring problems by maintaining a moving window. O(n) typically.'
  ],
  [
    'two pointer technique',
    'Two pointers move inwards/outwards to optimize search in sorted arrays, used in 2-sum, merge arrays, etc.'
  ],

  // strings
  [
    'kmp algorithm',
    'KMP pattern matching precomputes lps array to avoid rechecking. O(n+m) time.'
  ],
  [
    'rabin karp algorithm',
    'Uses rolling hash for string matching. O(n+m) average, O(nm) worst.'
  ],
  [
    'manacher algorithm',
    'Manacher finds longest palindromic substring in O(n) time using mirror expansion.'
  ],
  [
    'z algorithm',
    'Z-algorithm computes prefix matches efficiently for pattern search. O(n+m).'
  ],
  [
    'trie vs hashmap for string storage',
    'Trie is better for prefix search; hashmap for exact matches.'
  ],

  // advanced
  [
    'lru cache implementation',
    'LRU uses hash map + doubly linked list for O(1) get and put operations.'
  ],
  [
    'top k frequent elements',
    'Use min-heap or bucket sort to track top k frequencies. O(n log k).'
  ],
  [
    'monotonic stack usage',
    'Monotonic stacks track increasing/decreasing elements. Used in next greater element, stock span, histogram problems.'
  ],
  [
    'union find path compression',
    'Path compression flattens tree structure for near O(1) find operations.'
  ],
  [
    'difference between recursion and backtracking',
    'Recursion divides tasks hierarchically; backtracking undoes invalid choices to explore all valid solutions.'
  ],
  [
    'difference between dfs and backtracking',
    'DFS explores depth first, may stop early; backtracking explores all paths by undoing steps when invalid.'
  ],
  [
    'divide and conquer examples',
    'Examples: Merge Sort, Quick Sort, Binary Search, Closest Pair of Points.'
  ],
  [
    'greedy algorithm examples',
    'Greedy examples: Huffman coding, Kruskal, Prim, Fractional Knapsack, Activity selection.'
  ],
  [
    'prefix sum array use',
    'Prefix sum array precomputes cumulative sums to answer range queries in O(1).'
  ],
  [
    'difference between stable and unstable sort',
    'Stable sort preserves order of equal elements. Merge and insertion sort are stable; quicksort and heap sort are not.'
  ],
  [
    'time complexity of heap operations',
    'Insert O(log n), extract-min/max O(log n), peek O(1), build heap O(n).'
  ],
  [
    'difference between queue and deque',
    'Queue allows insert at rear and delete at front; deque allows both ends.'
  ],
  [
    'difference between bfs and dijkstra',
    'BFS gives shortest path in unweighted graphs; Dijkstra does for weighted graphs with non-negative edges.'
  ]
];