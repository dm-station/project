
const path = require('path');
const glob = require("glob")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {//入口
        test:'./src/test.js',
    },
    output: {//出口
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'//chunkhash哈希值
        //publicPath:'https://cdn.com/'//绝对路径，会替换path
        //__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录
    },
    plugins: [
        new CleanWebpackPlugin(),//一定要放在HtmlWebpackPlugin文件前面
        new HtmlWebpackPlugin({
            title:'title',////标题配置--使用：<%=HtmlWebpackPlugin .options.title%>
            //injectL'head',//生成到页面顶部,body
            filename:'index.html',//输出文件，dist生成的html文件
            template:'./src/index.html',//输入文件，获取的html文件
            // chunks:['main','a'],//指定加载的js文件，chunks和excludeChunks二选一-->包含
            // excludeChunks:['main','a'],//排除指定文件-->不包含
            // minify: {
            //     removeComments: true,        // 去掉注释
            //     collapseWhitespace: true     // 去掉空格
            // }
        }),
        new CopyWebpackPlugin([
            { 
                from:__dirname+'/src',//打包的静态资源目录地址
                to:__dirname+'/dist', //打包到dist下面的public 
                // ignore:['index.html']
            }
        ])
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        }
      ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),//在哪一个目录启动服务，需要和output.path名称一致
        compress: true,//是否压缩
        port: 8080,//启动的端口
        open: false//自动打开浏览器，暂时关闭（开启会导致控制台无法输入其他命令，可以通过ctrl+d终止当前cmd命令），手动在浏览器输入http://localhost:8080/
      }
}