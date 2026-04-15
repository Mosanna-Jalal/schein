const path = require('path');
const projectDir = path.resolve(__dirname);
const constants = require('./node_modules/next/dist/shared/lib/constants.js');
console.log('PHASE_DEVELOPMENT_SERVER:', JSON.stringify(constants.PHASE_DEVELOPMENT_SERVER));

// Load the config module's constants separately
const configSrc = require('fs').readFileSync('./node_modules/next/dist/server/config.js', 'utf8');
// Find what the config module imports as PHASE_DEVELOPMENT_SERVER
const match = configSrc.match(/PHASE_DEVELOPMENT_SERVER.*?=.*?['"]([^'"]+)['"]/);
console.log('Config uses phase:', match ? match[1] : 'not found');
