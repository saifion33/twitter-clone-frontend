import React from 'react'
import TweetCard from '../Tweet/TweetCard'
import TweetBox from '../Tweet/TweetBox'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'
import Loadingbar from '../Loadingbar'
import { useTweets } from '../../Context/tweet.context'
const Home = () => {
  const [user, loading] = useAuthState(auth)

  const { tweets } = useTweets()

  return (
    <div>
      <div>
        {user && <TweetBox buttonText={'Tweet'} placeholder={"What's happning "} />}
        {loading && <Loadingbar height='10' width='10' />}
      </div>
      <div>
        {tweets.loading && <Loadingbar />}
        {
          (tweets.tweets && tweets.tweets.length > 0) && tweets.tweets.map((tweet) => <TweetCard tweet={tweet} key={tweet._id} />)
        }
        {
          (tweets.tweets && tweets.tweets.length == 0) && <div className='text-4xl text-twitter-100 font-semibold text-center py-5'>No Tweets !</div>
        }
        {
          (!tweets.tweets && !tweets.loading) && <div className='text-2xl py-10 text-slate-600 font-semibold text-center'>Something went wrong...</div>
        }
      </div>
    </div>
  )
}

export default Home