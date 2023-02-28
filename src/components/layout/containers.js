/**
 * @file src/components/layout/container.js
 * @summary Middle container component
 * @module Client Todo list client (react)
 * @author FPC
 */

import React from "react"

/**
 * Constrains and horizontally centers content
 * based on viewport width
 */
export default function Container({ children, className= '', }) {	

	return (
		<main className="main-container">
			<div className={className !== '' ? ['container', className].join(' ') : 'container'}>
				{children}
			</div>
		</main>
	)
}
