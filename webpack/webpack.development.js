'use strict';

const path                 = require('path');
const webpack              = require('webpack');
const merge                = require('webpack-merge');
const common               = require('./webpack.common.js');
const autoprefixer         = require('autoprefixer');
const cssMqpacker          = require('css-mqpacker');
const BrowserSyncPlugin    = require('browser-sync-webpack-plugin');

const devServerPort = 9000;

module.exports = merge(common, {
	mode: 'development',
	output: {
		filename: '[name].js',
		chunkFilename: '[id].js',
		path: path.join(__dirname, '../dist'),
		publicPath: '/'
	},
	devtool: 'eval-source-map',
	devServer: {
		contentBase: path.join(__dirname, '../dist'),
        // watchContentBase: true,
		historyApiFallback: true,
		compress: true,
		hot: true,
		inline: true,
        host: '0.0.0.0',
        port: devServerPort,
        disableHostCheck: true // TODO: secure for dev ?
	},
	watch: true,
	watchOptions: {
		aggregateTimeout: 150,
		ignored: /node_modules/
	},
	performance: {
		hints: false,
		maxEntrypointSize: 400000,
		maxAssetSize: 250000,
		assetFilter: function (assetFilename) {
			return !(/\.map$/.test(assetFilename));
		}
	},
	cache: true,
	module: {
		rules: [
            {
                test: /\.js$/,
                exclude: [/(node_modules|bower_components)/],
                use: [/*'cache-loader',*/ 'babel-loader'],
            },
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: false,
							importLoaders: 1

						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								autoprefixer({ browsers: ['last 3 version', 'ie >= 11'] }),
								cssMqpacker({ sort: true })
							],
							sourceMap: true
						}
					}]
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[hash:base64:5]__[local]',
							importLoaders: 2
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								autoprefixer({ browsers: ['last 3 version', 'ie >= 11'] }),
								cssMqpacker({ sort: true })
							],
							sourceMap: true
						}
					},
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
				]
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[hash:base64:5]__[local]',
							importLoaders: 2

						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								autoprefixer({ browsers: ['last 3 version', 'ie >= 11'] }),
								cssMqpacker({ sort: true })
							],
							sourceMap: true
						}
					}, 'sass-loader'
				]
			},
			{
				test: /\.styl$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[hash:base64:5]__[local]',
							importLoaders: 2

						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [
								autoprefixer({ browsers: ['last 3 version', 'ie >= 11'] }),
								cssMqpacker({ sort: true })
							],
							sourceMap: true
						}
					},
					'stylus-loader'
				]
			},
			{
				test: /\.(png|jpg|jpeg|svg|ttf|eot|woff|woff2)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[path][name].[ext]',
							limit: 4096
						}
					},
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65
							},
							gifsicle: {
								interlaced: false
							},
							optipng: {
								optimizationLevel: 7
							},
							pngquant: {
								quality: '65-90',
								speed: 4
							},
							webp: { // the webp option will enable WEBP
								quality: 75
							}
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.NamedModulesPlugin(),

		new BrowserSyncPlugin(
			{
				ui: {
					port: 8090
				},
                https: false,
                ghostMode: {
                    clicks: false,
                    forms: true,
                    scroll: false
				},
				host: 'localhost',
				port: 8080,
				cors: false,
				proxy: {
					target: 'http://localhost:' + devServerPort,
					ws: true
				}
			},
			{
				reload: true
			}
		)
	]
});
