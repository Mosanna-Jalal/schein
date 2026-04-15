const path = require('path');
const { getBaseSWCOptions, getLoaderSWCOptions } = require('./node_modules/next/dist/build/swc/options.js');
const { loadBindings } = require('./node_modules/next/dist/build/swc/index.js');

const MODERN = ['chrome 111', 'edge 111', 'firefox 111', 'safari 16.4'];
const fakeFilename = path.resolve('./node_modules/next/dist/client/app-next-dev.js');

const opts = getLoaderSWCOptions({
  filename: fakeFilename,
  development: true,
  isServer: false,
  pagesDir: path.resolve('./src/app'),
  appDir: path.resolve('./src/app'),
  isPageFile: false,
  isCacheComponents: false,
  hasReactRefresh: true,
  modularizeImports: undefined,
  optimizeServerReact: true,
  optimizePackageImports: undefined,
  swcPlugins: undefined,
  compilerOptions: {},
  jsConfig: { compilerOptions: {} },
  supportedBrowsers: MODERN,
  swcCacheDir: path.resolve('./.next/cache/swc'),
  relativeFilePathFromRoot: 'node_modules/next/dist/client/app-next-dev.js',
  serverComponents: false,
  serverReferenceHashSalt: '',
  bundleLayer: undefined,
  esm: false,
  cacheHandlers: undefined,
  useCacheEnabled: false,
  taintEnabled: false,
  trackDynamicImports: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
});

const json = JSON.stringify(opts);
console.log('JSON length:', json.length);
console.log('Char at 1164:', json.substring(1160, 1170));
console.log('Around 1164:', json.substring(1140, 1200));
