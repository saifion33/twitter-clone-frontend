import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Modal from './components/Modal/Modal.jsx'
import AuthContext from './Context/auth.context.jsx'
import AlertContext from './Context/alert.context.jsx'
import Alert from './components/Alert/Alert.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AlertContext>
        <AuthContext>
          <App />
          <Modal />
          <Alert />
        </AuthContext>
      </AlertContext>
    </Router>
  </React.StrictMode>,
)
