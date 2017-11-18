const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
const extractSass = new ExtractTextPlugin({
	filename: "./public/stylesheets/[name].[contenthash].css",
	disable: process.env.NODE_ENV === "development"
});

module.exports = {
	entry: path.resolve(__dirname, 'assets/js/main.js'),
	output: {
		path: path.resolve(__dirname, 'public/javascripts'),
		filename: 'build.js'
	},
	module: {

		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						js: 'babel-loader',
						scss: 'style-loader!css-loader!sass-loader'
					}
				}
			},
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [{
						loader: "css-loader"
					}, {
						loader: "sass-loader"
					}],
					// use style-loader in development
					fallback: "style-loader"
				})}
		],

	}
};

