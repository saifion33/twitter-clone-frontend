/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import TimeAgo from 'react-timeago'
import imagePlaceholder from '../../assets/image-placeholder.svg'
import { AiOutlineHeart, AiFillHeart, AiOutlineRetweet } from 'react-icons/ai'
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

const TweetCard = ({ tweet, deleteTweet, setReplies, isTweetOpen }) => {
    const [imageLoaded, setImageLoaded] = useState(true)

    const { loggedInUser } = useAuth()
    const { showAlert } = useAlert()
    const [likes, setLikes] = useState(tweet.likes)
    const navigate = useNavigate()
    const { isOpen: isReplyModalOpen, openModal: openReplyModal, closeModal: closeReplyModal } = useModal()
    const { isOpen: isOptionOpen, openModal: openOptionModal, closeModal: closeOptionModal } = useModal()
    const isAdmin = loggedInUser.user && tweet.user.id === loggedInUser.user.id
    const handleImageError = () => {
        setImageLoaded(false)

    }
    const openTweet = async () => {
        sessionStorage.setItem('tweet', JSON.stringify(tweet))
        const response = await fetch(`http://localhost:5000/getReplies/${tweet._id}`)
        const replies = await response.json()
        sessionStorage.setItem('replies', JSON.stringify(replies.data))
        navigate(`/tweet/${tweet._id}`, { relative: 'path' })
    }
    const handleDeleteTweet = () => {
        deleteTweet(tweet._id)
    }
    const userId = loggedInUser.user && loggedInUser.user.id
    const isLiked = likes.includes(userId)
    const handleLikeTweet = () => {
        if (!loggedInUser.user) {
            navigate('/login')
            return
        }
        if (isLiked) {
            setLikes(prev => {
                const newLikes = prev.filter(id => id != userId)
                return newLikes
            })
        }
        else {
            setLikes(prev => [...prev, userId])
        }
        const url = `http://localhost:5000/like/${tweet._id}${tweet.replyOf ? `?replyOf=${tweet.replyOf}` : ''}`
        fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) }).then(() => {
        }).catch(err => {
            console.log(err)
            if (!isLiked) {
                setLikes(prev => {
                    const newLikes = prev.filter(id => id != userId)
                    return newLikes
                })
            }
            else {
                setLikes(prev => [...prev, userId])
            }
            showAlert('Something went wrong', 'danger')
        })
    }
    return (
        <>
            <div className='p-6 cursor-pointer hover:bg-gray-100 relative '>
                <div onClick={openTweet}>
                    <header className='flex gap-4 items-center'>
                        <div >
                            <img className='rounded-full w-12' src={tweet.user.avatarUrl} alt={tweet.user.name} />
                        </div>

                        <div className='flex items-center gap-1 cursor-pointer'>
                            <h1 className='text-lg font-semibold hover:underline '>{tweet.user.name}</h1>
                            <GoVerified className='text-twitter-100 text-xl  ' />
                            <p className='text-gray-700 hover:underline '>@{tweet.user.userName}</p>
                            <TimeAgo className='text-gray-700 ml-3' date={new Date(tweet.postedOn)} />
                        </div>
                        <div onClick={(e) => { e.stopPropagation(); openOptionModal() }} className='ml-auto mr-5 cursor-pointer p-2 rounded-full hover:bg-twitter-25 bg-opacity-10 hover:text-twitter-100 transition-colors duration-300 text-xl'>
                            <BsThreeDots />
                        </div>
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
                </div>
                <footer className='p-5 px-8 flex gap-6'>
                    <div onClick={openReplyModal} className='flex gap-2 items-center text-gray-700 group hover:text-twitter-100 cursor-pointer w-fit transition-all duration-300 '>
                        <div className='text-lg  group-hover:bg-twitter-25 rounded-full p-1'><BiMessageRounded /></div>
                        <span className='text-sm '>{tweet.replyCount}</span>
                    </div>
                    <div className='flex gap-2 items-center text-gray-700 group hover:text-green-600 cursor-pointer w-fit transition-all duration-300 '>
                        <div className='text-lg  group-hover:bg-green-200  rounded-full p-1'><AiOutlineRetweet /></div>
                        <span className='text-sm'>5,780</span>
                    </div>
                    <div onClick={handleLikeTweet} className={`${isLiked ? 'text-pink-600' : 'text-gray-700'} flex gap-2 items-center  group hover:text-pink-600 cursor-pointer w-fit transition-all duration-300 `}>
                        <div className='text-lg  group-hover:bg-pink-300 rounded-full p-1'>{isLiked ? <AiFillHeart /> : <AiOutlineHeart />}</div>
                        <span className='text-sm'>{likes.length}</span>
                    </div>
                    <div className='flex gap-2 items-center text-gray-700 group hover:text-twitter-100 cursor-pointer w-fit transition-all duration-300 '>
                        <div className='text-lg  group-hover:bg-twitter-25 rounded-full p-1'><BiBarChart /></div>
                        <span className='text-sm'>12,345</span>
                    </div>
                    <div className='flex gap-2 items-center text-gray-700 group hover:text-twitter-100 cursor-pointer w-fit transition-all duration-300'>
                        <div className='text-lg  group-hover:bg-twitter-25 rounded-full p-1'><HiArrowUpTray /></div>
                        <span className='text-sm'>3,455</span>
                    </div>
                </footer>
                <SmallModal position={'right-2'} isOpen={isOptionOpen} onClose={closeOptionModal} >
                    <div className='py-2 space-y-3 '>
                        {isAdmin && <div onClick={handleDeleteTweet} className='hover:bg-gray-200 px-2 rounded flex gap-2 items-center text-red-600'><MdDelete /> Delete Tweet</div>}
                        <div className='hover:bg-gray-200 px-2 rounded flex gap-2 items-center text-twitter-100'><IoIosShareAlt /> Share Tweet</div>
                    </div>
                </SmallModal>
            </div>
            {isReplyModalOpen && <ReplyModal isOpen={isReplyModalOpen} isTweetOpen={isTweetOpen} isReply={tweet.isReply} setReplies={setReplies} closeModal={closeReplyModal} tweet={tweet} />}
        </>
    )
}

export default TweetCard