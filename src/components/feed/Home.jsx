import React from 'react'
import TweetCard from '../Tweet/TweetCard'
import TweetBox from '../Tweet/TweetBox'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'
import Loadingbar from '../Loadingbar'
const Home = () => {
  const [user, loading] = useAuthState(auth)
  return (
    <div>
      <div>
        {user && <TweetBox />}
        {loading && <Loadingbar height='10' width='10' />}
      </div>
      <TweetCard />
      <TweetCard />
    </div>
  )
}

export default Home