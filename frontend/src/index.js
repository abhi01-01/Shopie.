import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from "react-redux" ;
import store from "./Store" ;

import {positions,transitions,Provider as AlertProvider} from "react-alert" ;
import AlertTemplate from "./component/layout/Alert/AlertTemplate";

const options ={
  timeout:8000,
  position:positions.BOTTOM_CENTER,
  transition:transitions.SCALE,
  offset: "20px",
};

ReactDOM.render(
  <Provider store={store}>
  <AlertProvider template={AlertTemplate} {...options}>
     <App />
  </AlertProvider>
  </Provider>,
  document.getElementById('root')
);
