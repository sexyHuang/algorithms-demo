const { readFileSync } = require('fs');
const path = require('path');
const cdnHost = 'https://cdn.mooyuer.com';
const getJson = path => {
  return JSON.parse(readFileSync(path));
};
const { name } = getJson(path.join(__dirname, './package.json'));
if (!name) throw Error('package.json中name属性不能为空！');
const cdnBaseUrl = `${cdnHost}/${name}/`;

module.exports = {
  base: cdnBaseUrl,
  outDir: name,
  alias: {
    '/src/': path.resolve(__dirname, 'src/')
  }
};
