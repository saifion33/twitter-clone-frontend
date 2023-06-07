/* eslint-disable react/prop-types */
import React, { useState } from 'react'

const Popover = ({ position = 'bottom', message, children }) => {

    const [isHover, setIsHover] = useState(false)
    // const handleHover = () => {
    //     setTimeout(() => {
    //         setIsHover(true)
    //     }, 100);
    // }
    return (
        <div className='relative cursor-pointer h-fit' onMouseEnter={() => { setIsHover(true) }} onMouseLeave={() => { setIsHover(false) }} >
            {children}
            {
                isHover && <div className={`absolute -${position}-10 text-xs bg-slate-900 text-white p-1 rounded-md `}>{message}</div>
            }
        </div>
    )
}

export default Popover