/**
 * @file src/utils/contexts/authenticationContext.js
 * @summary Authentication context 
 * @module Client Todo list client (react)
 * @author FPC
 */

import React, { createContext, useEffect, useReducer } from 'react'
import { authReducer } from '../reducers/authenticationReducer'

const AuthContext = createContext(null)

function AuthContextProvider({ initialState, children }) {

	// == The reducer that store the authentication and user persistant data
	const [ state, dispatch ] = useReducer(
		authReducer,
		initialState,
		init => {

			let isAuthenticated= localStorage.getItem('isAuthenticated')
			let email= localStorage.getItem('email')
			let username = localStorage.getItem('username')
			
			return {
				isAuthenticated: isAuthenticated,
				email: email,
				username: username,
			}
		}

	)

	return(
		<AuthContext.Provider value={{ state, dispatch, }}>
			{children}
		</AuthContext.Provider>
	)
}

export { AuthContextProvider, AuthContext, }