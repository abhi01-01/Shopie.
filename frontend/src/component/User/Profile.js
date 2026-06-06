import React , {Fragment,useEffect} from 'react'
import {useSelector} from "react-redux";
import Loader from  "../layout/Loader/Loader"
import MetaData from "../layout/MetaData"
import {Link} from "react-router-dom"
import "./Profile.css";


const Profile = ({history}) => {

    const {loading , user , isAuthenticated } = useSelector((state)=>state.user);
    const image = user?.avatar?.url || "/profilePng.png";
    const joinedOn = user?.createdAt ? String(user.createdAt).substr(0,10) : "";

    useEffect(()=>{
        if(isAuthenticated===false){
            history.push("/login");
        }
    },[isAuthenticated,history]);


  return ( 
    <Fragment>
  {
    loading || !user?._id ? (<Loader/>) :(
    <Fragment>
    <MetaData title={`Shopie. || ${user?.name || "User"}'s Profile`} />
    <div className='profileContainer'>
        <div>
            <h1>My Profile:-</h1>
            <img src={image} alt={user?.name || "Profile"} />
            <Link to="/me/update">Edit Profile</Link>
        </div>
        <div>
            <div>
                <h4>Full Name:</h4>
                <p>{user?.name || ""}</p>
            </div>
            <div>
                <h4>Email:</h4>
                <p>{user?.email || ""}</p>
            </div>
            <div>
                <h4>Joined On:</h4>
                <p>{joinedOn}</p>
            </div>
            <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
            </div>
        </div>
    </div>
  </Fragment>
            )
        }
    </Fragment>
  )
}

export default Profile
