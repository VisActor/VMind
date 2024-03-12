/**
 * Usage:
 *  example command: node ./download-documents.js path=./examples token=1e7a4c5b-893e-580f-96f2-29e62d5de99c routeId=186
 *  arguments:
 *    path: target directory to store documents
 *    token: cms site token
 *    routeId: top route id for cms site
 *
 *  target directory structure:
 *    entry:
 *      zh: xx.md / dir
 *      en: xx.md / dir
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch-commonjs');

// configs
const languages = ['zh', 'en'];
const ignores = ['README.md', 'readme.md'];

// CMS Domain

const CMSDomain = 'https://cms-cn.zijieapi.com';
// arguments
const arguments = process.argv.slice(2);

let targetDirectory = path.resolve(__dirname);
let token = '';
let routeId = -1;
for (const argument of arguments) {
  if (argument.startsWith('path=')) {
    targetDirectory = argument.split('path=')[1];
  } else if (argument.startsWith('token=')) {
    token = argument.split('token=')[1];
  } else if (argument.startsWith('routeId=')) {
    routeId = argument.split('routeId=')[1];
  }
}
if (token === '') {
  console.error('Invalid parameters! Please refer to the cms config in the scripts.');
}
targetDirectory = path.resolve(targetDirectory);
const targetEntry = targetDirectory.split('/')[targetDirectory.split('/').length - 1];

async function fetchCMSData(token, url, plain) {
  const response = await fetch(`${CMSDomain}${url}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: token
    }
  });
  const json = await response.json();
  const data = plain ? json : json?.data;
  return data;
}

async function fetchRoutes(routeId, token) {
  if (routeId === -1) {
    const routeData = await fetchCMSData(token, `/api/open/site`, false);
    return routeData.routes;
  }
  const routeData = await fetchCMSData(token, `/api/open/site/top/${routeId}`, false);
  return routeData[0].children;
}

async function generateRouteData(route, parentMenuItem, rootDirectory, directory, token) {
  // not downloading any readme file
  if (route.path.indexOf('README') >= 0) {
    return;
  }
  if (route.children) {
    for (const language of languages) {
      const targetPath = path.join(rootDirectory, language, directory, route.path);
      // create directory
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath);
      }
    }
    const menuItem = {
      path: route.path,
      title: {
        zh: route.name['1'],
        en: route.name['2']
      },
      children: []
    };
    parentMenuItem.children.push(menuItem);
    for (const subRoute of route.children) {
      await generateRouteData(subRoute, menuItem, rootDirectory, path.join(directory, route.path), token);
    }
  } else {
    const menuItem = {
      path: route.path,
      title: {}
    };
    parentMenuItem.children.push(menuItem);
    for (const language of languages) {
      const languageIndex = languages.indexOf(language) + 1;
      const document = await fetchCMSData(
        token,
        `/api/open/document?fullPath=${route.fullPath}&language=${languageIndex}`,
        false
      );
      const content = document[0].content;
      if (!content || content === '') {
        console.log(`Empty document: ${route.fullPath}`);
        return;
      }
      const meta = JSON.parse(document[0].meta);
      menuItem.title[language] = meta.title;
      const targetPath = path.resolve(rootDirectory, language, directory, `${route.path}.md`);
      fs.writeFileSync(targetPath, content, { encoding: 'utf8' });
    }
    console.log(`Generate document: ${route.fullPath}`);
  }
}

// token = tokenEnum.vtableGuide;
// // routeId = vchartExampleRouteId;
// targetDirectory = './tutorials';

async function run() {
  const routes = await fetchRoutes(routeId, token);

  const menu = {
    menu: targetEntry,
    children: []
  };
  const targetFullPath = path.resolve(targetDirectory);
  if (!fs.existsSync(targetFullPath)) {
    fs.mkdirSync(targetFullPath);
  }
  for (const language of languages) {
    const languageFullPath = path.join(targetDirectory, language);
    if (!fs.existsSync(languageFullPath)) {
      fs.mkdirSync(languageFullPath);
    }
  }
  for (const route of routes) {
    await generateRouteData(route, menu, targetFullPath, '', token);
  }
  const menuResult = JSON.stringify(menu, null, 2);
  const menuPath = path.join(targetDirectory, 'menu.json');
  fs.writeFileSync(menuPath, menuResult, { encoding: 'utf8' });

  console.log('Successfully download all documents!');
}

run();
