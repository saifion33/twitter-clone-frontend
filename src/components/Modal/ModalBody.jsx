/* eslint-disable react/prop-types */
import React from 'react'
import { GrClose, GrTwitter } from 'react-icons/gr'
const ModalBody = ({ onClose, height = '90%', children }) => {
    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-xl flex justify-center  items-center'>
            <div className={`bg-white rounded-lg w-[80%] max-w-xl h-[${height}]`}>
                <div className='p-4 flex '>
                    <div className='cursor-pointer hover:bg-gray-200 p-2 rounded-full' onClick={onClose}>
                        <GrClose className='text-xl ' />
                    </div>
                    <GrTwitter className='text-twitter-100 text-4xl mx-auto' />
                </div>
                {children}
            </div>

        </div>
    )
}

export default ModalBody