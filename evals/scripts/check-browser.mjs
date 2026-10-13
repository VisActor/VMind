import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { withRequiredChecks } from './browser-checks.mjs';
import { useLocalAssets } from './local-browser-assets.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const directory = path.resolve(process.argv[2] || '');
const metadata = JSON.parse(await fs.readFile(path.join(directory, 'metadata.json'), 'utf8'));
const expected = await fs.readFile(path.join(directory, 'expectations.json'), 'utf8').then(JSON.parse).catch(async error => {
  if (error.code === 'ENOENT') {
    const expectations = JSON.parse(await fs.readFile(path.join(root, 'evals/cases', metadata.task.skill, 'expectations.json'), 'utf8'));
    return expectations[metadata.task.id];
  }
  throw error;
});
const outputs = path.join(directory, 'workspace/outputs');
const checks = [];
const errors = [];
const requests = [];
let browser;
let assetFailures = [];
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(outputs, '.' + pathname);
    if (!target.startsWith(outputs + path.sep)) { res.writeHead(403); res.end(); return; }
    const real = await fs.realpath(target);
    if (!real.startsWith((await fs.realpath(outputs)) + path.sep)) { res.writeHead(403); res.end(); return; }
    res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.css':'text/css'})[path.extname(real)] || 'application/octet-stream');
    res.end(await fs.readFile(real));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
try {
  browser = await chromium.launch({ channel: 'chromium', headless: true });
  const page = await browser.newPage({ viewport: {width: 1440, height: 1000} });
  if (process.argv.includes('--local-assets')) {
    assetFailures = await useLocalAssets(page, `http://127.0.0.1:${server.address().port}`, path.join(root, 'evals'));
  }
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => requests.push({url:request.url(),error:request.failure()?.errorText}));
  page.on('response', response => { if (response.status() >= 400) requests.push({url:response.url(),status:response.status()}); });
  // Observe the instance produced by the installed template, without changing its options or data.
  await page.addInitScript(() => {
    window.__storyBuilds = [];
    window.__VSEED_AFTER_BUILD_SPEC__ = payload => window.__storyBuilds.push(payload);
    let module;
    Object.defineProperty(window, 'VTable', {configurable:true, get:()=>module, set(value) {
      module = new Proxy(value, {get(target, key) {
        const item = target[key];
        if (!['ListTable','PivotTable','PivotChart'].includes(key) || typeof item !== 'function') return item;
        return new Proxy(item, {construct(Type, args) {
          const instance = Reflect.construct(Type, args);
          window.__evalTable = instance;
          return instance;
        }});
      }});
    }});
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/${expected.html}`, {waitUntil:'networkidle',timeout:60000});
  await page.waitForFunction(() => [...document.querySelectorAll('canvas')].some(c => c.width > 0 && c.height > 0), null, {timeout:15000});
  if (expected.engine === 'story') {
    await page.waitForFunction(() => {
      const charts = [...document.querySelectorAll('[data-chart-id]')];
      return charts.length > 0 && charts.every(c => c.querySelector('canvas'));
    }, null, {timeout:15000});
    const builds = await page.evaluate(() => JSON.parse(JSON.stringify(window.__storyBuilds, (key, value) => typeof value === 'function' ? '[function]' : value)));
    await fs.writeFile(path.join(directory, 'runtime-spec.json'), JSON.stringify(builds, null, 2) + '\n');
    checks.push({name:'storyChartsCompiled',passed:builds.length > 0});
    if (expected.deck) {
      const slides = page.locator('.deck-slide');
      checks.push({name:'deckSlides',passed:await slides.count() >= 2});
      const before = await page.locator('.deck-slide.is-active').getAttribute('data-slide-label');
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(previous => document.querySelector('.deck-slide.is-active')?.dataset.slideLabel !== previous, before, {timeout:5000});
      await page.waitForFunction(() => {
        const slide = document.querySelector('.deck-slide.is-active');
        const rect = slide.getBoundingClientRect();
        return Math.abs(rect.x) < 1 && Math.abs(rect.y) < 1 &&
          [...slide.querySelectorAll('.headline, .chart-frame')].every(node => Number(getComputedStyle(node).opacity) > 0.99);
      }, null, {timeout:15000, polling:100});
      checks.push({name:'deckNavigation',passed:true});
      await page.screenshot({path:path.join(directory,'deck-next.png')});
      await page.keyboard.press('ArrowLeft');
      try {
        await page.waitForFunction(previous => {
          const slide = document.querySelector('.deck-slide.is-active');
          const rect = slide.getBoundingClientRect();
          return slide.dataset.slideLabel === previous && Math.abs(rect.x) < 1 && Math.abs(rect.y) < 1 && Number(getComputedStyle(slide.querySelector('.headline')).opacity) > 0.99;
        }, before, {timeout:15000, polling:100});
      } catch (error) {
        const state = await page.evaluate(() => ({
          activeLabel: document.querySelector('.deck-slide.is-active')?.dataset.slideLabel,
          slides: [...document.querySelectorAll('.deck-slide')].map(slide => ({
            label: slide.dataset.slideLabel,
            rect: slide.getBoundingClientRect().toJSON(),
            headlineOpacity: getComputedStyle(slide.querySelector('.headline')).opacity,
          })),
          scrollX, scrollY,
        }));
        await fs.writeFile(path.join(directory,'deck-return-state.json'), JSON.stringify(state,null,2) + '\n');
        await page.screenshot({path:path.join(directory,'deck-return-failed.png')});
        throw error;
      }
      checks.push({name:'deckReturnNavigation',passed:true});
    }
  }
  await page.screenshot({path:path.join(directory,'screenshot.png'),fullPage:true});
  const rendering = await page.evaluate(story => {
    const canvas = [...document.querySelectorAll(story ? '.chart-container canvas' : 'canvas')].find(c => c.width > 100 && c.height > 100);
    if (!canvas) return {passed:false,reason:'No chart/table canvas'};
    try {
      const pixels = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
      let colored = 0;
      for(let i=0;i<pixels.length;i+=40) if(pixels[i+3]>0 && Math.min(pixels[i],pixels[i+1],pixels[i+2])<245) colored++;
      return {passed:colored>20,coloredSamples:colored};
    } catch(error) {return {passed:false,reason:String(error)};}
  }, expected.engine === 'story');
  checks.push({name:'nonBlankCanvas',...rendering});
  if (expected.engine === 'vchart') {
    const spec = await page.evaluate(() => JSON.stringify(window.vchart?.getSpec?.() ?? null, (key, value) => typeof value === 'function' ? '[function]' : value, 2));
    await fs.writeFile(path.join(directory, 'runtime-spec.json'), spec + '\n');
  }
  const records = () => page.evaluate(() => window.__evalTable?.records ?? window.vchart?.getSpec()?.data?.flatMap(d => d.values ?? []) ?? null);
  if (expected.records) {
    const csv = (await fs.readFile(path.join(directory,'workspace/inputs',expected.records),'utf8')).trim().split(/\r?\n/).map(row=>row.split(','));
    const fields = csv.shift();
    const wanted = csv.map(row=>Object.fromEntries(fields.map((key,i)=>[key,row[i]])));
    const normalize = rows => rows?.map(row=>fields.map(key=>String(row[key])).join('|')).sort();
    const actual = await records();
    checks.push({name:'completeRuntimeRecords',passed:JSON.stringify(normalize(actual))===JSON.stringify(normalize(wanted)),actual,expected:wanted});
    if (expected.filter) {
      for(const quarter of ['Q1','Q2','all']) {
        await page.selectOption('#quarter-filter',quarter);
        await page.waitForTimeout(300);
        const actual = await records();
        const selected = wanted.filter(row=>quarter==='all'||row.quarter===quarter);
        checks.push({name:`filter:${quarter}`,passed:JSON.stringify(normalize(actual))===JSON.stringify(normalize(selected)),actual,expected:selected});
        await page.screenshot({path:path.join(directory,`filter-${quarter}.png`),fullPage:true});
      }
    }
  }
} catch(error) {
  errors.push(String(error));
} finally {
  if(browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
checks.push({name:'pageErrors',passed:errors.length===0},{name:'networkErrors',passed:requests.length===0});
if (process.argv.includes('--local-assets')) checks.push({name:'localAssets',passed:assetFailures.length===0});
const allChecks = withRequiredChecks(checks, expected.requiredChecks);
const result = {status:allChecks.every(check=>check.passed)?'passed':'failed',checks:allChecks,errors,requests,assetFailures,visualReview:'not-run'};
await fs.writeFile(path.join(directory,'browser.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
process.exitCode=result.status==='passed'?0:1;
