import constants from './node_modules/next/dist/shared/lib/constants.js';
import * as configMod from './node_modules/next/dist/server/config.js';

const { PHASE_DEVELOPMENT_SERVER } = constants;
// The module uses module.exports = ... pattern (CJS wrapped in ESM)
const loadConfig = configMod['module.exports'];
const projectDir = process.cwd();
console.log('loadConfig type:', typeof loadConfig);
try {
  const cfg = await loadConfig(PHASE_DEVELOPMENT_SERVER, projectDir);
  console.log('distDir:', cfg.distDir);
  console.log('distDirRoot:', cfg.distDirRoot);
  console.log('outputFileTracingRoot:', cfg.outputFileTracingRoot);
} catch(e) {
  console.error('Error:', e.message);
}
