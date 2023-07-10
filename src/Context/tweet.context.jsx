/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { GET_ALL_TWEETS } from '../utils/helpers'
const tweetContext = createContext(null)
const TweetContext = ({ children }) => {
    const [tweetsLoading,setTweetsLoading]=useState(false)
    const [tweets, setTweets] = useState(null)

    // fetch tweets from server
    const getTweets=()=>{
        setTweetsLoading(true)
        GET_ALL_TWEETS()
        .then(res=>{
            setTweets(res.data.data)
        })
        .catch(err=>{
            console.log(err.message)
        })
        .finally(()=>setTweetsLoading(false))
      }
// run get tweets function when component is mounted
    useEffect(() => {
        getTweets()
    }, [])

    const increaseTweetReplyCount = (tweetId) => {
        setTweets(prev => {
            const newTweets = prev.map(tweet => {
                if (tweet._id == tweetId) {
                    tweet.replyCount += 1;
                }
                return tweet
            })
            return newTweets
        })
    }
    const pushTweet = (tweet) => {
        setTweets(prev => {
            const newTweets = [...prev, tweet]
            return newTweets
        })
    }
    return (
        <tweetContext.Provider value={{ tweets, setTweets,tweetsLoading, increaseTweetReplyCount, pushTweet }} >
            {children}
        </tweetContext.Provider>
    )
}
export const useTweets = () => useContext(tweetContext)
export default TweetContext