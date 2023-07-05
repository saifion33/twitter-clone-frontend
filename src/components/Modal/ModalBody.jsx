/* eslint-disable react/prop-types */
import React from 'react'
import { GrClose, GrTwitter } from 'react-icons/gr'
const ModalBody = ({ onClose, children }) => {
    return (
        <div className='absolute z-30 top-0 left-0 w-full h-full bg-black bg-opacity-60 text-xl flex justify-center  items-center'>
            <div className={`bg-white  rounded-lg min-w-[500px] max-w-2xl `}>
                <div className='p-4 flex '>
                    <div className='cursor-pointer hover:bg-gray-200 p-2 rounded-full' onClick={onClose}>
                        <GrClose className='text-xl ' />
                    </div>
                    <GrTwitter className='text-twitter-100 text-4xl mx-auto' />
                </div>
                <div className=' max-h-[70vh] overflow-y-auto'>
                    {children}
                </div>
            </div>

        </div>
    )
}

export default ModalBody