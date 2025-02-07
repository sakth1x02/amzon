import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Tooltip, Paper, Fab, Button, IconButton, Modal, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, TextField, InputAdornment, Stack, Chip } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import { deleteMultipleProducts, deleteProduct, getProductDetails, getSellerProducts } from '../../../features/seller/sellerThunks';
import { Loader } from '../../../layouts';
import AddProduct from '../AddProduct/AddProduct';
import UpdateProduct from '../UpdateProduct/UpdateProduct';
import { categories } from '../data';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    height: 170,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '3px',
}

const ITEM_HEIGHT = 48; 
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
            borderRadius: 7, 
            marginLeft: '5rem'
        },
    },
    MenuListProps: {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2px'
        },
    },
};


const SellerProducts = () => {

    const dispatch = useDispatch()

    const { seller, sellerProducts, sellerLoading, isSellerAuthenticated, sellerMessage, sellerError } = useSelector((state) => state.seller)
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [multipleDeleteConfirmation, setMultipleDeleteConfirmation] = useState(false)
    const [productId, setProductId] = useState('')
    const [popup, setPopup] = useState(false)
    const [updatePopup, setUpdatePopup] = useState(false)

    const [sortValue, setSortValue] = useState('')
    const [categoryName, setCategoryName] = useState([])
    const [searchProduct, setsearchProduct] = useState('')
    const [selectedProducts, setSelectedProducts] = useState([])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const table_head_cell_properties = { color: 'white', fontWeight: "bold", fontFamily: "Montserrat, sans-serif"  }
    const table_body_cell_properties = { fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontSize: 13, border: '1px solid #ddd' }
    const truncation_properties = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const handleUpdateProductOpen = (product_id) => {
        setUpdatePopup(true)
        dispatch(getProductDetails(product_id))
    }

    const handleDeleteModalOpen = (product_id) => {
        setProductId(product_id)
        setDeleteConfirmation(true)
    }

    const handleDeleteModalClose = () => {
        setProductId('')
        setDeleteConfirmation(false)
    }

    const handleProductDelete = () => {
        setDeleteConfirmation(false)
        dispatch(deleteProduct(productId))
        setPage(0)
    }

    const handleMultipleDeleteModalOpen = () => {
        if(selectedProducts.length <= 1){
            toast.error("Select 2 or more products to delete")
        }else{
            setMultipleDeleteConfirmation(true)
        }
    }

    const handleMultipleDeleteModalClose = () => {
        setMultipleDeleteConfirmation(false)
    }
    
    const handleMultipleProductsDelete = () => {
        dispatch(deleteMultipleProducts(selectedProducts))
        setSelectedProducts([])
        setMultipleDeleteConfirmation(false)
        setPage(0)
    }


    const handleAddProductOpen = () => {
        setPopup(true)
    }

    const handleSortValueChange = (e) => {
        setSortValue(e.target.value)
    }

    const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    }

    const handleSearchproduct = (event) => {
        setsearchProduct(event.target.value)
    }

    const handleProductCheckboxSelect = (id) => {
        const selectedIndex = selectedProducts.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedProducts, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedProducts.slice(1));
        } else if (selectedIndex === selectedProducts.length - 1) {
            newSelected = newSelected.concat(selectedProducts.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedProducts.slice(0, selectedIndex),
                selectedProducts.slice(selectedIndex + 1),
            );
        }

        setSelectedProducts(newSelected);
    };

    const handleAllProductSelect = (event) => {
        if(event.target.checked){
            const newSelected = sellerProducts.map(product => product.id)
            setSelectedProducts(newSelected)
        }else(
            setSelectedProducts([])
        )
    }

    useEffect(() => {
        setPage(0)
    }, [categoryName, sortValue, searchProduct])
    

    useEffect(() => {
        dispatch(getSellerProducts())
    }, [dispatch])

    const sortProducts = (products, sortValue) => {
        switch (sortValue) {
            case 'L2H':
                return [...products].sort((a, b) => a.price - b.price);
            case 'H2L':
                return [...products].sort((a, b) => b.price - a.price);
            case 'A2Z':
                return [...products].sort((a, b) => a.category.localeCompare(b.category));
            case 'Z2A':
                return [...products].sort((a, b) => b.category.localeCompare(a.category));
            default:
                return products;
        }
    };

    const filterProducts = (products, categories, searchTerm) => {
    
        return products.filter(product => {
            const matchesCategory = categories.length === 0 || categories.includes(product.category)
            const matchesSearch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())
            
            return matchesCategory && matchesSearch
        })
    }

    const sortedAndFilteredProducts = useMemo(() => {
        return sortProducts(filterProducts(sellerProducts, categoryName, searchProduct), sortValue);
    }, [sellerProducts, categoryName, searchProduct, sortValue]) 

  return (
    <>
    {sellerLoading ? (
        <Loader/>
    ) : (
        <>
        <AddProduct popup={popup} setPopup={setPopup} />
        <UpdateProduct updatePopup={updatePopup} setUpdatePopup={setUpdatePopup} />
        <div className='min-h-[90vh] w-full pl-[6rem] pr-[2.5rem] py-[3rem]'>
            <div className='flex flex-col justify-center items-start w-full h-full gap-[1rem]'>
                {sellerProducts.length === 0 ? (
                    <div className='flex-center flex-col w-full pt-[3rem] gap-[1rem]'>
                        <div className='flex-center flex-col gap-[4rem] w-full'>
                            <img className='w-[35%]' src="/no-products.svg" alt="no products" />
                            <h2 className='font-extrabold text-[35px] text-mediumGray'>No Products Found</h2>
                        </div>
                        <button onClick={handleAddProductOpen} className='btn-fill rounded-[3px] shadow-md flex gap-[7px]'><AddIcon />Add Product</button>
                    </div>
                ):(
                <>
                    <div className='w-full flex-center'>
                        <h1 className='font-extrabold text-[35px] text-mediumGray'>All Products</h1>
                    </div>
                    <div className='flex justify-between w-full'>
                        <div className='flex gap-[1rem]'>
                            <FormControl size='small' sx={{ minWidth: 150 }}>
                                <InputLabel sx={{ fontFamily: 'Montserrat, sans-serif' }}>Category</InputLabel>
                                <Select 
                                    value={categoryName} 
                                    onChange={handleCategoryNameChange}
                                    multiple
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    sx={{ borderRadius: '2px', textOverflow: 'ellipsis', maxWidth: 150 }}
                                    MenuProps={MenuProps}
                                    >
                                    {categories.map((category, key) => (
                                        <MenuItem key={key} value={category}>
                                            <Checkbox checked={categoryName.indexOf(category) > -1}  />
                                            <ListItemText primary={category} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl size='small' sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ fontFamily: 'Montserrat, sans-serif' }}>Sort By</InputLabel>
                                <Select
                                    input={<OutlinedInput label="Tag" />} 
                                    value={sortValue} 
                                    onChange={handleSortValueChange}
                                    sx={{ borderRadius: '2px' }}>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="L2H">Lowest to Highest Price</MenuItem>
                                    <MenuItem value="H2L">Highest to Lowest Price</MenuItem>
                                    <MenuItem value="A2Z">Category A-Z</MenuItem>
                                    <MenuItem value="Z2A">Category Z-A</MenuItem>
                                </Select>
                            </FormControl>
                            <Button sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, borderRadius: '2px' }} onClick={handleMultipleDeleteModalOpen} variant='outlined' color='primary'>Delete Products</Button>
                            <Modal 
                                open={multipleDeleteConfirmation}
                                onClose={handleMultipleDeleteModalClose}
                            >
                                <Box className="flex flex-col justify-between" sx={style}>
                                    <p className='text-[18px]'>You're deleting {selectedProducts.length} products, Are you sure?</p>
                                    <Button
                                        variant='contained' 
                                        color='primary' 
                                        sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, height: '2.5rem' }}
                                        onClick={handleMultipleProductsDelete}>
                                        Delete
                                    </Button>                                                    
                                </Box>
                            </Modal>
                        </div>
                        <div>
                            
                            <TextField 
                                variant='outlined' 
                                size='small' 
                                label='Search'
                                value={searchProduct}
                                onChange={handleSearchproduct}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),  
                                    sx: { borderRadius: '2px', fontFamily: 'Montserrat, sans-serif', maxWidth: 220 }
                                }}
                            />
                        </div>
                    </div>
                    {/* <div>
                        <Stack direction="row" spacing={1}>
                            <Chip label="Deletable" onDelete={handleDelete} />
                        </Stack>
                    </div> */}
                    <TableContainer sx={{ boxShadow:5 }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="products table"> 
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#ff5151' }}>
                                    <TableCell sx={{...table_body_cell_properties, minWidth: 50, maxWidth: 50, display: 'flex', justifyContent: 'center', border: 0, borderColor: 'transparent' }} align="left">
                                        <Checkbox
                                            indeterminate={selectedProducts.length > 0 && selectedProducts.length < sellerProducts.length}
                                            checked={sellerProducts.length > 0 && selectedProducts.length === sellerProducts.length}
                                            onChange={handleAllProductSelect} 
                                            sx={{ color: 'white', '&.Mui-checked': { color: 'white' }, '&.MuiCheckbox-indeterminate' : { color: 'white' } }}
                                            >
                                        </Checkbox>
                                    </TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Product</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Description</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="right">Price</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="right">MRP</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="right">Stock</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Category</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 100, maxWidth: 100}} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? sortedAndFilteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : sortedAndFilteredProducts).map((product, key) => (
                                    <TableRow
                                        key={product.id}
                                    >
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 50, maxWidth: 50}} align="center">
                                            <Checkbox 
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => handleProductCheckboxSelect(product.id)}
                                                sx={{ display: 'flex', justifyContent: 'center' }}>
                                            </Checkbox>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, ...truncation_properties, minWidth: 200, maxWidth: 200}} align="left">
                                            <div className='flex items-center w-full gap-[0.5rem]'>
                                                <div className='max-h-[30px] max-w-[30px]'>
                                                    <img className='w-full h-full' src={product.image_url} alt={`${product.name} image`} />
                                                </div>
                                                <div className='overflow-hidden'>
                                                    <Tooltip title={product.name} placement='bottom-start'>
                                                        <p className='font-semibold overflow-hidden text-ellipsis whitespace-nowrap'>{product.name}</p>
                                                    </Tooltip>
                                                    <Tooltip title={product.id} placement='bottom-start'>
                                                        <p className='text-[12px] font-normal overflow-hidden text-ellipsis whitespace-nowrap'>ID: {product.id}</p>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, ...truncation_properties, minWidth: 300, maxWidth: 300}} align="left">
                                            <Tooltip title={product.description} placement='bottom-start'>
                                                <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{product.description}</p>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 150}} align="right">₹{new Intl.NumberFormat('en-IN').format(product.price)}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 150}} align="right">₹{new Intl.NumberFormat('en-IN').format(product.mrp)}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 150}} align="right">{product.stock}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 200}} align="left">{product.category}</TableCell>
                                        <TableCell align="right">
                                            <div className='flex gap-[0.4rem] justify-end'>
                                                <IconButton onClick={() => {handleUpdateProductOpen(product.id)}} aria-label='update' size='medium'><ModeEditIcon fontSize='inherit' /></IconButton>
                                                <IconButton onClick={() => {handleDeleteModalOpen(product.id)}} aria-label='delete' size='medium'><DeleteIcon fontSize='inherit' /></IconButton>
                                                <Modal 
                                                    open={deleteConfirmation}
                                                    onClose={handleDeleteModalClose}
                                                >
                                                    <Box className="flex flex-col justify-between" sx={style}>
                                                        <p className='text-[18px]'>Are you sure about deleting?</p>
                                                        <Button
                                                            variant='contained' 
                                                            color='primary' 
                                                            sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, height: '2.5rem' }}
                                                            onClick={handleProductDelete}>
                                                            Delete
                                                        </Button>                                                    
                                                    </Box>
                                                </Modal>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}    
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className='flex justify-between w-full'>
                        <Tooltip title="Add Product" placement='right' arrow>
                            <Fab onClick={handleAddProductOpen} color='primary'>
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                        <TablePagination 
                            component="div"
                            rowsPerPageOptions={[5, 10, 15, 20, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={sortedAndFilteredProducts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </>
                )}

            </div>
        </div>
    </>
    )}
    </>
  )
}

export default SellerProducts