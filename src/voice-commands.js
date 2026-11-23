// Interpret editing commands locally. Speech recognition is intentionally separate.
export function parseVoiceCommand(transcript) {
  const text = String(transcript).trim().replace(/[.!?]+$/, '');
  const back = /^highlight back (\d+|one|two|three|four|five|six|seven|eight|nine|ten)$/i.exec(text);
  const numbers = {one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
  if (back) return {type:'highlight-back', count:numbers[back[1].toLowerCase()] || Number(back[1])};
  const named = /^highlight\s+([\w$]+)$/i.exec(text);
  if (named) return {type:'highlight-name', name:named[1]};
  const method = /^dot\s+([a-z_$][\w$]*)$/i.exec(text);
  if (method) return {type:'insert-method', name:method[1]};
  return {type:'unknown'};
}

export function resolveVoiceSelection(code, caret, command) {
  const source = String(code), end = Math.max(0, Math.min(source.length, caret));
  const tokens = [...source.matchAll(/[A-Za-z_$][\w$]*|\d+/g)];
  if (command.type === 'highlight-back') {
    const previous = tokens.filter(token => token.index + token[0].length <= end);
    if (!Number.isSafeInteger(command.count) || command.count < 1 || previous.length < command.count) return null;
    return {start:previous[previous.length-command.count].index,end:previous.at(-1).index+previous.at(-1)[0].length};
  }
  if (command.type === 'highlight-name') {
    const matches = tokens.filter(token => token[0].toLowerCase() === command.name.toLowerCase());
    if (matches.length !== 1) return null;
    return {start:matches[0].index,end:matches[0].index+matches[0][0].length};
  }
  return null;
}
