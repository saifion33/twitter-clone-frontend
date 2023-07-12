/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react'
import { useFormik } from 'formik'
import Loadingbar from '../Loadingbar'
import { useAuth } from '../../Context/auth.context'
const CreateAccount = ({ setIsCreateAccount }) => {

    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [nameActive, setNameActive] = useState(false)
    const [emailActive, setEmailActive] = useState(false)
    const [passwordActive, setPasswordActive] = useState(false)
    const { SignUpWithEmailAndPassword } = useAuth()
    const validate = values => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Name is Required';
        } else if (values.name.length > 15) {
            errors.name = 'Must be 15 characters or less';
        } else if (values.name.length < 3) {
            errors.name = 'Name must be at least 3 characters';
        }
        if (!values.email) {
            errors.email = 'Email is Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        if (!values.password) {
            errors.password = 'Password is required';
        } else if (values.password.length < 8) {
            errors.password = 'Password must be at least 8 characters'
        }
        return errors;
    };


    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        }, validate,
        onSubmit: async (values) => {
           try {
            setLoading(true)
            SignUpWithEmailAndPassword(values.name, values.email, values.password).finally(()=>setLoading(false))
           } catch (error) {
            console.log(error.message)
            setLoading(false)
           }
        }
    })

    const handleNameActive = () => {
        setNameActive(true)
        nameRef.current.focus()
    }

    const handleEmailActive = () => {
        setEmailActive(true)
        emailRef.current.focus()
    }

    const handlePasswordActive = () => {
        setPasswordActive(true)
        passwordRef.current.focus()
    }





    return (
        <div className='w-full'  >
            {
                (!loading) && <div>
                    <h1 className='text-3xl font-bold mt-2 mb-8'>Create your account</h1>
                    <div className='space-y-5'>
                        <div onClick={handleNameActive} onBlur={() => { setNameActive(false) }} className={`border-[1px] ${nameActive ? 'border-twitter-100 ' : ''}  rounded-md p-4`}  >

                            {nameActive && <div className='text-sm flex justify-between  text-twitter-100'>
                                <label htmlFor="name">Name</label>
                                <p>0/50</p>
                            </div>}
                            <input onChange={formik.handleChange} ref={nameRef} className='outline-none' id='name' type="text" value={formik.values.name} placeholder={nameActive ? '' : 'Name'} />
                            {formik.errors.name ? <p className='text-xs text-red-600'>{formik.errors.name}</p> : null}
                        </div>
                        <div onClick={handleEmailActive} onBlur={() => { setEmailActive(false) }} className={`border-[1px] ${emailActive ? 'border-twitter-100 ' : ''}  rounded-md p-4`}  >
                            {emailActive && <div className='text-sm flex justify-between  text-twitter-100'>
                                <label htmlFor="name">Email</label>
                            </div>}
                            <input onChange={formik.handleChange} ref={emailRef} className='outline-none' id='email' type="email" value={formik.values.email} placeholder={nameActive ? '' : 'Email'} />
                            {formik.errors.email ? <p className='text-xs text-red-600'>{formik.errors.email}</p> : null}
                        </div>
                        <div onClick={handlePasswordActive} onBlur={() => { setPasswordActive(false) }} className={`border-[1px] ${passwordActive ? 'border-twitter-100 ' : ''}  rounded-md p-4`}  >
                            {passwordActive && <div className='text-sm flex justify-between  text-twitter-100'>
                                <label htmlFor="name">Password</label>
                                <p>0/12</p>
                            </div>}
                            <input onChange={formik.handleChange} ref={passwordRef} className='outline-none' id='password' type={passwordActive ? 'password' : 'text'} value={formik.values.password} placeholder={nameActive ? '' : 'Password'} />
                            {formik.errors.password ? <p className='text-xs text-red-600'>{formik.errors.password}</p> : null}
                        </div>
                    </div>
                    <div className='h-9'>

                    </div>
                    <div className='py-5 flex gap-3' role='button-bar'>
                        <button onClick={() => { setIsCreateAccount(false); formik.resetForm() }} className='bg-orange-500 rounded-full py-1 px-3  text-white ml-auto text-base'>Cancel</button>
                        <button type='submit' onClick={formik.handleSubmit} className='bg-twitter-100 rounded-full py-1 px-3  text-white text-base'>Signup</button>
                    </div>
                    <div>

                    </div>
                </div>
            }
            {
                loading && <Loadingbar height='10' width='10' />
            }

        </div>
    )
}

export default CreateAccount