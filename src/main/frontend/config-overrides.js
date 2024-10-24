const { override, addWebpackPlugin, addBabelPlugin } = require('customize-cra');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = override(
    // (config) => {
    //     if (!config.optimization) {
    //         config.optimization = {};
    //     }
    //     config.optimization.splitChunks = {
    //         chunks: 'all',
    //         maxInitialRequests: Infinity,
    //         minSize: 0,
    //         cacheGroups: {
    //             vendor: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name(module) {
    //                     // get the name. E.g. node_modules/packageName/not/this/part.js
    //                     // or node_modules/packageName
    //                     const packageName = module.context && module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
    //                     if (!packageName) return 'vendor';
    //
    //                     // npm package names are URL-safe, but some servers don't like @ symbols
    //                     return `npm.${packageName[1].replace('@', '')}`;
    //                 },
    //             },
    //         },
    //     };
    //     return config;
    // },

    (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer = [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            // drop_console: false,
                        },
                    },
                }),
            ];
        }
        return config;
    },

    // 소스 맵 비활성화 설정 추가
    (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.devtool = false;
        }
        return config;
    },

    // addBabelPlugin(['transform-remove-console', { exclude: ['error', 'warn'] }]),

    addWebpackPlugin(new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
    })),

    addWebpackPlugin(new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
    })),

    addWebpackPlugin(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
    }))
);