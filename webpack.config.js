/**
 * @file webpack.config.js
 * @summary Webpack configuration and settings
 * @module Client
 */

const HtmlWebPackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

require('dotenv').config()

const htmlPlugin = new HtmlWebPackPlugin({
	template: './src/index.html',
	filename: './index.html',
	hash: true,
})


module.exports = env => { 

	const devServer = {
		client: {
			overlay: false,
		},
		historyApiFallback: {
			disableDotRule:true,
			open: true,
			hot: false,
			inline: false,
		}
	}

	const devtool = 'inline-source-map'

	const mode = 'development'

	const _module = {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		]
	}

	const plugins = [
		htmlPlugin, 
		new webpack.EnvironmentPlugin(['RUN_PRODUCTION_SERVER', 'API_HEADER_DEVELOPMENT', 'API_HEADER_PRODUCTION'])
	]

	const conf = {
		devtool,
		devServer,
		mode,
		module: _module,
		plugins,
	}

	return conf
}