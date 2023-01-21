/**
 * @file App.js
 * @summary The react app entry point of Todo list client
 * @module Client Todo list client (react)
 * @author FPC
 */

import React, { Suspense, useState, useEffect, } from "react"
import { AuthContextProvider } from './utils/contexts/authenticationContext'
import {BrowserRouter, useHistory, } from 'react-router-dom'
import Header from './components/layout/header'
import Container from './components/layout/containers'
import { ErrorBoundary, } from "./components/sdk/toolBox-sdk-js"
import Navigation from './components/routes/navigation'
// import {FaGithub} from 'react-icons/fa'

class DebugRouter extends BrowserRouter {
	constructor(props) {
		super(props)

		try {
			this.history.listen((location,action) => {

			})
		}
		finally{
		}
	}
}

const isDebugRouter = false
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
			<Router >	
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
				<Header />
			</ErrorBoundary>
			<ErrorBoundary>
				<Navigation />
			</ErrorBoundary>

			{/* 
			<div className="footer">
				<a href='https://github.com/konflex' target='_blank' rel="noopener noreferrer"><FaGithub className='github'/></a>
			</div> */}

		</>
}