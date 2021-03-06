/**
 * @file src/utils/reducers/authenticationReducer.js
 * @summary Authentication reducer
 * @module Client Todo list client (react)
 * @author FPC
 */

export const APP_CONTEXT = {
	setSignIn: 'LOGIN_SUCCESS',
	setSignOut: 'LOGOUT_SUCCESS',
}

export function authReducer(state,action) {
	try {
		switch(action.type) {
			case APP_CONTEXT.setSignedIn:
				localStorage.setItem('isAuthenticated', action.isAuthenticated)
				localStorage.setItem('email', action.email)
				localStorage.setItem('username', action.username)
				return {
					isAuthenticated: action.isAuthenticated,
					email: action.email,
					username: action.username,
				}
			case APP_CONTEXT.setSignedOut:
				localStorage.clear()
				cookieStorage.delete()
				return {
					isAuthenticated: action.isAuthenticated
				}
			default: return {
			}
		}
	}
	finally{

	} 
}