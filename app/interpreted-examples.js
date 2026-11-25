import {instrumentInterpreted} from './trace.js';

const pythonNodes = `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def __cf_node_arg(value, kind):
    if kind not in ('TreeNode', 'ListNode'):
        return value
    if kind == 'ListNode':
        head = None
        for item in reversed(value or []):
            head = ListNode(item, head)
        return head
    values = iter(value or [])
    first = next(values, None)
    if first is None:
        return None
    root = TreeNode(first)
    queue = deque([root])
    while queue:
        parent = queue.popleft()
        for field in ('left', 'right'):
            item = next(values, None)
            if item is not None:
                child = TreeNode(item)
                setattr(parent, field, child)
                queue.append(child)
    return root

def __cf_node_result(root, kind):
    if kind not in ('TreeNode', 'ListNode'):
        return root
    out, seen, queue = [], set(), deque([root])
    while queue:
        node = queue.popleft()
        if node is None:
            if kind == 'TreeNode':
                out.append(None)
            continue
        if id(node) in seen:
            raise ValueError('Returned structure contains a cycle or repeated node')
        seen.add(id(node))
        out.append(node.val)
        queue.extend((node.left,node.right) if kind == 'TreeNode' else (node.next,))
    while out and out[-1] is None:
        out.pop()
    return out
`;
const rubyNodes = `
class ListNode
  attr_accessor :val, :next
  def initialize(val=0, tail=nil)
    @val, @next = val, tail
  end
end
class TreeNode
  attr_accessor :val, :left, :right
  def initialize(val=0, left=nil, right=nil)
    @val, @left, @right = val, left, right
  end
end
def __cf_node_arg(values, kind)
  return values unless %w[ListNode TreeNode].include?(kind)
  return Array(values).reverse_each.reduce(nil) { |tail, v| ListNode.new(v,tail) } if kind == 'ListNode'
  return nil if values.nil? || values[0].nil?
  root = TreeNode.new(values[0])
  queue = [root]
  index = 1
  queue.each do |parent|
    [:left=, :right=].each do |field|
      value = values[index]
      index += 1
      unless value.nil?
        child = TreeNode.new(value)
        parent.public_send(field, child)
        queue << child
      end
    end
  end
  root
end
def __cf_node_result(root, kind)
  return root unless %w[ListNode TreeNode].include?(kind)
  out, queue, seen = [], [root], {}
  queue.each do |node|
    if node.nil?
      out << nil if kind == 'TreeNode'
      next
    end
    raise 'Returned structure contains a cycle or repeated node' if seen[node.object_id]
    seen[node.object_id] = true
    out << node.val
    queue.concat(kind == 'TreeNode' ? [node.left, node.right] : [node.next])
  end
  out.pop while !out.empty? && out.last.nil?
  out
end
`;

// The scaffolding executes outside the traced source file, keeping line numbers
// aligned with the editor even when LeetCode supplies commented node definitions.
export function interpretedExample(language,source,plan,{trace=true}={}) {
  if (!['ruby','python'].includes(language) || !plan?.tests?.length || !Array.isArray(plan.params)) return null;
  const python=language==='python';
  const prelude=python?'from typing import *\nfrom collections import *\n':'';
  const traced=trace?instrumentInterpreted(language,source):source;
  const types=plan.params.map(p=>p.type),ret=plan.returns?.type || '';
  const treeOrList=t=>t==='TreeNode' || t==='ListNode';
  const usesNodes=[...types,ret].some(treeOrList);
  if([...types,ret].some(t=>/Node|NestedInteger/.test(t) && !treeOrList(t)))return null;
  const name=plan.functionName;
  if(!/^[a-zA-Z_]\w*$/.test(name))return null;
  const raw=JSON.stringify(plan.tests.map(test=>test.args));
  if(python)return prelude+(usesNodes?pythonNodes:'')+traced+'\nimport json as __cf_json\n'+
    '__cf_call = getattr(Solution(), '+JSON.stringify(name)+') if "Solution" in globals() else globals()['+JSON.stringify(name)+']\n'+
    'for __cf_case in __cf_json.loads('+JSON.stringify(raw)+'):\n'+
    '    __cf_args = '+(usesNodes?'[__cf_node_arg(v,t) for v,t in zip(__cf_case,'+JSON.stringify(types)+')]':'__cf_case')+'\n'+
    '    print("__CODEFIELD_CASE__" + __cf_json.dumps('+(usesNodes?'__cf_node_result(__cf_call(*__cf_args),'+JSON.stringify(ret)+')':'__cf_call(*__cf_args)')+'))';
  // Preserve test data verbatim, including Ruby interpolation and backslashes.
  const bytes=[...new TextEncoder().encode(raw)].join(',');
  const args='JSON.parse(['+bytes+'].pack("C*").force_encoding("UTF-8"))';
  const call='method(:'+name.replace(/[A-Z]/g,c=>'_'+c.toLowerCase())+').call(*__cf_args)';
  return 'require "json"\n'+(usesNodes?rubyNodes:'')+traced+'\n'+args+'.each do |__cf_case|\n  __cf_args = __cf_case'+(usesNodes?'.zip('+JSON.stringify(types)+').map { |v,t| __cf_node_arg(v,t) }':'')+
    '\n  puts "__CODEFIELD_CASE__" + JSON.generate('+(usesNodes?'__cf_node_result('+call+','+JSON.stringify(ret)+')':call)+')\nend';
}
