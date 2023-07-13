import React, { Suspense, lazy } from 'react'
import Modal from './components/Modal/Modal'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './Context/auth.context'
import Loadingbar from './components/Loadingbar'

const Login = lazy(() => import('./components/Login/Login'))

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
            <Suspense fallback={<Loadingbar/>}>
                <Login />
            </Suspense>
        </Modal>
    )
}

export default LoginPage