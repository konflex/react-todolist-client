/**
 * @file components/layout/todoItemActionButton.js
 * @summary The todo component to delete and edit item
 * @module Client Todo list client (react)
 * @author FPC
 */

import React from 'react'
// == SDK
import ToolBoxSdk from '../sdk/toolBox-sdk-js'
// Icons 
import { EditIcon, TrashIcon, } from '@iconicicons/react'

const countPerPage = ToolBoxSdk.countPerPage

/**
 * @param {Object} itemToDelete Contains the id of the item to delete
 */
async function handleDelete({itemToModify, todos, setTodos, analyseFetchResponseParams}) {

  const { email, dispatch, APP_CONTEXT, history, } = analyseFetchResponseParams
  // the id of the item to delete
  const id = itemToModify?.id

  if(id) {
    // the new items list to render after delete
    const filteredItems = todos.items.filter(item => item.id !== id)

    let response = await ToolBoxSdk.api.deleteTask(id)

    // check response status code
    const shouldSignIn = await ToolBoxSdk.api.analyseFetchResponse(
      response, 
      email, 
      history, dispatch, APP_CONTEXT)
    
    if(shouldSignIn >= 1) {

      // accessToken needs to be renew and retry the fetch call
      if(shouldSignIn == 1) {
        response = await ToolBoxSdk.api.deleteTask(id)
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
}

/**
 * 
 * @param {Object} itemToEdit The item to edit
 * @returns 
 */
async function handleEdit({ itemToModify, todos, setTodos, analyseFetchResponseParams, editItems, setEditItems, setSpanWidth, spanRef, } ) {

  const { email, dispatch, APP_CONTEXT, history, } = analyseFetchResponseParams

  const {id, task, achievement} = itemToModify

  if(editItems[id]) {

    let updateTask = await ToolBoxSdk.api.updateTask(id, editItems[id], achievement)

    const shouldSignIn = await ToolBoxSdk.api.analyseFetchResponse(updateTask, email, history, dispatch, APP_CONTEXT)

    if(shouldSignIn >= 1) {

      // accessToken needs to be renew and retry the fetch call
      if(shouldSignIn == 1) {
        updateTask = await ToolBoxSdk.api.updateTask(id, editItems[id], achievement)
      }

      // no need to renew access token, just continue to fetch data
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

    // need to sign in again, refreshToken needs to be renew
    if(shouldSignIn == 0) {
      return
    }

  }
  
  let _editItems = {
    ...editItems,
    [id]: task
  }

  setEditItems(_editItems)

}

/**
 * Array containing element to render edit button and delete button (title, Icon, onClick function)
 */
const todoListItemActions = [
  {
    title: 'Edit Item',
    icon: <EditIcon />,
    onClick: handleEdit,
  },
  {
    title: 'Delete Item',
    icon: <TrashIcon />,
    onClick: handleDelete,
  },
];


/**
 * 
 * @param {ReactElement} Icon 
 * @param {String} title Name of the action 
 * @param {Function} onClick The action triggered by onClick
 * @param {Object} itemToModify Contains the itemToModify the function needs
 * @returns 
 */
function TodoListItemActionButton(props) {

	return (
    <button
      className={props.editMode == true && props.title == "Edit Item" ? ['todo-list-item-button', "button-edit-mode"].join(' ') : 'todo-list-item-button'}
      type="button"
      title={props.title}
      onClick={() => {
		props.onClick(props)
	  }}
    >
      { props.icon }
    </button>
  )
}

function TodoListItemActionButtons(props) {
  
  return(
    <div className="todo-list-item-actions-group">
    {todoListItemActions.map((action) => (
    <TodoListItemActionButton
      key={action.title}
      icon={action.icon}
      title={action.title}
      onClick={action.onClick}
      itemToModify={props.item}
      todos={props.todos}
      setTodos={props.setTodos}
      analyseFetchResponseParams={props.analyseFetchResponseParams}
      editItems={props.editItems}
      setEditItems={props.setEditItems}
      setSpanWidth={props.setSpanWidth}
      spanRef={props.spanRef}
	  editMode={props.editMode}
    />
    ))}
  </div>
  )
}

export default TodoListItemActionButtons;