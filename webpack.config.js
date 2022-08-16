/**
 * @file webpack.config.js
 * @summary Webpack configuration and settings
 * @module Client
 */

const HtmlWebPackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

require('dotenv').config()

const fs = require('fs')

const htmlPlugin = new HtmlWebPackPlugin({
	template: './src/index.html',
	filename: './index.html',
	hash: true,
})

const serverOptions = process.env.NODE_ENV == "development" && process.env.NODE_ENV == "true" ? 
{
	type: 'https',
	options: {
		key:  fs.readFileSync('./todo.key'),
		cert: fs.readFileSync('./todo.crt')
	},
} : {}

module.exports = env => { 

	const devServer = {

		server: serverOptions,
		host: process.env.NODE_ENV == "development" && 
			  process.env.NODE_ENV == "true" ? process.env.HOST : 'localhost',
		port: 8080,

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

	const mode = process.env.NODE_ENV == 'production' ? 'production' : 'development'

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
		cache:false,
	}

	return conf
}