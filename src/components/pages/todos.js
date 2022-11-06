/**
 * @file components/pages/todos.js
 * @summary The todo component that containt the logic
 * @module Client Todo list client (react)
 * @author FPC
 */

// == React
import React, { useState, useEffect, useContext, useCallback, useRef, } from "react"
//== React router dom 
import { useHistory } from "react-router-dom"
// == UUID
import { v1 as uuid } from 'uuid'
// == SDK
import ToolBoxSdk from '../sdk/toolBox-sdk-js'
// == AuthContext 
import { AuthContext } from '../../utils/contexts/authenticationContext'
import { APP_CONTEXT, } from '../../utils/reducers/authenticationReducer'
// AddToDoInput component
import AddToDoInput from '../layout/AddToDoInput'
// TabItems component
import TabItems from "../layout/tabItems"
// framer-motion
import { motion } from 'framer-motion'
// TodoListItemActionButton 
import TodoListItemActionButtons from '../layout/todoListItemActionButton'
// TodoListEmptyState
import TodoListEmptyState from "../layout/todoListEmptyState"
// Icons 
import { CheckIcon, TrashIcon, } from '@iconicicons/react'
// Pagination component
import Pagination from "rc-pagination"


const FILTER_STATE = ToolBoxSdk.api.FILTER_STATE
const countPerPage = ToolBoxSdk.countPerPage

export default function Todos() {
	// Number of elements per page
	// const countPerPage = 7
	// current page number
	const [currentPage, setCurrentPage] = React.useState(1)

	const history = useHistory()
	const { state, dispatch, } = useContext(AuthContext)

	// user email
	const email = state.email
	// username 
	const username = state.username
	// 
	const [editItems, setEditItems] = useState({})

	// enum to handle when user need to sign in again
	const [shouldSignIn, setShouldSignIn] = useState(0)

	const [todos, setTodos]= useState({
		items: [],
		itemsToShow: FILTER_STATE.all,
		id: uuid(),
		item: '',
		editItem: false,
	})

	// filtered items to display 
	const [filteredItems, setFilteredItems] = useState([])
	// The active filter can be: All, pending or completed tasks
	const [activeFilter, setActiveFilter] = useState(FILTER_STATE.all)
	// nothingToRender on the page
	const [nothingToRender, setNothingToRender] = useState(false)

	async function handleDoneTask (e) {

		const id = e.target.value

		const filteredItems = todos.items.map(item => {
			
			item.id === id && (item.achievement = !item.achievement)
			return item
		})

		for(const item of todos.items) {


			if(item.id === id) {
				const response = await ToolBoxSdk.api.updateTask(item.id, item.task, item.achievement)

				// check response status code
				const shouldSignIn = await ToolBoxSdk.api.analyseFetchResponse(
					response, 
					email, 
					history, dispatch, APP_CONTEXT)
				
				if(shouldSignIn >= 1) {

					// accessToken needs to be renew and retry the fetch call
					if(shouldSignIn == 1) {
						response = await ToolBoxSdk.api.updateTask(item.id, item.task, item.achievement)
					}
					
				}

				// need to sign in again, refreshToken needs to be renew
				if(shouldSignIn == 0) {
					return
				}
			}
			else continue
		}

		setTodos({
			...todos,
			items: filteredItems,
		})
	}

	async function handleDeleteDoneTasks() {

		const filteredItems = todos.items.filter(item => item.achievement === false)

		const response = await ToolBoxSdk.api.deleteManyTasks({email: email , achievement: true,})

		// check response status code
		const shouldSignIn = await ToolBoxSdk.api.analyseFetchResponse(
			response, 
			email, 
			history, dispatch, APP_CONTEXT)

		if(shouldSignIn >= 1) {

			// accessToken needs to be renew and retry the fetch call
			if(shouldSignIn == 1) {
				response = await ToolBoxSdk.api.deleteManyTasks({email: email , achievement: true,})
			}
			
		}

		// need to sign in again, refreshToken needs to be renew
		if(shouldSignIn == 0) {
			return
		}

		setTodos({
			...todos,
			items: filteredItems
		})
	}

	async function clearList () {

		//TODO
		const response = await ToolBoxSdk.api.deleteManyTasks({email: email})

		// check response status code
		const shouldSignIn = await ToolBoxSdk.api.analyseFetchResponse(
			response, 
			email, 
			history, dispatch, APP_CONTEXT)

		if(shouldSignIn >= 1) {

			// accessToken needs to be renew and retry the fetch call
			if(shouldSignIn == 1) {
				response = await ToolBoxSdk.api.deleteManyTasks({email: email})
			}
			
		}

		// need to sign in again, refreshToken needs to be renew
		if(shouldSignIn == 0) {
			return
		}

		setTodos({
			...todos,
			items: []
		})

	}


	const getAllTasks = useCallback(async () => {
		let response = await ToolBoxSdk.api.getAllTasks(email)

		if(response.responseStatusCode === 200) {
			// no need to renew access token, just continue to fetch data
			const todosItems = []
			const recordedTodos = response.json

			for (const record of recordedTodos) {
				
				todosItems.push({
					task: record.task,
					achievement: record.achievement,
					id: record._id,
	
				})
			}

			setTodos({...todos, items: todosItems})
		} 
		else {
			let shouldSignIn = await ToolBoxSdk.api.analyseFetchResponse(response, email, history, dispatch, APP_CONTEXT)
			setShouldSignIn(shouldSignIn)
		}
		
	},[])

	useEffect(() => {
		getAllTasks()

		if(shouldSignIn >= 1) {
			// accessToken needs to be renew and retry the fetch call
			if(shouldSignIn == 1) {
				getAllTasks()
			}
		}

		// need to sign in again, refreshToken needs to be renew
		if(shouldSignIn == 0) {
			return
		}

	}, [])

	const updatePage = p => {
		setCurrentPage(p)
	}

	const firstItemOfThePage = currentPage === 1 ? 0 : countPerPage * (currentPage - 1)

	if(nothingToRender) {
		setCurrentPage(currentPage - 1)
		setNothingToRender(false)
	}

	useEffect(() => {

	},[])



	const spanRef = useRef()

	return <>

		<div className="persistent-header">
			<AddToDoInput todos={todos} setTodos={setTodos} />
			<TabItems todos={todos} filteredItems={filteredItems} setFilteredItems={setFilteredItems} activeFilter={activeFilter} setActiveFilter={setActiveFilter}/>
		</div>
	{
		filteredItems.length === 0 && <TodoListEmptyState filterOption={activeFilter} />
	}
	
	{
		filteredItems.length > 0 && 
			<div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0'}}>
				{ todos?.items.length > 0 &&	
					<div style={{ display: 'contents'}}>
							<button className='delete-tasks-button' onClick={() => clearList()}><TrashIcon />Delete all</button>
							<button className='delete-tasks-button' onClick={() => handleDeleteDoneTasks()}><CheckIcon />Delete completed</button>
							
					</div>	
				}
					
				<Pagination 
				showTitle={false}
				simple
				pageSize={countPerPage}
				onChange={updatePage}
				current={currentPage}
				total={filteredItems.length}
				/>
			</div>

	}

	
	{	filteredItems?.slice(firstItemOfThePage, countPerPage*currentPage).map((item,i) => {

		// WHEN you are editing some todo 
		const editMode = editItems[item.id] || editItems[item.id] === ''

		return (
			<ul className="todo-list-root" key={i}>
				<motion.li
					
					className="todo-list-item-root"
					data-completed={item.achievement}
					layout
					animate={{
						y: [30, 0],
						transition: {
						duration: 0.3,
						ease: 'easeOut',
						}
					}}>

					<div className="todo-list-item-primary-content">

						
						<input
							type="checkbox"
							checked={item.achievement}
							value={item.id}
							onChange={e => handleDoneTask(e)}
														
						/>
						<label 
						className="todo-list-item-label"
						>

						{ editMode ? 
							<input
								className="edit-todo-box-input" 
								style={{ paddingLeft: 0}}
								type="text" 
								value={editItems[item.id]}  
								onChange={(e) => {setEditItems({...editItems, [item.id]: e.target.value}); }}
								
								/> : <span>{item.task}</span>
							}

							{/* {console.log(spanWidth, spanRef?.current?.offsetWidth)} */}
						</label>
					</div>
					<TodoListItemActionButtons 
						item={item} 
						todos={todos} 
						setTodos={setTodos} 
						analyseFetchResponseParams={{email, dispatch, APP_CONTEXT, history}}
						editItems={editItems} 
						setEditItems={setEditItems}
						setNothingToRender={setNothingToRender}
						// setSpanWidth={setSpanWidth}
						spanRef={spanRef?.current?.offsetWidth}
					/>
				</motion.li></ul>)}
				
			)
		}
	
	
	</>
}