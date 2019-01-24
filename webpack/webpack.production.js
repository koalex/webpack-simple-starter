'use strict';

const path                  = require('path');
const webpack               = require('webpack');
const merge                 = require('webpack-merge');
const common                = require('./webpack.common.js');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const autoprefixer          = require('autoprefixer');
const cssMqpacker           = require('css-mqpacker');
const zopfli 				= require('@gfx/zopfli');
const CompressionPlugin 	= require('compression-webpack-plugin');
const TerserPlugin 			= require('terser-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	output: {
		filename: '[chunkhash].[name].js',
		chunkFilename: '[id].[chunkhash].js',
		path: path.join(__dirname, '../dist'),
		publicPath: '/'
	},
	devtool: 'source-map',
	performance: {
		hints: 'warning',
		maxEntrypointSize: 400000,
		maxAssetSize: 250000,
		assetFilter: function (assetFilename) {
			return !(/\.map$/.test(assetFilename));
		}
	},
	profile: true,
	module: {
		noParse: /jquery/,
		rules: [
			{
				test: /\.js?$/,
				exclude: [/(node_modules|bower_components)/],
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
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
					}
				]
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[hash:base64:5]',
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
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[hash:base64:5]',
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
					'sass-loader'
				]
			},
			{
				test: /\.styl$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[hash:base64:5]',
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
					'stylus-loader'
				]
			},
			{
				test: /\.(png|jpg|jpeg|svg|ttf|eot|woff|woff2)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[path][name].[hash:6].[ext]',
							limit: 4096
						}
					},
					{
						loader: 'file-loader'
					}
				]
			}
		]
	},
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: 4,
                // banner: 'hello',
                extractComments: true,
                test: /\.js$/,
                sourceMap: true
            })
		]
	},
	plugins: [
		new webpack.HashedModuleIdsPlugin({
			hashFunction: 'sha256',
			hashDigest: 'hex',
			hashDigestLength: 20
		}),

		new MiniCssExtractPlugin({
			filename: '[chunkhash].[name].css',
			chunkFilename: '[id].[chunkhash].css'
		}),
		new CompressionPlugin({
            test: /\.js$|\.css$/,
            filename: '[path].gz[query]',
            compressionOptions: {
                numiterations: 25
            },
            algorithm: function (input, compressionOptions, callback) {
                return zopfli.gzip(input, compressionOptions, callback);
            },
			threshold: 10240,
			minRatio: 0.8
		})
	]
});
