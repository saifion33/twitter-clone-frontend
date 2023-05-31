/* eslint-disable react/prop-types */
import React, { createContext, useContext } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebase'

const authContext = createContext(null)

const AuthContext = ({ children }) => {
    const baseUrl = 'http://localhost:5000'
    const [signInGoogle] = useSignInWithGoogle(auth)

    const SignUpWithGoogle = async () => {
        signInGoogle().then(user => {
            fetch(`${baseUrl}/newUser`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: user._tokenResponse.displayName, email: user._tokenResponse.email }) })
                .then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err))
        }).catch(err =>
            console.log(err))

    }
    const SignInWithGoogle = async () => {
        signInGoogle().then(() => { console.log('Sign in Successfully.') }).catch(err => console.log(err))
    }
    return (
        <authContext.Provider value={{ auth, SignUpWithGoogle, SignInWithGoogle }} >
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => { return useContext(authContext) }

export default AuthContext