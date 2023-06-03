import React from 'react'

import { BsCardImage, BsEmojiSmile } from 'react-icons/bs'
import { HiOutlineGif } from 'react-icons/hi2'
import { MdOutlinePoll } from 'react-icons/md'
import { TbCalendarTime } from 'react-icons/tb'
import { IoLocationOutline } from 'react-icons/io5'
import Popup from 'reactjs-popup'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'


const TweetBox = () => {
    const [user, loading] = useAuthState(auth)
    return (
        <div className='flex p-6 border-y-2'>
            <div>
                {
                    (user && !loading) && <img className='rounded-full w-16' src={user.photoURL} alt="avatar" />
                }
            </div>
            <div className='p-3 w-full'>
                <input className='placeholder:text-2xl placeholder:text-slate-500 p-2 w-full outline-none' type="text" name="tweet-input" id="tweet-input" placeholder='What&apos;s happning?!' />
                <div className='flex justify-between border-t-[2px] mt-6 py-4 px-2  items-center'>
                    <div className='flex gap-4 text-xl text-twitter-100   '>
                        <div className=' cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-500'>
                            <Popup on={'hover'} trigger={<div><BsCardImage /></div>} position={'bottom center'}>
                                <span className='bg-slate-900 text-stone-200 rounded-md p-1 text-xs'>Image</span>
                            </Popup>
                        </div>
                        <div className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-500'>
                            <Popup on={'hover'} trigger={<div><HiOutlineGif /></div>} position={'bottom center'}>
                                <span className='bg-slate-900 text-stone-200 rounded-md p-1 text-xs'>Gif</span>
                            </Popup>
                        </div>
                        <div className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-500'>
                            <Popup on={'hover'} trigger={<div><MdOutlinePoll /></div>} position={'bottom center'}>
                                <span className='bg-slate-900 text-stone-200 rounded-md p-1 text-xs'>Poll</span>
                            </Popup>
                        </div>
                        <div className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-500'>
                            <Popup on={'hover'} trigger={<div><BsEmojiSmile /></div>} position={'bottom center'}>
                                <span className='bg-slate-900 text-stone-200 rounded-md p-1 text-xs'>Imoji</span>
                            </Popup>
                        </div>
                        <div className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-500'>
                            <Popup on={'hover'} trigger={<div><TbCalendarTime /></div>} position={'bottom center'}>
                                <span className='bg-slate-900 text-stone-200 rounded-md p-1 text-xs'>Schedule</span>
                            </Popup>
                        </div>
                        <div className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-500'>
                            <Popup on={'hover'} trigger={<div><IoLocationOutline /></div>} position={'bottom center'}>
                                <span className='bg-slate-900 text-stone-200 rounded-md p-1 text-xs'>location</span>
                            </Popup>
                        </div>
                    </div>
                    <button className='bg-twitter-100 rounded-full py-2 px-4 text-slate-200 font-semibold'>Tweet </button>
                </div>
            </div>
        </div>
    )
}

export default TweetBox