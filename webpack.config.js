const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')

module.exports = (env, { mode }) => ({
  devServer: {
    contentBase: false,
  },
  devtool: mode === 'production' ? 'source-map' : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve(__dirname, 'src'),
        use: 'babel-loader',
      },
      {
        test: /\.(png)$/,
        include: resolve(__dirname, 'src'),
        use: {
          loader: 'file-loader',
          options: {
            name: mode === 'production' ? '[hash].[ext]' : '[path][name].[ext]',
          },
        },
      },
    ],
  },
  output: {
    chunkFilename: mode === 'production' ? '[chunkhash].js' : '[name].js',
    filename: mode === 'production' ? '[chunkhash].js' : '[name].js',
  },
  plugins: [
    mode === 'production' && new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      minify:
        mode !== 'production'
          ? false
          : {
              collapseWhitespace: true,
              removeAttributeQuotes: true,
              removeScriptTypeAttributes: true,
            },
      template: resolve(__dirname, 'src/index.html'),
    }),
  ].filter(Boolean),
})
