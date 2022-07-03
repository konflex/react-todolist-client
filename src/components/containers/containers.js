/**
 * @file src/components/container/container.js
 * @summary Middle container component
 * @module Client Todo list client (react)
 * @author FPC
 */

import React from "react"

export default function MiddleContainer({children}) {	
	
	return (
	<section className="section">
		<div className="container">{children}</div>
	</section>
)}
