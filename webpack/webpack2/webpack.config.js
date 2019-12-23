
const path = require('path');
// 清除文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// html
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 拷贝资源
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 提取css到单独文件的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩、去重css插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 引入webpack变量
const webpack = require('webpack')
// 图片压缩插件
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
var ImageminPlugin = require('imagemin-webpack-plugin').default
// 压缩js插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// 是否为生产模式
const isProduction = process.env.NODE_ENV === 'production'
console.log('NODE_ENV：', process.env.NODE_ENV)

module.exports = {
    // 声明开发模式
  mode: isProduction ? 'production' : 'development',
  // 生成 source map
  devtool: isProduction ? 'none' : 'cheap-module-eval-source-map',
  // 解决Child html-webpack-plugin for "index.html":
    stats: { children: false },
    // 入口
    entry: {
        main:'./src/main.js',
    },
     // 出口
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
              test: /\.css$/,
              use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader'
                   ]
            },
            {
              test: /\.(png|svg|jpg|gif)$/,
              use: [{
                loader: 'file-loader', //是指定使用的loader和loader的配置参数
                options: {
                  name: '[name].[ext]',
                  limit: 500, //是把小于500B的文件打成Base64的格式，写入JS
                  outputPath: 'img/',//输出路径
                  emitFile: true,//是否生成文件
                }
              }]
            }
          ]
    },
    plugins: [
      // 一定要放在HtmlWebpackPlugin文件前面
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './src/index.html',
          minify: {
            // 去掉注释
            removeComments: !!isProduction,
            // 去掉空格
            collapseWhitespace: !!isProduction
          }
        }),
        new CopyWebpackPlugin([
            {
                from:__dirname+'/src',
                to:__dirname+'/dist',
                ignore:['index.html','demo.js','reset.css']
            }
        ]),
        // 分离js中的css
    new MiniCssExtractPlugin({
      // 提到css目录中
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    }),
      new OptimizeCssAssetsPlugin(),
      new ImageminPlugin({
        disable: !isProduction,
        test: /\.(jpe?g|png|gif|svg)$/i,
        plugins: [imageminMozjpeg({quality: 65}),imageminPngquant({quality: [0.65,0.8]})]
    })
    ],
    devServer: {
      //在哪一个目录启动服务，需要和output.path名称一致
      contentBase: path.join(__dirname, "dist"),
      //是否压缩文件
      compress: true,
      //启动的端口
      port: 8080,
      //自动打开浏览器，访问地址http://localhost:8080/
      open: false
  }
}