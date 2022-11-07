/**
 * @file components/pages/todos.js
 * @summary The todo component that containt the logic
 * @module Client Todo list client (react)
 * @author FPC
 */

// == React
import React, { useState, useEffect, useContext, } from "react"
//== React router dom 
import { useHistory } from "react-router-dom"
// == UUID
import { v1 as uuid } from 'uuid'
// == SDK
import ToolBoxSdk from '../sdk/toolBox-sdk-js'
// == AuthContext 
import { AuthContext } from '../../utils/contexts/authenticationContext'
import { APP_CONTEXT, } from '../../utils/reducers/authenticationReducer'
// Plus icon
import { PlusIcon } from '@iconicicons/react'


/**
 * @summary Input component to add tasks 
 * @param {object} todo Tasks of the users that will be displayed
 * @param {function} setTodo useState function to set tasks
 * @returns Input component to add tasks
 */
export default function AddToDoInput({ todos, setTodos, }) {

	const history = useHistory()
	const { state, dispatch, } = useContext(AuthContext)
	const [isInputFocused, setIsInputFocused] = useState(false)
	const [isError, setIsError] = useState(false)

    // user email
	const email = state.email

	const handleChange = event => {
		setIsError(false)
		setTodos({
			...todos,
			item: event.target.value
		})
	}

	async function handleSubmit(event) {
		event.preventDefault()

		let postTodo = await ToolBoxSdk.api.postTask(todos.item,email, false)
		
		// check response status code
		let result = await ToolBoxSdk.api.analyseFetchResponse(postTodo, email, history, dispatch, APP_CONTEXT)
		
		const todosItems = []

		if(result >= 1) {

			// accessToken needs to be renew and retry the fetch call
			if(result == 1) {
				postTodo = await ToolBoxSdk.api.postTask(todos.item,email, false)
			}

			// no need to renew access token, just continue to fetch data
			let getAllTasks = await ToolBoxSdk.api.getAllTasks(email)

			const updatedItems = getAllTasks.json

			for (const record of updatedItems) {

				todosItems.push({
					task: record.task,
					achievement: record.achievement,
					id: record._id,
				})

			}
			
		}

		// need to sign in again, refreshToken needs to be renew
		if(result == 0) {
			return
		}

		if (todosItems.length > 0) {
			setTodos({
				...todos,
				items: todosItems,
				id: uuid(),
				item: '',
			})
		}
	}


	return (

    <div className="add-todo-box-root" data-active={isInputFocused} data-error={isError}>
			<span className="add-todo-box-leading">
				&gt;
			</span>

			<input
				type="text"
				placeholder="What's on your mind..."
				className="add-todo-box-input"
				value={todos.item}
				onChange={handleChange}
				onFocus={() => setIsInputFocused(true)}
				onBlur={() => {
				  setIsInputFocused(false);
				  setIsError(false);
				}}
				onKeyPress={(e) => {
				  if (e.key === 'Enter') {
				    handleSubmit(e);
				  }
				}}
			/>
			<div className="large-button-root">
				<button
					type="submit"
					className="large-button"
					title="Add todo"
					disabled={(todos.item.trim()).length === 0}
					onClick={handleSubmit}
				>
				<PlusIcon />
				</button>
			</div>
    	</div>
    )
}