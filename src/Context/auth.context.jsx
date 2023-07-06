/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from 'react'
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebase'
import { useAlert } from './alert.context'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../utils/helpers'

const authContext = createContext(null)

const AuthContext = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser')) : { user: null, loading: false, error: null })
    const [signInGoogle] = useSignInWithGoogle(auth)
    const [CreateAccount] = useCreateUserWithEmailAndPassword(auth)
    const [signInWithEmail] = useSignInWithEmailAndPassword(auth);
    const { showAlert } = useAlert()
    const navigate = useNavigate()
    const signUp = async (googleResponse) => {
        const body = JSON.stringify({
            id: googleResponse.user.uid,
            name: googleResponse._tokenResponse.displayName,
            email: googleResponse._tokenResponse.email,
            userName: googleResponse._tokenResponse.email.split('@')[0],
            avatarUrl: googleResponse._tokenResponse.photoUrl
        })
        const method = API_ENDPOINTS.AUTH.SIGNUP.METHOD
        const headers = { 'Content-Type': 'application/json' }
        // ** REGISTER NEW USER IN DATABASE
        fetch(API_ENDPOINTS.AUTH.SIGNUP.URL, { method, headers, body })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                localStorage.setItem('token', JSON.stringify(response.data.token))
                setLoggedInUser(prev => {
                    const newState = { ...prev, user: response.data.user, loading: false }
                    localStorage.setItem('loggedInUser', JSON.stringify(newState))
                    return newState
                });
                navigate('/')
                showAlert('Signup successfully .', 'success')
            })
            .catch(err => {
                console.log(err);
                setLoggedInUser(prev => {
                    const newState = { ...prev, error: err }
                    localStorage.setItem('loggedInUser', JSON.stringify(newState))
                    return newState
                });
                showAlert(`Signup Failed ${err.message}`, 'danger')
            })
    }

    // ** SIGN UP WITH GOOGLE
    const SignUpWithGoogle = async () => {
        setLoggedInUser({ ...loggedInUser, loading: true })
        // SEND SIGNUP REQUEST TO GOOGLE
        signInGoogle()
            .then(googleResponse => {
                signUp(googleResponse)
            })
            .catch(err => {
                console.log(err);
                showAlert('Signup Failed. ' + err.message, 'danger')
            })

    }
    const login = async (email, id) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.AUTH.LOGIN.URL}/${email}/${id}`)
            const data = await response.json();
            return { data, status: response.status }
        } catch (error) {
            console.log(error)
            return error
        }
    }

    // ** SIGN IN WITH GOOGLE
    const SignInWithGoogle = async () => {
        setLoggedInUser({ ...loggedInUser, loading: true })
        signInGoogle()
            .then(async (googleResponse) => {
                const isUserExist = await fetch(`${API_ENDPOINTS.AUTH.IS_USER_EXIST.URL}/${googleResponse.user.email}`)
                if (isUserExist.ok) {
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
    const SignUpWithEmailAndPassword = async (name, email, password) => {
        CreateAccount(email, password).then((googleResponse) => {
            console.log(googleResponse)
            const body = JSON.stringify({
                name,
                id: googleResponse.user.uid,
                email: googleResponse.user.email,
                userName: googleResponse.user.email.split('@')[0],
                avatarUrl: googleResponse.user.photoURL
            })
            const method = API_ENDPOINTS.AUTH.SIGNUP.METHOD
            const headers = { 'Content-Type': 'application/json' }
            fetch(API_ENDPOINTS.AUTH.SIGNUP.URL, { method, headers, body })
                .then(response => response.json())
                .then(response => {

                    setLoggedInUser(prev => {
                        localStorage.setItem('token', JSON.stringify(response.data.token));
                        const newState = { ...prev, user: response.data.user, loading: false }
                        localStorage.setItem('loggedInUser', JSON.stringify(newState))
                        return newState
                    });
                    navigate('/')
                    showAlert('Signup successfully .', 'success')
                })
                .catch(err => {
                    console.log(err);
                    setLoggedInUser(prev => {
                        const newState = { ...prev, error: err }
                        localStorage.setItem('loggedInUser', JSON.stringify(newState))
                        return newState
                    });
                    showAlert(`Signup Failed ${err.message}`, 'danger')
                })
        }).catch(err => {
            console.log(err);
            showAlert('Signup Failed. ' + err.message, 'danger')
        })
    }
    const signInWithEmailAndPassword = async (email, password) => {
        const googleResponse = await signInWithEmail(email, password)
        if (!googleResponse) {
            return showAlert(`Signin Failed. May you don't have an account`, 'danger')
        }
        login(googleResponse.user.email, googleResponse.user.uid)
            .then(response => {
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

    }

    return (
        <authContext.Provider value={{ auth, SignUpWithGoogle, SignInWithGoogle, login, loggedInUser, setLoggedInUser, SignUpWithEmailAndPassword, signInWithEmailAndPassword }} >
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => { return useContext(authContext) }

export default AuthContext