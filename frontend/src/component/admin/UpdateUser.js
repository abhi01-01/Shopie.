import React , {Fragment , useEffect , useState } from 'react';
import { useSelector , useDispatch } from "react-redux";
import {useAlert} from "react-alert";
import MetaData from "../layout/MetaData"
import Sidebar from "./Sidebar";
import { Button } from '@mui/material';
import Loader from "../layout/Loader/Loader"
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {UPDATE_USER_RESET} from "../../constants/userConstant";
import { getUserDetails, updateUser , clearErrors } from '../../actions/userAction';


const UpdateUser = ({history , match }) => {

  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, user } = useSelector((state) => state.userDetails);

  const { loading:updateLoading, error:updateError, isUpdated } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const userId = match.params.id ;

  useEffect(() => {

    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("User Updated Successfully");
      history.push("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    } 
  }, [dispatch, alert, error, history, isUpdated , updateError ,user ,userId ]);


  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(userId,myForm));
  };



  return (
    <Fragment>
      <MetaData title="Shopie. || Admin || Update User"/>
      <div className='dashboard'>
          <Sidebar/>
          <div className='newProductContainer'>
  
            { loading ? ( <Loader/>) : (
            <form 
            className="createProductForm"
            onSubmit={updateUserSubmitHandler}
            >
                <h1>UPDATE USER</h1>

            <div>
              <PersonIcon />
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <VerifiedUserIcon />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                
              </select>
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={updateLoading ? true : false || role === "" ? true :false }
            >
              Update
            </Button>


            </form>
            )}


          </div>
      </div>
    </Fragment>
  )
}

export default UpdateUser
