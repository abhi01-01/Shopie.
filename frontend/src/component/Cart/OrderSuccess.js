import React , {Fragment } from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import "./orderSuccess.css"
import { Typography } from '@mui/material';
import {Link} from "react-router-dom"
import MetaData from "../layout/MetaData"



const OrderSuccess = () => {
  return (
      <Fragment>
      <MetaData title="Shopie. || Order Success" />
          <div className='orderSuccess'>
              <CheckCircleIcon/>
              <Typography>Your Order has been placed successfully.</Typography>
              <Link to="/orders">View Orders</Link>
          </div>
      </Fragment>
  )
}

export default OrderSuccess
