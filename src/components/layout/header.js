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

export default function Header() {

	let history = useHistory()

	const { state, dispatch } = useContext(AuthContext)

	const isAuthenticated = (state.isAuthenticated === 'true')

	const [isActive, setIsActive] = useState(false)

	function handleLogOut() {
		dispatch({
			type: APP_CONTEXT.setSignedOut,
			isAuthenticated: false,
		})

		history.push('/signin')
	}
	
	function handleClick () {
		setIsActive(!isActive)
	}

	return(
		<nav 
			className="navbar is-fixed-top"
			role="navigation" 
			aria-label="main navigation">
			<div className="navbar-brand">
				<a className="navbar-item" href="/">
					<h1 className="title">TODO's</h1>
				</a>
				{
					// Mobile view: burger button
				}
				<a 	
					role="button" 
					className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
					aria-label="menu"
					onClick={handleClick} 
					aria-expanded="false"
					data-target="navbarBasicExample">
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
				</a>
					
			</div>

			<div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
				<div className="navbar-end">
					<div className="navbar-item">
						<div className="buttons">

						{
							isAuthenticated ? 
						<button className="button is-danger" onClick={handleLogOut}>
							<span className="icon is-small">
							<i className="fas fa-sign-out-alt"></i>
							</span>
						</button>
						:
						<>
						<a className="button is-link" href="/signup">
							<strong>Sign up</strong>
						</a>
						<a className="button is-light"  href="/signin">
							Log in
						</a>
						</>
						}

						</div>
					</div>
				</div>
			</div>
			</nav>
	)
}