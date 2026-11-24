const bodies={
  welcome:'Console.WriteLine("Ready to learn\\nLesson 1");',
  'reading-code':'int a=3, b=a+2; a=b*2; Console.WriteLine(a+b);',
  'values-types':'string item="tea"; int price=120, count=3; Console.WriteLine($"{item} x {count} = {price*count}");',
  'functions-scope':'string Describe(string name,int count) => $"{count} tickets for {name}"; Console.WriteLine(Describe("Ada",2));',
  'arrays-loops':'int[] prices={3,5,7,11}; int total=0; foreach(int price in prices) total+=price; Console.WriteLine(total);',
  'objects-maps':'string[] words={"go","stop","go","go","wait"}; var counts=new Dictionary<string,int>(); foreach(var word in words) counts[word]=counts.GetValueOrDefault(word)+1; Console.WriteLine($"go={counts["go"]}\\ndistinct={counts.Count}");',
  'strings-regex':'string reference="AB-42-x9"; foreach(char c in reference) if(c>=\'0\' && c<=\'9\') Console.Write(c); Console.WriteLine();',
  'hash-maps':'string[] ids={"k3","p1","k3","z9","p1"}; var seen=new HashSet<string>(); string repeat="none"; foreach(var id in ids) {if(!seen.Add(id)){repeat=id; break;}} Console.WriteLine(repeat);',
  'two-pointers':'int[] nums={1,4,7,12,15}; int target=19,left=0,right=nums.Length-1; while(left<right){int sum=nums[left]+nums[right]; if(sum==target){Console.WriteLine($"{nums[left]},{nums[right]}");break;} if(sum<target) left++; else right--;}',
  'sliding-window':'int[] nums={2,1,5,1,3,2}; int k=3,sum=0; for(int i=0;i<k;i++) sum+=nums[i]; int best=sum; for(int i=k;i<nums.Length;i++){sum+=nums[i]-nums[i-k];best=Math.Max(best,sum);} Console.WriteLine(best);',
  'binary-search':'int[] nums={2,4,4,6,10}; int target=5,lo=0,hi=nums.Length-1; while(lo<=hi){int mid=lo+(hi-lo)/2; if(nums[mid]<target) lo=mid+1; else hi=mid-1;} Console.WriteLine(lo);',
  recursion:'int Factorial(int n) => n<=1 ? 1 : n*Factorial(n-1); Console.WriteLine(Factorial(5));',
  'dynamic-programming':'int n=6; var ways=new List<int>{1,1,2}; for(int i=3;i<=n;i++) ways.Add(ways[i-1]+ways[i-2]+ways[i-3]); Console.WriteLine(ways[n]);',
  'trees-graphs':'var graph=new Dictionary<string,string[]>{{"a",new[]{"b","c"}},{"b",new[]{"a"}},{"c",new[]{"a","d"}},{"d",new[]{"c"}},{"e",new[]{"f"}},{"f",new[]{"e"}}}; var seen=new HashSet<string>{"a"}; var queue=new Queue<string>(); queue.Enqueue("a"); while(queue.Count>0){var node=queue.Dequeue(); foreach(var next in graph[node]) if(seen.Add(next)) queue.Enqueue(next);} Console.WriteLine(seen.Count);',
  complexity:'int n=6,steps=0; for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) steps++; Console.WriteLine($"{steps} O(n^2)");',
  'debugging-tests':'int[] nums={1,2,4,5,6}; int count=0; foreach(int n in nums) if(n%2==0) count++; Console.WriteLine(count);'
};
export const csharpLessonSolutions=Object.fromEntries(Object.entries(bodies).map(([id,body])=>[id,'using System;\nusing System.Collections.Generic;\n\nclass Program {\n  static void Main() {\n    '+body+'\n  }\n}\n']));
