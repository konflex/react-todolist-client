/**
 * @file src/components/routes/navigation.js
 * @summary Component that contains all the routes of the app
 * @module Client
 */

import React from "react"
import { Switch, Route, Redirect, } from "react-router-dom"
import loadable from '@loadable/component'
import PublicRoute from "./publicRoute"
import PrivateRoute from "./privateRoute"

const Todos  = 		loadable(() => 	import('../pages/todos'), 		{ fallback: <div></div>})
const SignUp = 		loadable(() => 	import('../pages/signUp'), 		{ fallback: <div></div>})
const SignIn = 		loadable(() => 	import('../pages/signIn'), 		{ fallback: <div></div>})
const NotFound = 	loadable(() => 	import('../pages/notFound'), 	{ fallback: <div></div>})

const Navigation = () => {

	const header = "/react-todolist-client"

	return(
		<Switch>
			
			<PrivateRoute exact path={header+"/"} 			component={Todos}/>
			<PrivateRoute exact path={header+"/tasks"}   	component={Todos} />
			<PublicRoute  exact path={header+"/signup"}		component={SignUp} />
			<PublicRoute  exact path={header+"/signin"} 	component={SignIn} />

			<Route path="" component={NotFound} />
		</Switch>
	)
}

export default Navigation