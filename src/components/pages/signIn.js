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
import classNames from "classnames"

export default function SignIn() {

	const history = useHistory()

	const { state, dispatch } = useContext(AuthContext)

	const [credential, setCredential] = useState({ email: '', password: '', })

	const [error, setError] = useState(false)

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

			// history.push('/tasks')
		}
		if(response.json && response.responseStatusCode === 401) {
			setError(true)
		} 	
	}

	return(




		<form className="" onSubmit={(e) => handleSubmit	(e) }>
		<h3 className="">Login</h3>
			<div className="">
				<label className="">Email</label>
				<div className="">
				<input
				
				
					// className={classNames("input", {
					// 	"is-danger": !isEmailAddressValid && credential.email.length !== 0
					// })} 
					className="input styled-input"
					type="email" 
					placeholder="e.g. alex@example.com" 
					onChange={handleChange}
					/>
				</div>

				{ !isEmailAddressValid && credential.email.length !== 0 && <p className="">This email address is not valid</p> }

				{ error && <p className="">Email or password is incorrect</p>}
			</div>


			<div className="">
				<label className="">Password</label>
				<div className="">
				<input 
					className="input styled-input" 
					type="password" 
					placeholder="Password" 
					onChange={handleChange}
					/>
				</div>
			</div>
			<button href="#" className="" disabled={!isSubmitEnable} type="submit" >Login&nbsp;<i className="fa fa-sign-in" aria-hidden="true"></i></button>
			


			<p className="">
				<a href="/signup">No account yet ?</a>
            </p>
		</form>

	
	)
}