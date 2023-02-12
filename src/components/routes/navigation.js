/**
 * @file src/components/routes/navigation.js
 * @summary Component that contains all the routes of the app
 * @module Client
 */

import React from "react"
import { Switch, Route, } from "react-router-dom"
import loadable from '@loadable/component'
import PublicRoute from "./publicRoute"
import PrivateRoute from "./privateRoute"

const Todos  = 				loadable(() =>	import('../pages/todos'), 					{ fallback: <div></div>})
const SignUp = 				loadable(() =>	import('../pages/signUp'), 					{ fallback: <div></div>})
const SignIn = 				loadable(() =>	import('../pages/signIn'), 					{ fallback: <div></div>})
const NotFound = 			loadable(() =>	import('../pages/notFound'), 				{ fallback: <div></div>})
const Landing = 			loadable(() =>	import('../pages/landing'), 				{ fallback: <div></div>})
const EmailConfirmation =	loadable(() =>	import('../pages/emailConfirmation'),		{ fallback: <div></div>})
const ResendLink =			loadable(() =>	import('../pages/resendLink'),				{ fallback: <div></div>})
const SendPasswordLink =	loadable(() =>	import('../pages/sendPasswordLink'),		{ fallback: <div></div>})
const ResetPassword =		loadable(() =>	import('../pages/resetPassword'),			{ fallback: <div></div>})

const Navigation = () => {

	return(
		<Switch>	
			<PublicRoute  	exact	path="/" 					component={Landing} />
			<PrivateRoute 	exact	path="/tasks"				component={Todos} />
			<PublicRoute  	exact	path="/signup"				component={SignUp} />
			<PublicRoute  	exact	path="/signin"				component={SignIn} />
			<PublicRoute 			path="/verify"				component={EmailConfirmation} />
			<PublicRoute 			path="/resendlink"			component={ResendLink} />

			<PublicRoute 			path="/sendpasswordlink"	component={SendPasswordLink} />
			<PublicRoute 			path="/resetpassword"		component={ResetPassword} />

			<Route 					path="*" 					component={NotFound} />
		</Switch>
	)
}

export default Navigation