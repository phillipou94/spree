var path = require('path');
var webpack = require('webpack');

// Based on template from:
// https://www.twilio.com/blog/2015/08/setting-up-react-for-es6-with-webpack-and-babel-2.html
module.exports = {
    entry : './app/js/main.js',  //main file, where does it start
    output : { path : __dirname+'/js', filename : 'bundle.js' },
    module : {
        loaders : [
            {
                test : /.jsx?$/,  //regex to tell babel to load .jsx file through babel-loader
                loader : 'babel-loader',
                exclude : /node_modules/,
                query : {
                    presets : ['es2015', 'react']
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
    },
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
