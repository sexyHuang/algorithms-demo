const path = require('path');
const cdnBaseUrl = 'https://cdn.mooyuer.com/algorithms-demo/';

module.exports = {
  base: cdnBaseUrl,
  outDir: 'algorithms-demo',
  alias: {
    '/src/': path.resolve(__dirname, 'src/')
  }
};
