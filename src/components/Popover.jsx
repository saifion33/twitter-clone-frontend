/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

const Popover = ({ position = 'top', message, delay = 500 }) => {
    const [showPopover, setShowPopover] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setShowPopover(true)
        }, delay);
    }, [])
    return (
        showPopover && <div className={`absolute ${position}-0 `}>
            {message}
        </div>
    )
}

export default Popover