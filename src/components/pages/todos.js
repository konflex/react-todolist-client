/**
 * @file components/pages/todos.js
 * @summary The todo component that containt the logic
 * @module Client Todo list client (react)
 * @author FPC
 */

import React, { useState, useEffect, useContext, } from "react"
//== React router dom 
import { useHistory } from "react-router-dom"

import { v1 as uuid } from 'uuid'
// == SDK
import ToolBoxSdk from '../sdk/toolBox-sdk-js'
// == AuthContext 
import { AuthContext } from '../../utils/contexts/authenticationContext'
import { APP_CONTEXT, } from '../../utils/reducers/authenticationReducer'

const FILTER_STATE = {
	all: 0,
	completed: 1,
	todo: 2,
}

const TOKEN_STATE = {
	expiredToken: "Unauthorized! Access Token was expired!"
}

export default function Todos() {

	const history = useHistory()
	const { state, dispatch } = useContext(AuthContext)
	const email = state.email

	const [editItems, setEditItems] = useState({})

	const [todos, setTodos]= useState({
		items: [],
		itemsToShow: FILTER_STATE.all,
		id: uuid(),
		item: '',
		editItem: false,
	})

	const handleChange = event => {
		setTodos({
			...todos,
			item: event.target.value
		})
	}

	async function handleSubmit(event) {
		event.preventDefault()

		const postTodo = await ToolBoxSdk.api.postTask(todos.item,email, false)
		
		let getAllTasks

		if(postTodo.responseStatusCode !== 200 
		&& postTodo.message === TOKEN_STATE.expiredToken) {

			// use refreshToken to get new accessToken
			const shouldSignIn = await ToolBoxSdk.api.refreshToken()	

			// force sign in
			if( shouldSignIn.responseStatusCode !== 200 
	
			||( postTodo.responseStatusCode !== 200 
			&& !postTodo.message === TOKEN_STATE.expiredToken)) {
				dispatch({
					type: APP_CONTEXT.setSignedIn,
					isAuthenticated: false,
					email: email
				})

				history.push('/signin')

				return
			}
			else {

				// retry to get all tasks
				getAllTasks = await ToolBoxSdk.api.getAllTasks(email)
				
			}
		}


		getAllTasks = await ToolBoxSdk.api.getAllTasks(email)
		
		const todosItems = []
		const updatedItems = getAllTasks.json

		for (const record of updatedItems) {

			todosItems.push({
				task: record.task,
				achievement: record.achievement,
				id: record._id,
			})

		}

		if (todos.item.length > 0) {
			setTodos({
				...todos,
				items: todosItems,
				id: uuid(),
				item: '',
			})
		}
	}

	const todosToShow = string => {
		setTodos({
			...todos,
			itemsToShow: string
		})
	}

	async function handleDoneTask(id) {

		const filteredItems = todos.items.map(item => {
			
			item.id === id && (item.achievement = !item.achievement)
			return item
		})

		for(const item of todos.items) {
			if(item.id === id) await ToolBoxSdk.api.updateTask(item.id, item.task, item.achievement)
			else continue
		}

		setTodos({
			...todos,
			items: filteredItems,
		})
	}

	async function handleDelete(id) {
		const filteredItems = todos.items.filter(item => item.id !== id)

		await ToolBoxSdk.api.deleteTask(id)

		setTodos({
			...todos,
			items: filteredItems
		})
	}

	async function handleDeleteDoneTasks() {
		const filteredItems = todos.items.filter(item => item.achievement === false)

		await ToolBoxSdk.api.deleteManyTasks({email: email , achievement: true,})
		setTodos({
			...todos,
			items: filteredItems
		})
	}

	async function clearList () {

		await ToolBoxSdk.api.deleteManyTasks({email: email})

		setTodos({
			...todos,
			items: []
		})
	}

	const handleEdit = async (id, task, achievement) => {

		if(editItems[id]) {
			let updateTask = await ToolBoxSdk.api.updateTask(id, editItems[id], achievement)

		// access token expired
		if(updateTask.responseStatusCode !== 200
			&& updateTask.message === TOKEN_STATE.expiredToken) {

				// use refreshToken to get new accessToken
				const shouldSignIn = await ToolBoxSdk.api.refreshToken()	

				// force sign in
				if( shouldSignIn.responseStatusCode !== 200 

				||( shouldSignIn.responseStatusCode !== 200 
				&& !shouldSignIn.message === TOKEN_STATE.expiredToken)) {
					dispatch({
						type: APP_CONTEXT.setSignedIn,
						isAuthenticated: false,
						email: email
					})

					history.push('/signin')

					return
				}


				else {

					// retry to update task
					updateTask = await ToolBoxSdk.api.updateTask(id, editItems[id], achievement)
					
				}
			}	


			let _editItems = {
				...editItems,
			}
			delete _editItems[id]
			setEditItems(_editItems)


			let _todosItems = []

			for(let item of todos.items) {
				if(item.id === id) {
					item = {
					id:item.id,
					task: editItems[id],
					achievement: item.achievement
				}
				_todosItems.push(item)
			}
				else _todosItems.push(item)
			}

			setTodos({...todos, items: _todosItems})
			return 
		}
		
		let _editItems = {
			...editItems,
			[id]: task
		}


		setEditItems(_editItems)
	}

	useEffect(async() => {

		// get all the tasks
		let allTasks = await ToolBoxSdk.api.getAllTasks(email)

		// access token expired
		if(allTasks.responseStatusCode !== 200
		&& allTasks.message === TOKEN_STATE.expiredToken) {

			// use refreshToken to get new accessToken
			const shouldSignIn = await ToolBoxSdk.api.refreshToken()	

			// force sign in
			if( shouldSignIn.responseStatusCode !== 200 
	
			||( shouldSignIn.responseStatusCode !== 200 
			&& !shouldSignIn.message === TOKEN_STATE.expiredToken)) {
				dispatch({
					type: APP_CONTEXT.setSignedIn,
					isAuthenticated: false,
					email: email
				})

				history.push('/signin')

				return
			}


			else {

				// retry to get all tasks
				allTasks = await ToolBoxSdk.api.getAllTasks(email)
				
			}
		}	


		const todosItems = todos.items
		const recordedTodos = allTasks.json
		

		for (const record of recordedTodos) {

			todosItems.push({
				task: record.task,
				achievement: record.achievement,
				id: record._id,

			})

		}

		setTodos({...todos, items: todosItems})

	},[])



	return <>
		<h3 className="title has-text-centered is-4">TODO input</h3>
		<form className="box" onSubmit={handleSubmit}>
			<div className="field">
				<div className="control">
				<input 
					className="input" 
					type="text" 
					placeholder="NEW TODO" 
					value={todos.item}
					onChange={handleChange} />
				</div>
			</div>
			<button className="button is-link is-fullwidth">
				  <span>Add new task</span>
			</button>
		</form>

		{  todos?.items 
		&& todos.items.length > 0 
		&&	<>
		<h3 className="title has-text-centered is-4">TODO list</h3>
		<div className="columns">
			<div className="column">
				<button 
					className="button is-link is-fullwidth" 
					onClick={() => todosToShow(FILTER_STATE.all)}>
					<span>All</span>
				</button>
			</div>
			<div className="column">
				<button 
					className="button is-link is-fullwidth" 
					onClick={() => todosToShow(FILTER_STATE.completed)}>
					<span>Completed</span>
				</button>
			</div>
			<div className="column">
				<button 
					className="button is-link is-fullwidth" 
					onClick={() => todosToShow(FILTER_STATE.todo)}>
					<span>To do</span>
				</button>
			</div>
		</div>
		</>
	}

	{	todos?.items?.map((item,i) => {

	if(todos.itemsToShow === FILTER_STATE.all
	|| todos.itemsToShow === FILTER_STATE.completed && item.achievement
	|| todos.itemsToShow === FILTER_STATE.todo && !item.achievement 
	) {

	// WHEN you are editing some todo 
	const editMode = editItems[item.id] || editItems[item.id] === ''
	// WHen a task should be marked as completed
	const isTaskCompleted = item.achievement && !editItems[item.id] 

	return (
		<div  
			key={item.id}
			// special color when editing ?
			className={editMode ? "box" : "box"} 
			style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
			<span 
				className={item.achievement ? "has-text-success" : ""} 
				style={isTaskCompleted? { textDecoration: 'line-through'} : {}}>
					{ editMode ?  
						<input 
							className="input" 
							type="text" 
							style={{ height: '100%', }}
							value={editItems[item.id]}  
							onChange={(e) => setEditItems({...editItems, [item.id]: e.target.value})}
							/> : item.task }
			</span>
			<div className="icon-text">
				<span className="icon has-text-success" onClick={() => handleDoneTask(item.id)}>
					<i className={item.achievement ? "far fa-check-square" : "far fa-square"}></i>
				</span>
				<span className="icon has-text-warning" onClick={() => handleEdit(item.id, item.task, item.achievement)}>
					<i className="fas fa-pen"></i>
				</span>
				<span className="icon has-text-danger" onClick={() => handleDelete(item.id)}>
					<i className="fas fa-trash"></i>
				</span>
			</div>
		</div>)}
	})}

	{	todos?.items 
	&&	todos.items.length > 0 
	&&	<div className="columns">
			<div className="column">
				<button className="button is-danger is-fullwidth" onClick={() => handleDeleteDoneTasks()}>
					  <span>Delete completed tasks</span>
				</button>
			</div>
			<div className="column">
				<button className="button is-danger is-fullwidth" onClick={() => clearList()}>
					<span>Delete all tasks</span>
				</button>
			</div>
		</div>
	}
	</>

}


