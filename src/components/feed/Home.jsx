import React from 'react'
import TweetCard from '../Tweet/TweetCard'
import TweetBox from '../Tweet/TweetBox'
const Home = () => {
  return (
    <div>
      <div>
        <TweetBox />
      </div>
      <TweetCard />
      <TweetCard />
    </div>
  )
}

export default Home