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
import { auth } from '../../firebase/firebase'
import { BiHomeCircle } from 'react-icons/bi'
import CustomNavLink from '../CustomNavLink'
import SmallModal from '../Modal/SmallModal'
import Loadingbar from '../Loadingbar'
import { useAlert } from '../../Context/alert.context'



const Sidebar = () => {
    const [signOut] = useSignOut(auth)
    const [user, loading, error] = useAuthState(auth)
    const { loggedInUser, setLoggedInUser } = useAuth()
    const { isOpen, openModal, closeModal } = useModal()
    const { showAlert } = useAlert()
    const handleSignOut = () => {
        signOut().then(() => {
            localStorage.setItem('loggedInUser', JSON.stringify({ user: null, loading: false, error: null }))
            setLoggedInUser({ user: null, loading: false, error: null })
            showAlert('Signout successfully .', 'danger')
            closeModal()
        })
    }
    return (

        <div className='sidebar py-4 pl-24 pr-3 w-1/4 space-y-1 overflow-y-scroll max-h-screen'>

            <div className='p-4'>
                <FaTwitter className='text-twitter-100 text-3xl cursor-pointer' />
            </div>
            {(user && !loading) && <CustomNavLink active to={'/'}><BiHomeCircle />Home</CustomNavLink>}
            <CustomNavLink to={'/explore'}><FaHashtag />Expore</CustomNavLink>
            {(!user && !loading) && <CustomNavLink to={'/setting'} ><AiOutlineSetting />Setting</CustomNavLink>}

            {(user && !loading) && <div className='space-y-1'>
                <CustomNavLink to={'/notifications'}><IoNotificationsOutline />Notifications</CustomNavLink>
                <CustomNavLink to={'/messages'}><HiOutlineEnvelope />Messages</CustomNavLink>
                <CustomNavLink to={'/lists'}><RiFileListLine />Lists</CustomNavLink>
                <CustomNavLink to={'/bookmarks'}><RiBookmarkLine />Bookmarks</CustomNavLink>
                <CustomNavLink active to={'/profile'}><FaRegUser />Profile</CustomNavLink>
                <CustomNavLink active to={'/more'}><HiOutlineDotsCircleHorizontal />More</CustomNavLink></div>}
            {
                (user && !loading) && <div className='tweet-button-container text-center p-4'>
                    <button className='bg-twitter-100 w-full py-2 px-4 rounded-full text-xl text-white font-semibold hover:bg-sky-600'>Tweet</button>
                </div>
            }

            {
                (user && !loading) && <div role='button' className='user-profile-button-container relative flex items-center rounded-full hover:bg-gray-200 p-3 justify-between cursor-pointer'>
                    <img className='w-8 rounded-full' src={user?.photoURL} alt={user?.displayName} />
                    <div className='pl-3'>
                        <p>{user?.displayName}</p>
                        {loggedInUser.user && <p className='text-slate-600'>@{loggedInUser?.user?.userName}</p>}
                    </div>
                    <HiDotsHorizontal className='text-2xl ml-auto' onClick={openModal} />
                    <SmallModal isOpen={isOpen} onClose={closeModal} >
                        <div className='text-base p-4'>
                            <button onClick={handleSignOut} className='bg-twitter-100 rounded-full text-white py-1 px-3 hover:bg-twitter-75 '>logOut {user?.displayName}</button>
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