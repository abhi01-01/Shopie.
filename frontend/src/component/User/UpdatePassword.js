import React, { Fragment , useState , useEffect } from 'react'
import "./UpdatePassword.css"
import Loader from '../layout/Loader/Loader'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import {useDispatch, useSelector} from "react-redux";
import { clearErrors , updatePassword } from '../../actions/userAction';
import {useAlert} from "react-alert"
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstant';
import MetaData from '../layout/MetaData';

 
const UpdatePassword = ({history}) => {

    const dispatch = useDispatch() ;
    const alert = useAlert() ;

    const {error, loading , isUpdated } = useSelector(state => state.profile) ;

    const [oldPassword , setOldPassword] = useState("");
    const [newPassword , setNewPassword] = useState("");
    const [confirmPassword , setConfirmPassword] = useState("");

    const updatePasswordSubmit = (e) =>{
        e.preventDefault();

        const myForm = new FormData() ;

        myForm.set("oldPassword",oldPassword) ;
        myForm.set("newPassword",newPassword);
        myForm.set("confirmPassword",confirmPassword);

        dispatch(updatePassword(myForm));
    };

        useEffect(()=>{

            if(error){
                alert.error(error);
                dispatch(clearErrors());
            }

            if(isUpdated){

                alert.success("Profile Updated Sucessfully");

                history.push("/account");

                dispatch({
                    type:UPDATE_PASSWORD_RESET,
                });
            }
        },[error,dispatch,alert,history,isUpdated])


  return (
    <Fragment>
        {loading ? (<Loader />) : (
            <Fragment>
            <MetaData title="Shopie. || Change Password" />
          <div className='updatePasswordContainer'>
              <div className='updatePasswordBox'>
                <h2>Update Password:-</h2>
                <form 
                  className='updatePasswordForm'
                  onSubmit={updatePasswordSubmit}
                  >
                      <div className='signUpPassword'>
                      <VpnKeyIcon/>
                          <input 
                          type="password"
                          placeholder='Old Password'
                          required
                          name="password"
                          value={oldPassword}
                          onChange={(e)=>setOldPassword(e.target.value)}
                           />
                      </div>
                      <div className='signUpPassword'>
                      <LockOpenIcon/>
                          <input 
                          type="password"
                          placeholder='New Password'
                          required
                          name="password"
                          value={newPassword}
                          onChange={(e)=>setNewPassword(e.target.value)}
                           />
                      </div>
                      <div className='signUpPassword'>
                      <LockIcon/>
                          <input 
                          type="password"
                          placeholder='Confirm Password'
                          required
                          name="password"
                          value={confirmPassword}
                          onChange={(e)=>setConfirmPassword(e.target.value)}
                           />
                      </div>
                      
                      <input 
                      type="submit"
                      value="Change"
                      className='updatePasswordBtn'
                    />
                  </form>
              </div>
         </div>
    </Fragment>
        )}
    </Fragment>
  )
}

export default UpdatePassword
