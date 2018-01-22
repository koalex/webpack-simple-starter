/*** ✰✰✰ Konstantin Aleksandrov ✰✰✰ ***/

// FIXME: file-loader v1.0 внутри url-loader глючит -> https://github.com/webpack-contrib/file-loader/issues/181 (откатился на file-loader v0.11)

'use strict';

global.__DEV__              = process.env.NODE_ENV === 'development';
const webpack               = require('webpack');
const fs                    = require('fs');
const path                  = require('path');
const join                  = path.join;
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const BrowserSyncPlugin     = require('browser-sync-webpack-plugin');
const ExtractCssChunks      = require('extract-css-chunks-webpack-plugin');
const autoprefixer          = require('autoprefixer');
const cssMqpacker           = require('css-mqpacker');


module.exports = {
    context: join(process.cwd(), './src'),
    entry: {
        index: ['./scripts/index.js'] 
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: __DEV__ ? '/' : './',
        filename: '[name].js',
        chunkFilename: '[id].js'
    },
    watchOptions: {
        aggregateTimeout: 100,
        ignored: /node_modules/
    },
    devtool: __DEV__ ? 'eval-source-map' : 'source-map',
    devServer: {
        port: 4000,
        hot: __DEV__,
        contentBase: path.resolve(__dirname, './dist')
    },
    resolve: {
        modules: ['node_modules', 'bower_components'],
        extensions: ['.js', '.jsx', '.less', '.styl', '.scss']
    },
    resolveLoader: {
        modules: ['node_modules', 'bower_components'],
        extensions: ['.js', '.jsx', '.less', '.styl', '.scss']
    },
    performance: {
        hints: false,
        maxEntrypointSize: 400000,
        maxAssetSize: 250000,
        assetFilter: function (assetFilename) {
            return !(/\.map$/.test(assetFilename));
        }
    },
    module: {
        noParse: [/jquery/],
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [['env', {'modules': false}], 'stage-0'],
                    plugins: [
                        'transform-runtime',
                        'transform-decorators-legacy',
                        'transform-decorators-legacy'
                    ]

                }
            },
            {
                test: /\.css$/,
                use: ExtractCssChunks.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                sourceMap: true,
                                minimize: !__DEV__,
                                modules: false,
                                localIdentName: '[name]',
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
                })
            },
            {
                test: /\.less?$/,
                use: ExtractCssChunks.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                sourceMap: true,
                                minimize: !__DEV__,
                                modules: false,
                                localIdentName: '[name]',
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
                        'less-loader'
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractCssChunks.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                sourceMap: true,
                                minimize: !__DEV__,
                                modules: false,
                                localIdentName: '[name]',
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
                })
            },
            {
                test: /\.styl$/,
                use: ExtractCssChunks.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                sourceMap: true,
                                minimize: !__DEV__,
                                modules: false,
                                localIdentName: '[name]',
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
                })
            },
            {
                test: /\.(png|jpg|jpeg|svg|ttf|eot|woff|woff2)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        query: {
                            name: (__DEV__ ? '[path][name]' : '[path][name].[hash:6]') + '.[ext]',
                            limit: 4096
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        query: {
                            mozjpeg: {
                                progressive: true
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
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.HotModuleReplacementPlugin(),

        new webpack.ContextReplacementPlugin(
            /([\/\\]node_modules[\/\\]moment[\/\\]locale|[\/\\]bower_components[\/\\]moment[\/\\]locale)/,
            /ru|en-gb/
        ),

        new ExtractCssChunks({
            filename: '[name].css'
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
            __DEV__: JSON.stringify(__DEV__)
        }),

        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
};


if (__DEV__) {
    module.exports.plugins.push(new webpack.NamedModulesPlugin());

    module.exports.plugins.push(
        new BrowserSyncPlugin(
            {
                ui: {
                    port: 8090
                },
                host: 'localhost',
                port: 8080,
                // proxy the Webpack Dev Server endpoint
                // (which should be serving on http://localhost:8080/)
                // through BrowserSync
                cors: false,
                proxy: {
                    target: 'http://localhost:4000',
                    ws: true
                }
            },
            {
                // prevent BrowserSync from reloading the page
                // and let Webpack Dev Server take care of this
                reload: false
            }
        )
    )

} else {
    // to babel-loader
    module.exports.module.rules[0].query.plugins.unshift(['transform-react-remove-prop-types', {
        'mode': 'remove',
        'removeImport': true,
        'ignoreFilenames': ['node_modules']
    }]);

    module.exports.plugins.push(new webpack.HashedModuleIdsPlugin({
        hashFunction: 'sha256',
        hashDigest: 'hex',
        hashDigestLength: 20
    }));
    module.exports.plugins.push( // NO NEED IF -p in CLI
        new webpack.optimize.UglifyJsPlugin({
            test: /\.js$/,
            // exclude: /common\.js/, // ебаный баг заставляет писать костыли https://github.com/webpack/webpack/issues/1079 (TODO: был в v1, скорее всего уже не актуально)
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );

}