const path = require('path');
const _cwp = require('copy-webpack-plugin');

// const config = {
//     plugins: [
//         new _cwp(
//         [{from:'./src/*.html',to:'./dest'},
//         {from:'./src/images/*.png',to:'./dest/images'}
//         ])
//     ]
// }

module.exports = {
    // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
//    mode: 'development', //'development',//'production',
    mode: 'production', //'development',//'production',
    // エントリーポイントの設定
    entry: './src/xevious_main.js',
    // 出力の設定
    output: {
        // 出力するファイル名
        filename: 'xevious_main.js',
        // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
        path: path.join(__dirname, 'dist')
    },
    devtool: false,//'eval-source-map',
//    devtool: 'eval-source-map', //'eval-source-map',
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader',{
                    loader: 'css-loader',
                    options: {url: false}
                },
            ],
        },
        ]
    }

};