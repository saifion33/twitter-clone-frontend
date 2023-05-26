import React from 'react'
import { Outlet } from 'react-router-dom'
const Feed = () => {
    return (
        <div className='w-1/2'>
            This is feed
            <Outlet />
        </div>
    )
}

export default Feed