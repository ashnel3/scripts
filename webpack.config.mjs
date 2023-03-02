import BannerPlugin from 'webpack/lib/BannerPlugin.js'
import CopyPlugin from 'copy-webpack-plugin'

import { join } from 'path'

/**
 * Build mode
 * @type {'development' | 'production'}
 */
const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production'
const isDev = mode === 'development'

/**
 * Build tool
 * @type {string | undefined}
 */
const devtool = process.env.DEVTOOL

const cwd = process.cwd()
const input = 'src'
const output = 'bin'

/**
 * SWC config
 * @type {import('@swc/core').Options}
 */
const swcOptions = {
  env: {
    targets: {
      node: '12',
    },
  },
  jsc: {
    target: 'es2016',
    parser: {
      syntax: 'typescript',
    },
    minify: {
      compress: true,
      mangle: true,
      format: {
        comments: false,
        shebang: true,
      },
    },
  },
  module: {
    type: 'commonjs',
  },
  minify: !isDev,
  swcrc: false,
}

/**
 * Webpack config
 * @type {import('webpack').Configuration}
 */
const config = {
  devtool,
  mode,
  entry: {
    gitprofile: join(cwd, input, 'gitprofile.ts'),
    rhex: join(cwd, input, 'rhex.ts'),
    watchurl: join(cwd, input, 'watchurl.ts'),
  },
  output: {
    filename: mode === 'development' ? '[name].js' : '[name]',
    path: join(cwd, output),
    library: {
      type: 'commonjs',
    },
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  target: ['async-node12', 'es6'],
  module: {
    rules: [
      {
        test: /\.([cm]?js|ts)$/,
        use: {
          loader: 'swc-loader',
          options: swcOptions,
        },
      },
    ],
  },
  plugins: [
    new BannerPlugin({
      banner: '#!/usr/bin/env node\n',
      raw: true,
      include: /.*/,
    }),
    new CopyPlugin({
      patterns: [
        {
          context: input,
          from: '**/*.sh',
          to: '[name]',
        },
      ],
    }),
  ],
  optimization: {
    minimize: !isDev,
  },
}
export default config
