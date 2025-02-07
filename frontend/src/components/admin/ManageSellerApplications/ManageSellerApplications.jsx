import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Tooltip, Paper, Fab, Button, IconButton, Modal, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, TextField, InputAdornment, Stack, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { Loader } from '../../../layouts';
import 'react-toastify/dist/ReactToastify.css';
import { adminGetAllSellerApplications, approveSeller, rejectSeller } from '../../../features/admin/adminThunks';

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


const ManageSellerApplications = () => {

    const dispatch = useDispatch()

    const { adminLoading, adminMessage, adminError, allUsers, allAdmins, allSellerApplications, allSellers, isAuthenticated } = useSelector((state) => state.admin)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [applicationId, setApplicationId] = useState('')

    const [sortValue, setSortValue] = useState('')
    const [categoryName, setCategoryName] = useState([])
    const [searchApplication, setSearchApplication] = useState('')
    const [selectedApplications, setSelectedApplications] = useState([])

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

    const handleSortValueChange = (e) => {
        setSortValue(e.target.value)
    }

    const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    }

    const handleSearchApplication = (event) => {
        setSearchApplication(event.target.value)
    }

    const handleApproveSeller = (email, gstin) => {
        const approveForm = new FormData;
        approveForm.set("email", email)
        approveForm.set("gstin", gstin)

        dispatch(approveSeller(approveForm))
    }

    const handleRejectSeller = (email, gstin) => {
        const rejectForm = new FormData;
        rejectForm.set("email", email)
        rejectForm.set("gstin", gstin)

        dispatch(rejectSeller(rejectForm))
    }

    const handleApplicationCheckboxSelect = (id) => {
        const selectedIndex = selectedApplications.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedApplications, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedApplications.slice(1));
        } else if (selectedIndex === selectedApplications.length - 1) {
            newSelected = newSelected.concat(selectedApplications.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedApplications.slice(0, selectedIndex),
                selectedApplications.slice(selectedIndex + 1),
            );
        }

        setSelectedApplications(newSelected);
    };

    const handleAllApplicationSelect = (event) => {
        if(event.target.checked){
            const newSelected = allSellerApplications.map(applications => applications.id)
            setSelectedApplications(newSelected)
        }else(
            setSelectedApplications([])
        )
    }

    useEffect(() => {
        if(allSellerApplications.length === 0){
            dispatch(adminGetAllSellerApplications())
        }
        setPage(0)
    }, [dispatch, categoryName, sortValue, searchApplication])

    const sortApplications = (applications, sortValue) => {
        switch (sortValue) {
            case 'Name-A2Z':
                return [...applications].sort((a, b) => a.full_name.localeCompare(b.full_name));
            case 'Name-Z2A':
                return [...applications].sort((a, b) => b.full_name.localeCompare(a.full_name));
            case 'Email-A2Z':
                return [...applications].sort((a, b) => a.email.localeCompare(b.email));
            case 'Email-Z2A':
                return [...applications].sort((a, b) => b.email.localeCompare(a.email));
            case 'Old-New':
                return [...applications].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            case 'New-Old':
                return [...applications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            default:
                return applications;
        }
    };

    const filterApplications = (applications, categories, searchTerm) => {
    
        if (!Array.isArray(applications)) {
            return [];
        }

        return applications.filter(application => {
            const matchesCategory = categories.length === 0 || categories.includes(application.category)
            const matchesSearch = searchTerm === '' || application.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || application.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || application.gstin.toLowerCase().includes(searchTerm.toLowerCase()) || application.email.toLowerCase().includes(searchTerm.toLowerCase())
            
            return matchesCategory && matchesSearch
        })
    }

    const sortedAndFilteredApplications = useMemo(() => {
        return sortApplications(filterApplications(allSellerApplications, categoryName, searchApplication), sortValue);
    }, [allSellerApplications, categoryName, searchApplication, sortValue]) 

  return (
    <>
    {adminLoading ? (
        <Loader/>
    ) : (
        <>
        <div className='w-full pl-[6rem] pr-[2.5rem] py-[3rem]'>
            <div className='flex flex-col justify-center items-start w-full h-full gap-[1rem]'>
                {allSellerApplications.length === 0 ? (
                    <div className='flex-center flex-col w-full pt-[3rem] gap-[1rem]'>
                        <div className='flex-center flex-col gap-[4rem] w-full'>
                            <img className='w-[25%]' src="/no-applications.svg" alt="no admins" />
                            <h2 className='font-extrabold text-[35px] text-mediumGray'>No seller applications Found</h2>
                        </div>
                    </div>
                ):(
                <>
                    <div className='w-full flex-center'>
                        <h1 className='font-extrabold text-[35px] text-mediumGray'>All Seller Applications</h1>
                    </div>
                    <div className='flex justify-between w-full'>
                        <div className='flex gap-[1rem]'>
                            {/* <FormControl size='small' sx={{ minWidth: 150 }}>
                                <InputLabel sx={{ fontFamily: 'Montserrat, sans-serif' }}>Category</InputLabel>
                                <Select 
                                    value={categoryName} 
                                    onChange={handleCategoryNameChange}
                                    multiple
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    sx={{ borderRadius: '2px' }}
                                    >
                                    {categories.map((category, key) => (
                                        <MenuItem key={key} value={category}>
                                            <Checkbox checked={categoryName.indexOf(category) > -1}  />
                                            <ListItemText primary={category} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
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
                                    <MenuItem value="Name-A2Z">Name A-Z</MenuItem>
                                    <MenuItem value="Name-Z2A">Name Z-A</MenuItem>
                                    <MenuItem value="Email-A2Z">Email A-Z</MenuItem>
                                    <MenuItem value="Email-Z2A">Email Z-A</MenuItem>
                                    <MenuItem value="Old-New">Created At Old-New</MenuItem>
                                    <MenuItem value="New-Old">Created At New-Old</MenuItem>
                                </Select>
                            </FormControl>
                            {/* <Button sx={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontWeight: 600, borderRadius: '2px' }} onClick={handleMultipleRestoreModalOpen} variant='contained' color='customBlue'>Restore Products</Button>
                            <Modal 
                                open={multipleRestoreConfirmation}
                                onClose={handleMultipleRestoreModalClose}
                            >
                                <Box className="flex flex-col justify-between" sx={style}>
                                    <p className='text-[18px]'>You're Restoring {selectedProducts.length} products, Are you sure?</p>
                                    <Button
                                        variant='contained' 
                                        color='customBlue' 
                                        sx={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontWeight: 600, height: '2.5rem' }}
                                        onClick={handleMultipleProductsRestore}>
                                        Restore
                                    </Button>                                                    
                                </Box>
                            </Modal> */}
                        </div>
                        <div>
                            
                            <TextField 
                                variant='outlined' 
                                size='small' 
                                label='Search'
                                value={searchApplication}
                                onChange={handleSearchApplication}
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
                    <TableContainer sx={{ boxShadow:5 }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="users table"> 
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'primary.main' }}>
                                    <TableCell sx={{...table_body_cell_properties, minWidth: 50, maxWidth: 50, border: 0, borderColor: 'transparent' }} align="center">
                                        <Checkbox
                                            indeterminate={selectedApplications.length > 0 && selectedApplications.length < allSellerApplications.length}
                                            checked={allSellerApplications.length > 0 && selectedApplications.length === allSellerApplications.length}
                                            onChange={handleAllApplicationSelect} 
                                            sx={{ display: 'flex', justifyContent: 'center', color: 'white', '&.Mui-checked': { color: 'white' }, '&.MuiCheckbox-indeterminate' : { color: 'white' } }}
                                            >
                                        </Checkbox>
                                    </TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Application</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Company Name</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Company Address</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">GSTIN</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Email</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="right">Created At</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 100, maxWidth: 100}} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? sortedAndFilteredApplications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : sortedAndFilteredApplications).map((application, key) => (
                                    <TableRow
                                        key={application.id}
                                    >
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 50, maxWidth: 50}} align="center">
                                            <Checkbox 
                                                checked={selectedApplications.includes(application.id)}
                                                onChange={() => handleApplicationCheckboxSelect(application.id)}
                                                sx={{ display: 'flex', justifyContent: 'center' }}>
                                            </Checkbox>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, ...truncation_properties, minWidth: 200, maxWidth: 200}} align="left">
                                            <div className='flex items-center w-full gap-[0.5rem]'>
                                                {/* <div className='max-h-[30px] max-w-[30px]'>
                                                    <img className='w-full h-full' src={product.image_url} alt={`${product.name} image`} />
                                                </div> */}
                                                <div className='overflow-hidden'>
                                                    <Tooltip title={application.full_name} placement='bottom-start'>
                                                        <p className='font-semibold overflow-hidden text-ellipsis whitespace-nowrap'>{application.full_name}</p>
                                                    </Tooltip>
                                                    <Tooltip title={application.id} placement='bottom-start'>
                                                        <p className='text-[12px] font-normal overflow-hidden text-ellipsis whitespace-nowrap'>ID: {application.id}</p>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 200}} align="left">
                                            <Tooltip title={application.company_name} placement='bottom-start'>
                                                <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{application.company_name}</p>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, ...truncation_properties, minWidth: 300, maxWidth: 300}} align="left">
                                            <Tooltip title={application.company_address} placement='bottom-start'>
                                                <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{application.company_address}</p>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 200}} align="left">{application.gstin}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 200}} align="left">
                                            <Tooltip title={application.email} placement='bottom-start'>
                                                <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{application.email}</p>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 200}} align="right">{application.createdAt.split('T')[0]}</TableCell>
                                        <TableCell align="right">
                                            <div className='flex gap-[0.4rem] justify-center'>
                                                <Tooltip title="Approve" placement="left" arrow>
                                                    <IconButton onClick={() => {handleApproveSeller(application.email, application.gstin)}} aria-label='approve' size='medium'><DoneIcon fontSize='inherit' /></IconButton>
                                                </Tooltip>  
                                                <Tooltip title="Reject" placement="right" arrow>
                                                    <IconButton onClick={() => {handleRejectSeller(application.email, application.gstin)}} aria-label='reject' size='medium'><CloseIcon fontSize='inherit' /></IconButton>
                                                </Tooltip>  
                                                    {/* <Modal 
                                                        open={deleteConfirmation}
                                                        onClose={handleDeleteModalClose}
                                                        >
                                                        <Box className="flex flex-col justify-between" sx={style}>
                                                            <p className='text-[18px]'>Are you sure about deleting?</p>
                                                            <Button
                                                                variant='contained' 
                                                                color='primary' 
                                                                sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, height: '2.5rem' }}
                                                                onClick={handleAdminDelete}>
                                                                Delete
                                                            </Button>                                                    
                                                        </Box>
                                                    </Modal> */}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}    
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className='flex justify-end w-full'>
                        <TablePagination 
                            component="div"
                            rowsPerPageOptions={[5, 10, 15, 20, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={sortedAndFilteredApplications.length}
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

export default ManageSellerApplications