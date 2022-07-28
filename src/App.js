/**
 * @file App.js
 * @summary The react app entry point of Todo list client
 * @module Client Todo list client (react)
 * @author FPC
 */

import React, { Suspense, useState, useEffect, StrictMode, } from "react"
import { AuthContextProvider } from './utils/contexts/authenticationContext'
import {BrowserRouter, useLocation, } from 'react-router-dom'
import Header from './components/layout/header'
import Footer from './components/layout/footer'
import MiddleContainer from './components/containers/containers'
import { ErrorBoundary, } from "./components/sdk/toolBox-sdk-js"
import Navigation from './components/routes/navigation'

class DebugRouter extends BrowserRouter {
	constructor(props) {
		super(props)

		try {
			// console.log('enter');
			// console.log('url is ', location.pathname, 'history is: ', this.history)
			this.history.listen((location,action) => {
				// console.log(`this current url is ${location.pathname}${location.search}${location.hash}`)
			})
		}
		finally{
			// console.log('leave')

		}
	}
}

const isDebugRouter = true
const Router = isDebugRouter ? DebugRouter : BrowserRouter

export default function App() {
	const [entranceCount, setEntranceCounter] = useState(0)

	useEffect(() => {
		if(entranceCount === 0) {
			setEntranceCounter(1)

			console.log(String.raw`
====================================================
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ 
█▄▄░▄▄██░▄▄▄░██░▄▄▀██░▄▄▄░██░████▄░▄██░▄▄▄░█▄▄░▄▄███ 
███░████░███░██░██░██░███░██░█████░███▄▄▄▀▀███░█████ 
███░████░▀▀▀░██░▀▀░██░▀▀▀░██░▀▀░█▀░▀██░▀▀▀░███░█████ 
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ 
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
██░▄▄▄██░▄▄▀██░▄▄▄░██░▀██░█▄▄░▄▄██░▄▄▄██░▀██░██░▄▄▀█
██░▄▄███░▀▀▄██░███░██░█░█░███░████░▄▄▄██░█░█░██░██░█
██░█████░██░██░▀▀▀░██░██▄░███░████░▀▀▀██░██▄░██░▀▀░█
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀                      
====================================================
			`)
		}
	}, [entranceCount])

	return (
		<AuthContextProvider>
			<Router>	
				<ErrorBoundary>
					<Suspense fallback={<div>Loading...</div>} />
					<Layout />
				</ErrorBoundary>
			</Router>
		</AuthContextProvider>
	)
}

function Layout() {
	return <>
		<ErrorBoundary>
			<ErrorBoundary>
				<Header />
			</ErrorBoundary>
			<MiddleContainer>
				<ErrorBoundary>
					<Navigation />
				</ErrorBoundary>
			</MiddleContainer>
			<ErrorBoundary>
				<Footer />
			</ErrorBoundary>
		</ErrorBoundary>
	</>
}