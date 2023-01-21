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
		<Container>
			<div className="has-text-centered">
				<h1 className="title is-3 has-text-weight-normal mb-0">Whoops</h1>
				<h1 className="title is-1 mb-0" style={{ fontSize: "10rem"}}>404</h1>
				<h1 className="title is-3 has-text-weight-normal">Page not found!</h1>

				<p classNAme="is-1">We can't found the page you're looking for.</p>

				<a className="button is-link  mt-4" href="/">
					<strong>Go back</strong>
				</a>
			</div>
		</Container>
	)
}

export default NotFound