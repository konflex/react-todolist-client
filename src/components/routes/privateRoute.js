/**
 * @file src/components/routes/privateRoute.js
 * @summary Private route handler component
 * @module Client
 */

import React, { useContext, useEffect, useState} from 'react'
import { Route, useHistory, Redirect, } from 'react-router-dom'
import { AuthContext } from '../../utils/contexts/authenticationContext'

const PrivateRoute = ({ component:Component, ...rest}) => {

	//Check sign in/out mode
	const { state, dispatch } = useContext(AuthContext)
	// bool depending of the auth state of the user
	let isAuthenticated

	if(typeof state.isAuthenticated == 'string') isAuthenticated = (state.isAuthenticated === 'true')
	else if(typeof state.isAuthenticated == 'boolean') isAuthenticated = state.isAuthenticated
	else isAuthenticated = false

	if(isAuthenticated) return <Route {...rest} render={(props) => <Component {...props} />  } />

	else return <Redirect to="/signin" />
}

export default PrivateRoute