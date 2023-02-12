/**
 * @file webpack.config.js
 * @summary Webpack configuration and settings
 * @module Client
 */


const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
require('dotenv').config()
const fs = require('fs')


module.exports = env => { 

	const entry = "./src/index.js"

	const devServer = {
		host: process.env.NODE_ENV == "development" && 
			  process.env.RUN_PRODUCTION_SERVER == "true" ? process.env.HOST : 'localhost',
		port: 8080,

		// display error in browser
		client: {
			overlay: false,
		},

		historyApiFallback: true,

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

			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
					  loader: 'css-loader'
					},
					{
					  loader: 'sass-loader',
					  options: {
						sourceMap: true,
					  }
					}
				]
			}
		]
	}


	const plugins = [
		new HtmlWebPackPlugin({
			template: 'src/index.html',
			filename: 'index.html',
			hash: true,
		}), 
		new webpack.EnvironmentPlugin([
			'RUN_PRODUCTION_SERVER', 
			'API_HEADER_DEVELOPMENT', 
			'API_HEADER_PRODUCTION'
		]),
		new MiniCssExtractPlugin({
			filename: 'css/mystyles.css'
		  }),
	]


	const conf = {
		entry,
		devtool,
		devServer,
		mode,
		module: _module,
		plugins,
		cache:false,
		output: {
			filename: "main.js",
			path: path.resolve(__dirname, "dist"),
			publicPath: "/",
		},
	}

	return conf
}