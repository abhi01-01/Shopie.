import React, { Fragment, useEffect, useState } from 'react'
import "./Products.css"
import {clearErrors, getProduct} from "../../actions/productAction";
import {useDispatch, useSelector} from "react-redux";
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import Pagination from "react-js-pagination"
import { Typography } from '@mui/material';
import { Slider } from '@mui/material';
import {useAlert} from "react-alert"
import MetaData from "../../component/layout/MetaData" 

const categories=[
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones"
];

const Products = ({match}) => {

    const dispatch = useDispatch() ;
    const alert = useAlert() ;

    const [currentPage,setCurrentPage] = useState(1) ;
    const [price , setPrice ] = useState([0,25000]);
    const [category,setCategory] = useState("") ;
    const [ratings , setRatings] = useState(0) ;

    const {
        loading,
        error,
        resultPerPage,
        products,
        productsCount,
        filteredProductsCount
    } = useSelector(state=>state.products)
    
    const keyword = match.params.keyword;

    const setCurrentPageNo = (e) =>{
        setCurrentPage(e)
    }

    const priceHandler = (event , newPrice) =>{
        setPrice(newPrice) ;
    }

    useEffect(()=>{ 
        if(error){
            alert.error(error);
            dispatch(clearErrors()) ;
        }
        dispatch(getProduct(keyword,currentPage,price,category,ratings));
    },[dispatch,keyword,currentPage,price,category,ratings,alert,error])

    let count = filteredProductsCount;



  return (
    <Fragment>
        {loading ? <Loader/> : (
            <Fragment>
            <MetaData title="Shopie. || Products"/>
            <h2 className='productsHeading'>Products</h2>
            <div className='products'>
                {products && 
                products.map((product)=>(
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            
            <div className='filterBox'>
            <h2>Filters</h2>
                <Typography>Price</Typography>
                <Slider 
                    size="small"
                    value={price}
                    onChange={priceHandler}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={0}
                    max={25000}    
                />
                <Typography>Categories</Typography>
                <ul className='categoryBox'>
                    {categories.map((category)=>(
                        <li
                        className='category-link'
                        key={category}
                        onClick={()=>setCategory(category)}
                        >
                            {category}
                        </li>
                    ))}
                </ul>

                <fieldset>
                    <Typography component="legend">Ratings Above</Typography>
                     <Slider
                        size="small"
                        value={ratings}
                        onChange={(e,newRating)=>{
                            setRatings(newRating);
                        }}
                        aria-labelledby="continuous-slider"
                        min={0}
                        max={5}
                        valueLabelDisplay="auto"
                     />
                </fieldset>


            </div>



            {resultPerPage < count && (
                <div className='paginationBox'>
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={productsCount}
                    onChange={setCurrentPageNo}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="1st"
                    lastPageText="Last"
                    itemClass='page-item'
                    linkClass='page-link'
                    activeClass='pageItemActive'
                    activeLinkClass='pageLinkActive'
                />
            </div>
            )}

            </Fragment>
        )}
    </Fragment>
  )
}

export default Products
