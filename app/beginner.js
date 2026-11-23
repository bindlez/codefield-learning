const steps = [
  {id:'welcome',title:'Run your first line',lesson:'welcome',why:'See how code becomes output, and learn where to find it.',task:'Run each example. Change the greeting, then complete the checkpoint.',tip:'Text needs quotes. Numbers do not.',time:8},
  {id:'reading-code',title:'Read a program line by line',lesson:'reading-code',why:'A computer follows the instructions in order. Tracing each line makes unfamiliar code less intimidating.',task:'Predict the value before each example runs, then check it.',tip:'Write down what each variable contains after a line runs.',time:12},
  {id:'values-types',title:'Understand values and types',lesson:'values-types',why:'Problems give you inputs such as numbers, text, and true-or-false values.',task:'Change the inputs in the examples and notice how their types affect the result.',tip:'A number like 3 and the text “3” are different values.',time:12},
  {id:'functions-scope',title:'Write a function',lesson:'functions-scope',why:'Most coding problems ask you to finish a function that accepts inputs and returns an answer.',task:'Name the inputs, identify the return value, and complete the checkpoint.',tip:'Returning a value sends it back to the caller. Printing displays it.',time:14},
  {id:'arrays-loops',title:'Work through a list',lesson:'arrays-loops',why:'Arrays and loops are the starting point for many easy problems.',task:'Trace the loop on paper for a list of three values, then run it.',tip:'An index tells you where an element is. The first index is zero.',time:15},
  {id:'contains-duplicate',title:'First problem: Contains Duplicate',problem:'contains-duplicate',why:'Practice translating a short problem into a function and testing an edge case.',task:'Read the examples. Start with any correct approach, then run the examples.',tip:'Ask what should happen for an empty list and for two equal values.',time:15},
  {id:'objects-maps',title:'Keep track of what you have seen',lesson:'objects-maps',why:'A map stores a value by key, which helps you count or look things up.',task:'Run the counting example, change its input, and finish the checkpoint.',tip:'For each item, ask whether it already has an entry.',time:15},
  {id:'strings-regex',title:'Read and compare strings',lesson:'strings-regex',why:'Many problems ask you to inspect, count, or rearrange characters.',task:'Work through the string examples. Focus on indexes and character counts.',tip:'A string can be empty, so test that case too.',time:14},
  {id:'complexity',title:'Estimate how work grows',lesson:'complexity',why:'An answer can be correct yet slow for large inputs. Complexity helps explain the tradeoff.',task:'Compare one loop with a loop inside a loop.',tip:'If the input doubles, think about how many times each loop runs.',time:16},
  {id:'hash-maps',title:'Find a faster lookup',lesson:'hash-maps',why:'Hash maps replace repeated searches with stored information in many problems.',task:'Explain what the map stores before writing the solution.',tip:'State the key and value aloud before you start coding.',time:18},
  {id:'two-sum',title:'Try Two Sum',problem:'two-sum',why:'Bring functions, loops, arrays, and a map together in a common beginner problem.',task:'Trace the first example. Implement a solution and run the provided examples.',tip:'For each number, what other number would add up to the target?',time:20},
  {id:'debugging-tests',title:'Debug and test your approach',lesson:'debugging-tests',why:'A repeatable debugging routine helps when a solution fails.',task:'Use a small input. Compare what you expected with what actually happened.',tip:'Change one thing at a time and rerun the smallest failing case.',time:18},
  {id:'two-pointers',title:'Add a two-pointer pattern',lesson:'two-pointers',why:'Pointers can narrow a search without checking every pair.',task:'Follow the pointer positions through the example before coding.',tip:'At each step, ask why a pointer can move without losing an answer.',time:18},
  {id:'valid-parentheses',title:'Practice: Valid Parentheses',problem:'valid-parentheses',why:'Try tracking unfinished work with a stack.',task:'Walk through one valid input and one invalid input, then run the examples.',tip:'The most recent opening bracket must match the next closing bracket.',time:20}
];
const $ = id => document.getElementById(id);
let lessons = {}, practice = {attempts:{},solutions:[]};
try { lessons = JSON.parse(localStorage.getItem('codefield.learn.v1') || '{}').completed || {}; } catch {}
try { practice = JSON.parse(localStorage.getItem('codefield.practice.v1') || '{}'); } catch {}
function complete(step) {
  if (step.lesson) return Boolean(lessons[step.lesson]);
  return Boolean(practice.attempts?.[step.problem]?.passed || (Array.isArray(practice.solutions) && practice.solutions.some(item => item.slug === step.problem && item.verified)));
}
let selected = steps.findIndex(step => !complete(step));
if (selected < 0) selected = steps.length - 1;
function render() {
  const count = steps.filter(complete).length;
  $('beginner-count').textContent = count + ' of ' + steps.length + ' steps complete';
  $('beginner-meter').max = steps.length;
  $('beginner-meter').value = count;
  const list = $('beginner-list');
  list.replaceChildren();
  steps.forEach((step,index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'beginner-item';
    button.setAttribute('aria-current', String(index === selected));
    const number = document.createElement('span'); number.className='beginner-number'; number.textContent = complete(step) ? '✓' : String(index + 1);
    const title = document.createElement('span'); title.textContent = step.title;
    button.append(number,title); button.onclick = () => { selected=index; render(); };
    list.append(button);
  });
  const step=steps[selected], panel=$('beginner-step');
  panel.replaceChildren();
  const meta=document.createElement('p');meta.className='eyebrow';meta.textContent='STEP '+(selected+1)+' OF '+steps.length+' · ABOUT '+step.time+' MIN';
  const title=document.createElement('h2');title.textContent=step.title;
  const why=document.createElement('p');why.className='beginner-why';why.textContent=step.why;
  const card=document.createElement('div');card.className='beginner-card';
  const taskTitle=document.createElement('h3');taskTitle.textContent='Your next move';
  const task=document.createElement('p');task.textContent=step.task;
  const tip=document.createElement('p');tip.className='beginner-tip';tip.textContent='Try this · '+step.tip;
  const action=document.createElement('a');action.className='beginner-action';action.href=step.lesson ? './learn.html?lesson='+encodeURIComponent(step.lesson) : './practice.html?mode=problem&p='+encodeURIComponent(step.problem);
  action.textContent=step.lesson ? 'Open lesson →' : 'Open problem →';
  const guide=document.createElement('p');guide.className='beginner-guide';guide.textContent=step.lesson ? 'Read the lesson, run the examples, and finish the checkpoint. Return here to continue.' : 'Run the examples. A passing JavaScript run completes this step. For Python or Ruby, save the verified solution to complete it.';
  card.append(taskTitle,task,tip,action,guide);
  const buttons=document.createElement('div');buttons.className='beginner-controls';
  for (const [label,next] of [['← Previous',selected-1],['Next →',selected+1]]) {
    const button=document.createElement('button');button.type='button';button.className='pill-button';button.textContent=label;button.disabled=next<0||next>=steps.length;button.onclick=()=>{selected=next;render();};buttons.append(button);
  }
  const note=document.createElement('p');note.className='beginner-note';note.textContent='Lessons use JavaScript examples. The practice editor also supports other languages.';
  panel.append(meta,title,why,card,buttons,note);
}
render();
