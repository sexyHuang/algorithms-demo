const path = require('path');
const cdnBaseUrl = './';

module.exports = {
  base: cdnBaseUrl,
  outDir: 'algorithms-demo',
  alias: {
    '/src/': path.resolve(__dirname, 'src/')
  }
};
