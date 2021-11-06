const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const path = require('path');

let entries = {
    'bundle': './src/front/index.tsx',
}

const shouldUseSourceMapForProduction = false;

const relPathToStatic = '/_media/react-part/';

module.exports = {
    mode: 'development',
    entry: entries,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: 'tsconfig.json'
                }
            },
            {
                test: /\.scss$/,
                exclude: /\.module\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            },
            {
                test: /\.module\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: { getLocalIdent: getCSSModuleLocalIdent }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            },

            
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            import: true,
                        }
                    },
                ],
            },
            {
                test: /\.module\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            import: true,
                            modules: { getLocalIdent: getCSSModuleLocalIdent }
                        }
                    },
                ],
            },

            {
                test: /\.(jpg|png|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: "[name].[ext]",
                    outputPath: "./assets",
                    esModule: false
                }
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dest/front/'),
        devtoolModuleFilenameTemplate(info) {
            return `file:///${info.absoluteResourcePath.replace(/\\/g, '/')}`;
        },
    },
    devtool: 'source-map',
    devServer: {
        port: 9000
    },
    optimization: {
        minimize: !true,
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: "styles",
                    type: "css/mini-extract",
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "front/*.html", context: path.resolve(__dirname, "src"), to: path.resolve(__dirname, "dest") }, // only for isolate 
                // { from: "mock/*.json", context: path.resolve(__dirname, "src/front"), to: path.resolve(__dirname, relPathToStatic) },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: './bundle.css',
        })
    ],
};