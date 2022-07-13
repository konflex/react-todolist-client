/**
 * @file src/components/pages/signIn.js
 * @summary Sign up page
 * @module Client Todo list client (react)
 * @author FPC
 */

// == React
import React, { useContext, useEffect, useState, } from "react"
//== React router dom 
import { useHistory } from "react-router-dom"
// == AuthContext 
import { AuthContext } from '../../utils/contexts/authenticationContext'
import { APP_CONTEXT, } from '../../utils/reducers/authenticationReducer'
// == SDK
import ToolBoxSdk from '../sdk/toolBox-sdk-js'
import classNames from 'classnames'

export default function SignUp() {

	const history = useHistory()

	const { state, dispatch } = useContext(AuthContext)

	const [credential, setCredential] = useState({ username: '', email: '', password: '', confirmedPassword: '' })

	const [ errorMessage, setErrorMessage] = useState('')

	const handleChange = (e) => {
		setCredential({ ...credential,[e.target.name]: e.target.value })
	} 

	// Check if email address is invalid and there is at least 1 character
	const isEmailAddressValid = ToolBoxSdk.isEmailAddressValid(credential.email) && credential.email.length > 0

	// Check if password and confirmedPassword are the same and there is at least 1 character
	const arePasswordsIdentical = ToolBoxSdk.arePasswordsIdentical(credential.password, credential.confirmedPassword) && credential.password.length > 0

	const isSubmitEnable = isEmailAddressValid && arePasswordsIdentical && credential.username.length > 0

	async function handleSubmit(e) {

		e.preventDefault()

		setErrorMessage('')

		if(!isSubmitEnable) {
			return
		}

		const response = await ToolBoxSdk.api.signUp(credential.username,credential.email, credential.password)

		if(response.json && response.responseStatusCode === 400) {
			setErrorMessage(response.message)
		}

		if(response.json && response.responseStatusCode === 200) {
			setErrorMessage('')
			alert('Account created')
		}

	}
	
	return(
		<>
		<h3 className="title has-text-centered is-4">Sign up</h3>
		<form className="box" onSubmit={(e) => handleSubmit	(e) }>
		<div className="field">
				<label className="label">Username</label>
				<div className="control">
				<input 
					className="input" 
					type="text" 
					name="username"
					placeholder="e.g. alex" 
					onChange={handleChange}
					/>
				</div>
			</div>
			<div className="field">
				<label className="label">Email</label>
				<div className="control">
				<input
					className={classNames("input", {
						"is-danger": !isEmailAddressValid && credential.email.length !== 0
					})} 
					type="email" 
					name="email"
					placeholder="e.g. alex@example.com" 
					onChange={handleChange}
					/>
				</div>

				{ !isEmailAddressValid  && credential.email.length !== 0 && <p className="help is-danger">This email address is not valid</p> }

			</div>

			<div className="field">
				<label className="label">Password</label>
				<div className="control">
				<input 
					className={classNames("input", {
						"is-danger": !arePasswordsIdentical && credential.password.length !== 0 
					})} 
					type="password" 
					name="password"
					placeholder="Password" 
					onChange={handleChange}
					/>
				</div>

				
				{ !arePasswordsIdentical && credential.password.length !== 0 && <p className="help is-danger">Password must be the same</p> }


			</div>
			<div className="field">
				<label className="label">Confirm password</label>
				<div className="control">
				<input 
					className="input" 
					type="password"
					name="confirmedPassword" 
					placeholder="Confirm password" 
					onChange={handleChange}
					/>
				</div>
			</div>
			<button href="#" className="button is-block is-link is-fullwidth" disabled={!isSubmitEnable} type="submit" >Sign up&nbsp;<i class="fa fa-sign-in" aria-hidden="true"></i></button>

			{ errorMessage && <p className="help is-danger">{errorMessage} </p> }

			<p class="has-text-grey mt-2">
				<a href="/signin">Already have an account ?</a>
            </p>

		</form>
		</>
	)
}