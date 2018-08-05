// const _GA = 'UA-117905768-2';

const path = require('path');

const _FS = require('fs-extra');
// const _CI = require("cheerio");

const _IM = require('imagemin');
const _IMP = require('imagemin-pngquant');

const _HWP = require('html-webpack-plugin')

const DEBUG = !process.argv.includes('--release');

// const config = {
//     plugins: [
//         new _cwp(
//         [{from:'./src/*.html',to:'./dest'},
//         {from:'./src/images/*.png',to:'./dest/images'}
//         ])
//     ]
// }

// const _SET_HTML = () => {
//     let _html = _FS.readFileSync("./src/xevious.html", "utf8");
//     const $ = _CI.load(_html);
//     console.log('_SET_HTML');
//     $('body').append('<script>' + makeGoogleAnalytics(_GA) + '</script>');
//     _FS.writeFileSync('./dist/xevious.html', $.html().replace(/[\t\n]/g, "").replace(/^\s+/g, ""));
// }

const _SET_IMGS = () => {
    (async () => {
        console.log('_SET_IMGS');
        _FS.removeSync('./dist/images');
        const files = await _IM(['./src/images/*.{jpg,png}'], './dist/images', {
            plugins: [_IMP({
                quality: '65-80'
            })]
        });
    })()
};

// const makeGoogleAnalytics = (ua) => {
//     return `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga'); ga('create', '${ua}', 'auto'); ga('send', 'pageview');`;
// }

module.exports = {
    // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
    mode: (DEBUG) ? 'development' : 'production',
    // エントリーポイントの設定
    entry: './src/xevious_main.js',
    // 出力の設定
    output: {
        // 出力するファイル名
        filename: 'xevious_main.js',
        // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
        path: path.join(__dirname, 'dist')
    },
    devtool: (DEBUG) ? 'eval-source-map':false,
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        _SET_IMGS,
        new _HWP({
            filename: 'xevious.html',
            template: 'src/xevious.html',
            minify:true,
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',{
                        loader: 'css-loader',
                        options: {url: false}
                    },
                ],
            }
        ]
    }

};