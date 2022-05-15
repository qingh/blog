const os = require('os');
const path = require('path');
const chalk = require('chalk');
const { port, open, proxy } = require('.');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
//获取本机ip地址
const getIpAddress = () => {
  let ip = '';
  let obj = os.networkInterfaces();
  for (const key in obj) {
    for (const item of obj[key]) {
      if (item.family.toLocaleLowerCase() === 'ipv4' && !item.internal) {
        ip = item.address;
      }
    }
  }
  return ip;
};

module.exports = {
  devServer: {
    port,
    open,
    hot: true,
    contentBase: path.resolve(__dirname, '../src/public'),
    quiet: true,
    compress: true,
    progress: true,
    // host: getIpAddress(),
    historyApiFallback: true,
    proxy,
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your app is running:\n\n
          ${chalk.green(`http://localhost:${port}`)}\n
          ${chalk.green(`http://${getIpAddress()}:${port}`)}\n\n`,
        ],
      },
    }),
  ],
};
