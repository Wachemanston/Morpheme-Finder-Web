const path = require('path');
const config = {
  entry: {
    index: path.resolve(__dirname, 'src/index.jsx'),
  },
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/env', {
                    modules: false,
                  },
                ],
              ],
              plugins: [
                'transform-object-rest-spread',
                '@babel/plugin-transform-react-jsx',
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: {
                localIdentName: '[path][name]__[local]', // Default: '[hash:base64]'
              },
            },
          },
        ],
      },
    ],
  },
};

module.exports = config;
