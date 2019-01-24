'use strict';

const path                          = require('path');
const webpack                       = require('webpack');
const CleanWebpackPlugin            = require('clean-webpack-plugin');
const HtmlWebpackPlugin 			= require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin       = require('optimize-css-assets-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
	context: path.join(__dirname, '../src'),
	target: 'web',
	entry: {
		index: [path.join(__dirname, '../src/index.js')]
	},
	resolve: {
        symlinks: false,
		alias: {

		},
		extensions: ['.js', '.less', '.styl', '.scss']
	},
	stats: {
		assets: true,
		colors: true,
		errors: true,
		errorDetails: true,
		hash: true,
		performance: true,
		reasons: true,
		timings: true
	},
	optimization: {
		runtimeChunk: {
			name: 'runtime'
		},
		splitChunks: {
			chunks: 'all',
			minSize: 0,
			maxAsyncRequests: Infinity,
			maxInitialRequests: Infinity,
			name: true,
			cacheGroups: {
				styles: { // extract in one CSS file
					name: 'styles',
					test: /\.css$|\.less$|\.scss$|\.styl$/,
					chunks: 'all',
					enforce: true
				},
				default: {
					chunks: 'async',
					minSize: 30000,
					minChunks: 2,
					maxAsyncRequests: 5,
					maxInitialRequests: 3,
					priority: -20,
					reuseExistingChunk: true
				},
				vendor: {
					name: 'vendor',
					enforce: true,
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					reuseExistingChunk: true
				},
				common: {
					name: 'common',
					chunks: 'initial',
					minChunks: 2,
					test: function (module) {
						return module.resource && /src[\\/]/.test(module.resource);
					},
					priority: -5,
					reuseExistingChunk: true,
				}
			}
		}
	},
	plugins: [
		new CleanWebpackPlugin(['dist'], {
			root: path.join(__dirname, '../'),
			exclude: ['.gitkeep']
		}),

        new HtmlWebpackPlugin({
            filename: path.join(__dirname, '../dist/index.html'),
            template: path.join(__dirname, '../src/index.html'),
            minify: true,
            inject: true,
            chunks: ['runtime', 'styles', 'vendor', 'common', 'index'],
			browserSync: process.env.NODE_ENV == 'development' ? `<script id="__bs_script__">//<![CDATA[document.write("<script async src='http://HOST:8080/browser-sync/browser-sync-client.js?v=2.24.7'><\\/script>".replace("HOST", location.hostname));//]]></script>` : ''
		}),

		new LodashModuleReplacementPlugin(/*opts*/),
		new OptimizeCSSAssetsPlugin(),

		new webpack.ContextReplacementPlugin(
			/([\/\\]node_modules[\/\\]moment[\/\\]locale|[\/\\]bower_components[\/\\]moment[\/\\]locale)/,
			/en-gb/
		)
	]
};
