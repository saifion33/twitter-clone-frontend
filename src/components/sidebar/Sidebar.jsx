import React from 'react'
import { BiHomeCircle } from 'react-icons/bi'
import { FaHashtag, FaRegUser, FaTwitter, FaUser } from 'react-icons/fa'
import { IoNotificationsOutline } from 'react-icons/io5'
import { HiOutlineDotsCircleHorizontal, HiDotsHorizontal } from 'react-icons/hi'
import { HiOutlineEnvelope, } from 'react-icons/hi2'
import { RiFileListLine, RiBookmarkLine } from 'react-icons/ri'

import CustomNavLink from '../CustomNavLink'
const Sidebar = () => {
    const user = {
        name: 'Raja',
        id: 'raja456'
    }
    return (
        <div className='sidebar py-4 pl-24 pr-3 w-1/4 space-y-1 overflow-y-scroll max-h-screen'>
            <div className='p-4'>
                <FaTwitter className='text-[--twitter-color] text-3xl cursor-pointer' />
            </div>
            <CustomNavLink active to={'/'}><BiHomeCircle />Home</CustomNavLink>
            <CustomNavLink to={'/explore'}><FaHashtag />Expore</CustomNavLink>
            <CustomNavLink to={'/notifications'}><IoNotificationsOutline />Notifications</CustomNavLink>
            <CustomNavLink to={'/messages'}><HiOutlineEnvelope />Messages</CustomNavLink>
            <CustomNavLink to={'/lists'}><RiFileListLine />Lists</CustomNavLink>
            <CustomNavLink to={'/bookmarks'}><RiBookmarkLine />Bookmarks</CustomNavLink>
            <CustomNavLink to={'/profile'}><FaRegUser />Profile</CustomNavLink>
            <CustomNavLink to={'/more'}><HiOutlineDotsCircleHorizontal />More</CustomNavLink>
            <div className='tweet-button-container text-center p-4'>
                <button className='bg-[--twitter-color] w-full py-2 px-4 rounded-full text-xl text-white font-semibold hover:bg-sky-600'>Tweet</button>
            </div>
            <div role='button' className='user-profile-button-container flex items-center rounded-full hover:bg-gray-200 p-3 justify-between cursor-pointer'>
                <FaUser className='text-4xl text-[#657786] bg-gray-300 rounded-full p-1' />
                <div className='pl-3'>
                    <p>{user.name}</p>
                    <p className='text-slate-600'>@{user.id}</p>
                </div>
                <HiDotsHorizontal className='text-2xl ml-auto' />
            </div>
        </div>
    )
}

export default Sidebar