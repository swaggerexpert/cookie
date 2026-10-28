import path from 'node:path';
import webpack from 'webpack';
import { nonMinimizeTrait, minimizeTrait } from './traits.config.js';

/**
 * Replaces Node.js specific modules (`*.node.js`) with their browser counterparts (`*.browser.js`),
 * the same way the `browser` field in package.json does for the es/ and cjs/ builds.
 */
const browserModuleReplacementPlugin = new webpack.NormalModuleReplacementPlugin(
  /\.node\.js$/,
  (resource) => {
    resource.request = resource.request.replace(/\.node\.js$/, '.browser.js');
  },
);

const browser = {
  mode: 'production',
  entry: ['./src/index.js'],
  target: 'web',
  output: {
    path: path.resolve('./dist'),
    filename: 'cookie.browser.js',
    libraryTarget: 'umd',
    library: 'SwaggerExpertCookie',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
    ],
  },
  ...nonMinimizeTrait,
  plugins: [browserModuleReplacementPlugin],
};

const browserMin = {
  mode: 'production',
  entry: ['./src/index.js'],
  target: 'web',
  output: {
    path: path.resolve('./dist'),
    filename: 'cookie.browser.min.js',
    libraryTarget: 'umd',
    library: 'SwaggerExpertCookie',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
    ],
  },
  ...minimizeTrait,
  plugins: [...minimizeTrait.plugins, browserModuleReplacementPlugin],
};

export default [browser, browserMin];
