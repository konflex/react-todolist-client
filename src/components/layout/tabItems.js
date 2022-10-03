/**
 * @file components/layout/tabItems.js
 * @summary The component to filter to task (completed, pending, all)
 * @module Client Todo list client (react)
 * @author FPC
 */

// == React
import React, { useEffect, } from "react"
// == SDK
import ToolBoxSdk from '../sdk/toolBox-sdk-js'
// == Icons
import { DotsIcon, ClockIcon, CheckIcon } from '@iconicicons/react';

const FILTER_STATE = ToolBoxSdk.api.FILTER_STATE

/**
 * @summary Component to filter tasks (completed, pending or all)
 * @param {function} setTodos To set user's tasks 
 * @param {object} todos User's tasks as object
 */
export default function TabItems({ todos, setFilteredItems, activeFilter, setActiveFilter, }) {

    const todosList = todos?.items

    const tabItems = [
        {
          filterId: FILTER_STATE.all,
          LeadingIcon: <DotsIcon />,
          label: 'All',
          ariaLabel: 'Show all tasks',
          active: activeFilter === FILTER_STATE.all,
        },
        {
          filterId: FILTER_STATE.todo,
          LeadingIcon: <ClockIcon />,
          label: 'Pending',
          ariaLabel: 'Show pending tasks',
          active: activeFilter === FILTER_STATE.todo,
        },
        {
          filterId: FILTER_STATE.completed,
          LeadingIcon: <CheckIcon />,
          label: 'Completed',
          ariaLabel: 'Show completed tasks',
          active: activeFilter === FILTER_STATE.completed,
        },
    ]

    const filteredTodoList = todosList.filter((todoItem) => {
        switch (activeFilter) {
        // pending tasks
          case 2:
            return !todoItem.achievement;
        // completed tasks
          case 1:
            return todoItem.achievement;
        // all tasks
          case 0:
            return true;
          default:
            return true;
        }
    })
  
    useEffect(() => {

        setFilteredItems(filteredTodoList)

    }, [todos,activeFilter])

    return(
        <ul className="tab-group-root">
        {
            tabItems.map(({ LeadingIcon, filterId, label, ariaLabel, active, }) => (
                <li className="tab-item-root" data-active={active} key={ariaLabel}>
                    <button
                        type="button"
                        className="tab-item-main"
                        onClick={() => setActiveFilter(filterId)}
                        aria-label={ariaLabel}
                    >
                        { LeadingIcon }
                        { label }
                    </button>
                </li>)
                )
        }
        </ul> 
    )
}