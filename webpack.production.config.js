var path = require('path');
var webpack = require('webpack');

/**
 * @summary This file configures Webpack for our development environment, including some other useful features.
 * The key differences are that we include the devServer key, along with options to specify where the content should
 * be loaded from (contentBase) and hosted at (publicPath).  We include the "HotModuleReplacementPlugin()" to manage
 * the automatic file watching and bundle updating.  We also add the "webpack-hot-middleware"
 * @type {{entry: string[], output: {filename: string, path: string, publicPath: string}, devServer: {inline: boolean, hot: boolean, publicPath: string, contentBase: string}, plugins: *[], module: {loaders: *[]}, node: {console: boolean, fs: string, net: string, tls: string}}}
 */
module.exports = {
    entry : ['./app/js/main.js', 'webpack-hot-middleware/client', 'webpack/hot/dev-server'],
    output : {
        filename : 'bundle.js',
        path : '/',
        publicPath : '/js/'
    },
    devServer : {
        inline : true,
        hot : true,
        publicPath : '/public',
        contentBase : './public'
    },
    plugins : [
        new webpack.HotModuleReplacementPlugin()
    ],
    module : {
        loaders : [
            {
                test : /.jsx?$/,
                loader : 'babel-loader',
                exclude : /node_modules/,
                query : {
                    presets : ['es2015', 'react', 'react-hmre']
                }
            },
            { test: /\.css$/, include: path.resolve(__dirname, 'app'), loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]' },
            { test: /\.(svg|ttf|woff|eot|woff2)(\?.*)?$/, loader: 'file' },
            { test : /\.json$/, loader: 'json'},
            {
              test: /\.(jpg|png)$/,
              loader: 'url?limit=25000',
              include: __dirname+'/app/assets'
            }
        ]
    }, node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
