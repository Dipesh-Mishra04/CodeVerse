import type {
  CodingLanguage,
  Difficulty,
  LeaderboardEntry,
  QuestionDetail,
  QuestionSummary,
  Topic,
} from "@/types";

export const MOCK_TOPICS: Topic[] = [
  { id: "t1", name: "Arrays", slug: "arrays", icon: "Layers", description: "Array techniques", questionCount: 4 },
  { id: "t2", name: "Strings", slug: "strings", icon: "Type", description: "String problems", questionCount: 2 },
  { id: "t3", name: "Linked Lists", slug: "linked-lists", icon: "List", description: "Pointer manipulation", questionCount: 2 },
  { id: "t4", name: "Stacks & Queues", slug: "stacks-queues", icon: "Boxes", description: "LIFO & FIFO", questionCount: 1 },
  { id: "t5", name: "Trees", slug: "trees", icon: "GitBranch", description: "Hierarchical structures", questionCount: 2 },
  { id: "t6", name: "Graphs", slug: "graphs", icon: "Share2", description: "Traversal & paths", questionCount: 1 },
  { id: "t7", name: "Dynamic Programming", slug: "dynamic-programming", icon: "Cpu", description: "Optimal substructure", questionCount: 2 },
];

const topic = (slug: string) => {
  const t = MOCK_TOPICS.find((x) => x.slug === slug);
  if (!t) return { id: "t0", name: "General", slug: "general" };
  return { id: t.id, name: t.name, slug: t.slug };
};

function q(
  id: string,
  title: string,
  slug: string,
  difficulty: Difficulty,
  topicSlug: string,
  company: string[],
  premium: boolean,
  status: QuestionSummary["status"],
  bookmarked: boolean
): QuestionSummary {
  return {
    id,
    title,
    slug,
    difficulty,
    topic: topic(topicSlug),
    company_tags: company,
    is_premium: premium,
    status,
    bookmarked,
  };
}

export const MOCK_QUESTION_SUMMARIES: QuestionSummary[] = [
  q("q1", "Two Sum", "two-sum", "easy", "arrays", ["Google", "Amazon"], false, "solved", true),
  q("q2", "Reverse Linked List", "reverse-linked-list", "easy", "linked-lists", ["Microsoft"], false, "attempted", false),
  q("q3", "Valid Parentheses", "valid-parentheses", "easy", "stacks-queues", ["Bloomberg"], false, "unsolved", false),
  q("q4", "Binary Search", "binary-search", "easy", "arrays", ["Meta"], false, "solved", false),
  q("q5", "Merge Intervals", "merge-intervals", "medium", "arrays", ["Google", "Uber"], false, "unsolved", true),
  q("q6", "Number of Islands", "number-of-islands", "medium", "graphs", ["Amazon", "DoorDash"], false, "attempted", false),
  q("q7", "Longest Increasing Subsequence", "longest-increasing-subsequence", "medium", "dynamic-programming", ["Apple"], true, "unsolved", false),
  q("q8", "Climbing Stairs", "climbing-stairs", "easy", "dynamic-programming", ["Adobe"], false, "solved", false),
  q("q9", "Invert Binary Tree", "invert-binary-tree", "easy", "trees", ["Google"], false, "unsolved", false),
  q("q10", "Lowest Common Ancestor of a BST", "lowest-common-ancestor-bst", "medium", "trees", ["Meta", "Amazon"], false, "unsolved", false),
  q("q11", "Group Anagrams", "group-anagrams", "medium", "strings", ["Yelp"], false, "attempted", false),
  q("q12", "Trapping Rain Water", "trapping-rain-water", "hard", "arrays", ["Amazon", "Bloomberg"], true, "unsolved", false),
];

const DESCRIPTION_TWO_SUM = `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`;

const DETAIL = (
  slug: string,
  extra: Partial<QuestionDetail> & Pick<QuestionDetail, "title" | "description">
): QuestionDetail => ({
  id: MOCK_QUESTION_SUMMARIES.find((x) => x.slug === slug)?.id ?? "q0",
  slug,
  difficulty: MOCK_QUESTION_SUMMARIES.find((x) => x.slug === slug)?.difficulty ?? "easy",
  topic: topic(MOCK_QUESTION_SUMMARIES.find((x) => x.slug === slug)?.topic.slug ?? "arrays"),
  company_tags: MOCK_QUESTION_SUMMARIES.find((x) => x.slug === slug)?.company_tags ?? [],
  constraints: null,
  input_format: null,
  output_format: null,
  sample_input: null,
  sample_output: null,
  editorial: null,
  is_premium: MOCK_QUESTION_SUMMARIES.find((x) => x.slug === slug)?.is_premium ?? false,
  related_topic_slugs: ["arrays", "hashing"],
  user_solved: MOCK_QUESTION_SUMMARIES.find((x) => x.slug === slug)?.status === "solved",
  ...extra,
});

export const MOCK_QUESTION_DETAILS: Record<string, QuestionDetail> = {
  "two-sum": DETAIL("two-sum", {
    title: "Two Sum",
    description: DESCRIPTION_TWO_SUM,
    constraints: `- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9\n- Only one valid answer exists.`,
    input_format: `First line: \`n\` — length of array\nSecond line: \`n\` space-separated integers\nThird line: \`target\``,
    output_format: `Two space-separated indices \`i j\` (0-based).`,
    sample_input: `4\n2 7 11 15\n9`,
    sample_output: `0 1`,
    editorial: `Use a hash map from value → index while scanning. For each value \`x\`, check if \`target - x\` exists in the map.`,
  }),
  "reverse-linked-list": DETAIL("reverse-linked-list", {
    title: "Reverse Linked List",
    description: `Given the \`head\` of a singly linked list, reverse the list and return the new head.`,
    constraints: `The number of nodes in the list is in the range [0, 5000].\n-5000 <= Node.val <= 5000`,
    input_format: `Space-separated list values ending with -1 for null (stub format).`,
    output_format: `Reversed values on one line.`,
    sample_input: `1 2 3 4 5 -1`,
    sample_output: `5 4 3 2 1`,
    editorial: `Iterative: maintain \`prev\` and \`curr\` pointers; or recursive unwind.`,
  }),
  "valid-parentheses": DETAIL("valid-parentheses", {
    title: "Valid Parentheses",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.`,
    constraints: `1 <= s.length <= 10^4`,
    input_format: `A single line string \`s\`.`,
    output_format: `\`true\` or \`false\`.`,
    sample_input: `()[]{}`,
    sample_output: `true`,
    editorial: `Use a stack; push on open, pop and match on close.`,
  }),
  "binary-search": DETAIL("binary-search", {
    title: "Binary Search",
    description: `Given a sorted array of distinct integers and a target, return its index or -1.`,
    constraints: `1 <= nums.length <= 10^4`,
    input_format: `Sorted integers then target.`,
    output_format: `Index or -1.`,
    sample_input: `-1 0 3 5 9 12\n9`,
    sample_output: `4`,
    editorial: `Classic two-pointer binary search on sorted array.`,
  }),
  "merge-intervals": DETAIL("merge-intervals", {
    title: "Merge Intervals",
    description: `Given an array of intervals, merge all overlapping intervals.`,
    constraints: `1 <= intervals.length <= 10^4`,
    input_format: `Stub: pairs a b per line, empty line to end.`,
    output_format: `Merged intervals.`,
    sample_input: `1 3\n2 6\n8 10\n15 18\n`,
    sample_output: `1 6\n8 10\n15 18`,
    editorial: `Sort by start; sweep and merge when overlap.`,
  }),
  "number-of-islands": DETAIL("number-of-islands", {
    title: "Number of Islands",
    description: `Count islands in a binary grid (4-directionally connected 1s).`,
    constraints: `m,n <= 300`,
    input_format: `Grid rows of 0/1.`,
    output_format: `Integer count.`,
    sample_input: `11000\n11000\n00100\n00011`,
    sample_output: `3`,
    editorial: `DFS/BFS flood fill or union-find.`,
  }),
  "longest-increasing-subsequence": DETAIL("longest-increasing-subsequence", {
    title: "Longest Increasing Subsequence",
    description: `Return length of longest strictly increasing subsequence.`,
    constraints: `1 <= nums.length <= 2500`,
    input_format: `Space-separated integers.`,
    output_format: `Single integer length.`,
    sample_input: `10 9 2 5 3 7 101 18`,
    sample_output: `4`,
    editorial: `Patience sorting O(n log n) or DP O(n^2).`,
  }),
  "climbing-stairs": DETAIL("climbing-stairs", {
    title: "Climbing Stairs",
    description: `You can climb 1 or 2 steps. How many distinct ways to reach the top?`,
    constraints: `1 <= n <= 45`,
    input_format: `Integer n`,
    output_format: `Ways mod large prime (stub: integer)`,
    sample_input: `3`,
    sample_output: `3`,
    editorial: `Fibonacci: \`ways(n) = ways(n-1) + ways(n-2)\`.`,
  }),
  "invert-binary-tree": DETAIL("invert-binary-tree", {
    title: "Invert Binary Tree",
    description: `Invert a binary tree (mirror left/right subtrees).`,
    constraints: `The tree has at most 100 nodes.`,
    input_format: `Level-order stub`,
    output_format: `Level-order inverted`,
    sample_input: `4 2 7 1 3 6 9`,
    sample_output: `4 7 2 9 6 3 1`,
    editorial: `Swap children recursively or iteratively with queue.`,
  }),
  "lowest-common-ancestor-bst": DETAIL("lowest-common-ancestor-bst", {
    title: "Lowest Common Ancestor of a BST",
    description: `Given a BST and two values, find their LCA.`,
    constraints: `All values unique in BST.`,
    input_format: `Stub`,
    output_format: `Value of LCA node`,
    sample_input: `6 2 8\n2\n8`,
    sample_output: `6`,
    editorial: `Walk from root: if both < root go left; if both > go right; else root is LCA.`,
  }),
  "group-anagrams": DETAIL("group-anagrams", {
    title: "Group Anagrams",
    description: `Group strings that are anagrams.`,
    constraints: `1 <= strs.length <= 10^4`,
    input_format: `Words on one line`,
    output_format: `Grouped lines (stub)`,
    sample_input: `eat tea tan ate nat bat`,
    sample_output: `bat\nteat ate\ntan nat`,
    editorial: `Key by sorted string or count array signature.`,
  }),
  "trapping-rain-water": DETAIL("trapping-rain-water", {
    title: "Trapping Rain Water",
    description: `Compute trapped water between bars.`,
    constraints: `n <= 2 * 10^4`,
    input_format: `Heights space-separated`,
    output_format: `Integer liters trapped`,
    sample_input: `0 1 0 2 1 0 1 3 2 1 2 1`,
    sample_output: `6`,
    editorial: `Two pointers tracking left/right max height.`,
  }),
};

export const MOCK_LANGUAGES: CodingLanguage[] = [
  {
    id: "py",
    name: "Python",
    slug: "python",
    version: "3.11",
    file_extension: "py",
    template_code:
      "def solve():\n    pass\n\nif __name__ == '__main__':\n    solve()\n",
  },
  {
    id: "js",
    name: "JavaScript",
    slug: "javascript",
    version: "Node 20",
    file_extension: "js",
    template_code: "function solve() {\n  // your code\n}\n\nsolve();\n",
  },
  {
    id: "cpp",
    name: "C++",
    slug: "cpp",
    version: "g++ 13",
    file_extension: "cpp",
    template_code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  return 0;\n}\n",
  },
  {
    id: "java",
    name: "Java",
    slug: "java",
    version: "21",
    file_extension: "java",
    template_code:
      "public class Main {\n  public static void main(String[] args) {\n  }\n}\n",
  },
  {
    id: "go",
    name: "Go",
    slug: "go",
    version: "1.22",
    file_extension: "go",
    template_code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n}\n",
  },
  {
    id: "c",
    name: "C",
    slug: "c",
    version: "gcc 13",
    file_extension: "c",
    template_code: "#include <stdio.h>\n\nint main(void) {\n  return 0;\n}\n",
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = Array.from({ length: 25 }, (_, i) => ({
  rank: i + 1,
  user_id: `u${i + 1}`,
  username: `coder_${i + 1}`,
  avatar_url: null,
  college: ["MIT", "Stanford", "NIT", "IIIT", null][i % 5],
  total_solved: 420 - i * 3,
  accuracy_percent: Math.max(55, 92 - i * 0.4),
  current_streak: Math.max(0, 40 - i),
}));
