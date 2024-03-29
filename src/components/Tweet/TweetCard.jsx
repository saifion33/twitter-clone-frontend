/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import TimeAgo from 'react-timeago'

import imagePlaceholder from '../../assets/image-placeholder.svg'
import { AiOutlineHeart, AiFillHeart, AiOutlineRetweet } from 'react-icons/ai'
import copy from 'copy-to-clipboard'
import { BiMessageRounded, BiBarChart } from 'react-icons/bi'
import { HiArrowUpTray } from 'react-icons/hi2'
import { BsThreeDots } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'
import { IoIosShareAlt } from 'react-icons/io'
import { useModal } from '../../utils/customHooks'
import ReplyModal from './ReplyModal'
import { useNavigate } from 'react-router-dom'
import SmallModal from '../Modal/SmallModal'
import { MdDelete } from 'react-icons/md'
import { useAuth } from '../../Context/auth.context'
import { useAlert } from '../../Context/alert.context'
import { LIKE_TWEET } from '../../utils/helpers'
import { useSignOut } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'

const TweetCard = ({ tweet, deleteTweet, setReplies, isTweetOpen, disableOption }) => {
    const [imageLoaded, setImageLoaded] = useState(true)
    const { loggedInUser, setLoggedInUser } = useAuth()
    const { showAlert } = useAlert()
    const navigate = useNavigate()
    const { isOpen: isReplyModalOpen, openModal: openReplyModal, closeModal: closeReplyModal } = useModal()
    const { isOpen: isOptionOpen, openModal: openOptionModal, closeModal: closeOptionModal } = useModal()
    const isAdmin = loggedInUser.user && tweet.user.id === loggedInUser.user.id
    const [animateClass, setAnimateClass] = useState('')
    const [signOut] = useSignOut(auth)


    const handleExpireToken = () => {
        signOut().then(() => {
            localStorage.setItem('loggedInUser', JSON.stringify({ user: null, loading: false, error: null }))
            setLoggedInUser({ user: null, loading: false, error: null })
            navigate('/login')
        })
    }

    const handleImageError = () => {
        setImageLoaded(false)

    }
    const openTweet = async () => {
        navigate(`/tweet/${tweet._id}/${tweet.replyOf?tweet.replyOf:''}`, { relative: 'path' })
    }
    const handleDeleteTweet = (e) => {
        e.stopPropagation()
        if (!navigator.onLine) {
            showAlert('Please check your Internet connection.')
            return
        }

        deleteTweet(tweet)
    }
    const userId = loggedInUser.user && loggedInUser.user.id
    const isLiked = tweet.likes.includes(userId)

    const handleLikeTweet = (e) => {
        e.stopPropagation()
        if (!navigator.onLine) {
            showAlert('Please check your Internet connection.')
            return
        }
        setAnimateClass('animate-bounce')
        setTimeout(() => {
            setAnimateClass('')
        }, 1000);
        if (!loggedInUser.user) {
            navigate('/login')
            return
        }

        if (isLiked) {
            const newLikes = tweet.likes.filter(id => id != userId)
            tweet.likes = newLikes
        }
        else {
            tweet.likes.push(userId)
        }
        LIKE_TWEET(tweet).catch(err => {
            if (err.response.status === 401) {
                handleExpireToken()
            }
            console.log(err.message)
            if (!isLiked) {
                const newLikes = tweet.likes.filter(id => id != userId)
                tweet.likes = newLikes
            }
            else {
                tweet.likes.push(userId)
            }
            showAlert('Something went wrong', 'danger')
        })
    }
    const openProfile = (e) => {
        e.stopPropagation();
        navigate(`/profile/${tweet.user.id}`)
    }
    const handleReply = (e) => {
        e.stopPropagation()
        openReplyModal()
    }
    const handleShareTweet=(e) => {
        e.stopPropagation()
        copy(`${location.host}/tweet/${tweet._id}`)
        showAlert('Tweet Link Copied to clipboard')
    }


    return (
        <>
            <div onClick={openTweet} role='card' className={`p-6 cursor-pointer hover:bg-gray-100 ${disableOption ? 'bg-gray-100' : ''}  relative `}>

                <header className='flex gap-4 items-center'>
                    <div onClick={openProfile} >
                        <img className='rounded-full w-12' src={tweet.user.avatarUrl} alt={tweet.user.name} />
                    </div>

                    <div className='flex items-center gap-1 cursor-pointer'>
                        <h1 onClick={openProfile} className='text-lg font-semibold hover:underline '>{tweet.user.name}</h1>
                        <GoVerified className='text-twitter-100  ' />
                        <p onClick={openProfile} className='text-gray-700 hover:underline '>@{tweet.user.userName}</p>
                        <TimeAgo className='text-gray-700 ml-3' date={tweet.postedOn} />
                    </div>
                    {
                        !disableOption && <div onClick={(e) => { e.stopPropagation(); openOptionModal() }} className='ml-auto mr-5 cursor-pointer p-2 rounded-full hover:bg-twitter-25 bg-opacity-10 hover:text-twitter-100 transition-colors duration-300 text-xl'>
                            <BsThreeDots />
                        </div>
                    }
                </header>
                <div className='pl-12 py-4'>{tweet.tweet}</div>
                <div className='flex justify-center items-center'>
                    {
                        tweet.imageUrl && <div>{
                            imageLoaded ? (
                                <img src={tweet.imageUrl} onError={handleImageError} alt="Image" />
                            ) : (
                                <img src={imagePlaceholder} alt="Placeholder image" />
                            )}</div>
                    }
                </div>

                <footer className='p-5 px-8 flex gap-6'>
                    {
                        !disableOption && <div onClick={handleReply} className='flex gap-2 items-center text-gray-700 group hover:text-twitter-100 cursor-pointer w-fit transition-all duration-300 '>
                            <div className='text-lg  group-hover:bg-twitter-25 rounded-full p-1'><BiMessageRounded /></div>
                            <span className='text-sm '>{tweet.replyCount}</span>
                        </div>
                    }
                    <div onClick={() => showAlert('Comming soon. 😊')} className='flex gap-2 items-center text-gray-700 group hover:text-green-600 cursor-pointer w-fit transition-all duration-300 '>
                        <div className='text-lg  group-hover:bg-green-200  rounded-full p-1'><AiOutlineRetweet /></div>
                        <span className='text-sm'></span>
                    </div>
                    <div onClick={handleLikeTweet} className={`${isLiked ? 'text-pink-600' : 'text-gray-700'} ${animateClass} flex gap-2 items-center  group hover:text-pink-600 cursor-pointer w-fit transition-all duration-300 `}>
                        <div className='text-lg  group-hover:bg-pink-300 rounded-full p-1'>{isLiked ? <AiFillHeart /> : <AiOutlineHeart />}</div>
                        <span className='text-sm'>{tweet.likes.length}</span>
                    </div>
                    <div onClick={() => showAlert('Comming soon. 😊')} className='flex gap-2 items-center text-gray-700 group hover:text-twitter-100 cursor-pointer w-fit transition-all duration-300 '>
                        <div className='text-lg  group-hover:bg-twitter-25 rounded-full p-1'><BiBarChart /></div>
                        <span className='text-sm'></span>
                    </div>
                    <div onClick={() => { copy(`${location.host}/tweet/${tweet._id}`) }} className='flex gap-2 items-center text-gray-700 group hover:text-twitter-100 cursor-pointer w-fit transition-all duration-300'>
                        <div className='text-lg  group-hover:bg-twitter-25 rounded-full p-1'><HiArrowUpTray /></div>
                        <span className='text-sm'></span>
                    </div>
                </footer>
                <SmallModal position={'right-2'} isOpen={isOptionOpen} onClose={closeOptionModal} >
                    <div className='py-2 space-y-3 '>
                        {isAdmin && <div onClick={handleDeleteTweet} className='hover:bg-gray-200 px-2 rounded flex gap-2 items-center text-red-600'><MdDelete /> Delete Tweet</div>}
                        <div onClick={handleShareTweet} className='hover:bg-gray-200 px-2 rounded flex gap-2 items-center text-twitter-100'><IoIosShareAlt /> Share Tweet</div>
                    </div>
                </SmallModal>
            </div>
            {isReplyModalOpen && <ReplyModal isOpen={isReplyModalOpen} isTweetOpen={isTweetOpen} isReply={tweet.isReply} setReplies={setReplies} closeModal={closeReplyModal} tweet={tweet} />}
        </>
    )
}

export default TweetCard