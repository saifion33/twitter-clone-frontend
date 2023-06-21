import React from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './components/Modal/Modal'
import Signup from './components/Signup/Signup'

const SignupPage = () => {
    const navigate = useNavigate()
    const handleClose = () => {
        navigate('/')
    }
    return (
        <Modal isOpen onClose={handleClose} height={'90%'} >
            <Signup />
        </Modal>
    )
}

export default SignupPage