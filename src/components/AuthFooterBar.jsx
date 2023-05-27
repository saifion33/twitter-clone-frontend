import React, { useState } from 'react'
import Modal from './Modal/Modal'
import { useModal } from '../utils/customHooks'
import Login from './Login'
import Signup from './Signup'


const AuthFooterBar = () => {
    const { isOpen, openModal, closeModal } = useModal()
    const [isLogin, setIsLogin] = useState(false)
    return (
        <div className='absolute bottom-0 left-0 bg-[--twitter-color] w-full flex justify-evenly items-center py-2'>
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