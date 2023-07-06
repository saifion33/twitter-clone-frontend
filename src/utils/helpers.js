export const API_BASE_URL = 'http://localhost:5000'
export const API_ENDPOINTS = {
    AUTH: {
        SIGNUP: { URL: `${API_BASE_URL}/auth/signup`, METHOD: 'POST' },
        LOGIN: { URL: `${API_BASE_URL}/auth/login`, METHOD: 'GET' }, //  API_BASE_URL/auth/login/:email/:id
        IS_USER_EXIST: { URL: `${API_BASE_URL}/auth/isUserExist` }, // API_BASE_URL/auth/isUserExist/:email
    },
    TWEET: {
        // 1. GET ALL TWEETS
        GET_ALL_TWEETS: { URL: `${API_BASE_URL}/tweet/alltweets`, METHOD: 'GET' },

        // 2. POST TWEET
        POST_TWEET: { URL: `${API_BASE_URL}/tweet/post`, METHOD: 'POST' },

        // 3. REPLY TO TWEET
        REPLY_TWEET: { URL: `${API_BASE_URL}/tweet/reply`, METHOD: 'PATCH' }, // API_BASE_URL/tweet/reply/:tweetId

        // 4. LIKE TWEET
        LIKE_TWEET: { URL: `${API_BASE_URL}/tweet/like`, METHOD: 'PATCH' }, // API_BASE_URL/tweet/like/:tweetId

        // 5. GET TWEET REPLIES
        GET_TWEET_REPLIES: { URL: `${API_BASE_URL}/tweet/gettweetreplies`, METHOD: 'GET' }, // API_BASE_URL/tweet/gettweetreplies/:tweetId

        // 6. DELETE TWEET
        DELETE_TWEET: { URL: `${API_BASE_URL}/tweet/delete`, METHOD: 'DELETE' }, // API_BASE_URL/tweet/delete/:tweetId

        // 7. DELETE REPLY
        DELETE_REPLY: { URL: `${API_BASE_URL}/tweet/delete/reply`, METHOD: 'DELETE' }, // API_BASE_URL/tweet/delete/reply/:tweetId/:replyId

        // 8. GET TWEET BY ID
        GET_TWEET_BY_ID: { URL: `${API_BASE_URL}/tweet/getTweet`, METHOD: 'GET' }, // API_BASE_URL/tweet/like/:tweetId
    },
    USER: {
        GET_USER_BY_ID: { URL: `${API_BASE_URL}/user/userById`, METHOD: 'GET' },// API_BASE_URL/user/:userId
        UPDATE_USER: { URL: `${API_BASE_URL}/user/updateuser`, METHOD: 'PATCH' },// API_BASE_URL/user/updateuser/:email
    }
}