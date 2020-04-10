const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const dllPath = 'public/vendor'

module.exports = {
    entry: {
        vendors: ['vue', 'vuex', 'axios', 'vue-router', 'view-design']
    },
    output: {
        path: path.join(__dirname, dllPath), // 打包后输出位置
        filename: '[name].dll.js',
        library: '[name]_library',
        // 此处是给DllPlugin 的name
        // 需要和底下 plugin name 保持一致
        globalObject: 'this'
    },
    plugins: [
        // 清除之前的dll 文件
        new CleanWebpackPlugin(),
        // 设置环境变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        // manifest.json 描述动态链接库包含了哪些内容
        new webpack.DllPlugin({
            path: path.join(__dirname, dllPath, '[name]-manifest.json'), // manifest 生成的文件夹及名字，
            name: '[name]_library',     // 与 output library 保持一致即可
            context: __dirname
        }),
    ]
};
