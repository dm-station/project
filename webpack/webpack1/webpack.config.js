
const path = require('path');
// 清除文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// html
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 图片压缩插件
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
var ImageminPlugin = require('imagemin-webpack-plugin').default
// 拷贝资源
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
    //入口
    entry: {
        test:'./src/test.js'
    },
    //出口
    output: {
        path: path.resolve(__dirname, 'dist'),
        //[name]key值，[chunkhash]哈希值
        filename: '[name].[chunkhash].js',
        //绝对路径，会替换path
        //publicPath:'https://cdn.com/'
        //__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录
    },
    module: {
        rules: [
            {
              test: /\.css$/,
              use: [ 'style-loader', 'css-loader' ]
            }
        ]
      
    },
    //解决Child html-webpack-plugin for "index.html"
    stats: { children: false },
    plugins: [
        //一定要放在HtmlWebpackPlugin文件前面
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            //标题配置--使用：<%=HtmlWebpackPlugin .options.title%>
            // title:'title',
            //生成到页面顶部，body
            //injectL'head',
            //输出文件，dist生成的html文件
            filename:'index.html',
            //输入文件，获取的html文件
            template:'index.html',
            // minify: {
            //     // 去掉注释
            //     removeComments: true,
            //     // 去掉空格
            //     collapseWhitespace: true
            // },
        }),
        new CopyWebpackPlugin([
            {
                //打包的静态资源目录地址
                from:__dirname+'/src',
                //打包到dist下面的public 
                to:__dirname+'/dist', 
                //忽略文件
                ignore:['index.html','test.js'],
            },
        ]),
        new ImageminPlugin({
            //打开build情况下无效
            disable: process.env.NODE_ENV !== 'production',
            test: /\.(jpe?g|png|gif|svg)$/i,
            //压缩png--方式1
            // pngquant: ({quality: '65-80'}),
            //压缩jpg
            // plugins: [imageminMozjpeg({quality: 65})]
            //压缩png--方式2
            // plugins: [imageminPngquant({quality: [0.65,0.8]})]
            //压缩png及jpg
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