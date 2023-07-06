/* eslint-disable react/prop-types */
import React, { useState } from 'react'

import { MdOutlinePoll, MdOutlineClose } from 'react-icons/md'
import { BsCardImage, BsEmojiSmile } from 'react-icons/bs'
import { IoLocationOutline } from 'react-icons/io5'
import { TbCalendarTime } from 'react-icons/tb'
import { HiOutlineGif } from 'react-icons/hi2'

import { useAlert } from '../../Context/alert.context'
import { useAuth } from '../../Context/auth.context'
import Loadingbar from '../Loadingbar'
import Popover from '../Popover'
import { useNavigate } from 'react-router-dom'

const MAX_FILE_SIZE = 1024 * 1024 * 2  //Max file size 2MB

const TweetBox = ({ placeholder, buttonText, handleImageUpload, handleSubmit, id }) => {
    const [tweet, setTweet] = useState('')
    const [tweetPosting, setTweetPosting] = useState(false)
    const [renderImage, setRenderImage] = useState(null)
    const navigate = useNavigate()
    const [image, setImage] = useState(null)
    const { loggedInUser } = useAuth()
    const { showAlert } = useAlert()


    const handleChange = (e) => {
        setTweet(e.target.value)
    }

    const reset = () => {
        setTweetPosting(false)
        setTweet('')
        setImage(null)
        setRenderImage(null)
    }

    const handleFileSelect = (e) => {
        const selectedImage = e.target.files[0]
        setImage(selectedImage)
        if (selectedImage.size > MAX_FILE_SIZE) {
            setImage(null)
            console.log('Please select a file less than 2MB.')
            return
        }
        const reader = new FileReader();

        reader.onload = () => {
            setRenderImage(reader.result);
        };

        if (selectedImage) {
            reader.readAsDataURL(selectedImage);
        }

    }

    const handleTweet = async () => {
        if (!navigator.onLine) {
            showAlert('Please check your Internet connection.')
            return
        }
        if (!loggedInUser.user) {
            navigate('/login')
            return
        }
        setTweetPosting(true)
        if (image) {
            // First upload the image and get image url then post tweet to database
            handleImageUpload(image).then(async (imageUrl) => {
                handleSubmit(tweet, imageUrl, loggedInUser.user).finally(() => reset());
            })
        }
        else {

            // Post tweet to database
            handleSubmit(tweet, null, loggedInUser.user).finally(() => reset());
        }

    }

    return (
        <div className='p-6 border-y-2'>
            {
                !tweetPosting && <div className='flex'>
                    <div>
                        {
                            (loggedInUser.user && !loggedInUser.loading) && <img className='rounded-full w-16' src={loggedInUser.user.avatarUrl} alt="avatar" />
                        }
                    </div>
                    <div className='p-3 w-full'>
                        <input onChange={handleChange} value={tweet} className='placeholder:text-xl placeholder:text-slate-500 p-2 w-full outline-none' type="text" name="tweet-input" id="tweet-input" placeholder={placeholder} />
                        <div className='flex justify-between border-t-[2px] mt-6 py-4 px-2  items-center'>
                            <div className='flex gap-4 text-xl text-twitter-100   '>
                                <div className=' cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                                    <Popover message={'image'}>
                                        <label className='cursor-pointer' htmlFor={id}><BsCardImage /></label>
                                        <input className='hidden' type="file" name="fileInput" onChange={handleFileSelect} accept='image/*' id={id} />
                                    </Popover>
                                </div>
                                <div onClick={() => showAlert('Comming Soon... 😊')} className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                                    <Popover message={'gif'}>
                                        <HiOutlineGif />
                                    </Popover>
                                </div>
                                <div onClick={() => showAlert('Comming Soon... 😊')} className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                                    <Popover message={'poll'}>
                                        <MdOutlinePoll />
                                    </Popover>
                                </div>
                                <div onClick={() => showAlert('Comming Soon... 😊')} className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                                    <Popover message={'emoji'}>
                                        <BsEmojiSmile />
                                    </Popover>
                                </div>
                                <div onClick={() => showAlert('Comming Soon... 😊')} className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                                    <Popover message={'schedule'}>
                                        <TbCalendarTime />
                                    </Popover>
                                </div>
                                <div onClick={() => showAlert('Comming Soon... 😊')} className='cursor-pointer p-2 rounded-full hover:bg-twitter-25 transition-colors duration-300'>
                                    <Popover message={'location'}>
                                        <IoLocationOutline />
                                    </Popover>
                                </div>
                            </div>
                            <button onClick={() =>{handleTweet()}} disabled={tweet.length < 1} className='bg-twitter-100 rounded-full py-2 px-4 text-slate-200 disabled:bg-gray-500 font-semibold'>{buttonText}</button>
                        </div>
                    </div>
                </div>
            }
            {
                (image && !tweetPosting) && <div className='relative'>
                    <div onClick={() => { setImage(null); setRenderImage(null) }} className='absolute top-5 left-5 text-3xl p-2 rounded-full bg-gray-200 cursor-pointer hover:text-red-600 hover:bg-gray-100'>
                        <MdOutlineClose />
                    </div>
                    <img className='' src={renderImage} alt="user selected image" />
                </div>
            }
            {
                tweetPosting && <Loadingbar />
            }
        </div>
    )
}

export default TweetBox