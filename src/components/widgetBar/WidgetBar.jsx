import React from 'react'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'
import Signup from './Signup'
// import { TwitterTimelineEmbed } from 'react-twitter-embed'
// import Loadingbar from '../Loadingbar'

// const screenNames = ['SpaceX', 'elonmusk', 'NASA', 'Space_Station']

const WidgetBar = () => {

  // const getRandomItem = (arr) => {
  //   const randomIndex = Math.floor(Math.random() * arr.length)
  //   return arr[randomIndex]
  // }

  // const screenName = getRandomItem(screenNames)
  const [user] = useAuthState(auth)

  return (
    <div className='w-[30%] p-10 overflow-y-auto space-y-5 h-screen scrollbar-hide'>
      {
        !user && <Signup />
      }

      {/* <TwitterTimelineEmbed
        sourceType="profile"
        screenName={screenName}
        placeholder={<Loadingbar />}
        options={{ height: 400 }}
      /> */}
    </div>
  )
}

export default WidgetBar