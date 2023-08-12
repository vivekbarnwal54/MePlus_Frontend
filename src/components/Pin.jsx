import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline} from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, _id, destination, save }}) => {
    const [postHovered, setPostHovered] = useState(false);

    const navigate = useNavigate();
    const user = fetchUser();
    const userId = user?.sub;

    const alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === userId))?.length;

    const savePin = (id) =>{
        if(!alreadySaved) {
            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: userId,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: userId
                    }
                }])
                .commit()
                .then(() =>{
                    window.location.reload();
                })
        }
    }

    const deletePin = (id) =>{
        client
            .delete(id)
            .then(() =>{
                window.location.reload();
            })
    }

  return (
    <div className='pin__container'>
        <div 
            className="pin__post"
            onMouseEnter={() => setPostHovered(true)}
            onMouseLeave={() => setPostHovered(false)}
            onClick={() => navigate(`/pin-detail/${_id}`)}
        >
            <img src={urlFor(image).width(250).url()} alt="user-post" className='pin__img' />
            {postHovered && (
                <div 
                    className="pin_c1"
                >
                    <div className="pin_c2">
                        <div className="pin_c3">
                            <a 
                                href={`${image?.asset?.url}?dl=`}
                                download
                                onClick={(e) => e.stopPropagation()}
                                className='pin_dlink'
                            >
                                <MdDownloadForOffline/>
                            </a>
                        </div>
                        {alreadySaved ?(
                            <button type='button' className='save_btn'>
                               {save?.length} Saved
                            </button>
                        ): (
                            <button 
                                onClick={(e) =>{
                                    e.stopPropagation();
                                    savePin(_id);
                                }}
                                type='button' className='save_btn'>
                                Save
                            </button>
                        )}
                    </div>
                    <div className="pin_destin">
                        {destination && (
                            <a 
                                href={destination}
                                target="_blank"
                                rel='noreferrer'
                                className="pin_destin--link"
                            >
                                <BsFillArrowUpRightCircleFill fontSize={15} />
                                {destination.length > 15 ? `${destination.slice(0, 15)}...` : destination}
                            </a>
                        )}
                        {postedBy?._id === user.sub && (
                            <button 
                                type="button"
                                onClick={(e) =>{
                                    e.stopPropagation();
                                    deletePin(_id);
                                }}
                                className='delete_btn'
                            >
                               <AiTwotoneDelete fontSize={15}/>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
        <Link to={`user-profile/${postedBy?._id}`} className="pin_creator" >
                <img
                    className='creator--img' 
                    src={postedBy?.image} 
                    alt="user-profile" 
                />
                <p className='creator--name' >{postedBy?.userName}</p>
        </Link>
    </div>
  )
}

export default Pin