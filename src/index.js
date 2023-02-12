import React, { StrictMode, } from 'react'
import App from './App'
import './mystyles.scss'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('app')
const root = createRoot(container)

root.render(<App />)