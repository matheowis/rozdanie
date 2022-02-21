const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/app.tsx',
  module: {
    rules: [
      {
        test: /(\.tsx)|(\.ts)?$/,
        use: 'ts-loader',
        // exclude: /node_modules/,
        exclude:[
          path.resolve(__dirname,'node_modules'),
          path.resolve(__dirname,'local'),
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname,'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    port: 9090
  }
};