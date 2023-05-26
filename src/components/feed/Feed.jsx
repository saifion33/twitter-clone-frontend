import React from 'react'
import { Outlet } from 'react-router-dom'
const Feed = () => {
    return (
        <div>
            This is feed
            <Outlet />
        </div>
    )
}

export default Feed