const path = require('path');
const fs = require('fs');
const swc = require('./node_modules/next/dist/build/swc/index.js');
const { getLoaderSWCOptions } = require('./node_modules/next/dist/build/swc/options.js');

const MODERN = ['chrome 111', 'edge 111', 'firefox 111', 'safari 16.4'];
const fakeFilename = path.resolve('./node_modules/next/dist/client/app-next-dev.js');
const src = fs.readFileSync(fakeFilename, 'utf8');

const swcOptions = getLoaderSWCOptions({
  filename: fakeFilename,
  development: true, isServer: false,
  pagesDir: path.resolve('./src/app'), appDir: path.resolve('./src/app'),
  isPageFile: false, isCacheComponents: false, hasReactRefresh: true,
  modularizeImports: undefined, optimizeServerReact: true, optimizePackageImports: undefined,
  swcPlugins: undefined, compilerOptions: {}, jsConfig: { compilerOptions: {} },
  supportedBrowsers: MODERN, swcCacheDir: path.resolve('./.next/cache/swc'),
  relativeFilePathFromRoot: 'node_modules/next/dist/client/app-next-dev.js',
  serverComponents: false, serverReferenceHashSalt: '', bundleLayer: undefined,
  esm: false, cacheHandlers: undefined, useCacheEnabled: false, taintEnabled: false,
  trackDynamicImports: false, pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
});

const programmaticOptions = {
  ...swcOptions,
  filename: fakeFilename,
  sourceMaps: false,
  inlineSourcesContent: false,
  sourceFileName: fakeFilename,
};

swc.loadBindings().then(() => {
  console.log('Bindings loaded, transforming...');
  return swc.transform(src, programmaticOptions);
}).then(output => {
  console.log('SUCCESS! Output length:', output.code.length);
}).catch(err => {
  console.error('FULL ERROR:', err.message);
  const json = JSON.stringify(programmaticOptions);
  console.log('\nTotal JSON length:', json.length);
  // Find column 1164
  if (err.message.includes('column')) {
    const match = err.message.match(/column (\d+)/);
    if (match) {
      const col = parseInt(match[1]);
      console.log(`\nAround column ${col}:`, json.substring(col - 20, col + 30));
    }
  }
});
