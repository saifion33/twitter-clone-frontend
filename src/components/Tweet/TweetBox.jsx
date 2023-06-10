import React, { useState } from 'react'

import { BsCardImage, BsEmojiSmile } from 'react-icons/bs'
import { HiOutlineGif } from 'react-icons/hi2'
import { MdOutlinePoll, MdOutlineClose } from 'react-icons/md'
import { TbCalendarTime } from 'react-icons/tb'
import { IoLocationOutline } from 'react-icons/io5'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, storage } from '../../firebase/firebase'
import Popover from '../Popover'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { getDownloadURL, ref } from 'firebase/storage'
import Loadingbar from '../Loadingbar'

const MAX_FILE_SIZE = 1024 * 1024 * 2

const TweetBox = () => {
    const [user, loading] = useAuthState(auth)
    const [uploadImage] = useUploadFile(auth)
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null)
    const [tweet, setTweet] = useState('')
    const [tweetPosting, setTweetPosting] = useState(false)
    const [renderImage, setRenderImage] = useState(null)
    const [image, setImage] = useState(null)
    const handleChange = (e) => {
        setTweet(e.target.value)
    }
    const handleFileSelect = (e) => {

        const selectedImage = e.target.files[0]
        setImage(selectedImage)

        if (selectedImage.size > MAX_FILE_SIZE) {
            setImage(null)
            console.log('Please select a file less than 2MB')
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

    const handleImageUpload = async () => {
        try {
            const result = await uploadImage(ref(storage, `/images/${user.uid}/${Date.now() + image.name}`), image, { cacheControl: `public , max-age=${3600 * 24 * 3}` });
            const downloadurl = await getDownloadURL(result.ref)
            setUploadedImageUrl(downloadurl)
        } catch (error) {
            console.log(error)
        }
    }

    const handleTweet = async () => {
        setTweetPosting(true)
        const baseUrl = 'http://localhost:5000'
        if (image) {
            handleImageUpload().then(() => {
                fetch(`${baseUrl}/tweet`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tweet, imageUrl: uploadedImageUrl, userId: user.uid }) })
                    .then(res => res.json()).then(data => { console.log(data) }).catch(err => console.log(err))
            }).catch((err) => console.log(err)).finally(() => setTweetPosting(false));
        }
        else {
            fetch(`${baseUrl}/tweet`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tweet, imageUrl: null, userId: user.uid }) })
                .then((res => res.json())).then(data => console.log(data)).catch(err => console.log(err)).finally(() => setTweetPosting(false));
        }
    }

    return (
        <div className='p-6 border-y-2'>
            {
                !tweetPosting && <div className='flex'>
                    <div>
                        {
                            (user && !loading) && <img className='rounded-full w-16' src={user.photoURL} alt="avatar" />
                        }
                    </div>
                    <div className='p-3 w-full'>
                        <input onChange={handleChange} value={tweet} className='placeholder:text-xl placeholder:text-slate-500 p-2 w-full outline-none' type="text" name="tweet-input" id="tweet-input" placeholder='What&apos;s happning?!' />
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
                            <button onClick={() => { handleTweet() }} disabled={tweet.length < 1} className='bg-twitter-100 rounded-full py-2 px-4 text-slate-200 disabled:bg-gray-500 font-semibold'>Tweet </button>
                        </div>
                    </div>
                </div>
            }
            {
                (image && !tweetPosting) && <div className='relative'>
                    <div onClick={() => { setImage(null) }} className='absolute top-5 left-5 text-3xl p-2 rounded-full bg-gray-200 cursor-pointer hover:text-red-600 hover:bg-gray-100'>
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