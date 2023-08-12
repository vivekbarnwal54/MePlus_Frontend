import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const addComment = () =>{
    if(comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: []})
        .insert('after','comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user?._id
          }
        }])
        .commit()
        .then(() =>{
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        })
    }
  }

  const fetchPinDetails = () =>{
    let query = pinDetailQuery(pinId);

    if(query) {
      client.fetch(query)
        .then((data) =>{
          setPinDetail(data[0]);

          if(data[0]){
            query = pinDetailMorePinQuery(data[0]);

            client.fetch(query)
              .then((res) => setPins(res));
          }
        })
    }
  }

  useEffect(() =>{
    fetchPinDetails();
  }, [])

  if(!pinDetail) return <Spinner message="Loading pin..." />

  return (
    <>
      <div className="pin__detail">
      <div className="pin__detail--img">
        <img 
          src={pinDetail?.image && urlFor(pinDetail.image).width(250).url()} 
          alt="user-post" 
          className='pin--img'
        />
      </div>
      <div className="detail__container">
        <div className="detail__c2">
          <div className="detail__c3">
            <a 
              href={`${pinDetail.image?.asset?.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className='pin_dlink'
            >
              <MdDownloadForOffline/>
            </a>
          </div>
          <a href={pinDetail.destination} target="_blank" rel="noreferrer" style={{color:"black", fontSize: "0.9rem"}}>
            {pinDetail.destination}
          </a>
        </div>
        <div>
          <h1 className='heading-h1'>
            {pinDetail.title}
          </h1>
          <p style={{margin: "0.7rem 1.1rem", color:"grey"}} >{pinDetail.about}</p>
          <Link to={`user-profile/${pinDetail.postedBy?._id}`} className="pin_creator mod--2" >
                <img
                    className='creator--img' 
                    src={pinDetail.postedBy?.image} 
                    alt="user-profile" 
                />
                <p className='creator--name' >{pinDetail.postedBy?.userName}</p>
          </Link>
          <h2 className='pin--comment'>Comments</h2>
          <div className="comment__container">
            {pinDetail?.comments?.map((comment, i) =>(
              <div className='comment_c2' key={i}>
                <img 
                  src={comment.postedBy.image} 
                  alt="user-profile"
                  className='comment--upic' 
                />
                <div className="comment--postedby">
                  <p style={{fontWeight: 500}}>{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="create__comment">
            <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
                  <img
                      className='creator--img' 
                      src={pinDetail.postedBy?.image} 
                      alt="user-profile" 
                  />
            </Link>
            <input 
              type="text"
              className='comment__box' 
              placeholder='Add a comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type='button'
              className='comment--send'
              onClick={addComment}
            >
              {addingComment ? 'Posting the comment...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
    {pins ? (
      <>
        <h2 className='more--pins'>More like this</h2>
        <MasonryLayout pins={pins} />
      </>
    ) : (
      <Spinner message='Loading more pins..'/>
    )}
    </>
  )
}

export default PinDetail