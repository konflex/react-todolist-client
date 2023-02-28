/**
 * @file src/components/pages/sendPasswordLink.js
 * @summary Send link to reset user's password
 * @module Client
 */

import React, { useState, useEffect, useCallback, } from 'react'
import Container from '../layout/containers'
import { useHistory, } from 'react-router-dom'
// == SDK
import ToolBoxSdk from '../sdk/toolBox-sdk-js'

function SendPasswordLink() {

	const [ message, setMessage ] = useState("")
	const [ responseStatus, setResponseStatus] = useState(undefined)

	const [credential, setCredential] = useState({ email: '', })
	const handleChange = (e) => {
		setCredential({ email: e.target.value })
	}

	// Check is email address is invalid and there is at least 1 character
	const isEmailValid = ToolBoxSdk.isEmailAddressValid(credential.email) && credential.email.length > 0

	const sendPasswordLink = useCallback(async (email) => {

		const response = await ToolBoxSdk.api.sendResetPasswordLink(email)

		if(response.message && response.responseStatusCode) {
			setResponseStatus(response.responseStatusCode)
			setMessage(response.message)
		}

	},[])

	async function handleSubmit(e) {

		e.preventDefault()

		if(!isEmailValid) {
			return
		}

		else {
			sendPasswordLink(credential.email)
		}

	}

	return (
	<Container className="sign-in-up">

		<form className="landing-sign-in-up-container" onSubmit={(e) => handleSubmit(e) }>

			<div className="sign-in-up-input-container">
			<h2 className="" style={{ margin: 0 }}>Send reset password link</h2>
					<label className="sign-in-up-label-input">Email</label>
					<div className="div styles-input" style={{ padding: 0, }}>
						<input 					
							className="input styled-input-icon-right"
							type="email" 
							placeholder="e.g. alex@example.com" 
							onChange={handleChange}
						/>
						{ !isEmailValid && credential.email.length !== 0 && <i className="input-icon fa fa-times" aria-hidden="true"></i>}
						{ isEmailValid && credential.email.length !== 0 && <i className="input-icon fa fa-check success-message" aria-hidden="true"></i>}

					</div>
				<button className="stackoverflow-button sign-in-up-button" role="button" disabled={!isEmailValid} type="submit" >Send link&nbsp;<i className="fa fa-sign-in" aria-hidden="true"></i></button>

				<a href="/signin" style={{ color: "white" }}>Go back to sign in ?</a>

			</div>

			{ message.length !== 0 && 
				<p className={responseStatus == 200 ? "success-message" : "input-error"}>{message}</p>
			}
		</form>

	</Container>

)}

export default SendPasswordLink

