import React, { useEffect, useState } from "react"

import { useUploadFile } from "react-firebase-hooks/storage"
import { useNavigate, useParams } from "react-router-dom"
import { auth, storage } from "../../firebase/firebase"
import { getDownloadURL, ref } from "firebase/storage"
import { useAlert } from "../../Context/alert.context"
import { useAuth } from "../../Context/auth.context"
import { MdOutlineArrowBack } from "react-icons/md"
import { API_BASE_URL } from "../../utils/helpers"
import Loadingbar from "../Loadingbar"
import TweetCard from "./TweetCard"
import TweetBox from "./TweetBox"



const Tweet = () => {

    const token = JSON.parse(localStorage.getItem('token'))
    const [isTweetOpen, setIsTweetOpen] = useState(false)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [replies, setReplies] = useState(null)
    const [uploadImage] = useUploadFile(auth)
    const [tweet, setTweet] = useState(null)
    const { loggedInUser } = useAuth()
    const { showAlert } = useAlert()
    const { id } = useParams()

    const getData = () => {
        const getTweet = fetch(`${API_BASE_URL}/tweet/getTweet/${id}`)
        const getTweetReplies = fetch(`${API_BASE_URL}/tweet/gettweetreplies/${id}`)
        setLoading(true)
        Promise.all([getTweet, getTweetReplies]).then(res => {
            const res1 = res[0]
            const res2 = res[1]
            return Promise.all([res1.json(), res2.json()])
        }).then((res) => {
            setTweet(res[0].data)
            setIsTweetOpen(res[0].data._id)
            setReplies(res[1].data)
        }).finally(() => setLoading(false))
    }
    useEffect(() => {
        getData()

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
            const response = await fetch(`${API_BASE_URL}/tweet/reply/${tweet._id}${tweet.replyOf ? `?replyOf=${tweet.replyOf}` : ''}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `hack no-way ${token}` }, body: JSON.stringify({ replyTweet, imageUrl, user }) })
            const newReply = await response.json()
            setReplies(prev => {
                const newReplies = [...prev, newReply.data]
                sessionStorage.setItem('replies', JSON.stringify(newReplies))
                setTweet(prev => {
                    return { ...prev, replyCount: prev.replyCount + 1 }
                })

                return newReplies
            })
        } catch (error) {
            console.log(error)
        }


    }

    // on back button click
    const returnHandler = () => {
        navigate('/')
    }

    // delete reply
    const deleteReply = (replyId) => {

        fetch(`${API_BASE_URL}/tweet/delete/reply/${tweet._id}/${replyId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `hack no-way ${token}` } })
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
                setTweet(prev => {
                    return { ...prev, replyCount: prev.replyCount - 1 }
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
            {
                (!loading && tweet) && <div>
                    <div className="sticky z-10 top-0 left-0 flex gap-5 p-4 bg-white shadow-md">
                        <MdOutlineArrowBack onClick={returnHandler} className="text-2xl cursor-pointer" />
                        <p>Tweet</p>
                    </div>
                    <TweetCard setReplies={setReplies} isTweetOpen={isTweetOpen} tweet={tweet} />
                    <TweetBox id={'tweet-box-reply'} buttonText={'Reply'} placeholder={'Reply your tweet '} handleImageUpload={handleImageUpload} handleSubmit={handleReply} />
                    <div className="ml-4 border-l-2 pl-4">
                        {(replies) && replies.map(reply => <TweetCard setReplies={setReplies} deleteTweet={deleteReply} key={reply._id} tweet={reply} />)}
                        {(replies && replies.length == 0) && <div>No replies</div>}
                    </div>
                </div>
            }
            {
                loading && <div className="w-full h-full flex justify-center items-center">
                    <Loadingbar />
                </div>
            }
        </div>
    )
}

export default Tweet