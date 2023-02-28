/**
 * @file src/components/pages/signIn.js
 * @summary Sign in page
 * @module Client Todo list client (react)
 * @author FPC
 */

// == React
import React, { useContext, useEffect, useState, } from "react"
//== React router dom 
import { useHistory } from "react-router-dom"
// == AuthContext 
import { AuthContext } from "../../utils/contexts/authenticationContext"
import { APP_CONTEXT, } from "../../utils/reducers/authenticationReducer"
// == SDK
import ToolBoxSdk from "../sdk/toolBox-sdk-js"
import Container from "../layout/containers"

export default function SignIn() {

	const history = useHistory()
	
	const { state, dispatch } = useContext(AuthContext)

	const [credential, setCredential] = useState({ email: '', password: '', })

	const [error, setError] = useState('')

	const handleChange = (e) => {
		setCredential({ ...credential,[e.target.type]: e.target.value })
	} 

	// Check is email address is invalid and there is at least 1 character
	const isEmailAddressValid = ToolBoxSdk.isEmailAddressValid(credential.email) && credential.email.length > 0

	const isSubmitEnable = isEmailAddressValid && credential.password.length > 0

	async function handleSubmit(e) {

		e.preventDefault()

		if(!isSubmitEnable) {
			return
		}

		const response = await ToolBoxSdk.api.login(credential.email, credential.password)

		if(response.json && response.json.isAuthenticated && response.responseStatusCode === 200) {

			dispatch({
				type: APP_CONTEXT.setSignedIn,
				isAuthenticated: true,
				email: response.json.email,
				username: response.json.username,
			})

			history.push('/tasks')
		}
		if(response.json && response.responseStatusCode !== 200) {
			setError(response.json.message)
		}
	}
 
	return(

		<Container className="sign-in-up">
		<form className="landing-sign-in-up-container" onSubmit={(e) => handleSubmit	(e) }>


		<div className="sign-in-up-input-container"> 
		<h2 className="" style={{ margin: 0 }}>Login</h2>

				<label className="sign-in-up-label-input">Email</label>
				<div className="div styles-input" style={{ padding: 0, }}>
					<input 					
						className="input styled-input-icon-right"
						type="email" 
						placeholder="e.g. alex@example.com" 
						onChange={handleChange}
					/>
					{ !isEmailAddressValid && credential.email.length !== 0 && <i className="input-icon fa fa-times" aria-hidden="true"></i>}
					{ isEmailAddressValid && credential.email.length !== 0 && <i className="input-icon fa fa-check" aria-hidden="true"></i>}

				</div>
				<label className="sign-in-up-label-input">Password</label>
				<input 
					className="input styled-input" 
					type="password" 
					placeholder="Password" 
					onChange={handleChange}
					/>
			<button className="stackoverflow-button sign-in-up-button" role="button" disabled={!isSubmitEnable} type="submit" >
				Login&nbsp;<i className="fa fa-sign-in" aria-hidden="true"></i>
			</button>
	
			<a href="/signup" style={{ color: "white" }}>No account yet ?</a>
			<a href="/sendpasswordlink" style={{ color: "white" }}>Forgot password ?</a>
			{ error.length !== 0 && <p className="input-error" style={{ textAlign: 'center'}}>{error}</p>}

		</div>
	
		</form>

		</Container>
	)
}