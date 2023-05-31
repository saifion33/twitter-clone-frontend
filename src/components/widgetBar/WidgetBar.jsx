import React from 'react'
import Signup from './Signup'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'


const WidgetBar = () => {
  const [user] = useAuthState(auth)
  return (
    <div className='w-[30%] p-10'>
      {
        !user && <Signup />
      }
    </div>
  )
}

export default WidgetBar