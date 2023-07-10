import React from 'react'
import Signup from './Signup'
import { useAuth } from '../../Context/auth.context'


const WidgetBar = () => {
  const {loggedInUser} = useAuth()

  return (
    <div className='w-[30%] p-10 overflow-y-auto space-y-5 h-screen scrollbar-hide'>
      {
        !loggedInUser.user && <Signup />
      }
      
    </div>
  )
}

export default WidgetBar