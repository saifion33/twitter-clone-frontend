import React from 'react'
import Sidebar from './components/sidebar/Sidebar'
import WidgetBar from './components/widgetBar/WidgetBar'
import Feed from './components/feed/Feed'
import Home from './components/feed/Home'
import Explore from './components/feed/Explore'
import Notifications from './components/feed/Notifications'
import Messages from './components/feed/Messages'
import Lists from './components/feed/Lists'
import Bookmarks from './components/feed/Bookmarks'
import More from './components/feed/More'
import { Routes, Route } from 'react-router-dom'
import Profile from './components/feed/Profile'
function App() {

  return (
    <div className='app flex'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Feed />} >
          <Route path='/' element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/lists' element={<Lists />} />
          <Route path='/bookmarks' element={<Bookmarks />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/more' element={<More />} />
        </Route>
      </Routes>
      <WidgetBar />
    </div>
  )
}

export default App
