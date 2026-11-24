export const variants = {
  'two-sum': {title:'Break ties',description:'Several pairs may work. Return the lexicographically smallest pair of increasing indices, or an empty array when none exists.',tests:[
    {args:[[1,3,4,6],7],expected:[0,3]},{args:[[2,2,2],4],expected:[0,1]},{args:[[1,2],8],expected:[]}
  ]},
  'contains-duplicate': {title:'Nearby repeat',description:'Return true only if equal values occur at indices at most two places apart.',tests:[
    {args:[[1,2,3,1]],expected:false},{args:[[1,2,1]],expected:true},{args:[[1,2,3,1,1]],expected:true},{args:[[]],expected:false}
  ]},
  'climbing-stairs': {title:'No consecutive doubles',description:'Count paths using steps of one or two, with no consecutive two-step jumps. There is one empty path at zero.',tests:[
    {args:[0],expected:1},{args:[3],expected:3},{args:[4],expected:4},{args:[5],expected:6}
  ]},
  'maximum-subarray': {title:'Circular array',description:'A nonempty contiguous run may wrap once from the end to the beginning. Each position can be used at most once.',tests:[
    {args:[[5,-3,5]],expected:10},{args:[[-4,-2,-6]],expected:-2},{args:[[3,2,1]],expected:6}
  ]},
  'best-time-to-buy-and-sell-stock': {title:'Two trades',description:'Maximize profit with at most two completed trades. Sell before buying again.',tests:[
    {args:[[3,3,5,0,0,3,1,4]],expected:6},{args:[[1,2,3,4]],expected:3},{args:[[5,4,3]],expected:0}
  ]},
  'valid-parentheses': {title:'Quoted brackets',description:'Ignore brackets inside double quotes. Inputs contain brackets, letters and quotes without escapes. An unclosed quote is invalid.',tests:[
    {args:['("[")'],expected:true},{args:['["}"]'],expected:true},{args:['["'],expected:false},{args:['(]'],expected:false}
  ]},
  'move-zeroes': {title:'Move nonpositives',description:'Return the positive values first and all zero or negative values last. Preserve the order within both groups.',tests:[
    {args:[[0,-2,3,0,-1,2]],expected:[3,2,0,-2,0,-1]},{args:[[-3,0]],expected:[-3,0]},{args:[[]],expected:[]}
  ]},
  'product-of-array-except-self': {title:'Exclude neighbors',description:'For each index, return the product excluding that index and its immediate neighbors. The empty product is one.',tests:[
    {args:[[2,3,4,5]],expected:[20,5,2,6]},{args:[[7]],expected:[1]},{args:[[0,1,2]],expected:[2,1,0]}
  ]},
  'binary-search': {title:'First occurrence',description:'The sorted input may contain duplicates. Return the first matching index, or -1 if absent.',tests:[
    {args:[[1,2,2,2,5],2],expected:1},{args:[[3,3,3],3],expected:0},{args:[[1,2,4,4],3],expected:-1},{args:[[],5],expected:-1},{args:[[-4,-4,0,9],9],expected:3}
  ]},
  'valid-anagram': {title:'Unicode characters',description:'Strings can contain any Unicode characters, including emoji. Compare characters exactly, including case.',tests:[
    {args:['éa','aé'],expected:true},{args:['😀a😀','😀😀a'],expected:true},{args:['😀a','😁a'],expected:false},{args:['aA','aa'],expected:false},{args:['',''],expected:true}
  ]}
};
