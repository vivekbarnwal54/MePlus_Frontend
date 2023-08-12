import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle} from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import { Sidebar, UserProfile } from '../components';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import { client } from '../client';
import logo from '../assets/Black logo - no background.png';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  
  const userInfo = fetchUser();
  let userID = userInfo?.sub;
  // const userID = localStorage.getItem('userId') !== 'undefined' ? localStorage.getItem('userId') : localStorage.clear();

  useEffect(() =>{
    const query = userQuery(JSON.stringify(userID));
    
    client.fetch(query)
      .then((data) =>{
        setUser(data[0]);
      })
  }, [userID]);


  useEffect(()=>{
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className='home'>
      <div className="sidebar">
        <Sidebar user={user && user} />
      </div>
      <div className="header">
        <div className="header__cont">
          <HiMenu fontSize={40} className="hamburger" onClick={() => setToggleSidebar(true)} />
          <Link to="/">
            <img src={logo} alt="logo" className='home_logo' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={`${user?.image}`} alt="logo" className='home_profile' />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="sidebar--mod2">
            <div className="sidebar_cont">
              <AiFillCloseCircle fontSize={28} className="close_btn" onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="main__content" ref={scrollRef} >
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home