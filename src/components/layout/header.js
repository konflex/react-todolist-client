/**
 * @file src/components/layout/header.js
 * @summary Navigation bar component
 * @module Client Todo list client (react)
 * @author FPC
 */

import React, { useContext, useState, } from "react"
//== React router dom 
import { useHistory, } from "react-router-dom"
// == AuthContext 
import { AuthContext, } from '../../utils/contexts/authenticationContext'
import { APP_CONTEXT, } from '../../utils/reducers/authenticationReducer'
// Plus icon
import { ArrowRightIcon } from '@iconicicons/react'

export default function Header() {

	// test again 
	let history = useHistory()

	const { state, dispatch, } = useContext(AuthContext)

	let isAuthenticated
	
	if(typeof state.isAuthenticated == 'string') isAuthenticated = (state.isAuthenticated === 'true')
	else if(typeof state.isAuthenticated == 'boolean') isAuthenticated = state.isAuthenticated
	else isAuthenticated = false

	const [isActive, setIsActive] = useState(false)

	function handleLogOut() {
		dispatch({
			type: APP_CONTEXT.setSignedOut,
			isAuthenticated: false,
		})

		history.push('/signin')
	}

	return(
		<header className="appbar-root">
			<div className="container appbar-container">
			<h1 className="appbar-title">
				<a href="/" style={{ textDecoration: "none" ,color: "white", }}>Konflxomatic</a>
			</h1>
			
			{ isAuthenticated && 
			<div className="large-button-root log-out-button-root">
				<button
					className="large-button log-out-button"

					title="Log out"
					onClick={handleLogOut}
				>
					<ArrowRightIcon />
				</button>
			</div>
			}
			</div>
	  	</header>
	)
}