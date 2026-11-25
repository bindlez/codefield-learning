const lessons = {
  welcome: 'System.out.println("Ready to learn");\nSystem.out.println("Lesson 1");',
  'reading-code': 'int a = 3;\nint b = a + 2;\na = b * 2;\nSystem.out.println(a + b);',
  'values-types': 'String item = "tea";\nint price = 120, count = 3;\nSystem.out.printf("%s x %d = %d%n", item, count, price * count);',
  'functions-scope': 'System.out.println(describe("Ada", 2));',
  'arrays-loops': 'int total = 0;\nfor (int price : new int[]{3,5,7,11}) total += price;\nSystem.out.println(total);',
  'objects-maps': 'var counts = new HashMap<String,Integer>();\nfor (String word : List.of("go","stop","go","go","wait")) counts.merge(word, 1, Integer::sum);\nSystem.out.printf("go=%d%ndistinct=%d%n", counts.get("go"), counts.size());',
  'strings-regex': 'String ref = "AB-42-x9";\nSystem.out.println(ref.replaceAll("[^0-9]", ""));',
  'hash-maps': 'var seen = new HashSet<String>();\nfor (String id : List.of("k3","p1","k3","z9","p1")) {\n    if (!seen.add(id)) { System.out.println(id); break; }\n}',
  'two-pointers': 'int[] nums = {1,4,7,12,15};\nint left = 0, right = nums.length - 1;\nwhile (left < right) {\n    int sum = nums[left] + nums[right];\n    if (sum == 19) { System.out.printf("%d,%d%n", nums[left], nums[right]); break; }\n    if (sum < 19) left++; else right--;\n}',
  'sliding-window': 'int[] nums = {2,1,5,1,3,2};\nint k = 3, sum = 0;\nfor (int i = 0; i < k; i++) sum += nums[i];\nint best = sum;\nfor (int i = k; i < nums.length; i++) {\n    sum += nums[i] - nums[i-k];\n    best = Math.max(best, sum);\n}\nSystem.out.println(best);',
  'binary-search': 'int[] nums = {2,4,4,6,10};\nint lo = 0, hi = nums.length;\nwhile (lo < hi) {\n    int mid = lo + (hi-lo)/2;\n    if (nums[mid] < 5) lo = mid+1; else hi = mid;\n}\nSystem.out.println(lo);',
  recursion: 'System.out.println(factorial(5));',
  'dynamic-programming': 'int[] ways = {1,1,2,0,0,0,0};\nfor (int i = 3; i < ways.length; i++) ways[i] = ways[i-1]+ways[i-2]+ways[i-3];\nSystem.out.println(ways[6]);',
  'trees-graphs': 'var graph = Map.of("a", List.of("b","c"), "b", List.of("a"), "c", List.of("a","d"), "d", List.of("c"), "e", List.of("f"), "f", List.of("e"));\nvar seen = new HashSet<String>();\nvar queue = new ArrayDeque<String>();\nseen.add("a"); queue.add("a");\nwhile (!queue.isEmpty()) {\n    for (var next : graph.get(queue.remove())) {\n        if (seen.add(next)) queue.add(next);\n    }\n}\nSystem.out.println(seen.size());',
  complexity: 'int steps = 0;\nfor (int i = 0; i < 6; i++) {\n    for (int j = i+1; j < 6; j++) steps++;\n}\nSystem.out.println(steps + " O(n^2)");',
  'debugging-tests': 'int count = 0;\nfor (int n : new int[]{1,2,4,5,6}) {\n    if (n % 2 == 0) count++;\n}\nSystem.out.println(count);'
};
const helpers = {
  'functions-scope': '    static String describe(String name, int count) {\n        return count + " tickets for " + name;\n    }\n',
  recursion: '    static int factorial(int n) {\n        return n <= 1 ? 1 : n * factorial(n - 1);\n    }\n'
};
export const javaLessonSolutions = Object.fromEntries(Object.entries(lessons).map(([id, body]) => [
  id, 'import java.util.*;\n\nclass Main {\n' + (helpers[id] || '') + '    public static void main(String[] args) {\n        ' + body.replaceAll('\n','\n        ') + '\n    }\n}\n'
]));
