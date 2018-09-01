const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: paths.entry,
  output: {
    path: paths.dist,
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: paths.src,
        use: 'babel-loader',
      },
      {
        test: /\.(png)$/,
        include: paths.src,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.demoHtml,
    }),
  ],
}
