// Every checkpoint is a standalone Go program for the same exercise inputs.
const bodies = {
  welcome: 'fmt.Println("Ready to learn")\nfmt.Println("Lesson 1")',
  'reading-code': 'a := 3\nb := a + 2\na = b * 2\nfmt.Println(a + b)',
  'values-types': 'item, price, count := "tea", 120, 3\nfmt.Printf("%s x %d = %d\\n", item, count, price * count)',
  'functions-scope': 'describe := func(name string, count int) string {\n  return fmt.Sprintf("%d tickets for %s", count, name)\n}\nfmt.Println(describe("Ada", 2))',
  'arrays-loops': 'total := 0\nfor _, price := range []int{3, 5, 7, 11} {\n  total += price\n}\nfmt.Println(total)',
  'objects-maps': 'counts := map[string]int{}\nfor _, word := range []string{"go","stop","go","go","wait"} {\n  counts[word]++\n}\nfmt.Printf("go=%d\\ndistinct=%d\\n", counts["go"], len(counts))',
  'strings-regex': 'for _, digit := range "AB-42-x9" {\n  if digit >= \'0\' && digit <= \'9\' { fmt.Printf("%c", digit) }\n}\nfmt.Println()',
  'hash-maps': 'seen := map[string]bool{}\nfor _, id := range []string{"k3","p1","k3","z9","p1"} {\n  if seen[id] { fmt.Println(id); break }\n  seen[id] = true\n}',
  'two-pointers': 'nums := []int{1,4,7,12,15}\nleft, right := 0, len(nums)-1\nfor left < right {\n  sum := nums[left] + nums[right]\n  if sum == 19 { fmt.Printf("%d,%d\\n", nums[left], nums[right]); break }\n  if sum < 19 { left++ } else { right-- }\n}',
  'sliding-window': 'nums := []int{2,1,5,1,3,2}\nk, sum := 3, 0\nfor _, n := range nums[:k] { sum += n }\nbest := sum\nfor i := k; i < len(nums); i++ {\n  sum += nums[i] - nums[i-k]\n  if sum > best { best = sum }\n}\nfmt.Println(best)',
  'binary-search': 'nums := []int{2,4,4,6,10}\nlo, hi := 0, len(nums)\nfor lo < hi {\n  mid := lo + (hi-lo)/2\n  if nums[mid] < 5 { lo = mid+1 } else { hi = mid }\n}\nfmt.Println(lo)',
  recursion: 'var factorial func(int) int\nfactorial = func(n int) int {\n  if n <= 1 { return 1 }\n  return n * factorial(n-1)\n}\nfmt.Println(factorial(5))',
  'dynamic-programming': 'ways := []int{1,1,2}\nfor i := 3; i <= 6; i++ {\n  ways = append(ways, ways[i-1]+ways[i-2]+ways[i-3])\n}\nfmt.Println(ways[6])',
  'trees-graphs': 'graph := map[string][]string{"a":{"b","c"}, "b":{"a"}, "c":{"a","d"}, "d":{"c"}, "e":{"f"}, "f":{"e"}}\nqueue := []string{"a"}\nseen := map[string]bool{"a":true}\nfor head := 0; head < len(queue); head++ {\n  for _, next := range graph[queue[head]] {\n    if !seen[next] { seen[next] = true; queue = append(queue, next) }\n  }\n}\nfmt.Println(len(seen))',
  complexity: 'steps := 0\nfor i := 0; i < 6; i++ {\n  for j := i+1; j < 6; j++ { steps++ }\n}\nfmt.Printf("%d O(n^2)\\n", steps)',
  'debugging-tests': 'count := 0\nfor _, n := range []int{1,2,4,5,6} {\n  if n%2 == 0 { count++ }\n}\nfmt.Println(count)'
};
export const goLessonSolutions = Object.fromEntries(Object.entries(bodies).map(([id, body]) => [
  id, 'package main\n\nimport "fmt"\n\nfunc main() {\n  ' + body.replaceAll('\n','\n  ') + '\n}\n'
]));
