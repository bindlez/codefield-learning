// A small guide that appears after selecting a method name in the Learn and Practice editors.
export function createMethodCard(host) {
  if (!host) return { show() {}, hide() {} };
  host.className = 'method-card-host';
  const card = document.createElement('aside');
  card.className = 'method-card';
  card.hidden = true;
  card.setAttribute('aria-label', 'Method guide');

  const head = document.createElement('div');
  head.className = 'method-card-head';
  const title = document.createElement('strong');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'text-button';
  close.textContent = '✕';
  close.setAttribute('aria-label', 'Close method guide');
  close.onclick = () => {
    card.hidden = true;
  };
  head.append(title, close);

  const signature = document.createElement('code');
  signature.className = 'method-card-signature';
  const description = document.createElement('p');
  const example = document.createElement('pre');
  const returns = document.createElement('small');
  card.append(head, signature, description, example, returns);
  host.append(card);

  return {
    show(guide) {
      if (!guide) {
        card.hidden = true;
        return;
      }
      title.textContent = `${guide.owner ? `${guide.owner}.` : ''}${guide.name}`;
      signature.textContent = guide.signature;
      description.textContent = guide.description;
      example.textContent = guide.example;
      returns.textContent = guide.returns ? `Returns ${guide.returns}` : '';
      card.hidden = false;
    },
    hide() {
      card.hidden = true;
    }
  };
}
