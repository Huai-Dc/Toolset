const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const IS_PROD = process.env.NODE_ENV === 'production';

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 项目部署的基础路径
    // 我们默认假设你的应用将会部署在域名的根部，
    // 比如 https://www.my-app.com/
    // 如果你的应用时部署在一个子路径下，那么你需要在这里
    // 指定子路径。比如，如果你的应用部署在
    // https://www.foobar.com/my-app/
    // 那么将这个值改为 `/my-app/`
    publicPath: './',

    // 将构建好的文件输出到哪里
    outputDir: 'dist',

    // 放置静态资源的地方 (js/css/img/font/...)
    assetsDir: './assets',

    // 是否在保存的时候使用 `eslint-loader` 进行检查。
    // 有效的值：`ture` | `false` | `"error"`
    // 当设置为 `"error"` 时，检查出的错误会触发编译失败。
    lintOnSave: false,

    // 使用带有浏览器内编译器的完整构建版本
    // 查阅 https://cn.vuejs.org/v2/guide/installation.html#运行时-编译器-vs-只包含运行时
    // compiler: false,  // 该配置 不被允许 此处会报错

    // babel-loader 默认会跳过 node_modules 依赖。
    // 通过这个选项可以显式转译一个依赖。
    transpileDependencies: [/* string or regex */],

    // 是否为生产环境构建生成 source map？ 方便调试 快速定位错误地方
    productionSourceMap: false,

    // 调整内部的 webpack 配置。
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/webpack.md
    chainWebpack: config => {
        config.module
            .rule('worker')
            .test(/\.worker\.js$/)      //以.worker.js结尾的文件将被worker-loader加载 
            .use('worker-loader')   //指定文件的加载器
            .loader('worker-loader')
            .options({
                inline: true
            })
            .end();

        // // 文件夹路径处理
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('view', resolve('src/views'))
            .set('utils', resolve('src/utils'))
            .set('js', resolve('src/common/editor/js'))
            .end();
    },
    configureWebpack: (config)=>{
        let plugins = [];
        if(IS_PROD){
            // 有几个 dll.js，这里就响应 new 几个 webpack.DllReferencePlugin
            plugins = plugins.concat([
                new webpack.DllReferencePlugin({
                    context: process.cwd(),
                    manifest: require('./public/vendor/vendors-manifest.json')
                }),
                // 将 dll 注入到 生成的 html 模板中
                new AddAssetHtmlPlugin({
                    // dll文件位置
                    filepath: resolve('./public/vendor/*.js'),
                    // dll 引用路径
                    publicPath: './vendor',
                    // dll最终输出的目录
                    outputPath: './vendor'
                })
            ])
        }
        return {
            plugins
        }
    },

    // CSS 相关选项
    css: {
        // 将组件内的 CSS 提取到一个单独的 CSS 文件 (只用在生产环境中)
        // 也可以是一个传递给 `extract-text-webpack-plugin` 的选项对象
        extract: true,

        // 是否开启 CSS source map？
        sourceMap: false,

        // 为预处理器的 loader 传递自定义选项。比如传递给
        // sass-loader 时，使用 `{ sass: { ... } }`。
        loaderOptions: {},

        // 为所有的 CSS 及其预处理文件开启 CSS Modules。
        // 这个选项不会影响 `*.vue` 文件。
        modules: false
    },

    // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1,

    // PWA 插件的选项。
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli-plugin-pwa/README.md
    pwa: {},

    // 配置 webpack-dev-server 行为。
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8067,
        https: false,
        hotOnly: false,
        // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
        proxy: null, // string | Object
        before: app => {
        }
    },

    // 三方插件的选项
    pluginOptions: {
        // ...
    },
}
