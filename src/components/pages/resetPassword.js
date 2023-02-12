/**
 * @file src/components/pages/resetPassword.js
 * @summary Reset user's password page
 * @module Client
 */

import React, { useState, useEffect, useCallback, } from 'react'
import Container from '../layout/containers'
import { useHistory, } from 'react-router-dom'
// == SDK
import ToolBoxSdk from '../sdk/toolBox-sdk-js'

function ResetPassword() {

	const history = useHistory()
	const search = history.location.search

	const parameters = new URLSearchParams(search)
	const token = parameters.get('token')
	
	const [ message, setMessage ] = useState("")
	const [ responseStatus, setResponseStatus] = useState(undefined)

	const [credential, setCredential] = useState({ password: '', confirmedPassword: '', })
	const handleChange = (e) => {
		setCredential({ ...credential,[e.target.name]: e.target.value })
	}

	// Check if password and confirmedPassword are the same and there is at least 1 character
	const arePasswordsIdentical = ToolBoxSdk.arePasswordsIdentical(credential.password, credential.confirmedPassword) && credential.password.length > 0
	
	async function handleSubmit(e) {

		e.preventDefault()

		if(!arePasswordsIdentical) {
			return
		}
		

		else {

			const response = await ToolBoxSdk.api.resetPassword(token, credential.password)

			if(response.message && response.responseStatusCode) {
				setResponseStatus(response.responseStatusCode)
				setMessage(response.message)
			}
		}

		console.log(token)

	}

	return (
	<Container>

		<form className="landing-sign-in-up-container" onSubmit={(e) => handleSubmit(e) }>

			<div className="sign-in-up-input-container">
			<h2 className="" style={{ margin: 0 }}>Reset your password</h2>

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
					{ !arePasswordsIdentical && (credential.password.length && credential.confirmedPassword.length) !== 0 && <i className="input-icon fa fa-times" aria-hidden="true"></i>}
					{ arePasswordsIdentical && (credential.password.length && credential.confirmedPassword.length) !== 0 && <i className="input-icon  fa fa-check" aria-hidden="true"></i>}

				</div>

				<button className="stackoverflow-button sign-in-up-button" role="button" disabled={!arePasswordsIdentical} type="submit" >Reset your password&nbsp;<i className="fa fa-sign-in" aria-hidden="true"></i></button>

				<a href="/signin" style={{ color: "white" }}>Sign in</a>

			</div>

			{ message.length !== 0 && 
				<p className={responseStatus == 200 ? "success-message" : "input-error"}>{message}</p>
			}
		</form>

	</Container>

)}

export default ResetPassword

