/**
 * @file src/components/routes/publicRoute.js
 * @summary Public route handler component
 * @module Client
 */

import React, { useContext, useEffect, useState, } from 'react'
import { Route, useHistory, Redirect} from 'react-router-dom'
import { AuthContext } from '../../utils/contexts/authenticationContext'

const  PublicRoute = ({ component: Component, ...rest }) => {

	const { state , dispatch } = useContext(AuthContext)

	//Check sign in/out mode
	let isAuthenticated = state.isAuthenticated
	
	if(typeof isAuthenticated === 'string') isAuthenticated = (state.isAuthenticated === 'true')

	if(!isAuthenticated) return <Route {...rest} render={(props) => <Component {...props} />  } />
	
	else if(isAuthenticated) return <Redirect to='/tasks' />
}

export default PublicRoute