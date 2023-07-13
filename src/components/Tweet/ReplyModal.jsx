/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import Modal from '../Modal/Modal'
import TimeAgo from 'react-timeago'
import { GoVerified } from 'react-icons/go'
import TweetBox from './TweetBox'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { auth, storage } from '../../firebase/firebase'
import { getDownloadURL, ref } from 'firebase/storage'
import { useAuth } from '../../Context/auth.context'
import { useNavigate } from 'react-router-dom'
import { REPLY_TWEET } from '../../utils/helpers'
import { useSignOut } from 'react-firebase-hooks/auth'

const ReplyModal = ({ isOpen, closeModal, tweet, setReplies, isTweetOpen }) => {
    const { loggedInUser,setLoggedInUser } = useAuth()
    const [signOut]=useSignOut(auth)
    const navigate = useNavigate()
    useEffect(() => {
        if (!loggedInUser.user) {
            navigate('/login')
            return
        }
    }, [])
    const [uploadImage] = useUploadFile(auth)

    const handleExpireToken=()=>{
        signOut().then(() => {
          localStorage.setItem('loggedInUser', JSON.stringify({ user: null, loading: false, error: null }))
          setLoggedInUser({ user: null, loading: false, error: null })
          navigate('/login')
      })
      }

    const handleImageUpload = async (image) => {
        try {
            const result = await uploadImage(ref(storage, `/images/${loggedInUser.user.id}/${Date.now() + image.name}`), image, { cacheControl: `public , max-age=${3600 * 24 * 3}` });
            const downloadUrl = await getDownloadURL(result.ref)
            return downloadUrl
        } catch (error) {
            console.log(error)
            return null
        }
    }


    const handleReply = async (replyTweet, imageUrl, user) => {

            REPLY_TWEET({replyTweet,imageUrl,user},tweet)
            .then((response)=>{
                const newReply=response.data.data
                if (tweet.replyOf && isTweetOpen == tweet._id) {
                    setReplies(prev => {
                        const newReplies = [...prev, newReply]
                        return newReplies
                    })
                }
                tweet.replyCount += 1
                closeModal()
            })
            .catch(err=>{
                if (err.response.status===401) {
                    handleExpireToken()
                    return
                }
                console.log(err)
                closeModal()
            })
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <header className='flex px-5 py-2 gap-4 items-center text-base'>
                <div >
                    <img className='rounded-full w-12' src={tweet.user.avatarUrl} alt={tweet.user.name} />
                </div>
                <div className='flex items-center gap-1 cursor-pointer'>
                    <h1 className='text-lg font-semibold hover:underline '>{tweet.user.name}</h1>
                    <GoVerified className='text-twitter-100 text-xl  ' />
                    <p className='text-gray-700 hover:underline '>@{tweet.user.userName}</p>
                    <TimeAgo className='text-gray-700 ml-3' date={new Date(tweet.postedOn)} />
                </div>
            </header>
            <div className='px-12 py-2'>
                <div className='border-l-2 px-5 text-base'>
                    {tweet.tweet}
                    <p className='text-gray-400'>Replying to <span className='text-twitter-100 cursor-pointer'>@{tweet.user.userName}</span></p>
                </div>
            </div>
            <div className=''>
                <TweetBox id={'reply-box'} handleImageUpload={handleImageUpload} handleSubmit={handleReply} buttonText={'Reply'} placeholder={'Tweet your Reply! '} />
            </div>
        </Modal>
    )
}

export default ReplyModal