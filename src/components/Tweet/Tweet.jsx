import React, { useEffect, useState } from "react"

import { MdOutlineArrowBack } from "react-icons/md"
import { useNavigate, useParams } from "react-router-dom"
import TweetCard from "./TweetCard"
import TweetBox from "./TweetBox"
import { useUploadFile } from "react-firebase-hooks/storage"
import { auth, storage } from "../../firebase/firebase"
import { getDownloadURL, ref } from "firebase/storage"
import { useAuth } from "../../Context/auth.context"
import { useAlert } from "../../Context/alert.context"



const Tweet = () => {
    const navigate = useNavigate()
    const { showAlert } = useAlert()
    const { id } = useParams()
    const tweet = JSON.parse(sessionStorage.getItem('tweet'))
    const [replies, setReplies] = useState(null)
    useEffect(() => {
        const replies = JSON.parse(sessionStorage.getItem('replies'))
        setReplies(replies)
    }, [id])
    const [uploadImage] = useUploadFile(auth)
    const { loggedInUser } = useAuth()
    const handleImageUpload = async (image) => {
        try {
            const result = await uploadImage(ref(storage, `/images/${loggedInUser.user.id}/${Date.now() + image.name}`), image, { cacheControl: `public , max-age=${3600 * 24 * 3}` });
            const downloadUrl = await getDownloadURL(result.ref)
            return downloadUrl
        } catch (error) {
            console.log(error)
            return null
        }
    }
    const handleReply = async (replyTweet, imageUrl, user) => {
        const baseUrl = 'http://localhost:5000'
        try {
            const response = await fetch(`${baseUrl}/reply/${tweet._id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ replyTweet, imageUrl, user }) })
            const newReply = await response.json()
            setReplies(prev => {
                const newReplies = [...prev, newReply.data]
                sessionStorage.setItem('replies', JSON.stringify(newReplies))
                return newReplies
            })
        } catch (error) {
            console.log(error)
        }


    }
    const returnHandler = () => {
        sessionStorage.removeItem('replies')
        sessionStorage.removeItem('tweet')
        navigate('/')
    }
    const deleteReply = (replyId) => {
        fetch(`http://localhost:5000/deleteReply/${tweet._id}/${replyId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                setReplies(prev => {
                    const newReplies = prev.filter(reply => reply._id !== replyId)
                    sessionStorage.setItem('replies', JSON.stringify(newReplies));
                    return newReplies
                })
                showAlert('Deleted Reply successfully. ', 'success')
            })
    }
    return (
        <div key={id}>
            <div className="sticky z-10 top-0 left-0 flex gap-5 p-4 bg-white shadow-md">
                <MdOutlineArrowBack onClick={returnHandler} className="text-2xl cursor-pointer" />
                <p>Tweet</p>
            </div>
            <TweetCard tweet={tweet} />
            <TweetBox buttonText={'Reply'} placeholder={'Reply your tweet '} handleImageUpload={handleImageUpload} handleSubmit={handleReply} />
            <div className="ml-4 border-l-2 pl-4">
                {(replies) && replies.map(reply => <TweetCard deleteTweet={deleteReply} key={reply._id} tweet={reply} />)}
                {(replies && replies.length == 0) && <div>No replies</div>}
            </div>

        </div>
    )
}

export default Tweet