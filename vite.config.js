const path = require('path');
const cdnBaseUrl = './';

module.exports = {
  outDir: 'algorithms-demo',
  alias: {
    '/src/': path.resolve(__dirname, 'src/')
  }
};
