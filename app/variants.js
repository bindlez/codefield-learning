export const variants = {
  'binary-search': {title:'First occurrence',description:'The sorted input may contain duplicates. Return the first matching index, or -1 if absent.',tests:[
    {args:[[1,2,2,2,5],2],expected:1},{args:[[3,3,3],3],expected:0},{args:[[1,2,4,4],3],expected:-1},{args:[[],5],expected:-1},{args:[[-4,-4,0,9],9],expected:3}
  ]},
  'valid-anagram': {title:'Unicode characters',description:'Strings can contain any Unicode characters, including emoji. Compare characters exactly, including case.',tests:[
    {args:['éa','aé'],expected:true},{args:['😀a😀','😀😀a'],expected:true},{args:['😀a','😁a'],expected:false},{args:['aA','aa'],expected:false},{args:['',''],expected:true}
  ]}
};
