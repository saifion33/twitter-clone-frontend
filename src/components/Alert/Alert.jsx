import React from 'react'
import { createPortal } from 'react-dom'
import { useAlert } from '../../Context/alert.context'

const Alert = () => {
    const { isAlert, alertType, alertMessage } = useAlert()
    const AlertBody = <div className={` ${alertType == 'success' ? 'bg-green-600 border-green-700' : alertType == 'info' ? 'bg-twitter-100 border-twitter-100' : alertType == 'danger' ? 'bg-red-600 border-red-700' : ''} border-2 bg-opacity-80 text-lg absolute  top-5 left-[50%] rounded-md p-2`}>{alertMessage}</div>
    return (
        isAlert && createPortal(AlertBody, document.body)
    )
}

export default Alert