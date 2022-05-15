const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devConfig = require('./config/webpack.dev');
const prdConfig = require('./config/webpack.prd');

const debug = process.env.NODE_ENV === 'development';

console.log(`\n当前是${debug ? '开发' : '生产'}环境 \n`);

const common = {
  styleLoader: {
    // ...(debug ? { loader: 'style-loader' } : { loader: MiniCssExtractPlugin.loader, options: { publicPath: '../' } }),
    // loader: 'style-loader',
    loader: MiniCssExtractPlugin.loader,
    options: { publicPath: '../' },
  },
  lessLoader: {
    loader: 'less-loader',
    options: {
      lessOptions: {
        javascriptEnabled: true,
      },
    },
  },
  postcssLoader: {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [require('autoprefixer')('last 1 versions')],
      },
    },
  },
};

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/main.tsx',
  output: {
    ...(debug
      ? { filename: '[name].[chunkhash:8].js', chunkFilename: '[name].[chunkhash:8].js' }
      : {
          path: path.resolve(__dirname, 'dist'),
          filename: 'js/[name].[chunkhash:8].js',
          chunkFilename: 'js/[name].[chunkhash:8].js',
          publicPath: './',
        }),
  },
  devtool: 'inline-source-map',
  ...(debug ? { devServer: devConfig.devServer } : {}),
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/i,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory([
                {
                  libraryName: 'antd',
                  // libraryDirectory: 'lib',
                  style: true,
                },
              ]),
            ],
          }),
          compilerOptions: {
            module: 'es2015',
          },
        },
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [common.styleLoader, 'css-loader'],
      },
      /* 处理node_modules里antd的less */
      {
        test: /\.less$/i,
        include: /node_modules/,
        use: [common.styleLoader, 'css-loader', common.postcssLoader, common.lessLoader],
      },
      {
        test: /\.less$/i,
        exclude: /node_modules/,
        use: [
          common.styleLoader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: debug,
              modules: {
                localIdentName: '[name]-[local]-[hash:base64:8]',
              },
            },
          },
          common.postcssLoader,
          common.lessLoader,
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          common.styleLoader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: debug,
              modules: {
                localIdentName: '[name]-[local]-[hash:base64:8]',
              },
            },
          },
          common.postcssLoader,
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: 'file-loader',
          options: {
            limit: 4 * 1024,
            outputPath: 'images',
            name: '[name].[hash:20].[ext]',
          },
        },
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 4 * 1024,
            outputPath: 'fonts',
            name: '[name].[hash:20].[ext]',
          },
        },
      },
      {
        test: /\.(wav|mp4|avi)$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 4 * 1024,
            outputPath: 'media',
            name: '[name].[hash:20].[ext]',
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            arrows: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,
            booleans: true,
            if_return: true,
            sequences: true,
            unused: true,
            conditionals: true,
            dead_code: true,
            evaluate: true,
          },
          mangle: {
            safari10: true,
          },
        },
        // sourceMap: true,
        // cache: true,
        parallel: true,
        extractComments: false,
      }),
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@pages': path.resolve(__dirname, './src/pages'),
      '@api': path.resolve(__dirname, './src/api'),
      '@imgs': path.resolve(__dirname, './src/static/imgs'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      favicon: path.resolve(__dirname, './src/favicon.ico'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        removeScriptTypeAttributes: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: debug ? './css/[name].css' : './css/[name].[chunkhash:8].css',
    }),
    ...(debug ? devConfig.plugins : prdConfig.plugins),
  ],
};
