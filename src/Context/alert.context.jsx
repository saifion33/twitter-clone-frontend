/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from 'react'
const alertContext = createContext(null)
const AlertContext = ({ children }) => {
    const [isAlert, setIsAlert] = useState(false)
    const [alertType, setAlertType] = useState('danger')
    const [alertMessage, setAlertMessage] = useState('This is alert')
    const showAlert = (message,type,time=3000) => {
        setAlertType(type)
        setAlertMessage(message)
        setIsAlert(true)
        setTimeout(() => {
            setIsAlert(false)
        }, time);
    }
    return (
        <alertContext.Provider value={{ isAlert, alertType, alertMessage, showAlert }}>
            {children}
        </alertContext.Provider>
    )
}
export const useAlert = () => useContext(alertContext)
export default AlertContext