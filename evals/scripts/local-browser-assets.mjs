import fs from 'node:fs/promises';
import path from 'node:path';

// Map only the pinned CDN versions to the matching installed npm packages.
export function assetPath(url, nodeModules, versions) {
  const parsed = new URL(url);
  if (parsed.origin !== 'https://unpkg.com' || parsed.search) {
    throw new Error(`Unexpected browser asset: ${url}`);
  }
  const pathname = decodeURIComponent(parsed.pathname).slice(1);
  for (const [name, version] of Object.entries(versions)) {
    const prefix = `${name}@${version}/`;
    if (!pathname.startsWith(prefix)) continue;
    const directory = path.resolve(nodeModules, name);
    const file = path.resolve(directory, pathname.slice(prefix.length));
    if (!file.startsWith(directory + path.sep)) {
      throw new Error(`Asset escapes package directory: ${url}`);
    }
    return file;
  }
  throw new Error(`No pinned local package for browser asset: ${url}`);
}

export async function useLocalAssets(page, origin, evalsDirectory) {
  const { devDependencies } = JSON.parse(
    await fs.readFile(path.join(evalsDirectory, 'package.json'), 'utf8')
  );
  const versions = Object.fromEntries(
    ['@visactor/vchart', '@visactor/vtable', 'monaco-editor'].map(name => [name, devDependencies[name]])
  );
  const failures = [];
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (new URL(url).origin === origin) return route.continue();
    try {
      const file = assetPath(url, path.join(evalsDirectory, 'node_modules'), versions);
      await route.fulfill({ path: file });
    } catch (error) {
      failures.push({ url, error: String(error) });
      await route.abort('failed');
    }
  });
  return failures;
}
