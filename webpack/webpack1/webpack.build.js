
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
var ImageminPlugin = require('imagemin-webpack-plugin').default
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        test:'./src/test.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    module: {
      
    },
    stats: { children: false },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            //injectL'head',//生成到页面顶部,body
            filename:'index.html',//输出文件，dist生成的html文件
            template:'index.html',//输入文件，获取的html文件
            // minify: {
            //     removeComments: true,        // 去掉注释
            //     collapseWhitespace: true     // 去掉空格
            // },
        }),
        new CopyWebpackPlugin([
            {
                from:__dirname+'/src',//打包的静态资源目录地址
                to:__dirname+'/dist', //打包到dist下面的public 
                ignore:['index.html','test.js'],
            },
        ]),
        new ImageminPlugin({
            // disable: process.env.NODE_ENV !== 'production',//打开build情况下无效
            test: /\.(jpe?g|png|gif|svg)$/i,
            // pngquant: ({quality: '65-80'}),//压缩png--方式1
            // plugins: [imageminMozjpeg({quality: 65})]//压缩jpg
            // plugins: [imageminPngquant({quality: [0.65,0.8]})]//压缩png--方式2
            plugins: [imageminMozjpeg({quality: 65}),imageminPngquant({quality: [0.65,0.8]})]
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8080,
        open: false//http://localhost:8080/
      }
}