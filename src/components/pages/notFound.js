/**
 * @file src/components/pages/notFound.js
 * @summary Component displayed when clients navigate to unknown routes
 * @module Client
 */

import React from 'react'
import Container
 from '../layout/containers'
const NotFound = () => {
	return(
		<Container className='not-found-container'>
			<div className="">
				<h1 className="">Whoops</h1>
				<h1 className="not-found">404</h1>
				<h1 className="">Page not found!</h1>
				<p classNAme="">We can't found the page you're looking for.</p>
				<a className="" style={{ color: 'white', }} href="/">
					<strong>Go back</strong>
				</a>
			</div>
		</Container>
	)
}

export default NotFound