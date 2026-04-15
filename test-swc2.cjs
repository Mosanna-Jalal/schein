const path = require('path');
const { getBindingsSync, transform } = require('./node_modules/next/dist/build/swc/index.js');
const { getLoaderSWCOptions } = require('./node_modules/next/dist/build/swc/options.js');

const MODERN = ['chrome 111', 'edge 111', 'firefox 111', 'safari 16.4'];
const fakeFilename = path.resolve('./node_modules/next/dist/client/app-next-dev.js');

const swcOptions = getLoaderSWCOptions({
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

const programmaticOptions = {
  ...swcOptions,
  filename: fakeFilename,
  sourceMaps: true,
  inlineSourcesContent: true,
  sourceFileName: fakeFilename,
};

console.log('Full options JSON:');
const json = JSON.stringify(programmaticOptions, null, 2);
console.log(json);
console.log('\n\nAt col 1164 (non-pretty):', JSON.stringify(programmaticOptions).substring(1155, 1175));
