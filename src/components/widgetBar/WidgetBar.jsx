import React from 'react'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'
import Signup from './Signup'


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