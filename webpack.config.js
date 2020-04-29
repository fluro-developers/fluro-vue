const path = require('path');
// var JsDocPlugin = require('jsdoc-webpack-plugin-v2');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    // runtimeCompiler: true,
    entry: './src/index.js',
    // output: {
    //     filename: 'index.js',
    //     path: path.resolve(__dirname, 'dist'),
    //     globalObject: "this"
    // },
    output: {
        filename: 'index.js',
        library: 'fluro-vue',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.resolve(__dirname, 'dist'),
        globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
    externals: {
        'vue': 'vue',
        'fluro': 'fluro',
        'vuex-map-fields': 'vuex-map-fields',
        'lodash': {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        },
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            // {
            //     test: /\.scss$/,
            //     loader: 'sass-loader'
            // },
            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'vue-style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                    
                ],
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    // plugins: [
    //       new JsDocPlugin(
    //       // {
    //       //     conf:path.join(__dirname, 'jsdoc.json'),
    //       // }
    //       )
    //   ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    // output: {
    //   filename: 'main.js',
    //   path: path.resolve(__dirname, 'dist')
    // }
};