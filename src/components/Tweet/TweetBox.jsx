import React, { useState } from 'react'

import { BsCardImage, BsEmojiSmile } from 'react-icons/bs'
import { HiOutlineGif } from 'react-icons/hi2'
import { MdOutlinePoll } from 'react-icons/md'
import { TbCalendarTime } from 'react-icons/tb'
import { IoLocationOutline } from 'react-icons/io5'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'
import Popover from '../Popover'

const MAX_FILE_SIZE = 1024 * 1024 * 2

const TweetBox = () => {
    const [user, loading] = useAuthState(auth)
    const [tweet, setTweet] = useState('')
    const handleChange = (e) => {
        setTweet(e.target.value)
    }
    const handleFileSelect = (e) => {

        const image = e.target.files[0]

        if (image.size > MAX_FILE_SIZE) {
            console.log('Please select a file less than 2MB')
            return
        }
        console.log(MAX_FILE_SIZE, image)
    }
    return (
        <div className='flex p-6 border-y-2'>
            <div>
                {
                    (user && !loading) && <img className='rounded-full w-16' src={user.photoURL} alt="avatar" />
                }
            </div>
            <div className='p-3 w-full'>
                <input onChange={handleChange} value={tweet} className='placeholder:text-2xl placeholder:text-slate-500 p-2 w-full outline-none' type="text" name="tweet-input" id="tweet-input" placeholder='What&apos;s happning?!' />
                <div className='flex justify-between border-t-[2px] mt-6 py-4 px-2  items-center'>
                    <div className='flex gap-4 text-xl text-twitter-100   '>
                        <div className=' cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                            <Popover message={'image'}>
                                <label className='cursor-pointer' htmlFor="fileInput"><BsCardImage /></label>
                                <input className='hidden' type="file" name="fileInput" onChange={handleFileSelect} accept='image/*' id="fileInput" />
                            </Popover>
                        </div>
                        <div className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                            <Popover message={'gif'}>
                                <HiOutlineGif />
                            </Popover>
                        </div>
                        <div className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                            <Popover message={'poll'}>
                                <MdOutlinePoll />
                            </Popover>
                        </div>
                        <div className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                            <Popover message={'emoji'}>
                                <BsEmojiSmile />
                            </Popover>
                        </div>
                        <div className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                            <Popover message={'schedule'}>
                                <TbCalendarTime />
                            </Popover>
                        </div>
                        <div className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                            <Popover message={'location'}>
                                <IoLocationOutline />
                            </Popover>
                        </div>
                    </div>
                    <button disabled={tweet.length < 1} className='bg-twitter-100 rounded-full py-2 px-4 text-slate-200 disabled:bg-gray-500 font-semibold'>Tweet </button>
                </div>
            </div>
        </div>
    )
}

export default TweetBox