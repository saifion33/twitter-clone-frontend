/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from 'react'
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebase'
import { useAlert } from './alert.context'
import { useNavigate } from 'react-router-dom'
import { IS_USER_EXIST, LOGIN, SIGN_UP } from '../utils/helpers'

const authContext = createContext(null)

const AuthContext = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser')) : { user: null, loading: false, error: null })
    const [CreateAccount] = useCreateUserWithEmailAndPassword(auth)
    const [signInWithEmail] = useSignInWithEmailAndPassword(auth);
    const [signInGoogle] = useSignInWithGoogle(auth)
    const { showAlert } = useAlert()
    const navigate = useNavigate()


    const signUp = async (googleResponse) => {
        const data = JSON.stringify({
            id: googleResponse.user.uid,
            name: googleResponse.user.displayName,
            email: googleResponse.user.email,
            userName: googleResponse.user.email.split('@')[0],
            avatarUrl: googleResponse.user.photoUrl
        })
        // CALL SIGNUP API
        SIGN_UP(data)
            .then(response => {
                const { token, user } = response.data.data
                localStorage.setItem('token', JSON.stringify(token))
                setLoggedInUser(prev => {
                    const newState = { ...prev, user, loading: false }
                    localStorage.setItem('loggedInUser', JSON.stringify(newState))
                    return newState
                });
                navigate('/')
                showAlert('Signup successfully .', 'success')
            })
            .catch(err => {
                console.log(err);
                setLoggedInUser(prev => {
                    const newState = { ...prev, error: err.message }
                    localStorage.setItem('loggedInUser', JSON.stringify(newState))
                    return newState
                });
                showAlert(`Signup Failed ${err.message}`, 'danger')
            })
    }

    // ** SIGN UP WITH GOOGLE
    const SignUpWithGoogle = async () => {
        if (!navigator.onLine) {
            showAlert('check your Internet connection')
            return
        }
        setLoggedInUser({ ...loggedInUser, loading: true })
        // SEND SIGNUP REQUEST TO GOOGLE
        signInGoogle()
            .then(googleResponse => {
                signUp(googleResponse)
            })
            .catch(err => {
                console.log(err);
            })

    }
    const login = async (email, id) => {
        try {
            const response = await LOGIN(email, id)
            const { data } = response.data;
            return { data, status: response.status }
        } catch (error) {
            console.log(error)
            return error
        }
    }

    // ** SIGN IN WITH GOOGLE
    const SignInWithGoogle = async () => {
        if (!navigator.onLine) {
            showAlert('check your Internet connection')
            return
        }
        setLoggedInUser({ ...loggedInUser, loading: true })
        signInGoogle()
            .then(async (googleResponse) => {
                const isUserExist = await IS_USER_EXIST(googleResponse.user.email)
                if (isUserExist.data) {
                    login(googleResponse.user.email, googleResponse.user.uid)
                        .then(response => {
                            if (response.status === 404) {
                                showAlert('User Account Not Found', 'danger')
                                navigate('/signup')
                                throw new Error('User Account Not Found')
                            }
                            localStorage.setItem('token', JSON.stringify(response.data.data.token))
                            setLoggedInUser(prev => {
                                const newState = { ...prev, user: response.data.data.user, loading: false }
                                localStorage.setItem('loggedInUser', JSON.stringify(newState))
                                return newState
                            })
                            navigate('/')
                            showAlert('SignIn Successfully .', 'success')
                        })
                        .catch((error) => {

                            setLoggedInUser(prev => {
                                const newState = { ...prev, error, loading: false }
                                localStorage.setItem('loggedInUser', JSON.stringify(newState))
                                return newState
                            })
                            console.log(error)
                            showAlert('SignIn Failed .' + error.message, 'danger')
                        })
                    return
                }
                signUp(googleResponse)
            })
            .catch((err) => {
                console.log(err); showAlert('SignIn failed  .', 'danger')
            })
    }

    // ********************************** SIGN UP WITH EMAIL AND PASSWORD *************************************************************
    const SignUpWithEmailAndPassword = async (name, email, password) => {
        if (!navigator.onLine) {
            showAlert('Check your Internet connection')
            return
        }
        const isAccountExist=await IS_USER_EXIST(email)
       if(!isAccountExist.data){
        CreateAccount(email, password).then((googleResponse) => {
            googleResponse.user.displayName = name;
            signUp(googleResponse)
        }).catch(err => {
            console.log(err);
            showAlert('Signup Failed. ' + err.message, 'danger')
        })
        return
       }
        showAlert('Account already exist with this email')
       
       
    }

    const signInWithEmailAndPassword = async (email, password) => {

        const googleResponse = await signInWithEmail(email, password)
        if (!googleResponse) {
            return showAlert(`Signin Failed. May you don't have an account`, 'danger')
        }
        login(googleResponse.user.email, googleResponse.user.uid)
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.token))
                setLoggedInUser(prev => {
                    const newState = { ...prev, user: response.data.user, loading: false }
                    localStorage.setItem('loggedInUser', JSON.stringify(newState))
                    return newState
                })
                navigate('/')
                showAlert('SignIn Successfully .', 'success')
            })
            .catch((error) => {

                setLoggedInUser(prev => {
                    const newState = { ...prev, error, loading: false }
                    localStorage.setItem('loggedInUser', JSON.stringify(newState))
                    return newState
                })
                console.log(error)
                showAlert('SignIn Failed .' + error.message, 'danger')
            })

    }

    return (
        <authContext.Provider value={{ auth, SignUpWithGoogle, SignInWithGoogle, login, loggedInUser, setLoggedInUser, SignUpWithEmailAndPassword, signInWithEmailAndPassword }} >
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => { return useContext(authContext) }

export default AuthContext