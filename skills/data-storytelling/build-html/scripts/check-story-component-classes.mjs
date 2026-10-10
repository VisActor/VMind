import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..', '..', '..');
const buildHtmlDir = path.join(repoRoot, 'skills', 'data-storytelling', 'build-html');
const buildDocPath = path.join(buildHtmlDir, 'BUILD.md');
const patternsDir = path.join(buildHtmlDir, 'patterns');
const htmlTemplatesPath = path.join(buildHtmlDir, 'html-templates.md');
const visualPrimitivesPath = path.join(buildHtmlDir, 'visual-primitives.md');
const stylesDir = path.join(buildHtmlDir, 'styles');
const cssManifestPath = path.join(stylesDir, 'story-components.manifest.json');

const IGNORE_USED_CLASS_NAMES = new Set([
  'html',
  'in-view',
  'svg',
]);

const IGNORE_DEFINED_CLASS_NAMES = new Set([
  'css',
  'g',
  'down',
  'in-view',
  'mjs',
  'org',
  'w3',
]);

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function readStoryComponentsCss() {
  const manifest = readJson(cssManifestPath);
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    throw new Error('story-components.manifest.json must contain a non-empty files array');
  }

  return (
    manifest.files
      .map((relativePath) => {
        if (typeof relativePath !== 'string' || relativePath.length === 0) {
          throw new Error('story-components.manifest.json files must be non-empty strings');
        }

        const cssPath = path.join(stylesDir, relativePath);
        if (!fs.existsSync(cssPath)) {
          throw new Error(`CSS manifest references missing file: ${relativePath}`);
        }

        return `/* source: ${relativePath} */\n${readText(cssPath).trimEnd()}`;
      })
      .join('\n\n') + '\n'
  );
}

function getSourceFiles() {
  const patternFiles = fs
    .readdirSync(patternsDir)
    .filter((fileName) => fileName.endsWith('.md'))
    .sort()
    .map((fileName) => path.join(patternsDir, fileName));

  return [buildDocPath, htmlTemplatesPath, ...patternFiles];
}

function collectUsedClasses(filePath) {
  const classes = new Set();
  const text = readText(filePath);

  for (const match of text.matchAll(/class="([^"]+)"/g)) {
    match[1]
      .split(/\s+/)
      .filter(Boolean)
      .forEach((className) => {
        if (!IGNORE_USED_CLASS_NAMES.has(className) && !className.startsWith('my-')) {
          classes.add(className);
        }
      });
  }

  for (const match of text.matchAll(/`\.([a-zA-Z_][a-zA-Z0-9_-]*)`/g)) {
    const className = match[1];
    if (!IGNORE_USED_CLASS_NAMES.has(className) && !className.startsWith('my-')) {
      classes.add(className);
    }
  }

  return classes;
}

function collectDefinedClasses(cssText) {
  const classes = new Set();
  const selectorRegex = /(^|\}|,)\s*([^@\n][^{]+)\{/gm;

  for (const match of cssText.matchAll(selectorRegex)) {
    const selector = match[2];
    for (const classMatch of selector.matchAll(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g)) {
      const className = classMatch[1];
      if (!IGNORE_DEFINED_CLASS_NAMES.has(className)) {
        classes.add(className);
      }
    }
  }

  return classes;
}

function assertDataArtifactContract(cssText) {
  const heroImpactText = readText(path.join(patternsDir, 'hero-impact.md'));
  const visualPrimitivesText = readText(visualPrimitivesPath);
  const htmlTemplatesText = readText(htmlTemplatesPath);

  const checks = [
    {
      ok: heroImpactText.includes('non-redundant'),
      message: 'hero-impact.md must define non-redundant data-artifact selection criteria',
    },
    {
      ok:
        visualPrimitivesText.includes('没有背景图') &&
        visualPrimitivesText.includes('SVG') &&
        visualPrimitivesText.includes('物件感'),
      message: 'visual-primitives.md must say data-artifact is not a fallback for missing visual assets',
    },
    {
      ok: htmlTemplatesText.includes('data-artifact-no-trace'),
      message: 'html-templates.md must document the no-trace data-artifact class',
    },
    {
      ok: cssText.includes('.data-artifact.data-artifact-no-trace'),
      message: 'data-artifact.css must define the no-trace data-artifact fallback layout',
    },
  ];

  const failures = checks.filter((check) => !check.ok);
  if (failures.length === 0) {
    return;
  }

  for (const failure of failures) {
    console.error(`CONTRACT\t${failure.message}`);
  }
  process.exitCode = 1;
}

function main() {
  const sourceFiles = getSourceFiles();
  const usedClasses = new Set();
  const usedBy = new Map();

  for (const filePath of sourceFiles) {
    const relativePath = path.relative(repoRoot, filePath);
    for (const className of collectUsedClasses(filePath)) {
      usedClasses.add(className);
      if (!usedBy.has(className)) {
        usedBy.set(className, new Set());
      }
      usedBy.get(className).add(relativePath);
    }
  }

  const storyComponentsCss = readStoryComponentsCss();
  const definedClasses = collectDefinedClasses(storyComponentsCss);
  assertDataArtifactContract(storyComponentsCss);

  const missingFromCss = [...usedClasses]
    .filter((className) => !definedClasses.has(className))
    .sort();
  const unusedInDocs = [...definedClasses]
    .filter((className) => !usedClasses.has(className))
    .sort();

  const strictUnused = process.argv.includes('--strict-unused');

  if (missingFromCss.length === 0 && (unusedInDocs.length === 0 || !strictUnused)) {
    console.log('Missing-from-CSS: 0');
    if (unusedInDocs.length > 0) {
      console.warn(`Unused-in-docs warnings: ${unusedInDocs.length}`);
      for (const className of unusedInDocs) {
        console.warn(`UNUSED\t${className}`);
      }
    } else {
      console.log('Unused-in-docs: 0');
    }
    console.log('story component CSS coverage OK');
    return;
  }

  if (missingFromCss.length > 0) {
    console.error(`Missing-from-CSS: ${missingFromCss.length}`);
    for (const className of missingFromCss) {
      const files = [...(usedBy.get(className) ?? [])].sort().join(', ');
      console.error(`MISSING\t${className}\t${files}`);
    }
  } else {
    console.log('Missing-from-CSS: 0');
  }

  if (unusedInDocs.length > 0) {
    const log = strictUnused ? console.error : console.warn;
    log(`Unused-in-docs ${strictUnused ? 'failures' : 'warnings'}: ${unusedInDocs.length}`);
    for (const className of unusedInDocs) {
      log(`UNUSED\t${className}`);
    }
  } else {
    console.log('Unused-in-docs: 0');
  }

  process.exitCode = missingFromCss.length > 0 || (strictUnused && unusedInDocs.length > 0) ? 1 : 0;
}

main();
