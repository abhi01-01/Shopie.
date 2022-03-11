import React from 'react'
import { Rating } from '@mui/material';
import profilePng from "../../images/profilePng.png" ;

const ReviewCard = ({review}) => {

    const options = {
      value:review.rating,
      readOnly:true,
      precision:0.5,
  };



  return (
    <div className='reviewCard'>
    <img src={profilePng} alt="User" />
    <p>{review.name}</p>
    <Rating className='reviewCardComment' {...options} />
    <span>{review.comment}</span>      
    </div>
  )
}

export default ReviewCard
