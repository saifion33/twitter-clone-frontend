/* eslint-disable react/prop-types */
import React from 'react'
import Modal from '../Modal/Modal'
import TimeAgo from 'react-timeago'
import { GoVerified } from 'react-icons/go'
import TweetBox from './TweetBox'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { auth, storage } from '../../firebase/firebase'
import { getDownloadURL, ref } from 'firebase/storage'
import { useAuth } from '../../Context/auth.context'

const ReplyModal = ({ isOpen, closeModal, tweet, setReplies,isTweetOpen }) => {
    const { loggedInUser } = useAuth()
    const [uploadImage] = useUploadFile(auth)
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
        const baseUrl = 'http://localhost:5000'
        try {
            const response = await fetch(`${baseUrl}/reply/${tweet._id}${tweet.replyOf ? `?replyOf=${tweet.replyOf}` : ''}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ replyTweet, imageUrl, user }) })
            const newReply = await response.json()
            if (tweet.replyOf && isTweetOpen==tweet._id) {
                setReplies(prev => {
                    const newReplies = [...prev, newReply.data]
                    sessionStorage.setItem('replies', JSON.stringify(newReplies))
                    return newReplies
                })
            }
            tweet.replyCount += 1
            closeModal()
        } catch (error) {
            console.log(error)
            closeModal()
        }

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
            <div>
                <TweetBox key={tweet._id} handleImageUpload={handleImageUpload} handleSubmit={handleReply} buttonText={'Reply'} placeholder={'Tweet your Reply! '} />
            </div>
        </Modal>
    )
}

export default ReplyModal