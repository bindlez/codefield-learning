// Acorn supplies exact statement boundaries, including unbraced loops and branches.
// Edits use original offsets so trace rows always point into the learner's source.
export function traceJavaScript(source, parse) {
  const ast = parse(source,{ecmaVersion:'latest',locations:true});
  let probe = '__cfObserve';
  while (source.includes(probe)) probe += '_';
  const edits = new Map();
  function insert(offset, text) { edits.set(offset,(edits.get(offset) || '') + text); }
  function names(pattern, set) {
    if (!pattern) return;
    if (pattern.type === 'Identifier') set.add(pattern.name);
    else if (pattern.type === 'ObjectPattern') pattern.properties.forEach(p => names(p.value || p.argument,set));
    else if (pattern.type === 'ArrayPattern') pattern.elements.forEach(p => names(p,set));
    else names(pattern.left || pattern.argument,set);
  }
  function children(node) {
    return Object.values(node).flatMap(v => Array.isArray(v) ? v : [v]).filter(v => v && typeof v.type === 'string');
  }
  function collectVars(node, set) {
    if (/Function/.test(node.type) || node.type === 'ClassDeclaration') return;
    if (node.type === 'VariableDeclaration' && node.kind==='var') node.declarations.forEach(d => names(d.id,set));
    children(node).forEach(n => collectVars(n,set));
  }
  function walk(node, parent, bindings) {
    if (/Function/.test(node.type)) {
      bindings = new Set(bindings);
      node.params.forEach(p => names(p,bindings));
      collectVars(node.body,bindings);
    }
    if (node.type==='Program' || node.type==='BlockStatement' || node.type==='SwitchStatement' || node.type==='CatchClause' || node.type.startsWith('For')) {
      bindings=new Set(bindings);
      const statements=node.type==='SwitchStatement'?node.cases.flatMap(c=>c.consequent):
        Array.isArray(node.body)?node.body:[node.init || node.left];
      for(const declaration of statements) {
        if(declaration?.type==='VariableDeclaration')declaration.declarations.forEach(d=>names(d.id,bindings));
      }
      if(node.type==='CatchClause')names(node.param,bindings);
    }
    const list = [...bindings].slice(0,50);
    const read = '[' + list.map(n => '['+JSON.stringify(n)+',()=>'+n+']').join(',') + ']';
    const call = (label,line=node.loc.start.line) => probe+'('+line+','+JSON.stringify(label)+','+read+')';
    const sequence = parent && (parent.body?.includes?.(node) || parent.consequent?.includes?.(node));
    if (node.type === 'ReturnStatement' && node.argument) {
      insert(node.argument.start,probe+'.result('+node.loc.start.line+','+read+',(');
      walk(node.argument,node,bindings);
      insert(node.argument.end,'))');
      return;
    }
    if (node.type === 'ArrowFunctionExpression' && node.expression) {
      node.params.forEach(p => walk(p,node,bindings));
      insert(node.body.start,probe+'.result('+node.body.loc.start.line+','+read+',(');
      walk(node.body,node,bindings);
      insert(node.body.end,'))');
      return;
    }
    if (node.test && ['WhileStatement','IfStatement','DoWhileStatement','ForStatement','ConditionalExpression'].includes(node.type)) {
      insert(node.test.start,probe+'.test('+node.test.loc.start.line+','+read+',(');
      walk(node.test,node,bindings);
      insert(node.test.end,'))');
      children(node).filter(n => n !== node.test).forEach(n => walk(n,node,bindings));
      return;
    }
    if (node.type === 'BlockStatement' && parent && /^(For|While|DoWhile)/.test(parent.type))
      insert(node.start+1,';'+call('iteration',parent.loc.start.line)+';');
    const record = node.type === 'ExpressionStatement' && !node.directive || node.type === 'VariableDeclaration' && sequence;
    if (record) {
      const wrap = !sequence;
      if (wrap) insert(node.start,'{');
      children(node).forEach(n => walk(n,node,bindings));
      insert(node.end,';'+call('after')+';'+(wrap?'}':''));
      return;
    }
    children(node).forEach(n => walk(n,node,bindings));
  }
  const top = new Set();
  collectVars(ast,top);
  walk(ast,null,top);
  let code = source;
  for (const [offset,addition] of [...edits].sort(([a],[b]) => b-a)) code = code.slice(0,offset)+addition+code.slice(offset);
  return {code,probe};
}
