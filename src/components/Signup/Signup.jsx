import React, { useState } from 'react'

import { useAuth } from '../../Context/auth.context'
import { AiFillApple } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import CreateAccount from './CreateAccount'
import { useAlert } from '../../Context/alert.context'

const Signup = () => {
    const { SignUpWithGoogle } = useAuth()
    const { showAlert } = useAlert()
    const handleGoogleSignup = () => {
        SignUpWithGoogle()
    }
    const [isCreateAccount, setIsCreateAccount] = useState(false)
    return (
        <div className='flex justify-center flex-col items-center px-24'>
            {
                (!isCreateAccount) && <>
                    <h1 className='text-3xl font-bold my-5'>Join Twitter today</h1>
                    <div className='px-10 space-y-3'>
                        <button onClick={handleGoogleSignup} className='flex items-center bg-white hover:bg-gray-200 py-1 px-8 rounded-full border-[1px] w-full gap-2 my-4'><FcGoogle /> Sign up with Google</button>
                        <button onClick={() => showAlert('Comming Soon 😊. ', 'info')} className='flex items-center bg-white hover:bg-gray-200 py-1 px-8 rounded-full border-[1px] w-full gap-2 my-4'><AiFillApple /> Sign up with Apple</button>
                        <div className='flex items-center justify-center gap-2 w-full'>
                            <span className=' w-full h-[1px] bg-gray-400'></span>
                            <p>or</p>
                            <span className=' w-full h-[1px] bg-gray-400'></span>
                        </div>
                        <button onClick={() => setIsCreateAccount(true)} className='bg-slate-950 hover:bg-slate-800 py-2 rounded-full w-full text-stone-200 text-base font-semibold'>Create account</button>
                        <p className='text-xs text-gray-600 mt-2'>
                            By signing up, you agree to the <span className='text-blue-600'>Terms of Service</span> and <span className='text-blue-600'>Privacy Policy</span>, including <span className='text-blue-600'>Cookie Use.</span>
                        </p>
                        <div className='py-2'>
                            <p className='text-sm text-gray-700'>Don&apos;t have an account? <span className='text-[--twitter-color] cursor-pointer'>Log in</span></p>
                        </div>
                    </div>
                </>
            }
            {
                isCreateAccount && <CreateAccount setIsCreateAccount={setIsCreateAccount} />
            }

        </div>
    )
}

export default Signup