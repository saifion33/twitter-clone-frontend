import React from 'react'
import { useAuth } from '../../Context/auth.context'
import { BiArrowBack } from 'react-icons/bi'
import { FaUser } from 'react-icons/fa'
import { MdOutlineCalendarMonth } from 'react-icons/md'
import { useModal } from '../../utils/customHooks'
import Modal from '../Modal/Modal'
import ProfileEditor from '../ProfileEditor'

const Profile = () => {
  const { loggedInUser } = useAuth()
  const { isOpen, openModal, closeModal } = useModal()
  if (loggedInUser.user) {
    return (
      <div>
        <div className='flex items-center gap-8 p-2'>
          <BiArrowBack className='text-xl' />
          <div>
            <p className='text-lg font-semibold'>{loggedInUser?.user?.name}</p>
            <p className='text-sm'>2 Tweets</p>
          </div>
        </div>
        <div className='relative'>
          <div className='bg-gray-200 w-full h-44'>
          </div>
          <div className='border-[6px] p-1 cursor-pointer border-white bg-gray-200 rounded-full absolute -bottom-14 left-10'>
            {
              loggedInUser.user.avatarUrl && <img className='rounded-full' src={loggedInUser.user.avatarUrl} alt="user avatar" />
            }
            {
              !loggedInUser.user.avatarUrl && <FaUser className='text-9xl rounded-full text-gray-500' />
            }
          </div>
          <div className='float-right py-2 px-5'>
            <button onClick={openModal} className='rounded-full border-[1px] py-1 px-3 font-semibold'>Edit Profile</button>
          </div>
        </div>
        <div className='mt-20 py-2 px-4'>
          <div>
            <h1 className='text-2xl font-semibold'>{loggedInUser?.user?.name}</h1>
            <p className='text-slate-600'>@{loggedInUser?.user?.userName}</p>
          </div>
          <div className='py-3 flex gap-3 text-slate-600 items-center'>
            <MdOutlineCalendarMonth className='text-xl' />
            <p>joined {new Date(loggedInUser?.user?.joinedOn).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className=' py-2 flex gap-4 text-slate-600 font-semibold'>
            <p className='cursor-pointer hover:underline'><span className='text-black'>{4}</span> following</p>
            <p className='cursor-pointer hover:underline'><span className='text-black'>{0}</span> follower</p>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={closeModal} >
          <ProfileEditor />
        </Modal>
      </div>
    )
  }

}

export default Profile