import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { assetPath } from '../evals/scripts/local-browser-assets.mjs';

const modules = path.resolve('node_modules');
const versions = { '@visactor/vchart': '2.0.21', 'monaco-editor': '0.45.0' };

test('maps scoped pinned bundles and editor subresources to local files', () => {
  assert.equal(
    assetPath('https://unpkg.com/@visactor/vchart@2.0.21/build/index.min.js', modules, versions),
    path.join(modules, '@visactor/vchart/build/index.min.js')
  );
  assert.equal(
    assetPath('https://unpkg.com/monaco-editor@0.45.0/min/vs/editor/editor.main.css', modules, versions),
    path.join(modules, 'monaco-editor/min/vs/editor/editor.main.css')
  );
});

test('rejects unexpected hosts, versions and paths instead of accessing the network', () => {
  for (const url of [
    'https://example.com/index.js',
    'https://unpkg.com/@visactor/vchart@latest/build/index.min.js',
    'https://unpkg.com/monaco-editor@0.45.0/%2e%2e%2fsecret',
    'https://unpkg.com/monaco-editor@0.45.0/min/vs/loader.js?version=other',
  ]) assert.throws(() => assetPath(url, modules, versions));
});

test('keeps story and standalone chart versions distinct through npm aliases', () => {
  const pinned = {...versions, 'story-vchart': 'npm:@visactor/vchart@2.1.7'};
  assert.equal(assetPath('https://unpkg.com/@visactor/vchart@2.1.7/build/index.min.js', modules, pinned), path.join(modules, 'story-vchart/build/index.min.js'));
  assert.equal(assetPath('https://unpkg.com/@visactor/vchart@2.0.21/build/index.min.js', modules, pinned), path.join(modules, '@visactor/vchart/build/index.min.js'));
});
