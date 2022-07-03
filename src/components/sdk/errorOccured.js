/**
 * @file src/components/sdk/errorOccured.js
 * @summary Display error message 
 * @module Client
 */

import React from "react"

export default function ErrorOccured(props) {

	const { title, stack, message, error, errorInfo, } = props

	return <>
		<article class="message is-link">
			<div className="message-header">
				<p>{title}</p>
			</div>
		<div class="message-body">	
			{message}
		</div>
		</article>
	</>
}
