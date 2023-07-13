import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_HOST || 'http://localhost:5000'

const token=localStorage.getItem('token')?JSON.parse(localStorage.getItem('token')):'faketoken'
const api=axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization':`Basic ${btoa(import.meta.env.VITE_API_SECRET)} ${token}`
    }
})

// ************************************************ AUTH FUNCTIONS ************************************************
// SIGNUP FUNCTION
export const SIGN_UP=data=>api.post('/auth/signup',data)

// LOGIN FUNCTION
export const LOGIN=(email,id)=>api.get(`/auth/login/${email}/${id}`)

// IS USER EXIST FUNCTION
export const IS_USER_EXIST=(email)=>api.get(`/auth/isUserExist/${email}`)

// ************************************************** TWEETS FUNCTIONS ************************************************

// GET ALL TWEETS FUNCTION
export const GET_ALL_TWEETS=()=>api.get('/tweet/alltweets')

// POST TWEET FUNCTION
export const POST_TWEET=data=>api.post('/tweet/post',data)

// REPLY TO TWEET FUNCTION
export const REPLY_TWEET=(reply,tweet)=>api.patch(`/tweet/reply/${tweet._id}${tweet.replyOf ? `?replyOf=${tweet.replyOf}` : ''}`,reply)

// LIKE TWEET FUNCTION
export const LIKE_TWEET=(tweet)=>api.patch(`/tweet/like/${tweet._id}${tweet.replyOf ? `?replyOf=${tweet.replyOf}` : ''}`)

// GET TWEET REPLIES FUNCTION
export const GET_TWEET_REPLIES=(tweetId)=>api.get(`/tweet/gettweetreplies/${tweetId}`)

// DELETE TWEET FUNCTION
export const DELETE_TWEET=(tweetId)=>api.delete(`/tweet/delete/${tweetId}`)

// DELETE REPLY FUNCTION
export const DELETE_REPLY=(tweetId,replyId)=>api.delete(`/tweet/delete/reply/${tweetId}/${replyId}`)

// GET TWEET BY ID FUNCTION
export const GET_TWEET_BY_ID=(tweetId)=>api.get(`/tweet/getTweet/${tweetId}`)

// ************************************************* USER FUNCTIONS *********************************************************************

// GET USER BY ID FUNCTION
export const GET_USER_BY_ID=userId=>api.get(`/user/userByID/${userId}`)

// UPDATE USER FUNCTION
export const UPDATE_USER=(email,updates)=>api.patch(`/user/updateuser/${email}`,{updates})

// CONVERT IMAGE TO BLOB
export const getImageBlob = async (editorRef) => {
    return new Promise((resolve, reject) => {
      const canvas = editorRef.current.getImageScaledToCanvas()
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob)
        }
        else {
          reject(new Error('cant process file'));
        }
      })
    })

  }