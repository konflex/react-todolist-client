/**
 * @file src/components/sdk/toolBox-sdk-js.js
 * @summary Software development kit composed by many functions that help developers to build new components
 * @module Client
 */

import React from "react"
import ErrorOccured from "./errorOccured"


// Api header depending of the env variable 
const ApiHeader =  process.env.RUN_PRODUCTION_SERVER == 'true' ? process.env.API_HEADER_PRODUCTION : process.env.API_HEADER_DEVELOPMENT 


let ToolBoxSdk = {

	/**
	 * @summary Return true if the given email address conforms to 'a@b.c'
	 * @param {String} emailAddress should be a@b.c format
	 */
	isEmailAddressValid(emailAddress) {
		return /\S+@\S+\.\S+/.test(emailAddress)
	},

	/**
	 * @summary Minimum password character
	 */
	passwordMinCharacters: 8,

	/**
	 * 
	 * @param {String} password 
	 * @returns Return true if the given password has the right length
	 */
	isPasswordValid(password) {
		return password.length >= this.passwordMinCharacters
	},

	/**
	 * 
	 * @param {String} password 
	 * @param {String} confirmPassword 
	 * @returns Return true if the given password has the right length
	 */
	arePasswordsIdentical(password, confirmPassword) {
		return password === confirmPassword 
	},


}


class CoreSDK {

	/**
	 * @summary Return the headers 
	 */
	headers() {
		let headers = {
			accepts: 'application/json',
			Accept: 'application/json',
			'Content-Type': 'application/json',
			//'Access-Control-Allow-Credentials': 'true'
			// 'mode': 'no-cors'
		}

		return headers
	}

	/**
	 * @summary Invokes the API request
	 * @param {String} url The API URL to call
	 */
	async apiCall(url, options={}) {

		let { params, timeout, forceHost, } = options
		try { 

			let response

			params.headers = {
				...this.headers(),
				...params.headers,
			}

			try {
				response = await Promise.race([
					fetch(url,params),
				])
			}
			catch(err) {
				console.log('Error is: ', err)
				throw err
			}

			const statusCode = response.status
			const json = await response.json()

			return Promise.all([statusCode, json])
				.then(([statusCode,json]) => {

					const responseStatusCode = statusCode

					const _json = {
						responseStatusCode: responseStatusCode,
						message: json.message,
						headers: response.headers,
						json: json
					}

					return _json
				})
		}
		finally {

		}

	}
}

class API extends CoreSDK {

	/**
	 *@returns the filter state index
	 */
	FILTER_STATE = {
		all: 0,
		completed: 1,
		todo: 2,
	}
	
	/**
	 *@returns the expired token state from response
	*/
	TOKEN_STATE = {
		expiredToken: "Unauthorized! Access Token was expired!",
	}

	/**
	 * @summary Log the user in
	 * 
	 * @param {String} email The email address of the user to sign in
	 * @param {String} password The password of the user to sign in
	 * @returns The fetch promise
	 * @throws 401 error whenever the user is unknown
	*/
	login(email, password) {
		return this.apiCall(`${ApiHeader}/api/auth/signin`, {
			params: {
				method: 'POST',
				credentials: 'include',
				// headers: this.headers(),
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			}})
	}

	/**
	 * @summary Sign the user up
	 * @param {String} username The username of the user to sign up
	 * @param {String} email The email address of the user to sign up
	 * @param {String} password The password of the user to sign up
	 * @returns The fetch promise
	 * @throws 401 error whenever the user is unknown
	*/
	signUp(username, email, password) {
		return this.apiCall(`${ApiHeader}/api/auth/signup`, {
			params: {
				method: 'POST',
				credentials: 'include',
				headers: this.headers(),
				body: JSON.stringify({
					username: username,
					email: email,
					password: password,
				}),
			}})
	}

	/**
	 * @summary Get all tasks from an user 
	 * 
	 * @param {String} email The email address of the user to sign in
	 * @returns The fetch promise
	 * @throws 500 error code
	*/
	getAllTasks(email) {

		return this.apiCall(`${ApiHeader}/api/tasks?email=${encodeURIComponent(email)}`, {
			params: {
				method: 'GET',
				credentials: 'include',
				headers: this.headers(),
			}})
	}


	/**
	 * @summary Post a task
	 * 
	 * @param {String} task The task to post
	 * @param {String} email The email address of the user
	 * @param {Boolean} achievement The achievement of the task
	 * @returns The fetch promise
	 * @throws 500 error
	*/
	postTask(task,email,achievement) {
		return this.apiCall(`${ApiHeader}/api/task`, {
			params: {
				method: 'POST',
				credentials: 'include',
				headers: this.headers(),
				body: JSON.stringify({
					task: task,
					email: email,
					achievement: achievement
				}),
			}})
	}

	/**
	 * @summary Update a task
	 * 
	 * @param {String} id The id of the task
	 * @param {String} task The task to post
	 * @param {Boolean} achievement The achievement of the task
	 * @returns The fetch promise
	 * @throws 500 error when error
	*/
	updateTask(id,task,achievement) {
		return this.apiCall(`${ApiHeader}/api/task`, {
			params: {
				method: 'PUT',
				credentials: 'include',
				headers: this.headers(),
				body: JSON.stringify({
					id: id,
					task: task,
					achievement: achievement
				}),
			}})
	}


	/**
	 * @summary Delete a task
	 * @param {String} id The id of the task
	 * @returns The fetch response
	 * @throws 500 error whenever the user is unknown
	*/
	deleteTask(id) {
		return this.apiCall(`${ApiHeader}/api/task`, {
			params: {
				method: 'DELETE',
				credentials: 'include',
				headers: this.headers(),
				body: JSON.stringify({
					id: id,
				}),
			}})
	}

	/**
	 * @summary Delete many task
	 * @param {String} email The id of the task
	 * @returns The fetch response
	 * @throws 500 error whenever the user is unknown
	*/
	deleteManyTasks(filter) {
		return this.apiCall(`${ApiHeader}/api/tasks`, {
			params: {
				method: 'DELETE',
				credentials: 'include',
				headers: this.headers(),
				body: JSON.stringify({
					filter,
				}),
			}})
	}


	/**
	 * @summary Refresh a token that has expired
	*/
	refreshToken() {
		return this.apiCall(`${ApiHeader}/api/auth/refreshToken`, {
			params: {
				method: 'GET',
				credentials: 'include',
				headers: this.headers(),
			}})
	}


	/**
	 * @summary Analyse fetch response, call refreshToken if needed
	 * @param {Object} response The id of the task
	 * @param {String} email The user email
	 * @returns Integers to handle each case
	*/
	async analyseFetchResponse(response, email, history, dispatch, APP_CONTEXT) {

		if(response.responseStatusCode !== 200) {

			// use refreshToken to get new accessToken
			const shouldSignIn = await this.refreshToken()	

			// force sign in
			if( shouldSignIn.responseStatusCode !== 200 
	
			||( response.responseStatusCode !== 200 
			&& !response.message === this.TOKEN_STATE.expiredToken)) {
				dispatch({
					type: APP_CONTEXT.setSignedIn,
					isAuthenticated: false,
					email: email
				})

				history.push('/signin')

				// when refreshToken returns !== 200 and it is needed to sign in again
				return 0
			}

			return 1
					
		}
		else {
			// when response status code is 200 and there is no need to call refreshToken function
			return 2
		}
	}

}

/**
 * @summary Handle errors 
 * @returns Error catcher UI component. It display any error that might have came up in children tags
*/
export class ErrorBoundary extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
		hasError: false,
		stack: undefined,
		message: 'No error',
		errorInfo: undefined,
		}
	}

	static getDerivedStateFromError(err) {

		return { 
			hasError: true,
			message: 'This error occured: '+ err.message,
			errorInfo: err.message,
			stack: err.stack,			
		}
	}

	render() {

	if (this.state.hasError) {

		// Error path
		return (
			<ErrorOccured 
				title="Something went wrong"
				message={this.state.errorInfo}
				error={this.state.message}
				stack={this.state.stack}
			/>

		)
	  }
		// Normally, just render children
		return this.props.children;
	}
}



ToolBoxSdk.api = new API()

export default ToolBoxSdk