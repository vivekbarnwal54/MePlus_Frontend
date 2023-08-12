import React from 'react';
import { GoogleLogin} from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import jwt_decode from 'jwt-decode';
import shareVideo from '../assets/video.mp4';
import logo from '../assets/White logo - no background.png';

import { client } from '../client';

const Login = () => {
    const navigate = useNavigate();

    const responseGoogle = (response) =>{
        // let ID = response.clientId;
        let decoded = jwt_decode(response.credential);
        
        localStorage.setItem('user', JSON.stringify(decoded));
        // localStorage.setItem('userId', JSON.stringify(ID));

        const { sub, name, picture } = decoded;
        let ID = sub;

        const doc = {
            _id: ID,
            _type: 'user',
            userName: name,
            image: picture,
        }

        client.createIfNotExists(doc)
            .then(() =>{
                navigate('/', {replace: true})
            })
    }

  return (
    <div className="login">
        <div className="loginContainer">
            <video 
                src={shareVideo}
                type="video/mp4"
                loop
                controls={false}
                muted
                autoPlay
                className='login__video'
            />

            <div className="logo">
                <img src={logo}  alt="logo" />
            </div>

            <div className="login__box">
                <GoogleLogin 
                    clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                    render={(renderProps) =>(
                        <button
                            type='button'
                            className='login__btn'
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                        >
                            <FcGoogle /> Sign in with Google
                        </button>
                        )}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy="single_host_origin"
                />
            </div>
        </div>
    </div>
  )
}

export default Login