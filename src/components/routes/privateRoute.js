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
	let isAuthenticated = state.isAuthenticated

	if(typeof isAuthenticated === 'string') isAuthenticated = (state.isAuthenticated === 'true')

	if(isAuthenticated) return <Route {...rest} render={(props) => <Component {...props} />  } />

	else return <Redirect to="/signin" />
}

export default PrivateRoute