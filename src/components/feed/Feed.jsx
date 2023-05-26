import React from 'react'
import { Outlet } from 'react-router-dom'
const Feed = () => {
    return (
        <div className='w-1/2 flex items-center justify-center text-4xl font-bold text-[--twitter-color]'>
            <p>Welcome to_</p> <Outlet />
        </div>
    )
}

export default Feed