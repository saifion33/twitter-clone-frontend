import React from 'react'
import Signup from './Signup'
import { useAuth } from '../../Context/auth.context'
import { useTweets } from '../../Context/tweet.context'
import TweetCard from '../Tweet/TweetCard'


const WidgetBar = () => {
  const {loggedInUser} = useAuth()
  const {tweets,tweetsLoading}=useTweets()
 

  return (
    <div className='w-[32%] pl-5 py-10 overflow-y-auto h-screen scrollbar-hide'>
      {
        !loggedInUser.user && <Signup />
      }
      {
        loggedInUser.user && <div className='flex flex-col gap-5 justify-center items-center'>
          <p className='text-2xl text-slate-600 font-semibold text-center'>Tweet for you</p>
          {
            (!tweetsLoading && tweets) && <TweetCard disableOption tweet={tweets[Math.floor(Math.random()*tweets.length)]} />
          }
        </div>
      }
    </div>
  )
}

export default WidgetBar