const bodies={
  welcome:'println!("Ready to learn\\nLesson 1");',
  'reading-code':'let mut a=3; let b=a+2; a=b*2; println!("{}",a+b);',
  'values-types':'let item="tea"; let price=120; let count=3; println!("{} x {} = {}",item,count,price*count);',
  'functions-scope':'fn describe(name: &str,count: i32)->String { format!("{} tickets for {}",count,name) } println!("{}",describe("Ada",2));',
  'arrays-loops':'let prices=[3,5,7,11]; let mut total=0; for price in prices {total+=price;} println!("{}",total);',
  'objects-maps':'use std::collections::HashMap; let words=["go","stop","go","go","wait"]; let mut counts=HashMap::new(); for word in words {*counts.entry(word).or_insert(0)+=1;} println!("go={}\\ndistinct={}",counts["go"],counts.len());',
  'strings-regex':'let reference="AB-42-x9"; let digits:String=reference.chars().filter(|c| c.is_ascii_digit()).collect(); println!("{}",digits);',
  'hash-maps':'use std::collections::HashSet; let ids=["k3","p1","k3","z9","p1"]; let mut seen=HashSet::new(); let mut repeat="none"; for id in ids {if !seen.insert(id){repeat=id;break;}} println!("{}",repeat);',
  'two-pointers':'let nums=[1,4,7,12,15]; let target=19; let (mut left,mut right)=(0,nums.len()-1); while left<right {let sum=nums[left]+nums[right]; if sum==target {println!("{},{}",nums[left],nums[right]);break;} if sum<target {left+=1;} else {right-=1;}}',
  'sliding-window':'let nums=[2,1,5,1,3,2]; let k=3; let mut sum:i32=nums[..k].iter().sum(); let mut best=sum; for i in k..nums.len(){sum+=nums[i]-nums[i-k];best=best.max(sum);} println!("{}",best);',
  'binary-search':'let nums=[2,4,4,6,10]; let target=5; let (mut lo,mut hi)=(0i32,nums.len() as i32-1); while lo<=hi {let mid=lo+(hi-lo)/2; if nums[mid as usize]<target {lo=mid+1;} else {hi=mid-1;}} println!("{}",lo);',
  recursion:'fn factorial(n:u32)->u32 {if n<=1 {1} else {n*factorial(n-1)}} println!("{}",factorial(5));',
  'dynamic-programming':'let n=6; let mut ways=vec![1,1,2]; for i in 3..=n {ways.push(ways[i-1]+ways[i-2]+ways[i-3]);} println!("{}",ways[n]);',
  'trees-graphs':'use std::collections::{HashMap,HashSet,VecDeque}; let graph=HashMap::from([("a",vec!["b","c"]),("b",vec!["a"]),("c",vec!["a","d"]),("d",vec!["c"]),("e",vec!["f"]),("f",vec!["e"])]); let mut seen=HashSet::from(["a"]); let mut queue=VecDeque::from(["a"]); while let Some(node)=queue.pop_front() {for next in &graph[node] {if seen.insert(*next){queue.push_back(*next);}}} println!("{}",seen.len());',
  complexity:'let n=6; let mut steps=0; for i in 0..n {for _j in (i+1)..n {steps+=1;}} println!("{} O(n^2)",steps);',
  'debugging-tests':'let nums=[1,2,4,5,6]; let mut count=0; for n in nums {if n%2==0 {count+=1;}} println!("{}",count);'
};
export const rustLessonSolutions=Object.fromEntries(Object.entries(bodies).map(([id,body])=>[id,'fn main() {\n  '+body+'\n}\n']));
