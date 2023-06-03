import React from 'react'

import Notifications from './components/feed/Notifications'
import { useAuthState } from 'react-firebase-hooks/auth'
import WidgetBar from './components/widgetBar/WidgetBar'
import AuthFooterBar from './components/AuthFooterBar'
import Bookmarks from './components/feed/Bookmarks'
import Sidebar from './components/sidebar/Sidebar'
import Messages from './components/feed/Messages'
import { Routes, Route } from 'react-router-dom'
import Setting from './components/feed/Setting'
import Explore from './components/feed/Explore'
import Profile from './components/feed/Profile'
import Lists from './components/feed/Lists'
import { auth } from './firebase/firebase'
import Feed from './components/feed/Feed'
import Home from './components/feed/Home'
import More from './components/feed/More'


function App() {
  const [user] = useAuthState(auth)

  return (
    <>
      <div className='app flex'>

        <Sidebar />
        <Routes>
          <Route path='/' element={<Feed />} >
            <Route path='/notifications' element={<Notifications />} />
            <Route path='/bookmarks' element={<Bookmarks />} />
            <Route path='/messages' element={<Messages />}/>
            <Route path='/explore' element={<Explore />} />
            <Route path='/setting' element={<Setting />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/lists' element={<Lists />} />
            <Route path='/more' element={<More />} />
            <Route path='/' element={<Home />} />
          </Route>
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
