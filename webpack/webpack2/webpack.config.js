
// node用于处理文件路径的模块
const path = require('path')
// 获取全局变量webpack的引用
const webpack = require('webpack')
// 清空文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// html
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 压缩js插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 图片压缩插件
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
var ImageminPlugin = require('imagemin-webpack-plugin').default
// 提取css到单独文件的插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩、去重css插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 复制资源
const CopyWebpackPlugin = require('copy-webpack-plugin')

// 当前是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'
// 是否要删除console信息，生产环境删除
const isConsole = process.env.NODE_ENV === 'production'
console.log('NODE_ENV：', process.env.NODE_ENV)

module.exports = {
  // 声明开发模式
  mode: isProduction ? 'production' : 'development',
  // 选择sourcemap映射方式
  // devtool:'none',//在开发者模式下，默认开启sourcemap,将其关闭
  // devtool:'source-map'//开启映射打包会变慢
  // devtool:'inline-source-map'//不单独生成.map文件，会将生成的映射文件以base64的形式插入到打包后的js文件的底部
  // devtool:'cheap-inline-source-map'//代码出错提示不用精确显示第几行的第几个字符出错，只显示第几行出错，会提高一些性能
  // devtool:'cheap-module-inline-source-map'//不仅管自己的业务代码出错，也管第三方模块和loader的一些报错
  // devtool:'eval'//执行效率最快，性能最好，但是针对比较复杂的代码的情况下，提示内容不全面
  // devtool: 'cheap-module-eval-source-map',//在开发环境推荐使用，提示比较全，打包速度比较快
  // devtool: 'cheap-module-source-map',//在生产环境中推荐使用，提示效果会好一些
  devtool: isProduction ? 'none' : 'cheap-module-eval-source-map',

  // 解决Child html-webpack-plugin for "index.html"
  stats: { children: false },
  // 入口
  entry: {
    main: './src/main.js'
  },
  // 出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    // [name]key值，[chunkhash]哈希值
    filename: 'js/[name].js'
    // 绝对路径，会替换path
    // publicPath:'https://cdn.com/'
    // __dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录
  },
  module: {
    rules: [
      // 加载 ES2015+ 代码，然后使用 Babel 转译为 ES5
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      // 提取img并更正引用地址
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              // name: '[path][name].[ext]',
              // publicPath: 'assets/',
              // 输出路径
              outputPath: 'img/',
              // 是否生成文件
              emitFile: false
            }
          }
        ]
      },
      // 处理css文件
      {
        test: /\.css$/,
        use: [
          isProduction ? {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 默认使用 webpackOptions.output中的publicPath，可以根据目录结构动态调整，css文件跟html同级./,css文件在css文件夹下../
              publicPath: '../'
            }
          } : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      SERVICE_URL: JSON.stringify('http://www.sina.com')
    }),
    // 一定要放在HtmlWebpackPlugin文件前面
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 标题配置--使用：<%=HtmlWebpackPlugin .options.title%>
      // title:'title',
      // 生成到页面顶部，body
      // injectL'head',
      // 输出文件，dist生成的html文件
      filename: 'index.html',
      // 输入文件，获取的html文件
      template: './src/index.html'
      // minify: {
      //     // 去掉注释
      //     removeComments: true,
      //     // 去掉空格
      //     collapseWhitespace: true
      // },
    }),
    new CopyWebpackPlugin([
      {
        // 打包的静态资源目录地址
        from: path.resolve(__dirname, 'src'),
        // 打包到dist文件夹
        to: path.resolve(__dirname, 'dist'),
        // 忽略文件
        ignore: ['index.html', 'main.js', 'demo.js', 'reset.css']
      }
    ]),
    // 分离js中的css
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    }),
    new OptimizeCssAssetsPlugin({}),
    new ImageminPlugin({
      // 设置true为时，将完全禁用该插件
      disable: !isProduction,
      test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [imageminMozjpeg({ quality: 65 }), imageminPngquant({ quality: [0.65, 0.8] })]
    })
  ],
  devServer: {
    // 在哪一个目录启动服务，需要和output.path名称一致
    contentBase: path.join(__dirname, 'dist'),
    // 是否压缩文件
    compress: true,
    // 启动的端口
    port: 8080,
    // 自动打开浏览器，访问地址http://localhost:8080/
    open: false
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      exclude: /(node_modules|bower_components)/,
      uglifyOptions: {
        compress: {
          drop_debugger: isConsole,
          // 生产环境自动删除console
          drop_console: isConsole
        },
        warnings: false,
        ie8: false
      },
      sourceMap: false,
      // 使用多进程并行运行来提高构建速度
      parallel: true
    })]
  }
}
