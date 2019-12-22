
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css到单独文件的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
var ImageminPlugin = require('imagemin-webpack-plugin').default

module.exports = {
    // devtool: 'cheap-module-eval-source-map',
    stats: { children: false },
    entry: {
        main:'./src/main.js',
    },
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:'src/index.html',
            // minify: {
            //     removeComments: true,        // 去掉注释
            //     collapseWhitespace: true     // 去掉空格
            // }
        }),
        new CopyWebpackPlugin([
            {
                from:__dirname+'/src',
                to:__dirname+'/dist',
                ignore:['index.html','demo.js','reset.css']
            }
        ]),
        new MiniCssExtractPlugin({//分离js中的css
            filename:"[name].css",//提到css目录中
            chunkFilename: "[id].css"
        }),
      new OptimizeCssAssetsPlugin(),
      new ImageminPlugin({
        disable: process.env.NODE_ENV !== 'production',//打开build情况下无效
        test: /\.(jpe?g|png|gif|svg)$/i,
        plugins: [imageminMozjpeg({quality: 65}),imageminPngquant({quality: [0.65,0.8]})]
    })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),//在哪一个目录启动服务，需要和output.path名称一致
        compress: false,//是否压缩
        port: 8080,//启动的端口
        open: false//自动打开浏览器，暂时关闭（开启会导致控制台无法输入其他命令，可以通过ctrl+d终止当前cmd命令），手动在浏览器输入http://localhost:8080/
      }
}