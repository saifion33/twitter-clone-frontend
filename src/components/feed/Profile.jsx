/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { FaUser } from 'react-icons/fa'
import { MdOutlineCalendarMonth } from 'react-icons/md'
import { useModal } from '../../utils/customHooks'
import Modal from '../Modal/Modal'
import ProfileEditor from '../ProfileEditor'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../Context/auth.context'
import { useAlert } from '../../Context/alert.context'
import { API_ENDPOINTS } from '../../utils/helpers'
import Loadingbar from '../Loadingbar'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { userId } = useParams()
  const { loggedInUser } = useAuth()
  const { showAlert } = useAlert()
  const getUser = (userId) => {
    setLoading(true)
    const token = JSON.parse(localStorage.getItem('token'))
    fetch(`${API_ENDPOINTS.USER.GET_USER_BY_ID.URL}/${userId}`, { headers: { 'content-type': 'application/json', 'Accept': '*/*', 'Origin': 'http://localhost:5173/', 'Authorization': `Basic ${btoa(import.meta.env.VITE_API_SECRET)} ${token}` } })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw new Error(res.status)
      })
      .then((data) => {
        setUser(data.data)
      })
      .catch((err) => { showAlert('Somthing went wrong', 'danger'); console.log(err.message) })
      .finally(() => setLoading(false))
  }
  useEffect(() => {
    if (!navigator.onLine) {
      showAlert('Check you Internet connection.')
      navigate('/')
      return
    }
    if (!loggedInUser.user) {
      navigate('/login')
      return
    }
    getUser(userId)
  }, [userId])
  const { isOpen, openModal, closeModal } = useModal()
  const isAdmin = user && user.id === loggedInUser.user.id
  return (
    <div>
      {
        (user && !loading) && <div>
          <div className='flex items-center gap-8 p-2'>
            <BiArrowBack className='text-xl' />
            <div>
              <p className='text-lg font-semibold'>{user?.name}</p>
              <p className='text-sm'>2 Tweets</p>
            </div>
          </div>
          <div className='relative'>
            {!user.bannerUrl && <div className='bg-gray-200 w-full h-44'></div>}
            {user.bannerUrl && <div className='bg-gray-200 w-full h-44'>
              <img src={user.bannerUrl} alt="banner" />
            </div>}
            <div className='border-[6px] p-1 cursor-pointer border-white bg-gray-200 rounded-full absolute -bottom-14 left-10'>
              {
                user.avatarUrl && <img className='rounded-full' src={user.avatarUrl} alt="user avatar" />
              }
              {
                !user.avatarUrl && <FaUser className='text-9xl rounded-full text-gray-500' />
              }
            </div>
            {
              isAdmin && <div className='float-right py-2 px-5'>
                <button onClick={openModal} className='rounded-full border-[1px] py-1 px-3 font-semibold'>Edit Profile</button>
              </div>
            }
          </div>
          <div className='mt-20 py-2 px-4'>
            <div>
              <h1 className='text-2xl font-semibold'>{user?.name}</h1>
              <p className='text-slate-600'>@{user?.userName}</p>
              {user.bio && <p className=' text-slate-600 font-semibold'>{user.bio}</p>}
            </div>
            <div className='py-3 flex gap-3 text-slate-600 items-center'>
              <MdOutlineCalendarMonth className='text-xl' />
              <p>joined {new Date(user?.joinedOn).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div className=' py-2 flex gap-4 text-slate-600 font-semibold'>
              <p onClick={() => showAlert('Comming Soon 😊')} className='cursor-pointer hover:underline'><span className='text-black'>{0}</span> following</p>
              <p onClick={() => showAlert('Comming Soon 😊')} className='cursor-pointer hover:underline'><span className='text-black'>{0}</span> follower</p>
            </div>
          </div>
          <Modal isOpen={isOpen} onClose={closeModal} >
            <ProfileEditor />
          </Modal>
        </div>
      }
      {
        loading && <div className='w-full h-full flex justify-center items-center'>
          <Loadingbar />
        </div>
      }
    </div>

  )


}

export default Profile