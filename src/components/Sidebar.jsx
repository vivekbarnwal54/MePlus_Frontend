import React from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import logo from '../assets/Black logo - no background.png';
import { categories } from '../utils/data';

const Sidebar = ({ user, closeToggle }) => {

  const handleCloseSidebar = () =>{
    if(closeToggle) closeToggle(false);
  }

  return (
    <div className='sidebar--content' >
        <div className="content__head">
            <Link
                to="/"
                className="content--logo"
                onClick={handleCloseSidebar}
            >
                <img src={logo} alt="logo" className="sidebar--logo"/>
            </Link>
            <div className="content">
                <NavLink
                    to='/'
                    className={({ isActive }) => isActive ? "isActiveStyle" : "isNotActiveStyle" }
                    onClick={handleCloseSidebar} 
                >
                    <RiHomeFill />
                    Home
                </NavLink>
                <h3 className="sidebar__title">Discover categories</h3>
                { categories.slice(0, categories.length-1).map((category) =>(
                    <NavLink
                        to={`/category/${category.name}`}
                        className={({ isActive }) => isActive ? "isActiveStyle" : "isNotActiveStyle" }
                        onClick={handleCloseSidebar} 
                        key={category.name}
                    >
                        <img 
                            src={category.image} 
                            alt="category icon"
                            className='category--icon' 
                        />
                        {category.name}
                    </NavLink>
                )) }
            </div>
        </div>
        { user && (
            <Link
                to={`user-profile/${user._id}`}
                className="sidebar__profile"
                onClick={handleCloseSidebar}
            >
                <img src={user.image} className="profile__img" alt="logo" />
                <p>{user.userName}</p>
            </Link>
        )}
    </div>
  )
}

export default Sidebar;