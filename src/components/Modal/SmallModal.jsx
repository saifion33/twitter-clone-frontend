/* eslint-disable react/prop-types */
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

const SmallModal = ({ isOpen, onClose, children }) => {

    return (
        isOpen && <div className='absolute top-0 bg-white rounded-md p-2  shadow-md w-fit'>
            <div className='p-1 flex justify-end cursor-pointer border-b '>
                <AiOutlineClose className='text-sm' onClick={onClose} />
            </div>
            {children}
        </div>
    )
}

export default SmallModal