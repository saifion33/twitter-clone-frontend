/* eslint-disable react/prop-types */
import React from 'react'
import twitterAnimatedLogo from '../assets/twitterAnimatedLogo.gif'
const CommingSoon = ({ text }) => {
    return (
        <div className='flex justify-center items-center h-full'>
            <div className='flex flex-col justify-center items-center'>
                <h1 className='py-5  text-3xl text-twitter-100 font-semibold'>{text} Comming Soon...</h1>
                <img src={twitterAnimatedLogo} alt="twitter Logo" />
                <p className='text-2xl text-slate-500'>We are working on this feature.</p>
            </div>

        </div>
    )
}

export default CommingSoon