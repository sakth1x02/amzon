import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductDetails } from '../../../features/products/productsThunks'
import StarIcon from '@mui/icons-material/Star';
import { Loader } from '../../../layouts'
import { Breadcrumbs, Rating } from '@mui/material'
import { toast } from 'react-toastify';
import ButtonLoader from '../../../layouts/ButtonLoader/ButtonLoader';
import { addToCart } from '../../../features/cart/cartThunks';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import _ from 'lodash';
import ProductCard from '../../../layouts/ProductCard/ProductCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { addToWishlist, removeFromWishlist } from '../../../features/wishlist/wishlistThunks';
import LinesEllipsis from 'react-lines-ellipsis'

const renderButton = () => {
  if (product.is_deleted === 1) {
    return (
      <button
        disabled
        className="bg-secondary hover:shadow-lg disabled:bg-[#ffa1a1] py-[0.8rem] w-[190px] text-white font-medium shadow-md rounded-[3px]"
      >
        Currently Unavailable
      </button>
    );
  }
  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="bg-secondary hover:shadow-lg disabled:bg-[#ffa1a1] py-[0.8rem] w-[190px] text-white font-medium shadow-md rounded-[3px]"
      >
        Out of Stock
      </button>
    );
  }
  if (cart.find((item) => item.id === product.id)) {
    return (
      <button
        onClick={() => handleGotoCart()}
        disabled={cartLoading}
        className="bg-primary hover:bg-secondary hover:shadow-lg disabled:bg-[#ffa1a1] transition-all duration-150 py-[0.8rem] w-[190px] text-white font-medium shadow-md rounded-[3px]"
      >
        {cartLoading ? <ButtonLoader /> : <>Go to Cart</>}
      </button>
    );
  }
  return (
    <button
      onClick={() => handleAddtoCart(product.id)}
      disabled={cartLoading}
      className="bg-primary hover:bg-secondary hover:shadow-lg disabled:bg-[#ffa1a1] transition-all duration-150 py-[0.8rem] w-[190px] text-white font-medium shadow-md rounded-[3px]"
    >
      {cartLoading ? <ButtonLoader /> : <>Add to Cart</>}
    </button>
  );
};


const ProductDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated } = useSelector((state) => state.user)
  const { productDetails, productLoading, productDetailsLoading, products } = useSelector((state) => state.products)
  const { cartLoading, cart } = useSelector((state) => state.cart)
  const { wishlistLoading, wishlist } = useSelector((state) => state.wishlist)

  const [categoryName, setCategoryName] = useState('')
  const [shuffledProducts, setShuffledProducts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false)

  const handleRemoveWishlistProduct = (product_id) => {
      dispatch(removeFromWishlist(product_id))
  }

  const handleAddToWishlist = (product_id) => {
    dispatch(addToWishlist(product_id))
}

  const {product_id} = useParams()

  const handleAddtoCart = (product_id) => {
    if(isAuthenticated){
      dispatch(addToCart(product_id))
      navigate('/cart')
    }else{
      toast.error("Login to add products to the cart")
    }
  }

  const handleGotoCart = () => {
    if(isAuthenticated){
      navigate('/cart')
    }else{
      toast.error("Login to add products to the cart")
    }
  }

  const filteredProducts = useMemo(() => {
      let filtered = [...products];
      if (categoryName) {
          filtered = filtered.filter(product => product.category === categoryName && product.id != product_id);
      }
      return filtered;
    }, [products, categoryName, productDetails]);

    useEffect(() => {
      setShuffledProducts(_.shuffle(filteredProducts).slice(0, 4));
  }, [filteredProducts]);

  useEffect(() => {
    dispatch(getProductDetails(product_id))
  }, [dispatch, product_id])

  useEffect(() => {
    if(productDetails.length > 0){
        setCategoryName(productDetails[0].category)
    }
  }, [productDetails])

  return (
    <>
      {productLoading || productDetailsLoading ? (
        <Loader />
      ) : (
        <>
          <div className='w-full flex-center'>
            <div className='w-full max-w-[1200px]'>
              <div className='w-full flex-center'>
                  <div className='flex justify-start items-start w-full mt-[1rem]'>
                      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                          <Link to="/" className='hover:underline ' color="inherit">
                              Home
                          </Link>
                          <p className='text-primary text-ellipsis whitespace-nowrap overflow-hidden max-w-[170px]'>{productDetails.map((product) => product.name)}</p>
                      </Breadcrumbs>
                  </div>
              </div>
              <div className='flex justify-center w-full py-[2rem]'>
                <div className='w-full flex'>
                  {productDetails.map((product, key) => (
                    <div key={product.id} className='flex gap-[3rem]'>
                      <div className='flex justify-center items-start'>
                        <img className='min-w-[450px] max-w-[416px] max-h-[416px] object-contain flex-1 p-[0.5rem] rounded-[10px]' src={product.image_url} alt={product.name} />
                      </div>
                      <div className='flex flex-col gap-[1.2rem] flex-[2]'>
                        <div className='flex flex-col gap-[0.2rem]'>
                          <h2 className='font-bold text-[17px] text-ellipsis'>{product.name}</h2>
                          <p className='text-lightGray text-[15px]'>#{product.category}</p>
                          <Rating
                            name="text-feedback"
                            value={4}
                            readOnly
                            precision={0.5}
                            size="medium"
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                        </div>
                        <div>
                          <p className='text-[green] font-semibold text-[14px]'>Best Price</p>
                          <div className="flex items-center gap-[0.7rem]">
                              <p className="font-[Roboto] text-black font-semibold text-[30px]">₹{new Intl.NumberFormat('en-IN').format(product.price)}</p>
                              <p className="line-through font-[Roboto] text-[#777] text-[22px] font-normal">{product.mrp ? `₹${new Intl.NumberFormat('en-IN').format(product.mrp)}` : ""}</p>
                          </div>
                        </div>
                        <div className='flex flex-col gap-[0.5rem]'>
                          <p className='font-bold text-[14px] text-darkGray2'>Description</p>
                            {!isExpanded ? (
                              <LinesEllipsis
                                text={product.description}
                                maxLine="4"
                                ellipsis="..."
                                trimRight
                                basedOn="letters"
                                className="text-[14px] text-mediumGray"
                              />
                            ) : (
                              <p className="text-[14px] text-mediumGray">{product.description}</p>
                            )}
                            <button
                              className="text-blue-500 text-[15px] font-semibold mt-1 w-full text-start"
                              onClick={() => setIsExpanded(!isExpanded)}
                            >
                              {isExpanded ? 'Read Less' : 'Read More'}
                            </button>
                        </div>
                        <div className='flex align-center gap-x-[2rem] mt-2'>
                          <div className='w-fit'>
                            {(() => {
                              if (product.is_deleted === 1) {
                                // Case: Product is deleted
                                return (
                                  <button
                                    disabled={true}
                                    className="bg-secondary hover:shadow-lg disabled:bg-[#ffa1a1] py-[0.8rem] w-[190px] text-white font-medium shadow-md rounded-[3px]"
                                  >
                                    Currently Unavailable
                                  </button>
                                );
                              } else if (product.stock <= 0) {
                                // Case: Product is out of stock but not deleted
                                return (
                                  <button
                                    disabled={true}
                                    className="bg-secondary hover:shadow-lg disabled:bg-[#ffa1a1] py-[0.8rem] w-[190px] text-white font-medium shadow-md rounded-[3px]"
                                  >
                                    Out of Stock
                                  </button>
                                );
                              } else {
                                // Case: Product is in stock
                                return cart.find((item) => item.id === product.id) ? (
                                  <button
                                    onClick={() => handleGotoCart()}
                                    disabled={cartLoading}
                                    className="bg-primary hover:bg-secondary hover:shadow-lg disabled:bg-[#ffa1a1] transition-all duration-150 py-[0.8rem] w-[190px] text-white font-medium shadow-md rounded-[3px]"
                                  >
                                    {cartLoading ? <ButtonLoader /> : <>Go to Cart</>}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleAddtoCart(product.id)}
                                    disabled={cartLoading}
                                    className="bg-primary hover:bg-secondary hover:shadow-lg disabled:bg-[#ffa1a1] transition-all duration-150 py-[0.8rem] w-[190px] text-white font-medium shadow-md rounded-[3px]"
                                  >
                                    {cartLoading ? <ButtonLoader /> : <>Add to Cart</>}
                                  </button>
                                );
                              }
                            })()}
                          </div>
                          {wishlist.find((item) => item.id === product.id) ? (
                              <button disabled={wishlistLoading}>
                                <FavoriteIcon 
                                fontSize="large"
                                onClick={() => {handleRemoveWishlistProduct(product.id)}}  
                                className="text-primary self-center cursor-pointer hover:text-secondary"
                              />
                              </button>
                          ) : (                          
                              <button
                                disabled={wishlistLoading}
                              >
                                <FavoriteBorderIcon
                                  fontSize="large"
                                  onClick={() => {handleAddToWishlist(product.id)}}
                                  className='self-center hover:text-primary cursor-pointer'
                                />
                              </button>
                          )}
                        </div>
                      </div>
                  </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          {shuffledProducts.length > 0 && (
            <div className='flex flex-col w-full p-[5rem] gap-y-[2rem]'>
            <div className='flex justify-between'>
              <h1 className='heading'>
                Recommended Products
              </h1>
              <Link to={`/category/${categoryName.toLowerCase().trim().replace(' ', '')}`} className="flex-center bg-primary text-white px-[1.2rem] py-[0.4rem] border-[1px] border-primary hover:bg-secondary transition-colors duration-100 font-semibold rounded-[4px]">
                  View More
              </Link>
            </div>
            <div className='flex-center'>
              <div className='grid grid-cols-4 gap-[2rem]'>
                  {shuffledProducts.map((product, index) => (
                      <ProductCard product={product} />
                  ))}
              </div>
            </div>
          </div>
          )}
        </>
      )}
    </>
  )
}

export default ProductDetails