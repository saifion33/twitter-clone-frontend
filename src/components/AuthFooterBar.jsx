import React, { useState } from 'react'

import { useModal } from '../utils/customHooks'
import Modal from './Modal/Modal'
import Signup from './Signup/Signup'
import Login from './Login/Login'


const AuthFooterBar = () => {
    const { isOpen, openModal, closeModal } = useModal()
    const [isLogin, setIsLogin] = useState(false)

    return (
        <div className='absolute bottom-0 left-0 bg-twitter-100 w-full flex justify-evenly items-center py-2'>
            <div className='mx-auto text-white'>
                <h1 className='text-2xl font-bold'>Don&apos;t miss what&apos;s happning</h1>
                <p>People on Twitter are the first to know.</p>
            </div>
            <div className='flex  gap-6 mx-auto'>
                <button className='border-[1px] rounded-full py-2 px-5 text-white font-semibold' onClick={() => { setIsLogin(false); openModal() }} >Log in</button>
                <button className='bg-white rounded-full py-2 px-5 font-semibold' onClick={() => { setIsLogin(true); openModal() }}>Sign up</button>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal}>
                {
                    !isLogin && <Login />
                }
                {
                    isLogin && <Signup />
                }
            </Modal>
        </div>
    )
}


export default AuthFooterBar