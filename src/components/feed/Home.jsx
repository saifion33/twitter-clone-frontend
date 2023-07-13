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
import { DELETE_TWEET, POST_TWEET } from '../../utils/helpers'
import { BiWifiOff } from 'react-icons/bi'
import { useAuth } from '../../Context/auth.context'

const Home = () => {
  const [user, userLoading] = useAuthState(auth)
  const [signOut] = useSignOut(auth)
  const [uploadImage] = useUploadFile(auth)
  const { showAlert } = useAlert()
  const { tweets, setTweets,tweetsLoading } = useTweets()
  const {setLoggedInUser}=useAuth()
  const navigate = useNavigate()


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
    POST_TWEET({tweet,imageUrl,user})
    .then(response=>{
      const newTweet=response.data.data
      setTweets(prev => {
        const newTweets = [...prev, newTweet]
        return newTweets
      })
    })
    .catch(err => {
      if (err.response.status===401) {
        signOut().then(() => {
          localStorage.setItem('loggedInUser', JSON.stringify({ user: null, loading: false, error: null }))
          setLoggedInUser({ user: null, loading: false, error: null })
          navigate('/login')
      })
        return
      }
      console.log(err)
      showAlert('There was an error','danger')
    })
    
  }

  // handle Delete tweet
  const deleteTweet = (tweet) => {
    if (!navigator.onLine) {
      showAlert('Please check your Internet connection.')
      return
    }
    const tweetId = tweet._id
    DELETE_TWEET(tweetId)
    .then(()=>{
      if (tweet.imageUrl) {
        deleteObject(ref(storage, tweet.imageUrl))
      }
      setTweets(prev => {
        const newTweets = prev.filter(tweet => tweet._id !== tweetId)
        return newTweets
      })
      showAlert('Tweet has been deleted', 'success')
    })
    .catch(err=>{
      if (err.response.status===401) {
        signOut().then(() => {
          localStorage.setItem('loggedInUser', JSON.stringify({ user: null, loading: false, error: null }))
          setLoggedInUser({ user: null, loading: false, error: null })
          navigate('/login')
      })
        return
      }
      console.log(err)
      showAlert('There was an error', 'danger')
    })
    
  }
  return (
    <div>
      {
        user && <TweetBox handleImageUpload={handleImageUpload} handleSubmit={handleTweet} id={'tweet-home'} buttonText={'Tweet'} placeholder={"What's happning?!"} />
      }
      {userLoading && <Loadingbar height='10' width='10' />}
      <div>
        {(tweetsLoading && !tweets) && <Loadingbar />}
        {
          (tweets && tweets.length > 0 && !tweetsLoading) && tweets.toReversed().map((tweet) => <TweetCard deleteTweet={deleteTweet} tweet={tweet} key={tweet._id} />)
        }
        {
          (!tweets && !tweetsLoading && navigator.onLine) && <div className='text-3xl text-center'>Somthing went wrong</div>
        }
        {
          (tweets && tweets.length == 0) && <div className='text-4xl text-twitter-100 font-semibold text-center py-5'>No Tweets !</div>
        }
        {
          (!navigator.onLine && !tweets) && <div className='flex flex-col justify-center items-center py-20 text-slate-500'>
            <BiWifiOff className='text-9xl' />
            <p className='text-2xl font-semibold'>Check your Internet</p>
          </div>
        }
      </div>
    </div>
  )
}

export default Home