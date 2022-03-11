import React , {Fragment , useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import LaunchIcon from '@material-ui/icons/Launch';
import "./myOrders.css"
import {useSelector , useDispatch} from "react-redux";
import {useAlert} from "react-alert";
import MetaData from "../layout/MetaData"
import { clearErrors , myOrders } from "../../actions/orderAction"
import { Link } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import { Typography } from '@mui/material';


const MyOrders = () => {

    const dispatch = useDispatch() ;
    const alert = useAlert();

    const {loading , error , orders } = useSelector((state) => state.myOrders);
    const {user} = useSelector((state)=>state.user);

    const columns = [
        { field: "id" , headerName : "Order ID" , minWidth:300 , flex:1 },
        { field: "status" , headerName : "Status" , minWidth:150 , flex:0.5 ,cellClassName: (params) => {
            return params.getValue(params.id, "status") === "Delivered"
              ? "greenColor"
              : "redColor";
          },
         },
        { field: "itemsQty" , headerName : "Items Qty" , type: "number" , minWidth:150 , flex:0.3 },
        { field: "amount" , headerName : "Amount", type: "number" , minWidth:270 , flex:0.5 },
        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
              return (
                <Link to={`/order/${params.getValue(params.id, "id")}`}>
                  <LaunchIcon />
                </Link>
              );
            },
        }
    ] ;
    const rows = [] ;

    orders && orders.forEach((item,index) => {
        rows.push({
            itemsQty:item.orderItems.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice
         });
    }); 

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors);
        }

        dispatch(myOrders());
    },[dispatch,error,alert])

  return (
    <Fragment>
      <MetaData title={`Shopie.|| ${user.name}-Orders`} />
              {
                  loading ? (<Loader/>)  :  (
                    <div className='myOrderPage'>
              <DataGrid 
                  rows={rows}
                  columns={columns}
                  disableSelectionOnClick
                  className='myOrdersTable'
                  autoHeight={true}
              />

               <Typography id="myOrdersHeading" >{user.name}'s Order</Typography>     
              </div>
                  )
              }
    </Fragment>
  )
}

export default MyOrders
