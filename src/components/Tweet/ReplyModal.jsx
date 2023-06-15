/* eslint-disable react/prop-types */
import React from 'react'
import Modal from '../Modal/Modal'
import TimeAgo from 'react-timeago'
import { GoVerified } from 'react-icons/go'
import TweetBox from './TweetBox'

const ReplyModal = ({isOpen,closeModal,tweet}) => {

  return (
      <Modal isOpen={isOpen} onClose={closeModal} >
          <header className='flex px-5 py-2 gap-4 items-center text-base'>
              <div >
                  <img className='rounded-full w-12' src={tweet.user.avatarUrl} alt={tweet.user.name} />
              </div>

              <div className='flex items-center gap-1 cursor-pointer'>
                  <h1 className='text-lg font-semibold hover:underline '>{tweet.user.name}</h1>
                  <GoVerified className='text-twitter-100 text-xl  ' />
                  <p className='text-gray-700 hover:underline '>@{tweet.user.userName}</p>
                  <TimeAgo className='text-gray-700 ml-3' date={new Date(tweet.postedOn)} />
              </div>
          </header>
          <div className='px-12 py-2'>
              <div className='border-l-2 px-5 text-base'>
                  {tweet.tweet}
                  <p className='text-gray-400'>Replying to <span className='text-twitter-100 cursor-pointer'>@{tweet.user.userName}</span></p>
              </div>
          </div>
          <div>
              <TweetBox buttonText={'Reply'} placeholder={'Tweet your Reply! '} />
          </div>
      </Modal>
  )
}

export default ReplyModal