import React, { useEffect, useState } from "react"

import { useUploadFile } from "react-firebase-hooks/storage"
import { useNavigate, useParams } from "react-router-dom"
import { auth, storage } from "../../firebase/firebase"
import { getDownloadURL, ref } from "firebase/storage"
import { useAlert } from "../../Context/alert.context"
import { useAuth } from "../../Context/auth.context"
import { MdOutlineArrowBack } from "react-icons/md"
import { DELETE_REPLY, GET_TWEET_BY_ID, GET_TWEET_REPLIES, REPLY_TWEET } from "../../utils/helpers"
import Loadingbar from "../Loadingbar"
import TweetCard from "./TweetCard"
import TweetBox from "./TweetBox"



const Tweet = () => {
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
        const getTweet = GET_TWEET_BY_ID(id)
        const getTweetReplies = GET_TWEET_REPLIES(id)
        setLoading(true)
        Promise.all([getTweet, getTweetReplies]).then(res => {
            const tweet = res[0].data.data
            const replies = res[1].data.data
            setTweet(tweet)
            setIsTweetOpen(tweet._id)
            setReplies(replies)
        })
        .catch((err)=>{
            console.log(err.message)
        })
        .finally(() => setLoading(false))
    }
    useEffect(() => {
        if (!navigator.onLine) {
            showAlert('Please check your Internet connection.')
            navigate('/')
            return
        }
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
        REPLY_TWEET({replyTweet,imageUrl,user},tweet)
        .then(response=>{
            const newReply=response.data.data
            setReplies(prev => {
                const newReplies = [...prev, newReply]
                return newReplies
            })
            setTweet(prev => {
                return { ...prev, replyCount: prev.replyCount + 1 }
            })
        })
        .catch(err=>{
            console.log(err.message)
        })

    }

    // on back button click
    const returnHandler = () => {
        navigate('/')
    }

    // delete reply
    const deleteReply = (replyToDelete) => {

        DELETE_REPLY(tweet._id,replyToDelete._id)
            .then(() => {
                setReplies(prev => {
                    const newReplies = prev.filter(reply => reply._id !== replyToDelete._id)
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
                        {(replies) && replies.slice().reverse().map(reply => <TweetCard setReplies={setReplies} deleteTweet={deleteReply} key={reply._id} tweet={reply} />)}
                        {(replies && replies.length == 0) && <div>No replies</div>}
                       
                    </div>
                </div>
            }
            {
                loading && <div className="w-full h-full flex justify-center items-center">
                    <Loadingbar />
                </div>
            }
            {
                 (!(tweet || replies) && !loading)&& <div className="text-2xl text-slate-600 text-center font-semibold ">Something went wrong</div>
            }
        </div>
    )
}

export default Tweet