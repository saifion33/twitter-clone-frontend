import React, { useRef, useState } from 'react'
import { useAuth } from '../Context/auth.context'
import { useUploadFile } from 'react-firebase-hooks/storage'
import AvatarEditor from 'react-avatar-editor'
import { FaUser } from 'react-icons/fa'
import { TbCameraPlus } from 'react-icons/tb'
import { useFormik } from 'formik'
import { AiFillCloseCircle } from 'react-icons/ai'
import { getDownloadURL, ref } from 'firebase/storage'
import { storage } from '../firebase/firebase'

const ProfileEditor = () => {
  const { loggedInUser, setLoggedInUser } = useAuth();
  const bannerRef = useRef(null);
  const avatarRef = useRef(null);
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [slectedAvatar, setSlectedAvatar] = useState(null)

  const [uploadFile, uploading, snapshot, error] = useUploadFile();

  const handleBannerSelect = (e) => {
    setSelectedBanner(e.target.files[0])
  }
  const getImageBlob = async (editorRef) => {
    return new Promise((resolve, reject) => {
      const canvas = editorRef.current.getImageScaledToCanvas()
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob)
        }
        else {
          reject(new Error('cant process file'));
        }
      })
    })

  }
  const handleSubmit = async (values) => {
    const update = {}
    const bannerImage = selectedBanner ? await getImageBlob(bannerRef) : null;
    const avatarImage = slectedAvatar ? await getImageBlob(avatarRef) : null;

    if (bannerImage) {
      const file = await uploadFile(ref(storage, `Users/${loggedInUser.user.id}/banner/bannerImage`), bannerImage)
      const bannerUrl = await getDownloadURL(file.ref)
      update.bannerUrl = bannerUrl
    }
    if (avatarImage) {
      const file = await uploadFile(ref(storage, `User/${loggedInUser.user.id}/avatar/avatarImage`), avatarImage)
      const avatarUrl = await getDownloadURL(file.ref)
      update.avatarUrl = avatarUrl
    }

    if (values.name !== formik.initialValues.name) {
      update.name = values.name
    }
    if (values.bio !== formik.initialValues.bio) {
      update.bio = values.bio
    }
    if (values.location !== formik.initialValues.location) {
      update.location = values.location
    }

    fetch(`http://localhost:5000/updateUser`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'rajadevid999@gmail.com', update }) })
      .then(res => res.json())
      .then(res =>
        setLoggedInUser(prev => {
          const updatedUser = { ...prev, user: res.data }
          localStorage.setItem('loggedInUser', JSON.stringify(updatedUser))
          return updatedUser
        })
      )
      .catch(err => console.error(err))

  }
  const handleSelectedAvatar = (e) => {
    setSlectedAvatar(e.target.files[0])
  }
  const validate = (values) => {
    const errors = {}
    if (!values.name) {
      errors.name = 'Name is required'
    }
    if (!values.bio) {
      errors.bio = 'bio is required'
    }
    if (!values.location) {
      errors.location = 'Location is required'
    }
    return errors
  }
  const formik = useFormik({
    initialValues: {
      name: loggedInUser.user.name,
      bio: loggedInUser.user.bio || '',
      location: loggedInUser.user.location || ''
    }, validate, onSubmit: handleSubmit
  })
  return (
    <div className=''>
      <header className='flex justify-between py-3 px-2 '>
        <p className='text-lg font-semibold'>Edit Profile</p>
        <button type='submit' onClick={formik.handleSubmit} className='bg-black text-white rounded-full px-3 text-lg'>Save</button>
      </header>
      <section >
        <div className='relative'>
          <div className='bg-gray-200 w-full h-44 flex justify-center items-center'>
            <div className='relative flex justify-center items-center '>
              <div className='absolute flex items-center gap-5'>
                <div className='p-2 rounded-full bg-black bg-opacity-50 cursor-pointer '>
                  <label className='cursor-pointer' htmlFor="profile-banner"><TbCameraPlus className='text-xl text-white' /></label>
                  <input className='hidden' onChange={handleBannerSelect} type="file" name="profile-banner" id="profile-banner" />
                </div>
                {selectedBanner && <AiFillCloseCircle onClick={() => setSelectedBanner(null)} className=' bg-white rounded-full text-gray-700 text-3xl cursor-pointer' />}
              </div>
              {(!selectedBanner && loggedInUser.user.bannerUrl) && <img src={loggedInUser.user.bannerUrl} alt='banner' />}
              {selectedBanner && <AvatarEditor ref={bannerRef} border={1} height={176} width={575} image={selectedBanner} scale={1} />}
            </div>
          </div>
          <div className='border-[6px] flex justify-center items-center p-1 cursor-pointer border-white bg-gray-200 rounded-full absolute -bottom-14 left-10'>
            {
              (loggedInUser.user.avatarUrl && !slectedAvatar) && <img className='rounded-full' src={loggedInUser.user.avatarUrl} alt="user avatar" />
            }
            {
              (!loggedInUser.user.avatarUrl && !slectedAvatar) && <FaUser className='text-9xl rounded-full text-gray-500' />
            }
            {
              slectedAvatar && < AvatarEditor ref={avatarRef} className='rounded-full' border={1} height={96} width={96} image={slectedAvatar} scale={1.3} />
            }
            <div className='absolute cursor-pointer bg-black  bg-opacity-50 rounded-full p-2'>
              <label className='cursor-pointer' htmlFor="profile-photo"><TbCameraPlus className='text-white' /></label>
              <input onChange={handleSelectedAvatar} className='hidden' type="file" name="profile-photo" id="profile-photo" />
            </div>
          </div>
        </div>
        <div className='mt-12 p-3 h-72 overflow-y-auto'>
          <form action="#" onSubmit={formik.handleSubmit} className='w-full space-y-3'>
            <input value={formik.values.name} id='name' onChange={formik.handleChange} type="text" className='w-full border-[1px] p-3 rounded-sm' placeholder='Name' />
            {formik.errors.name && <p className='text-xs text-red-600'>{formik.errors.name}</p>}
            <textarea value={formik.values.bio} id='bio' onChange={formik.handleChange} maxLength={160} className='w-full border-[1px] p-3 rounded-sm' placeholder='Bio ' name="bio" cols="30" rows="3"></textarea>
            {formik.errors.bio && <p className='text-xs text-red-600'>{formik.errors.bio}</p>}
            <input value={formik.values.location} id='location' onChange={formik.handleChange} type="text" className='w-full border-[1px] p-3 rounded-sm' placeholder='Location' />
            {formik.errors.location && <p className='text-xs text-red-600'>{formik.errors.location}</p>}
          </form>
        </div>

      </section>
    </div>
  )
}

export default ProfileEditor