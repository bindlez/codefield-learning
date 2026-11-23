import {askModel, listModels, providerBases} from './ai-client.js';

export const browserProviders = [
  {id:'hosted', label:'Hosted OpenAI-compatible', kind:'openai', baseUrl:''},
  {id:'gemini', label:'Google Gemini', kind:'gemini', baseUrl:providerBases.gemini}
];

function directOptions(options) {
  const {provider, baseUrl, apiKey} = options;
  const kind = provider === 'gemini' || provider === 'ollama' ? provider : 'remote';
  return {...options, provider:kind, base:baseUrl, key:apiKey};
}

function direct(options) {
  return !options.backend || browserProviders.some(item => item.id === options.provider);
}

async function post(path, body, signal) {
  const {backend, signal:unusedSignal, ...payload} = body;
  const response = await fetch('/api/ai/' + path, {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), signal
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw Error(data.error || 'Model service returned HTTP ' + response.status);
  }
  return response;
}

export async function discover(options) {
  if (direct(options)) {
    const models = await listModels(directOptions(options));
    return {ok:true, models, suggested:models[0], label:options.provider};
  }
  return (await post('models', options, options.signal)).json();
}

export async function chatResponse(options) {
  if (direct(options)) return Response.json({text:await askModel(directOptions(options))});
  return post('chat', options, options.signal);
}

export async function askConnected(options) {
  if (!options.model) throw Error('Open AI coach and choose a loaded model.');
  const response = await chatResponse({...options, stream:false});
  const data = await response.json();
  if (!data.text?.trim()) throw Error('The model returned no text.');
  return data.text;
}
