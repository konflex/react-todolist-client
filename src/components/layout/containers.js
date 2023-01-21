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
export default function Container({ children, className= '', mainClassName = '', }) {	
	return (
		<div className={[mainClassName, ''].join(' ')}>
			<div className={[className, 'container'].join(' ')}>
				{children}
			</div>



		</div>
	)
}
