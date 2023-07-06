import React from 'react'
import TweetCard from '../Tweet/TweetCard'
import TweetBox from '../Tweet/TweetBox'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { auth, storage, } from '../../firebase/firebase'
import Loadingbar from '../Loadingbar'
import { useTweets } from '../../Context/tweet.context'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { getDownloadURL, ref, deleteObject } from 'firebase/storage'
import { useAlert } from '../../Context/alert.context'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS } from '../../utils/helpers'
import { BiWifiOff } from 'react-icons/bi'

const Home = () => {
  const [user, loading] = useAuthState(auth)
  const [signOut] = useSignOut(auth)
  const [uploadImage] = useUploadFile(auth)
  const { showAlert } = useAlert()
  const { tweets, setTweets } = useTweets()
  const navigate = useNavigate()
  const token = JSON.parse(localStorage.getItem('token'))

  // Upload image to firebase storage
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

  // TWEET
  const handleTweet = async (tweet, imageUrl, user) => {
    try {
      const response = await fetch(API_ENDPOINTS.TWEET.POST_TWEET.URL, { method: API_ENDPOINTS.TWEET.POST_TWEET.METHOD, headers: { 'Content-Type': 'application/json', 'Authorization': `hack no-way ${token}` }, body: JSON.stringify({ tweet, imageUrl, user }) })
      if (!response.ok) {
        throw new Error(response.status)
      }
      const newTweet = await response.json()
      setTweets(prev => {
        const newTweets = [...prev.tweets, newTweet.data]
        return { ...prev, tweets: newTweets }
      })
    } catch (error) {
      if (error.message == '401') {
        signOut().then(() => {
          navigate('/login')
        })
      }
      console.log(error)
    }

  }

  // handle Delete tweet
  const deleteTweet = (tweet) => {
    if (!navigator.onLine) {
      showAlert('Please check your Internet connection.')
      return
    }
    const tweetId = tweet._id
    fetch(`${API_ENDPOINTS.TWEET.DELETE_TWEET.URL}/${tweetId}`, { method: API_ENDPOINTS.TWEET.DELETE_TWEET.METHOD, headers: { 'Content-Type': 'application/json', 'Authorization': `hack no-way ${token}` } })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw new Error(res.status)
      })
      .then(() => {
        if (tweet.imageUrl) {
          deleteObject(ref(storage, tweet.imageUrl))
        }
        setTweets(prev => {
          const newTweets = prev.tweets.filter(tweet => tweet._id !== tweetId)
          return { ...prev, tweets: newTweets }
        })
        showAlert('Tweet has been deleted', 'success')
      }).catch(error => {
        console.log(error)
        showAlert('There was an error', 'danger')
      })
  }
  return (
    <div>
      {
        user && <TweetBox handleImageUpload={handleImageUpload} handleSubmit={handleTweet} id={'tweet-home'} buttonText={'Tweet'} placeholder={"What's happning?!"} />
      }
      {loading && <Loadingbar height='10' width='10' />}
      <div>
        {tweets.loading && <Loadingbar />}
        {
          (tweets.tweets && tweets.tweets.length > 0 && !tweets.loading) && tweets.tweets.slice().reverse().map((tweet) => <TweetCard deleteTweet={deleteTweet} tweet={tweet} key={tweet._id} />)
        }
        {
          (tweets.tweets && tweets.tweets.length == 0) && <div className='text-4xl text-twitter-100 font-semibold text-center py-5'>No Tweets !</div>
        }
        {
          (!tweets.tweets && !tweets.loading && navigator.onLine) && <div className='text-2xl py-10 text-slate-600 font-semibold text-center'>Something went wrong...</div>
        }
        {
          !navigator.onLine && <div className='flex flex-col justify-center items-center py-20 text-slate-500'>
            <BiWifiOff className='text-9xl' />
            <p className='text-2xl font-semibold'>Check your Internet</p>
          </div>
        }
      </div>
    </div>
  )
}

export default Home