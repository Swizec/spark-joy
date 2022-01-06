// DO NOT convert to ES6
// wranglerjs/mod.rs can't handle it

const path = require('path')

module.exports = {
  context: path.resolve(__dirname, './'),
  target: 'webworker',
  mode: 'production',
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      {
        include: /node_modules/,
        test: /\.mjs$/,
        type: 'javascript/auto',
      },
    ],
  },
}
