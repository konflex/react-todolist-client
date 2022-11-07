/**
 * @file src/components/pages/landing.js
 * @summary Landing page where users first arrive, here to explain the purpose of the app
 * @module Client
 */

 import React from 'react'

 const Landing = () => {
	 return(
		<div className="landing-sign-in-up-container">
			<h1 className="" style={{ margin: 0, }}>Welcome to the konflex TODO app 🤖</h1>
			<p className="">Yet another place where you can store tasks you have to do. To start you need to log in or create an account if you havn't one already.</p>
			<br/>
			<div className="stackoverflow-button-container">
				<form action="/signup" style={{ marginRight: '10px' }}>
					<button className="stackoverflow-button" role="button">Create an account</button>
				</form>
				<form action="/signin">                
					<button className="stackoverflow-button" role="button" >Login</button>
				</form>
			</div>
		 </div>
	 )
}

export default Landing