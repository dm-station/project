
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
var ImageminPlugin = require('imagemin-webpack-plugin').default
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    //devtool:'none',//在开发者模式下，默认开启sourcemap,将其关闭
    //devtool:'source-map'//开启映射打包会变慢
    //devtool:'inline-source-map'//不单独生成.map文件，会将生成的映射文件以base64的形式插入到打包后的js文件的底部
    //devtool:'cheap-inline-source-map'//代码出错提示不用精确显示第几行的第几个字符出错，只显示第几行出错，会提高一些性能
    //devtool:'cheap-module-inline-source-map'//不仅管自己的业务代码出错，也管第三方模块和loader的一些报错
    //devtool:'eval'//执行效率最快，性能最好，但是针对比较复杂的代码的情况下，提示内容不全面
    //devtool: 'cheap-module-eval-source-map',//在开发环境推荐使用，提示比较全，打包速度比较快
    //devtool: 'cheap-module-source-map',//在生产环境中推荐使用，提示效果会好一些
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
            disable: process.env.NODE_ENV !== 'production',//打开build情况下无效
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