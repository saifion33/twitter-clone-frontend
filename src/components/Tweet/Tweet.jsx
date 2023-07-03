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
import { useTweets } from "../../Context/tweet.context"
import { API_BASE_URL } from "../../utils/helpers"



const Tweet = () => {
    const token = JSON.parse(localStorage.getItem('token'))
    const [isTweetOpen, setIsTweetOpen] = useState(false)
    const navigate = useNavigate()
    const { increaseTweetReplyCount } = useTweets()
    const [replies, setReplies] = useState(null)
    const [uploadImage] = useUploadFile(auth)
    const [tweet, setTweet] = useState(null)
    const { loggedInUser } = useAuth()
    const { showAlert } = useAlert()
    const { id } = useParams()

    useEffect(() => {
        const tweet = JSON.parse(sessionStorage.getItem('tweet'))
        setTweet(tweet)
        const replies = JSON.parse(sessionStorage.getItem('replies'))
        setReplies(replies)
        setIsTweetOpen(tweet._id)
    }, [id])

    // upload image
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

    // handle reply
    const handleReply = async (replyTweet, imageUrl, user) => {

        try {
            const response = await fetch(`${API_BASE_URL}/tweet/reply/${tweet._id}${tweet.replyOf ? `?replyOf=${tweet.replyOf}` : ''}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `hack no-way ${token}` }, body: JSON.stringify({ replyTweet, imageUrl, user }) })
            const newReply = await response.json()
            setReplies(prev => {
                const newReplies = [...prev, newReply.data]
                sessionStorage.setItem('replies', JSON.stringify(newReplies))
                setTweet(prev => {
                    return { ...prev, replyCount: prev.replyCount + 1 }
                })
                increaseTweetReplyCount(tweet._id)
                return newReplies
            })
        } catch (error) {
            console.log(error)
        }


    }

    // on back button click
    const returnHandler = () => {
        sessionStorage.removeItem('replies')
        sessionStorage.removeItem('tweet')
        navigate('/')
    }

    // delete reply
    const deleteReply = (replyId) => {

        fetch(`${API_BASE_URL}/reply/delete/${tweet._id}/${replyId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `hack no-way ${token}` } })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                throw new Error(res.status)
            })
            .then(() => {
                setReplies(prev => {
                    const newReplies = prev.filter(reply => reply._id !== replyId)
                    sessionStorage.setItem('replies', JSON.stringify(newReplies));
                    return newReplies
                })
                showAlert('Deleted Reply successfully. ', 'success')
            })
            .catch(err => {
                console.log(err)
                showAlert('There was an error')
            })
    }

    return (
        <div key={id}>
            <div className="sticky z-10 top-0 left-0 flex gap-5 p-4 bg-white shadow-md">
                <MdOutlineArrowBack onClick={returnHandler} className="text-2xl cursor-pointer" />
                <p>Tweet</p>
            </div>
            {tweet && <TweetCard setReplies={setReplies} isTweetOpen={isTweetOpen} tweet={tweet} />}
            {tweet && <TweetBox buttonText={'Reply'} placeholder={'Reply your tweet '} handleImageUpload={handleImageUpload} handleSubmit={handleReply} />}
            <div className="ml-4 border-l-2 pl-4">
                {(replies) && replies.map(reply => <TweetCard setReplies={setReplies} deleteTweet={deleteReply} key={reply._id} tweet={reply} />)}
                {(replies && replies.length == 0) && <div>No replies</div>}
            </div>

        </div>
    )
}

export default Tweet