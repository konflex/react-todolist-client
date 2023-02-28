/**
 * @file src/components/pages/emailConfirmation.js
 * @summary Emain confirmation page
 * @module Client
 */

import React, { useState, useEffect, useCallback, } from 'react'
import Container from '../layout/containers'
import { useParams, useHistory, } from 'react-router-dom'
// == SDK
import ToolBoxSdk from '../sdk/toolBox-sdk-js'


function EmailConfirmation() {

	const [ message, setMessage ] = useState("")
	const [ responseStatus, setResponseStatus] = useState(undefined)

	const history = useHistory()
	const search = history.location.search

	const parameters = new URLSearchParams(search)
	const token = parameters.get('token')

	const checkToken = useCallback(async (token) => {

		if(token) {

			const response = await ToolBoxSdk.api.confirmEmail(token)

			if(response.message && response.responseStatusCode) {
				setResponseStatus(response.responseStatusCode)
				setMessage(response.message)
			}
		}

	},[])

	useEffect(() => {
		checkToken(token)
	}, [])

	return (
	<Container className="sign-in-up">
		{ message.length !== 0 && <>
			<p className={responseStatus == 200 ? "success-message" : "input-error"} style={{ textAlign: "center", }}>{message}</p> 
			{ responseStatus == 200 && <p style={{ textAlign: "center", }}><a href="/signin" style={{ color: "white" }}>Sign in</a></p> }
		</>}
		<a href="/resendlink">Resend link ?</a>
	</Container>
)}

export default EmailConfirmation