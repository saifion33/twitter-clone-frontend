import React from 'react'
import TweetCard from '../Tweet/TweetCard'
import TweetBox from '../Tweet/TweetBox'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, storage } from '../../firebase/firebase'
import Loadingbar from '../Loadingbar'
import { useTweets } from '../../Context/tweet.context'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { getDownloadURL, ref } from 'firebase/storage'
import { useAlert } from '../../Context/alert.context'

const Home = () => {
  const [user, loading] = useAuthState(auth)
  const [uploadImage] = useUploadFile(auth)
  const { showAlert } = useAlert()
  const { tweets, setTweets } = useTweets()


  const handleImageUpload = async (image) => {
    try {
      const result = await uploadImage(ref(storage, `/images/${user.uid}/${Date.now() + image.name}`), image, { cacheControl: `public , max-age=${3600 * 24 * 3}` });
      const downloadurl = await getDownloadURL(result.ref)
      return downloadurl
    } catch (error) {
      console.log(error)
      return null
    }
  }
  const handleTweet = async (tweet, imageUrl, user) => {
    const baseUrl = 'http://localhost:5000'
    try {
      const response = await fetch(`${baseUrl}/tweet`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tweet, imageUrl, user }) })
      const newTweet = await response.json()
      setTweets(prev => {
        const newTweets = [...prev.tweets, newTweet.data]
        return { ...prev, tweets: newTweets }
      })
    } catch (error) {
      console.log(error)
    }

  }
  const deleteTweet = (tweetId) => {
    fetch(`http://localhost:5000/deleteTweet/${tweetId}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        setTweets(prev => {
          const newTweets = prev.tweets.filter(tweet => tweet._id !== tweetId)
          return { ...prev, tweets: newTweets }
        })
        showAlert('Tweet has been deleted', 'success')
      }).catch(error => console.log(error))
  }

  return (
    <div>
      <div>
        {user && <TweetBox key={user.uid} buttonText={'Tweet'} handleImageUpload={handleImageUpload} handleSubmit={handleTweet} placeholder={"What's happning "} />}
        {loading && <Loadingbar height='10' width='10' />}
      </div>
      <div>
        {tweets.loading && <Loadingbar />}
        {
          (tweets.tweets && tweets.tweets.length > 0 && !tweets.loading) && tweets.tweets.map((tweet) => <TweetCard deleteTweet={deleteTweet} tweet={tweet} key={tweet._id} />)
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