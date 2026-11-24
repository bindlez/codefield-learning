// Public built-in methods, available without starting a Python runtime.
export const pythonMethods={
  String:['capitalize','casefold','center','count','encode','endswith','expandtabs','find','format','index','isalnum','isalpha','isascii','isdigit','islower','isnumeric','isspace','istitle','isupper','join','ljust','lower','lstrip','partition','removeprefix','removesuffix','replace','rfind','rindex','rjust','rpartition','rsplit','rstrip','split','splitlines','startswith','strip','swapcase','title','translate','upper','zfill'],
  Array:['append','clear','copy','count','extend','index','insert','pop','remove','reverse','sort'],
  Hash:['clear','copy','fromkeys','get','items','keys','pop','popitem','setdefault','update','values'],
  Set:['add','clear','copy','difference','difference_update','discard','intersection','intersection_update','isdisjoint','issubset','issuperset','pop','remove','symmetric_difference','symmetric_difference_update','union','update']
};
const descriptions={append:'Adds one item to the end of a list in place.',extend:'Adds items from an iterable to the list in place.',get:'Returns the value for a key, or a default when the key is absent.',items:'Returns a view of key and value pairs.',add:'Adds an item to a set in place.',upper:'Returns an uppercase copy of the string.',lower:'Returns a lowercase copy of the string.',split:'Returns a list of substrings split at the separator.',strip:'Returns a copy with leading and trailing whitespace removed.',sort:'Sorts the list in place and returns None.',pop:'Removes and returns an item from the collection.'};
export function pythonGuide(name){return {description:descriptions[name] || 'Explore this Python built-in method in the official reference.',example:null};}
