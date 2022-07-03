/**
 * @file src/components/routes/publicRoute.js
 * @summary Public route handler component
 * @module Client
 */

import React, { useContext, useEffect, useState, } from 'react'
import { Route, useHistory, Redirect} from 'react-router-dom'
import { AuthContext } from '../../utils/contexts/authenticationContext'
import ToolBoxSdk from '../sdk/toolBox-sdk-js'
import { APP_CONTEXT } from '../../utils/reducers/authenticationReducer'


const  PublicRoute = ({ component: Component, ...rest }) => {
	//Check sign in/out mode

	const { state , dispatch } = useContext(AuthContext)

	const isAuthenticated = false
	
	//state.isAuthenticated
	
	// const history = useHistory()


	if(!isAuthenticated) return <Route {...rest} render={(props) => <Component {...props} />  } />
	else return <Redirect to='/tasks' />
}

export default PublicRoute