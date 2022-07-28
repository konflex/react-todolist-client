/**
 * @file src/components/pages/landing.js
 * @summary Landing page where users first arrive, here to explain the purpose of the app
 * @module Client
 */

 import React from 'react'

 const Landing = () => {
     return(
 
        <form className="box">
             <h1 className="title is-3 has-text-weight-normal has-text-centered">Welcome to the konflex TODO app</h1>
             <p className="is-1">Yet another place where you can store your tasks.</p>
             <p  className="is-1">To start you need to log in or create an account if you havn't one already</p>
            <br/>
            <div className="buttons">
                <a className="button is-link" href="/signup">
                    <span>Create an account</span>
                </a>
                <a className="button is-link" href="/signin">
                    <span>Login</span>
                </a>
            </div>
         </form>
     )
}
 
export default Landing