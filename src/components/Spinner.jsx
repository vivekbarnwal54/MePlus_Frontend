import React from 'react';
import { Vortex } from 'react-loader-spinner';


const Spinner = ({ message }) => {
  return (
    <div className='spinner'>
         <Vortex 
            height={60}
            className='spinner-icon'
        />
        <p className="spinner-text">{ message }</p>
    </div>
  )
}

export default Spinner