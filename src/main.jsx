import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Modal from './components/Modal/Modal.jsx'
import AuthContext from './Context/auth.context.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthContext>
        <App />
        <Modal />
      </AuthContext>
    </Router>
  </React.StrictMode>,
)
