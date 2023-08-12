import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if(!user) return null;

  return (
    <div className='navbar'>
      <div className='navbar__container'>
        <IoMdSearch fontSize={21} className='navbar__icon' />
        <input 
          type="text" 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={()=> navigate('/search')}
          className='navbar__search'
        />
      </div>
      <div className="navbar__profile">
        <Link to={`user-profile/${user?._id}`} >
            <img src={user?.image} alt="user" className='navbar_pimg' />
        </Link>
        <Link to='create-pin' className='create' >
            <IoMdAdd />
        </Link>
      </div>
    </div>
  )
}

export default Navbar