import React from 'react'

import { HiOutlineDotsCircleHorizontal, HiDotsHorizontal } from 'react-icons/hi'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { FaHashtag, FaRegUser, FaTwitter } from 'react-icons/fa'
import { RiFileListLine, RiBookmarkLine } from 'react-icons/ri'
import { IoNotificationsOutline } from 'react-icons/io5'
import { useAuth } from '../../Context/auth.context'
import { HiOutlineEnvelope, } from 'react-icons/hi2'
import { useModal } from '../../utils/customHooks'
import { AiOutlineSetting } from 'react-icons/ai'
import { auth, storage } from '../../firebase/firebase'
import { BiHomeCircle } from 'react-icons/bi'
import CustomNavLink from '../CustomNavLink'
import SmallModal from '../Modal/SmallModal'
import Loadingbar from '../Loadingbar'
import { useAlert } from '../../Context/alert.context'
import { useNavigate } from 'react-router-dom'
import Modal from '../Modal/Modal'
import TweetBox from '../Tweet/TweetBox'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { getDownloadURL, ref } from 'firebase/storage'
import { useTweets } from '../../Context/tweet.context'
import { API_ENDPOINTS } from '../../utils/helpers'



const Sidebar = () => {
    const [signOut] = useSignOut(auth)
    const [user, loading, error] = useAuthState(auth)
    const [uploadImage] = useUploadFile(auth)
    const { loggedInUser, setLoggedInUser } = useAuth()
    const { isOpen, openModal, closeModal } = useModal()
    const { isOpen: isTweetModalOpen, openModal: openTweetModal, closeModal: closeTweetModal } = useModal()
    const { showAlert } = useAlert()
    const { pushTweet } = useTweets()
    const navigate = useNavigate()
    const handleSignOut = () => {
        if (!navigator.onLine) {
            showAlert('Please check your Internet connection.')
            return
        }
        signOut().then(() => {
            localStorage.setItem('loggedInUser', JSON.stringify({ user: null, loading: false, error: null }))
            setLoggedInUser({ user: null, loading: false, error: null })
            showAlert('Signout successfully .', 'danger')
            closeModal()
            navigate('/')
        })
    }
    const handleImageUpload = async (image) => {
        try {
            const result = await uploadImage(ref(storage, `/images/${user.uid}/${Date.now() + image.name}`), image, { cacheControl: `public , max-age=${3600 * 24 * 3}` });
            const downloadurl = await getDownloadURL(result.ref)
            return downloadurl
        } catch (error) {
            console.log(error)
            return null
        }
    }
    const handleTweet = async (tweet, imageUrl, user) => {
        const token = JSON.parse(localStorage.getItem('token'));
        try {
            const response = await fetch(API_ENDPOINTS.TWEET.POST_TWEET.URL, { method: API_ENDPOINTS.TWEET.POST_TWEET.METHOD, headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${btoa(import.meta.env.VITE_API_SECRET)} ${token}` }, body: JSON.stringify({ tweet, imageUrl, user }) })
            if (response.status === 401) {
                signOut().then(() => {
                    navigate('/login')
                })
                return
            }
            const newTweet = await response.json()
            pushTweet(newTweet.data)
            closeTweetModal()
        } catch (error) {
            console.log(error)
            closeTweetModal()
        }

    }
    return (

        <div className='sidebar py-4 pl-24 pr-3 w-1/4 space-y-1 overflow-y-scroll max-h-screen'>

            <div className='p-4'>
                <FaTwitter onClick={() => navigate('/')} className='text-twitter-100 text-3xl cursor-pointer' />
            </div>
            {(user && !loading) && <CustomNavLink active to={'/'}><BiHomeCircle />Home</CustomNavLink>}
            <CustomNavLink to={'/explore'}><FaHashtag />Expore</CustomNavLink>
            {(!user && !loading) && <CustomNavLink to={'/setting'} ><AiOutlineSetting />Setting</CustomNavLink>}

            {(user && !loading) && <div className='space-y-1'>
                <CustomNavLink to={'/notifications'}><IoNotificationsOutline />Notifications</CustomNavLink>
                <CustomNavLink to={'/messages'}><HiOutlineEnvelope />Messages</CustomNavLink>
                <CustomNavLink to={'/lists'}><RiFileListLine />Lists</CustomNavLink>
                <CustomNavLink to={'/bookmarks'}><RiBookmarkLine />Bookmarks</CustomNavLink>
                <CustomNavLink to={`/profile/${loggedInUser.user && loggedInUser.user.id}`}><FaRegUser />Profile</CustomNavLink>
                <CustomNavLink to={'/more'}><HiOutlineDotsCircleHorizontal />More</CustomNavLink></div>}
            {
                (user && !loading) && <div className='tweet-button-container text-center p-4'>
                    <button onClick={openTweetModal} className='bg-twitter-100 w-full py-2 px-4 rounded-full text-xl text-white font-semibold hover:bg-sky-600'>Tweet</button>
                    <Modal isOpen={isTweetModalOpen} onClose={closeTweetModal} height={'40%'} >
                        <TweetBox id={'sidebar-tweetbox'} buttonText={'Tweet'} placeholder={"What's happning! "} handleImageUpload={handleImageUpload} handleSubmit={handleTweet} />
                    </Modal>
                </div>
            }

            {
                (loggedInUser.user && !loggedInUser.loading) && <div role='button' className='user-profile-button-container relative flex items-center rounded-full hover:bg-gray-200 p-3 justify-between cursor-pointer'>
                    <img className='w-10 rounded-full' src={loggedInUser.user?.avatarUrl} alt={loggedInUser.user.name} />
                    <div className='pl-3'>
                        {loggedInUser.user && <p>{loggedInUser.user.name}</p>}
                        {loggedInUser.user && <p className='text-slate-600'>@{loggedInUser?.user?.userName}</p>}
                    </div>
                    <HiDotsHorizontal className='text-2xl ml-auto' onClick={openModal} />
                    <SmallModal isOpen={isOpen} onClose={closeModal} position={'-top-10'} >
                        <div className='text-base p-4'>
                            <button onClick={handleSignOut} className='bg-twitter-100 rounded-full text-white py-1 px-3 hover:bg-twitter-75 '>logOut {loggedInUser.user.name}</button>
                        </div>
                    </SmallModal>

                </div>
            }

            {
                (!loading && error) && <div>
                    {error.message}
                </div>
            }

            {
                loading && <div className='flex justify-center w-full h-full items-center'>
                    <Loadingbar />
                </div>
            }

        </div >
    )
}

export default Sidebar