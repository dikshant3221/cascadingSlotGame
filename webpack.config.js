const webpack = require('webpack'); // Import webpack
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development', // Set mode to 'development' or 'production' as needed
  entry: './src/core/GameApp.ts', // Entry point for the app
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
    clean: true, // Cleans the output folder before each build
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve .ts and .js files
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Process .ts files
        use: 'ts-loader',
        exclude: /node_modules/, // Exclude node_modules
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i, // Process image assets
        type: 'asset/resource', // Copy assets to the output directory
        generator: {
          filename: 'assets/[name][ext][query]', // Maintain asset structure in 'dist/assets'
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from 'dist'
    },
    compress: true, // Enable gzip compression for the served files
    port: 8081, // Port for the development server
    open: true, // Automatically open the app in the default browser
  },
  plugins: [
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js', // Automatically import PIXI globally when used
    }),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i, // Compress JavaScript files
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }, // Copy assets from 'src/assets' to 'dist/assets'
      ],
    }),
    new HtmlWebpackPlugin({
      template: './index.html', // Use 'src/index.html' as the base HTML file
    }),
  ],
};
