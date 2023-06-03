import React, { useState } from 'react'

import imagePlaceholder from '../../assets/image-placeholder.svg'
import { AiOutlineHeart, AiOutlineRetweet } from 'react-icons/ai'
import { BiMessageRounded, BiBarChart } from 'react-icons/bi'
import { HiArrowUpTray } from 'react-icons/hi2'
import { BsThreeDots } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'

const TweetCard = () => {
    const [imageLoaded, setImageLoaded] = useState(true)
    const handleImageError = () => {
        setImageLoaded(false)
    }

    return (
        <div className='p-6 cursor-pointer hover:bg-gray-100'>
            <header className='flex gap-4 items-center'>
                <div >
                    <img className='rounded-full' src={'https://i.pravatar.cc/50'} alt="user" />
                </div>

                <div className='flex items-center gap-1 cursor-pointer'>
                    <h1 className='text-lg font-semibold hover:underline '>Joe</h1>
                    <GoVerified className='text-twitter-100 text-xl  ' />
                    <p className='text-gray-700 hover:underline '>@joe67</p>
                    <p className='text-gray-700 ml-3'>7h ago</p>
                </div>
                <div className='ml-auto mr-5 cursor-pointer p-2 rounded-full hover:bg-twitter-25 bg-opacity-10 hover:text-twitter-100 transition-colors duration-300 text-xl'>
                    <BsThreeDots />
                </div>
            </header>
            <div className='pl-12 py-4'>
                Lorem ipsum dolor sit amet.
            </div>
            <div className='flex justify-center items-center'>
                {imageLoaded ? (
                    <img src="https://picsum.photos/600" onError={handleImageError} alt="Image" />
                ) : (
                    <img src={imagePlaceholder} alt="Placeholder image" />
                )}
            </div>
            <footer className='p-5 px-8 flex gap-6'>
                <div className='flex gap-2 items-center text-gray-700 group hover:text-twitter-100 cursor-pointer w-fit transition-all duration-300 '>
                    <div className='text-lg  group-hover:bg-twitter-25 rounded-full p-1'><BiMessageRounded /></div>
                    <span className='text-sm '>1,350</span>
                </div>
                <div className='flex gap-2 items-center text-gray-700 group hover:text-green-600 cursor-pointer w-fit transition-all duration-300 '>
                    <div className='text-lg  group-hover:bg-green-200  rounded-full p-1'><AiOutlineRetweet /></div>
                    <span className='text-sm'>5,780</span>
                </div>
                <div className='flex gap-2 items-center text-gray-700 group hover:text-pink-600 cursor-pointer w-fit transition-all duration-300 '>
                    <div className='text-lg  group-hover:bg-pink-300 rounded-full p-1'><AiOutlineHeart /></div>
                    <span className='text-sm'>4,567</span>
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
        </div>
    )
}

export default TweetCard