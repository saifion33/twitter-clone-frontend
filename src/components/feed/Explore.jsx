import React from 'react'
import Home from './Home'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'

const Explore = () => {
  const [user] = useAuthState(auth)
  return (
    <div>
      {!user && <Home />}
      {user && <div>Explore</div>}
    </div>
  )
}

export default Explore