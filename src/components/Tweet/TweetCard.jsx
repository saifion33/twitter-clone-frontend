/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import TimeAgo from 'react-timeago'
import imagePlaceholder from '../../assets/image-placeholder.svg'
import { AiOutlineHeart, AiOutlineRetweet } from 'react-icons/ai'
import { BiMessageRounded, BiBarChart } from 'react-icons/bi'
import { HiArrowUpTray } from 'react-icons/hi2'
import { BsThreeDots } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'
import { useModal } from '../../utils/customHooks'
import ReplyModal from './ReplyModal'

const TweetCard = ({ tweet }) => {
    const [imageLoaded, setImageLoaded] = useState(true)
    const { isOpen: isReplyModalOpen, openModal: openReplyModal, closeModal: closeReplyModal } = useModal()
    const handleImageError = () => {
        setImageLoaded(false)
    }

    return (
        <>
            <div className='p-6 cursor-pointer hover:bg-gray-100'>
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
                    <div className='ml-auto mr-5 cursor-pointer p-2 rounded-full hover:bg-twitter-25 bg-opacity-10 hover:text-twitter-100 transition-colors duration-300 text-xl'>
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
                <footer className='p-5 px-8 flex gap-6'>
                    <div onClick={openReplyModal} className='flex gap-2 items-center text-gray-700 group hover:text-twitter-100 cursor-pointer w-fit transition-all duration-300 '>
                        <div className='text-lg  group-hover:bg-twitter-25 rounded-full p-1'><BiMessageRounded /></div>
                        <span className='text-sm '>{tweet.reply.length}</span>
                    </div>
                    <div className='flex gap-2 items-center text-gray-700 group hover:text-green-600 cursor-pointer w-fit transition-all duration-300 '>
                        <div className='text-lg  group-hover:bg-green-200  rounded-full p-1'><AiOutlineRetweet /></div>
                        <span className='text-sm'>5,780</span>
                    </div>
                    <div className='flex gap-2 items-center text-gray-700 group hover:text-pink-600 cursor-pointer w-fit transition-all duration-300 '>
                        <div className='text-lg  group-hover:bg-pink-300 rounded-full p-1'><AiOutlineHeart /></div>
                        <span className='text-sm'>{tweet.likes.length}</span>
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
                <div className={`hidden`}>

                </div>
            </div>
            <ReplyModal isOpen={isReplyModalOpen} closeModal={closeReplyModal} tweet={tweet} />
        </>
    )
}

export default TweetCard