/**
 * @file src/components/routes/privateRoute.js
 * @summary Private route handler component
 * @module Client
 */

import React, { useContext, useEffect, useState} from 'react'
import { Route, useHistory, Redirect, } from 'react-router-dom'
import { AuthContext } from '../../utils/contexts/authenticationContext'
import ToolBoxSdk from '../sdk/toolBox-sdk-js'
import { APP_CONTEXT } from '../../utils/reducers/authenticationReducer'

const PrivateRoute = ({ component:Component, ...rest}) => {
	//Check sign in/out mode
	const { state, dispatch } = useContext(AuthContext)

	const isAuthenticated = state.isAuthenticated

	const history = useHistory()
	
	// useEffect(async() => {
	// 	const response = await ToolBoxSdk.api.checkAuth()

	// 	if(response.json && response.json.isAuthenticated && response.responseStatusCode === 200) {

	// 		dispatch({
	// 			type: APP_CONTEXT.setSignedIn,
	// 			isAuthenticated: true
	// 		})

	// 		history.push('/tasks')
	// 	} 
	// 	else {
	// 		dispatch({
	// 			type: APP_CONTEXT.setSignOut,
	// 			isAuthenticated: false
	// 		})
	// 	}
	// }, [])

	if(isAuthenticated) return <Route {...rest} render={(props) => <Component {...props} />  } />
	else return <Redirect to='/signin' />
	
}

export default PrivateRoute