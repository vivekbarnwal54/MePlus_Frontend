import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';


const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) =>{
    const { type, name } = e.target.files[0];
    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff' ){
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload('image', e.target.files[0], { contentType: type, filename: name })
        .then((document) =>{
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) =>{
          console.log('Image upload error ', error);
        })
    }
    else{
      setWrongImageType(true);
    }
  }

  const savePin = () =>{
    if(title && about && destination && imageAsset?._id && category){
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      }

      client.create(doc)
        .then(() =>{
          navigate('/');
        })
    } else{
      setFields(true);
      setTimeout(() => setFields(false), 2000)
    }
  }

  return (
    <div className="create__pin">
      {fields && (
        <p className="pin--message">Please fill in all the fields!</p>
      )}
      <div className="create__container">
        <div className="create_c2">
          <div className="create_c3">
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label>
                <div className="upload_img">
                  <div className="upload_c1">
                    <p>
                      <AiOutlineCloudUpload fontSize={35}/>
                    </p>
                    <p>Click to upload</p>
                  </div>
                  <p>
                    use high-quality JPG, SVG, PNG, GIF less than 20 MB
                  </p>
                </div>
                <input 
                  type="file"
                  name='upload-image'
                  onChange={uploadImage}
                  className='upload-input' 
                />
              </label>
            ): (
              <div className="uploaded_c1">
                <img src={imageAsset?.url} alt="uploaded-pic" className='uploaded-pic' />
                <button
                  type='button'
                  className='delete-pic'
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form">
        {user && (
            <div className="form--user">
              <img 
                src={user?.image}
                className='user-img'
                alt="user-profile" 
              />
              <p style={{fontWeight: '500'}} >{user.userName}</p>
            </div>
          )}
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder= "Add your title here"
            className='form--title' 
          />
          <input 
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder= "What is your pin about"
            className='form--title' 
          />
          <input 
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder= "Add a destination link"
            className='form--title' 
          />
          <div className="select__category">
            <div>
              <p className='select--placeholder'>Choose Pin Category</p>
              <select
                onChange={(e)=> setCategory(e.target.value)}
                className='select--box'
              >
                <option value="other" style={{background: 'white'}}>Select Category</option>
                {categories.map((category) =>(
                  <option className='select--option' value={category.name} >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="save__pin">
              <button
                type='button'
                onClick={savePin}
                className='save_btn'
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin