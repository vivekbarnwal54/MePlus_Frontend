import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
// import { GoogleLogout } from 'react-google-login';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage = 'https://source.unsplash.com/random/1600*900/?nature,photography,technology';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() =>{
    const query = userQuery(JSON.stringify(userId));

    client.fetch(query)
      .then((data) =>{
        setUser(data[0]);
      })
  }, [userId])

 const logout = () =>{
    localStorage.clear();
    console.log("logout") 
    navigate('/login');
  }

  useEffect(()=>{
    if(text === 'Created'){
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery)
        .then((data)=>{
          setPins(data);
        })

    }else{
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery)
        .then((data)=>{
          setPins(data);
        })
    }


  },[text, userId])

  if(!user)
    return <Spinner message="Loading profile..." />;

  return (
    <div className="user-profile">
      <div className="user-profile__cont">
        <div className="user-profile__c2">
          <div className="user-profile__c3">
            <img 
              src={randomImage} 
              alt="profile cover pic"
              className='profile-cover' 
            />
            <img 
              src={user.image}
              alt="user-profile-img" 
              className='user-profile-img'
            />
            <h1 className="user-name">
              {user.userName}
            </h1>
            <div className="user-profile-dashboard">
              {userId === user._id && (
                // <GoogleLogout 
                //   clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                //   render={(renderProps) =>(
                //       <button
                //           type='button'
                //           className='logout__btn'
                //           onClick={renderProps.onClick}
                //           disabled={renderProps.disabled}
                //       >
                //           <AiOutlineLogout color='red' fontSize={21} />
                //       </button>
                //       )}
                  
                //   onLogoutSuccess={logout}
                //   // onFailure={handleFailure}
                //   cookiepolicy="single_host_origin" 
                //   onClick={logout} 
                // />
                <button
                    type='button'
                    className='logout__btn'
                    onClick={logout}
                >
                    <AiOutlineLogout color='red' fontSize={21} />
                </button>
              )}
            </div>
          </div>
          <div className="tabs">
            <button
              type='button'
              onClick={(e) =>{
                setText(e.target.textContent);
                setActiveBtn('created');
              }}
              className={`${activeBtn === 'created' ? "activeBtnStyles" : "notActiveBtnStyles" }`}
            >
              Created
            </button>
            <button
              type='button'
              onClick={(e) =>{
                setText(e.target.textContent);
                setActiveBtn('saved');
              }}
              className={`${activeBtn}` === 'saved' ? "activeBtnStyles" : "notActiveBtnStyles" }
            >
              Saved
            </button>
          </div>
          
          {pins?.length ? (
            <div className="posts">
            <MasonryLayout pins={pins} />
          </div>
          ): (
            <div className="notFound">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile