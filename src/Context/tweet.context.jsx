/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from 'react'
const tweetContext = createContext(null)
const TweetContext = ({ children }) => {
    const [tweets, setTweets] = useState({ tweets: null, loading: false })
    useEffect(() => {
        setTweets(() => { return { tweets: null, loading: true } })
        fetch('http://localhost:5000/allTweets')
            .then((response) => response.json())
            .then(response => {
                setTweets(prev => { return { ...prev, tweets: response.data } })
            })
            .catch((error) => console.log(error))
            .finally(setTweets(prev => { return { ...prev, loading: false } }))
    }, [])
    return (
        <tweetContext.Provider value={{ tweets,setTweets}} >
            {children}
        </tweetContext.Provider>
    )
}
export const useTweets = () => useContext(tweetContext)
export default TweetContext