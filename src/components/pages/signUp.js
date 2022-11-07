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
// == SDK
import ToolBoxSdk from '../sdk/toolBox-sdk-js'

export default function SignUp() {

	const history = useHistory()

	const [credential, setCredential] = useState({ email: '', password: '', confirmedPassword: '' })

	const [ errorMessage, setErrorMessage] = useState('')

	const handleChange = (e) => {
		setCredential({ ...credential,[e.target.name]: e.target.value })
	} 

	// Check if email address is invalid and there is at least 1 character
	const isEmailAddressValid = ToolBoxSdk.isEmailAddressValid(credential.email) && credential.email.length > 0

	// Check if password and confirmedPassword are the same and there is at least 1 character
	const arePasswordsIdentical = ToolBoxSdk.arePasswordsIdentical(credential.password, credential.confirmedPassword) && credential.password.length > 0

	const isSubmitEnable = isEmailAddressValid && arePasswordsIdentical > 0

	async function handleSubmit(e) {

		e.preventDefault()

		setErrorMessage('')

		if(!isSubmitEnable) {
			return
		}

		const response = await ToolBoxSdk.api.signUp(credential.email, credential.password)

		if(response.json && response.responseStatusCode !== 200) {
			setErrorMessage(response.message)
		}

		if(response.json && response.responseStatusCode === 200) {
			setErrorMessage('')
			alert('Account created')
			setCredential({email: '', password: '', confirmedPassword: '' })
			history.push('/signin')
		}

	}

	return(
		<form className="landing-sign-in-up-container" onSubmit={(e) => handleSubmit(e) }>
			<div className="sign-in-up-input-container"> 
			<h2 style={{ margin: 0 }}>Sign up</h2>

				<label className="sign-in-up-label-input">Email</label>
				<div className="div styles-input" style={{ padding: 0, }}>
					<input 					
						className="input styled-input-icon-right"
						type="email"
						name="email" 
						placeholder="e.g. alex@example.com" 
						onChange={handleChange}
					/>
					{ !isEmailAddressValid  && credential.email.length !== 0 && <i className="fa fa-times" aria-hidden="true"></i>}
					{ isEmailAddressValid  && credential.email.length !== 0 && <i className="fa fa-check" aria-hidden="true"></i>}

				</div>


				<label className="sign-in-up-label-input">Password</label>
				<input 
					className="input styled-input"
					type="password" 
					name="password"
					placeholder="Password" 
					onChange={handleChange}
				/>

				<label className="sign-in-up-label-input">Confirm password</label>
				<div className="div styles-input" style={{ padding: 0, }}>
					<input 					
						className="input styled-input-icon-right"
						type="password"
						name="confirmedPassword" 
						placeholder="Confirm password" 
						onChange={handleChange}
					/>
					{ !arePasswordsIdentical && (credential.password.length && credential.confirmedPassword.length) !== 0 && <i className="fa fa-times" aria-hidden="true"></i>}
					{ arePasswordsIdentical && (credential.password.length && credential.confirmedPassword.length) !== 0 && <i className="fa fa-check" aria-hidden="true"></i>}

				</div>

				<button className="stackoverflow-button sign-in-up-button" role="button" disabled={!isSubmitEnable} type="submit" >Sign up&nbsp;<i className="fa fa-sign-in" aria-hidden="true"></i></button>
				
				<a href="/signin" style={{ color: "white" }}>Already have an account ?</a>
				{ errorMessage && <p className="input-error" style={{ textAlign: 'center', }}>{errorMessage} </p> }

			</div>
		</form>
	)
}	