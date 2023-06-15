import React from 'react'
import Home from './Home'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'
import CommingSoon from '../CommingSoon'

const Explore = () => {
  const [user] = useAuthState(auth)
  return (
    <>
      {!user && <Home />}
      {user && <CommingSoon text={'Explore'} />}
    </>
  )
}

export default Explore