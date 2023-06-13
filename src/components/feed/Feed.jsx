import React from 'react'
import { Outlet } from 'react-router-dom'
import TweetContext from '../../Context/tweet.context'

const Feed = () => {

    return (
        <div className='w-[37%]  border-x-[1px] h-screen overflow-y-auto scrollbar-hide'>
            <TweetContext>
                <Outlet />
            </TweetContext>
        </div>
    )
}

export default Feed