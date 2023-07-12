import React, { Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './components/Modal/Modal'
import Loadingbar from './components/Loadingbar'


const Signup = lazy(() => import('./components/Signup/Signup'))

const SignupPage = () => {
    const navigate = useNavigate()
    const handleClose = () => {
        navigate('/')
    }
    return (
        <Modal isOpen onClose={handleClose} height={'90%'} >
            <Suspense fallback={<Loadingbar/>}>
                <Signup />
            </Suspense>
        </Modal>
    )
}

export default SignupPage