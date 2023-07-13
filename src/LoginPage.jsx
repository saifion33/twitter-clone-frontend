import React from 'react'
import Modal from './components/Modal/Modal'
import { useNavigate } from 'react-router-dom'
import Login from './components/Login/Login'

const LoginPage = () => {
    const navigate = useNavigate()
    const handleClose = () => {
        navigate('/')
    }

    return (
        <Modal isOpen={true} onClose={handleClose}  >
            <Login />
        </Modal>
    )
}

export default LoginPage