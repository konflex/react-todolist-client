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

		let response = await ToolBoxSdk.api.postTask(todos.item,email, false)

		// if(response.responseStatusCode !== 200){
		// 	history.push('/signin')
		// }	

		response = await ToolBoxSdk.api.getAllTasks(email)

		const todosItems = []
		const updatedItems = response.json

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
			await ToolBoxSdk.api.updateTask(id, editItems[id], achievement)
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

		const response = await ToolBoxSdk.api.getAllTasks(email)

		// if(response.responseStatusCode !== 200){
		// 	history.push('/signin')
		// }	

		const todosItems = todos.items
		const recordedTodos = response.json
		

		console.log(recordedTodos)

		
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
		<h3 className="title has-text-centered is-4">Todo input</h3>
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
		<h3 className="title has-text-centered is-4">Todo list</h3>
		<div className="columns">
			<div className="column">
				<button className="button is-link is-fullwidth" onClick={() => todosToShow(FILTER_STATE.all)}>
					<span>All</span>
				</button>
			</div>
			<div className="column">
				<button className="button is-link is-fullwidth" onClick={() => todosToShow(FILTER_STATE.completed)}>
					<span>Completed</span>
				</button>
			</div>
			<div className="column">
				<button className="button is-link is-fullwidth" onClick={() => todosToShow(FILTER_STATE.todo)}>
					<span>To do</span>
				</button>
			</div>
		</div>
		</>
	}

	{	todos?.items?.map((item,i) => {

	if(todos.itemsToShow === FILTER_STATE.all
	|| todos.itemsToShow === FILTER_STATE.achievement && item.achievement
	|| todos.itemsToShow === FILTER_STATE.todo && !item.achievement 
	) {
	return (
		<div className="box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} key={item.id}>
			<span 
				className={item.achievement ? "has-text-danger" : ""} 
				style={item.achievement ? { textDecoration: 'line-through'} : {}}>
					{ editItems[item.id] || editItems[item.id] === '' ?  
						<input 
							className="input" 
							type="text" 
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


