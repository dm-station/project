
// process.env.NODE_ENV = 'production'
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
  // 生成 source map
  // source-map  会标识当前报错的列和行
  // eval-source-map  不会产生单独的文件, 但是可以显示列和行。和source-map的主要区别是不会产生文件
  // cheap-module-source-map  不会产生列, 但是是一个单独的map文件,产生后你可以保留起来,用于调试
  // cheap-module-eval-source-map 不会生成map文件,不会显示列,可以定位到错误的行
  // none  不触发SourceMap
  devtool: isProduction ? 'none' : 'cheap-module-eval-source-map',
  // 解决Child html-webpack-plugin for "index.html":
  stats: { children: false },
  // 入口
  entry: {
    main: path.resolve(__dirname, 'src/main.js')
  },
  // 出口
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        // 编译前检查
        enforce: 'pre',
        // 指定检查的目录
        include: [path.resolve(__dirname, './src/*.js')],
        // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
        options: {
          // 指定错误报告的格式规范
          formatter: require('eslint-friendly-formatter')
          // fix: true,
        }
      },
      // 提取img并更改正确引用地址
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
      // 加载 ES2015+ 代码，然后使用 Babel 转译为 ES5
      {
        test: /\.js$/,
        // 排除文件
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      // 处理css文件
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // webpackOptions.output中的publicPath，可以根据目录结构动态调整，css文件跟html同级./,css文件在css文件夹下../，规则等同background-image
              publicPath: '../'
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // 设置公众变量
    new webpack.DefinePlugin({
      SERVICE_URL: JSON.stringify('http://www.sina.com')
    }),
    // 一定要放在HtmlWebpackPlugin文件前面
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      minify: {
        // 是否去掉注释
        removeComments: isProduction,
        // 是否去掉空格
        collapseWhitespace: isProduction
      }
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
      // 提到css目录中
      filename: './css/[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    }),
    new OptimizeCssAssetsPlugin({}),
    new ImageminPlugin({
      // 设置true为时，将完全禁用该插件
      disable: !isProduction,
      test: /\.(jpe?g|png|gif|svg)$/i,
      // 压缩png--方式1
      // pngquant: ({quality: '65-80'}),
      // 压缩jpg
      // plugins: [imageminMozjpeg({quality: 65})]
      // 压缩png--方式2
      // plugins: [imageminPngquant({quality: [0.65,0.8]})]
      plugins: [imageminMozjpeg({ quality: 65 }), imageminPngquant({ quality: [0.65, 0.8] })]
    })

  ],

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
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // 在哪一个目录启动服务，需要和output.path名称一致
    compress: true, // 是否压缩
    port: 8080, // 启动的端口
    open: false// 自动打开浏览器，暂时关闭（开启会导致控制台无法输入其他命令，可以通过ctrl+d终止当前cmd命令），手动在浏览器输入http://localhost:8080/
  }
}
