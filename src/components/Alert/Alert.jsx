import React from 'react'
import { createPortal } from 'react-dom'
import { useAlert } from '../../Context/alert.context'

const Alert = () => {
    const { isAlert, alertType, alertMessage } = useAlert()
    const AlertBody = <div className='absolute top-0 left-0 flex justify-center items-center w-full py-5'><div className={` ${alertType == 'success' ? 'bg-green-600 border-green-700' : alertType == 'info' ? 'bg-twitter-100 z-40 border-twitter-100' : alertType == 'danger' ? 'bg-red-600 border-red-700' : ''} border-2 text-white bg-opacity-80 text-lg rounded-md p-2`}>{alertMessage}</div></div>
    return (
        isAlert && createPortal(AlertBody, document.body)
    )
}

export default Alert