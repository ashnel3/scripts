import BannerPlugin from 'webpack/lib/BannerPlugin.js'
import CopyPlugin from 'copy-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

import { join } from 'path'

/**
 * Build mode
 * @type {'development' | 'production'}
 */
const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production'

/**
 * Build tool
 * @type {string | undefined}
 */
const devtool = process.env.DEVTOOL

const cwd = process.cwd()
const input = 'src'
const output = 'bin'

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
  },
  output: {
    filename: mode === 'development' ? '[name].js' : '[name]',
    path: join(cwd, output),
    library: {
      type: 'commonjs',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: ['async-node12'],
  module: {
    rules: [
      {
        test: /\.([cm]?js|ts)$/,
        use: {
          loader: 'swc-loader',
          options: {},
        },
      },
    ],
  },
  optimization: {
    minimize: mode === 'production',
    minimizer: [new TerserPlugin({})],
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
}
export default config
