import React from 'react'
import Modal from './components/Modal/Modal'
import { useNavigate } from 'react-router-dom'
import Login from './components/Login/Login'
import { useAuth } from './Context/auth.context'

const LoginPage = () => {
    const navigate = useNavigate()
    const handleClose = () => {
        navigate('/')
    }
    const { loggedInUser } = useAuth()
    if (loggedInUser.user) {
        navigate('/')
    }
    return (
        <Modal isOpen={true} onClose={handleClose}  >
            <Login />
        </Modal>
    )
}

export default LoginPage