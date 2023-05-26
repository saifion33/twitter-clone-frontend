import React from 'react'

const AuthFooterBar = () => {
    return (
        <div className='absolute bottom-0 left-0 bg-[--twitter-color] w-full flex justify-evenly items-center py-2'>
            <div className='mx-auto text-white'>
                <h1 className='text-2xl font-bold'>Don&apos;t miss what&apos;s happning</h1>
                <p>People on Twitter are the first to know.</p>

            </div>
            <div className='flex  gap-6 mx-auto'>
                <button className='border-[1px] rounded-full py-2 px-5 text-white font-semibold'>Log in</button>
                <button className='bg-white rounded-full py-2 px-5 font-semibold'>Sign up</button>
            </div>
        </div>
    )
}

export default AuthFooterBar