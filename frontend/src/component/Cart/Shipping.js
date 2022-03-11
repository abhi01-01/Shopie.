import React , {Fragment , useState } from 'react'
import "./Shipping.css";
import {useSelector , useDispatch} from "react-redux";
import {useAlert} from "react-alert";
import {saveShippingInfo} from "../../actions/cartAction"
import MetaData from "../layout/MetaData"
import {Country , State , City } from "country-state-city"
import PinDropIcon from '@mui/icons-material/PinDrop';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PublicIcon from '@mui/icons-material/Public';
import PhoneIcon from '@mui/icons-material/Phone';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import CheckOutSteps from "../Cart/CheckOutSteps.js"

const Shipping = ({history}) => {

    const dispatch = useDispatch();
    const alert = useAlert() ;

    const {shippingInfo} = useSelector((state) => state.cart);

    const [address,setAddress] = useState(shippingInfo.address);
    const [city , setCity] = useState(shippingInfo.city);
    const [state , setState] = useState(shippingInfo.state);
    const [country , setCountry] = useState(shippingInfo.country);
    const [pinCode , setPinCode] = useState(shippingInfo.pinCode);
    const [phoneNo , setPhoneNo] = useState(shippingInfo.phoneNo);

    const shippingSubmit = (e) => {
        e.preventDefault() ;

        if(phoneNo.length !== 10 ){
            alert.error("Phone Number must be 10 digit long.");
            return ;
        }

        dispatch(
            saveShippingInfo({address,city,state,country,pinCode,phoneNo})
        );
        history.push("/order/confirm");
    } ;


return (
      <Fragment>
      <MetaData title="Shopie. || Shipping Details" />

      <CheckOutSteps activeStep={0} />
          <div className='shippingContainer'>
              <div className='shippingBox'>
                  <h2 className='shippingHeading'>Shipping Details</h2>
                  <form 
                  className='shippingForm'
                  encType='multipart/form-data'
                  onSubmit={shippingSubmit}
                  >

                  <div>
                      <HomeIcon />
                      <input 
                      type="text"
                      placeholder='Address'
                      required
                      value={address}
                      onChange={ (e)=>setAddress(e.target.value) }
                      />
                  </div>

                  <div>
                      <LocationCityIcon />
                      <input 
                      type="text"
                      placeholder='City'
                      required
                      value={city}
                      onChange={ (e)=>setCity(e.target.value) }
                      />
                  </div>

                  <div>
                      <PinDropIcon />
                      <input 
                      type="number"
                      placeholder='Pin Code'
                      required
                      value={pinCode}
                      onChange={ (e)=>setPinCode(e.target.value) }
                      />
                  </div>

                  <div>
                      <PhoneIcon />
                      <input 
                      type="number"
                      placeholder='Phone Number'
                      required
                      value={phoneNo}
                      size = "10"
                      onChange={ (e)=>setPhoneNo(e.target.value) }
                      />
                  </div>

                  <div>
                    <PublicIcon/>
                      <select
                      required
                      value={country}
                      onChange={(e)=>setCountry(e.target.value)}
                      >
                          <option value="">Country</option>
                          {
                              Country && 
                              Country.getAllCountries().map((item)=>(
                                  <option key={item.isoCode}  value={item.isoCode}>
                                      {item.name}
                                  </option>
                              )) 
                          }
                      </select>
                  </div>

                  { country && (
                      <div>
                          <TransferWithinAStationIcon />
                          <select 
                          required
                          value={state}
                          onChange={(e)=>setState(e.target.value) }>
                              <option value="">State</option>
                              {State && 
                              State.getStatesOfCountry(country).map((item)=>(
                                  <option key={item.isoCode} value={item.isoCode}>
                                      {item.name}
                                  </option>
                              ))}
                          </select>
                      </div>
                  )}

                  { state && (
                      <div>
                          <LocationCityIcon />
                          <select 
                          required
                          value={city}
                          onChange={(e)=>setCity(e.target.value) }>
                              <option value="">City</option>
                              {City && 
                              City.getCitiesOfState(country,state).map((item)=>(
                                  <option key={item.isoCode} value={item.isoCode}>
                                      {item.name}
                                  </option>
                              ))}
                          </select>
                      </div>
                  )}

                  <input 
                  type="submit"
                  value="Continue"
                  className='shippingBtn'
                  disabled={state ? false : true} 
                  />

                  </form>
              </div>
          </div>
      </Fragment>
  )
}

export default Shipping
