import test from 'node:test';
import assert from 'node:assert/strict';
import {loadQuestion} from './question-bridge.js';

test('reconnects an existing problem tab after its content script is invalidated',async()=>{
  const calls=[];
  const api={
    tabs:{async sendMessage(tab,message){calls.push({tab,message});if(calls.length===1)throw Error('No receiver');return {title:'Two Sum'};}},
    scripting:{async executeScript(options){calls.push(options);}}
  };
  assert.deepEqual(await loadQuestion(api,17,'two-sum'),{title:'Two Sum'});
  assert.deepEqual(calls[1],{target:{tabId:17},files:['launcher.js']});
  assert.deepEqual(calls[2],{tab:17,message:{type:'question',slug:'two-sum'}});
});
