/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebase'
import { useAlert } from './alert.context'

const authContext = createContext(null)

const AuthContext = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState({ user: null, loading: false, error: null })
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
                    name: googleResponse._tokenResponse.displayName,
                    email: googleResponse._tokenResponse.email,
                    userId: googleResponse._tokenResponse.email.split('@')[0],
                    avatarUrl: googleResponse._tokenResponse.photoUrl
                })
                const method = 'POST'
                const headers = { 'Content-Type': 'application/json' }

                // ** REGISTER NEW USER IN DATABASE
                fetch(`${baseUrl}/newUser`, { method, headers, body })
                    .then(response => response.json())
                    .then(response => { setLoggedInUser({ ...loggedInUser, user: response.data, loading: false }); console.log(response); showAlert('Signup successfully .', 'success') })
                    .catch(err => { console.log(err); setLoggedInUser({ ...loggedInUser, loading: false, error: err }); showAlert(`Signup Failed ${err.message}`, 'danger') })
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
            console.log(user.data)
            return user.data
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
                    .then(user => {
                        setLoggedInUser(prev => ({ ...prev, user }))
                        showAlert('SignIn Successfully .', 'success')
                    })
                    .catch((error) => {
                        setLoggedInUser(prev => ({ ...prev, error }))
                        console.log(error)
                        showAlert('SignIn Failed .' + error.message, 'danger')
                    })
                    .finally(() => {
                        setLoggedInUser(prev => ({ ...prev, loading: false}))
                    })
            })
            .catch((err) => {
                console.log(err); showAlert('Signup Successfully .', 'danger')
            })
    }




    return (
        <authContext.Provider value={{ auth, SignUpWithGoogle, SignInWithGoogle, getLoggedInUser, loggedInUser }} >
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => { return useContext(authContext) }

export default AuthContext