import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');

function allowed(text, agent, path) {
  const groups = []; let current;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.split('#')[0].trim(), colon = line.indexOf(':');
    if (colon < 0) continue;
    const field = line.slice(0, colon).trim().toLowerCase(), value = line.slice(colon + 1).trim();
    if (field === 'user-agent') {
      if (!current || current.rules.length) { current = { agents: [], rules: [] }; groups.push(current); }
      current.agents.push(value.toLowerCase());
    } else if (current && ['allow', 'disallow'].includes(field) && value) current.rules.push({ path: value, allow: field === 'allow' });
  }
  const specific = groups.filter(g => g.agents.includes(agent.toLowerCase()));
  const applicable = specific.length ? specific : groups.filter(g => g.agents.includes('*'));
  const rules = applicable.flatMap(g => g.rules).filter(r => path.startsWith(r.path)).sort((a, b) => b.path.length - a.path.length || Number(b.allow) - Number(a.allow));
  return rules[0]?.allow ?? true;
}

const PROJECT_PATHS = ['/', '/lifeops-atlas-showcase/', '/lifeops-atlas-showcase/terms/', '/agrisentry/',
  '/agrisentry/terms.html', '/rivulet-localops/film/', '/cyber-finance-city/', '/little-red-sequel/film/',
  '/payment-reconciliation-engine/film/', '/a-future-project/'];

test('AI training crawlers are blocked from the whole host (owner rule, 20 November 2026)', async () => {
  const text = await read('site/robots.txt');
  for (const agent of ['GPTBot', 'ClaudeBot', 'anthropic-ai', 'CCBot', 'Google-Extended', 'Applebot-Extended',
    'Bytespider', 'meta-externalagent', 'Amazonbot', 'cohere-ai', 'Diffbot', 'Omgilibot', 'Timpibot']) {
    for (const path of PROJECT_PATHS) assert.equal(allowed(text, agent, path), false, `${agent} ${path}`);
  }
});

test('AI search and user-requested AI agents may read every path (owner rule, 20 November 2026)', async () => {
  const text = await read('site/robots.txt');
  for (const agent of ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User']) {
    for (const path of PROJECT_PATHS) assert.equal(allowed(text, agent, path), true, `${agent} ${path}`);
  }
});

test('ordinary search engines may crawl every path', async () => {
  const text = await read('site/robots.txt');
  for (const agent of ['Googlebot', 'bingbot', 'DuckDuckBot']) {
    for (const path of PROJECT_PATHS) assert.equal(allowed(text, agent, path), true, `${agent} ${path}`);
  }
});

test('minimal entry contains bilingual copyright, terms links and no collection code', async () => {
  const html = await read('site/index.html');
  assert.match(html, /All rights reserved/); assert.match(html, /保留所有权利/);
  assert.match(html, /terms\/\?lang=en/); assert.match(html, /terms\/\?lang=zh/);
  assert.doesNotMatch(html, /<script|<form|localStorage|sessionStorage|document\.cookie/i);
  assert.match(await read('LICENSE'), /Copyright \(c\) 2026 LifeOps Atlas\. All rights reserved\./);
});
