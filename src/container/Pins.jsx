import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Navbar, Feed, PinDetail, CreatePin, Search } from '../components';

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='pins'>
      <div className="pins__search">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} />
      </div>
      <div className="pins__container">
        <Routes>
          <Route path='/' element={ <Feed /> } />
          <Route path='/category/:categoryId' element={ <Feed /> } />
          <Route path='/pin-detail/:pinId' element={ <PinDetail user={user} /> } />
          <Route path='/create-pin' element={ <CreatePin user={user} /> } />
          <Route path='/search' element={ <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> } />
        </Routes>
      </div>
    </div>
  )
}

export default Pins