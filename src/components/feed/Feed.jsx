import React from 'react'
import { Outlet } from 'react-router-dom'
const Feed = () => {
    return (
        <div className='w-1/2  border-x-[1px] h-screen overflow-y-auto scrollbar-hide'>
            <Outlet />
        </div>
    )
}

export default Feed