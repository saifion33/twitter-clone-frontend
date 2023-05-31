import React from 'react'
import { AiFillApple } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../Context/auth.context'

const Login = () => {
    const { SignInWithGoogle } = useAuth()
    return (
        <div className='flex justify-center flex-col items-center'>
            <h1 className='text-3xl font-bold my-5'>Sign in to Twitter</h1>
            <div className='px-10 space-y-3'>
                <button onClick={SignInWithGoogle} className='flex items-center bg-white py-1 px-8 rounded-full border-[1px] w-full gap-2 my-4'><FcGoogle /> Sign in with Google</button>
                <button className='flex items-center bg-white py-1 px-8 rounded-full border-[1px] w-full gap-2 my-4'><AiFillApple /> Sign in with Apple</button>
                <div className='flex items-center justify-center gap-2 w-full'>
                    <span className=' w-full h-[1px] bg-gray-400'></span>
                    <p>or</p>
                    <span className=' w-full h-[1px] bg-gray-400'></span>
                </div>
                <div className='flex flex-col gap-6'>
                    <input type="text" className='border-[1px] p-4 rounded-sm text-gray-600 ' value={'Phone, email or username'} />
                    <button className='bg-slate-950 hover:bg-slate-900 py-2 rounded-full text-stone-200 text-base font-semibold'>Next</button>
                    <button className='bg-white hover:bg-gray-100 border-[1px] py-2 rounded-full text-slate-800 text-base font-semibold '>Forgot Password?</button>
                </div>
                <div className='py-2'>
                    <p className='text-sm text-gray-700'>Don&apos;t have an account? <span className='text-[--twitter-color] cursor-pointer'>Sign up</span></p>
                </div>
            </div>
        </div>
    )
}

export default Login