import React from 'react';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';


const ProductCard = ({product}) => {
const productImage = product?.images?.[0]?.url || "/logoShopie1.png";

const options = {
  value:product?.ratings || 0,
  readOnly:true,
  precision:0.5,
};

  return (
    <Link className='productCard' to={`/product/${product?._id || ""}`} >
        <img src={productImage} alt={product?.name || "Product"} />
        <p>{product?.name || "Untitled Product"}</p>
        <div>
            <Rating  {...options} />
            <span className='productCardSpan' >({product?.numOfReviews || 0} Reviews)</span>
        </div>
        <span>{`₹ ${product?.price || 0}`}</span>
    </Link>
  )
}

export default ProductCard
