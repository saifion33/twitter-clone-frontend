/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebase'
import { useAlert } from './alert.context'

const authContext = createContext(null)

const AuthContext = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser')) : { user: null, loading: false, error: null })
    const baseUrl = 'http://localhost:5000'
    const [signInGoogle] = useSignInWithGoogle(auth)
    const { showAlert } = useAlert()

    // ** SIGN UP WITH GOOGLE
    const SignUpWithGoogle = async () => {
        setLoggedInUser({ ...loggedInUser, loading: true })
        // SEND SIGNUP REQUEST TO GOOGLE
        signInGoogle()
            .then(googleResponse => {

                const body = JSON.stringify({
                    id: googleResponse.user.uid,
                    name: googleResponse._tokenResponse.displayName,
                    email: googleResponse._tokenResponse.email,
                    userName: googleResponse._tokenResponse.email.split('@')[0],
                    avatarUrl: googleResponse._tokenResponse.photoUrl
                })
                const method = 'POST'
                const headers = { 'Content-Type': 'application/json' }

                // ** REGISTER NEW USER IN DATABASE
                fetch(`${baseUrl}/newUser`, { method, headers, body })
                    .then(response => response.json())
                    .then(response => {
                        setLoggedInUser(prev => {
                            const newState = { ...prev, user: response.data, loading: false }
                            localStorage.setItem('loggedInUser', JSON.stringify(newState))
                            return newState
                        });
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
            })
            .catch(err => {
                console.log(err);
                showAlert('Signup Failed. ' + err.message, 'danger')
            })

    }
    const getLoggedInUser = async (email) => {
        try {
            const response = await fetch(`${baseUrl}/logged-in-user/${email}`)
            const user = await response.json();
            return user
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
                showAlert('SignIn Successfully .', 'success')
                getLoggedInUser(googleResponse.user.email)
                    .then(response => {
                        setLoggedInUser(prev => {
                            const newState = { ...prev, user: response.data, loading: false }
                            localStorage.setItem('loggedInUser', JSON.stringify(newState))
                            return newState
                        })
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
            })
            .catch((err) => {
                console.log(err); showAlert('Signup Successfully .', 'danger')
            })
    }




    return (
        <authContext.Provider value={{ auth, SignUpWithGoogle, SignInWithGoogle, getLoggedInUser, loggedInUser, setLoggedInUser }} >
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => { return useContext(authContext) }

export default AuthContext