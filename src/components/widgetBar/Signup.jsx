import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { AiFillApple } from 'react-icons/ai'
import { useAuth } from '../../Context/auth.context'
const Signup = () => {
    const {SignUpWithGoogle}=useAuth()
    return (
        <div>
            <div className='border-[1px] rounded-xl p-4'>
                <div>
                    <h1 className='font-bold text-2xl my-2'>New to Twitter?</h1>
                    <p className='text-slate-600 text-xs mb-2'>Sign up now to get your own personalized timeline!</p>
                </div>
                <div className='space-y-3'>
                    <button onClick={SignUpWithGoogle} className='flex items-center justify-center gap-2 bg-white hover:bg-gray-200 border-[1px]   rounded-full py-2 px-3 w-full'> <FcGoogle className='text-xl' /> Sign up with Google</button>
                    <button className='flex items-center justify-center gap-2 bg-white hover:bg-gray-200 border-[1px]    rounded-full py-2 px-3 w-full'> <AiFillApple className='text-xl' /> Sign up with Apple</button>
                    <button className='bg-white hover:bg-gray-200 border-[1px]   rounded-full py-2 px-3 w-full'>Create account</button>
                </div>
                <p className='text-xs text-gray-600 mt-2'>
                    By signing up, you agree to the <span className='text-blue-600'>Terms of Service</span> and <span className='text-blue-600'>Privacy Policy</span>, including <span className='text-blue-600'>Cookie Use.</span>
                </p>
            </div>

            <div className='text-xs text-gray-600 flex flex-wrap gap-2 p-4'>
                <a className='hover:underline' href="#"> Privacy Policy</a>
                <a className='hover:underline' href="#"> Terms of Service</a>
                <a className='hover:underline' href="#">Cookie Policy</a>
                <a className='hover:underline' href="#"> Accessibility</a>
                <a className='hover:underline' href="#"> Ads info</a>
                <a className='hover:underline' href="#"> More</a>
                <p>© 2023 X Corp.</p>
            </div>
        </div>
    )
}

export default Signup