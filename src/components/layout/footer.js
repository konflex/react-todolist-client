/**
 * @file src/components/layout/footer.js
 * @summary Footer component
 * @module Client Todo list client (react)
 * @author FPC
 */

 import React from "react"

 export default function Footer() {

    return(
        <footer className="footer">
            <div className="content has-text-centered">
                <p>
                Powered by <strong>Konflex</strong>. 
                The website is licensed <a target="_blank" href="https://www.isc.org/licenses/">&nbsp;ISC</a>. 
                The source code for is available on <a target="_blank" href="https://github.com/konflex">Github</a>.
                </p>
            </div>
        </footer>
    )
}