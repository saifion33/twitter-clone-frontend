/* eslint-disable react/prop-types */
import React from 'react'
import TweetCard from './TweetCard'
const Replies = ({ replies }) => {

    return (
        <div className='border-l-2 ml-3'>

            {
                replies.map(reply => {
                    return <TweetCard key={reply._id} tweet={reply} />
                })
            }

        </div>
    )
}

export default Replies