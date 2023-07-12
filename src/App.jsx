import React,{lazy,Suspense} from 'react'


import { useAuthState } from 'react-firebase-hooks/auth'
import WidgetBar from './components/widgetBar/WidgetBar'
import Sidebar from './components/sidebar/Sidebar'
import TweetContext from './Context/tweet.context'
import { Routes, Route } from 'react-router-dom'
import { auth } from './firebase/firebase'
import AuthFooterBar from './components/AuthFooterBar'
import Feed from './components/feed/Feed'
import Loadingbar from './components/Loadingbar'
const Tweet=lazy(()=>import('./components/Tweet/Tweet'))
const Notifications=lazy(()=>import('./components/feed/Notifications'))
const Bookmarks=lazy(()=>import('./components/feed/Bookmarks'))
const Messages=lazy(()=>import('./components/feed/Messages'))
const Home=lazy(()=>import('./components/feed/Home'))
const Setting=lazy(()=>import('./components/feed/Setting'))
const Explore=lazy(()=>import('./components/feed/Explore'))
const Profile=lazy(()=>import('./components/feed/Profile'))
const Lists=lazy(()=>import('./components/feed/Lists'))
const More=lazy(()=>import('./components/feed/More'))
const LoginPage=lazy(()=>import('./LoginPage'));
const SignupPage=lazy(()=>import('./SignupPage'))

function App() {
  const [user] = useAuthState(auth)

  return (
    <>
      <div className='app flex'>
        <TweetContext>
          <Sidebar />
        </TweetContext>
        <Routes>
          
          <Route path='/' element={<Feed />} >
            <Route path='/notifications' element={<Suspense fallback={<Loadingbar/>}><Notifications /></Suspense>} />
            <Route path='/bookmarks' element={<Suspense fallback={<Loadingbar/>}><Bookmarks /></Suspense>} />
            <Route path='/messages' element={<Suspense fallback={<Loadingbar/>}><Messages /></Suspense>} />
            <Route path='/explore' element={<Suspense fallback={<Loadingbar/>}><Explore /></Suspense>} />
            <Route path='/setting' element={<Suspense fallback={<Loadingbar/>}><Setting /></Suspense>} />
            <Route path='/profile/:userId' element={<Suspense fallback={<Loadingbar/>}><Profile /></Suspense>} />
            <Route path='/lists' element={<Suspense fallback={<Loadingbar/>}><Lists /></Suspense>} />
            <Route path='/more' element={<Suspense fallback={<Loadingbar/>}><More /></Suspense>} />
            <Route path='/tweet/:id' element={<Suspense fallback={<Loadingbar/>}><Tweet /></Suspense>} />
            <Route path='/' element={<Suspense fallback={<Loadingbar/>}><Home /></Suspense>} />
          </Route>
          <Route path='/login' element={<Suspense fallback={<Loadingbar/>}><LoginPage /></Suspense>} />
          <Route path='/signup' element={<Suspense fallback={<Loadingbar/>}><SignupPage/></Suspense>} />
        </Routes>
        <WidgetBar />
      </div>
      {
        !user && <AuthFooterBar />
      }

    </>
  )
}

export default App
