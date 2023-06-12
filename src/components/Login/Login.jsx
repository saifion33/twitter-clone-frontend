import React, { useState } from 'react'

import { useAuth } from '../../Context/auth.context'
import { AiFillApple } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { useFormik } from 'formik'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'

import Loadingbar from '../Loadingbar'
import { useAlert } from '../../Context/alert.context'

const Login = () => {

    const { SignInWithGoogle } = useAuth()
    const { showAlert } = useAlert()
    const [signInWithEmailAndPassword, loading, error,] = useSignInWithEmailAndPassword(auth);
    const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false)
    const validate = (values) => {
        const errors = {}
        if (!values.name) {
            errors.name = 'Please provide email address'
        }
        if (!values.password) {
            errors.password = 'Please provide password'
        }
        return errors
    }
    const Formik = useFormik({
        initialValues: { name: '', password: '' }, validate, onSubmit: async (values) => {
            try {
                const res = await signInWithEmailAndPassword(values.name, values.password)
                if (!res) {

                    return alert('Invalid email or password')
                }
                res.user.displayName = values.name.slice(0, 4)
                console.log(res.user)
            } catch (error) {
                alert(error.message)
                console.log(error)
            }
        }
    })
    return (
        <div className='flex  flex-col items-center  h-[80%]'>
            {!isPasswordFormVisible && <h1 className='text-3xl font-bold my-5'>Sign in to Twitter</h1>}
            {isPasswordFormVisible && <h1 className='text-3xl font-bold my-5'>Enter your Password</h1>}
            {
                (!isPasswordFormVisible && !loading) && <div className='px-10 space-y-3'>
                    <button onClick={SignInWithGoogle} className='flex items-center bg-white py-1 px-8 rounded-full border-[1px] w-full gap-2 my-4'><FcGoogle /> Sign in with Google</button>
                    <button onClick={() => showAlert('Comming Soon 😊.', 'info')} className='flex items-center bg-white py-1 px-8 rounded-full border-[1px] w-full gap-2 my-4'><AiFillApple /> Sign in with Apple</button>
                    <div className='flex items-center justify-center gap-2 w-full'>
                        <span className=' w-full h-[1px] bg-gray-400'></span>
                        <p>or</p>
                        <span className=' w-full h-[1px] bg-gray-400'></span>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <input id='name' value={Formik.values.name} onChange={Formik.handleChange} type="text" className='border-[1px] p-4 rounded-sm text-gray-600 ' placeholder='Phone,Email or Username' />
                        {Formik.errors.name && <p className='text-sm text-red-500'>{Formik.errors.name}</p>}
                        <button disabled={Formik.values.name.length < 1} type='button' onClick={() => { setIsPasswordFormVisible(true) }} className='bg-slate-950 disabled:bg-slate-600 hover:bg-slate-900 py-2 rounded-full text-stone-200 text-base font-semibold'>Next</button>
                        <button className='bg-white hover:bg-gray-100 border-[1px] py-2 rounded-full text-slate-800 text-base font-semibold '>Forgot Password?</button>
                    </div>
                    <div className='py-2'>
                        <p className='text-sm text-gray-700'>Don&apos;t have an account? <span className='text-twitter-100 cursor-pointer'>Sign up</span></p>
                    </div>
                </div>
            }
            {
                (isPasswordFormVisible && !loading) && <div className='flex flex-col gap-5 h-full'>
                    <div className='p-3 rounded-md bg-gray-200 text-gray-400'>
                        <p className='text-sm'>Email</p>
                        <p>{Formik.values.name}</p>
                    </div>
                    <input id='password' value={Formik.values.password} onChange={Formik.handleChange} type="password" className='border-[1px] p-4 rounded-sm text-gray-600 ' placeholder='password' />
                    <div className='mt-auto'>
                        <button type='submit' onClick={Formik.handleSubmit} disabled={Formik.values.password.length < 1} className='bg-slate-950 disabled:bg-slate-600 hover:bg-slate-900 py-2 w-full rounded-full text-stone-200 text-base font-semibold'>Log In</button>
                        <div className='py-2'>
                            <p className='text-sm text-gray-700'>Don&apos;t have an account? <span className='text-twitter-100 cursor-pointer'>Sign up</span></p>
                        </div>
                    </div>
                </div>
            }
            {
                loading && <Loadingbar height='10' width='10' />
            }
            {
                (!loading && error) && <div> {error.message} </div>
            }
        </div>
    )
}

export default Login