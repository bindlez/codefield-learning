// Each checkpoint demonstrates the lesson's algorithm, not just its output.
const bodies={
  welcome:'cout << "Ready to learn\\nLesson 1\\n";',
  'reading-code':'int a=3, b=a+2; a=b*2; cout << a+b << "\\n";',
  'values-types':'string item="tea"; int price=120, count=3; cout << item << " x " << count << " = " << price*count << "\\n";',
  'functions-scope':'auto describe=[](string name,int count){ return to_string(count)+" tickets for "+name; }; cout << describe("Ada",2) << "\\n";',
  'arrays-loops':'vector<int> prices{3,5,7,11}; int total=0; for(int price:prices) total+=price; cout << total << "\\n";',
  'objects-maps':'vector<string> words{"go","stop","go","go","wait"}; map<string,int> counts; for(const auto& word:words) ++counts[word]; cout << "go=" << counts["go"] << "\\ndistinct=" << counts.size() << "\\n";',
  'strings-regex':'string ref="AB-42-x9"; for(char c:ref) if(c>=\'0\' && c<=\'9\') cout << c; cout << "\\n";',
  'hash-maps':'vector<string> ids{"k3","p1","k3","z9","p1"}; set<string> seen; string repeat="none"; for(const auto& id:ids){ if(seen.count(id)){repeat=id; break;} seen.insert(id); } cout << repeat << "\\n";',
  'two-pointers':'vector<int> nums{1,4,7,12,15}; int target=19, left=0, right=(int)nums.size()-1; while(left<right){ int sum=nums[left]+nums[right]; if(sum==target){cout << nums[left] << "," << nums[right] << "\\n"; break;} if(sum<target) ++left; else --right; }',
  'sliding-window':'vector<int> nums{2,1,5,1,3,2}; int k=3, sum=0; for(int i=0;i<k;++i) sum+=nums[i]; int best=sum; for(int i=k;i<(int)nums.size();++i){sum+=nums[i]-nums[i-k]; best=max(best,sum);} cout << best << "\\n";',
  'binary-search':'vector<int> nums{2,4,4,6,10}; int target=5, lo=0, hi=(int)nums.size()-1; while(lo<=hi){int mid=lo+(hi-lo)/2; if(nums[mid]<target) lo=mid+1; else hi=mid-1;} cout << lo << "\\n";',
  recursion:'function<int(int)> factorial=[&](int n){return n<=1 ? 1 : n*factorial(n-1);}; cout << factorial(5) << "\\n";',
  'dynamic-programming':'int n=6; vector<int> ways{1,1,2}; for(int i=3;i<=n;++i) ways.push_back(ways[i-1]+ways[i-2]+ways[i-3]); cout << ways[n] << "\\n";',
  'trees-graphs':'map<string,vector<string>> graph{{"a",{"b","c"}},{"b",{"a"}},{"c",{"a","d"}},{"d",{"c"}},{"e",{"f"}},{"f",{"e"}}}; set<string> seen{"a"}; queue<string> q; q.push("a"); while(!q.empty()){auto node=q.front(); q.pop(); for(const auto& next:graph[node]) if(seen.insert(next).second) q.push(next);} cout << seen.size() << "\\n";',
  complexity:'int n=6, steps=0; for(int i=0;i<n;++i) for(int j=i+1;j<n;++j) ++steps; cout << steps << " O(n^2)\\n";',
  'debugging-tests':'vector<int> nums{1,2,4,5,6}; int count=0; for(int n:nums) if(n%2==0) ++count; cout << count << "\\n";'
};
const headers='#include <algorithm>\n#include <functional>\n#include <iostream>\n#include <map>\n#include <queue>\n#include <set>\n#include <string>\n#include <vector>\nusing namespace std;\n\n';
export const cppLessonSolutions=Object.fromEntries(Object.entries(bodies).map(([id,body])=>[id,headers+'int main() {\n  '+body+'\n}\n']));
