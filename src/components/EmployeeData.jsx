import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import '../assets/EmployeeData.css';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';

const EmployeeData = ({ handlePageChange }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [sortOrder, setSortOrder] = useState({ name: 'asc', role: 'asc' });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:8085/getEmployees');
      console.log('Fetched data:', response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error.message);
      setMessage('Error fetching employee data. Please try again later.');
    }
  };

  const sortNames = () => {
    const sortedData = [...data].sort((a, b) => {
      return sortOrder.name === 'asc'
        ? (a.EmployeeName || '').localeCompare(b.EmployeeName || '')
        : (b.EmployeeName || '').localeCompare(a.EmployeeName || '');
    });
    setData(sortedData);
    setSortOrder({ ...sortOrder, name: sortOrder.name === 'asc' ? 'desc' : 'asc' });
  };

  const sortRoles = () => {
    const sortedData = [...data].sort((a, b) => {
      return sortOrder.role === 'asc'
        ? (a.Role || '').localeCompare(b.Role || '')
        : (b.Role || '').localeCompare(a.Role || '');
    });
    setData(sortedData);
    setSortOrder({ ...sortOrder, role: sortOrder.role === 'asc' ? 'desc' : 'asc' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8085/deleteEmployee/${id}`);
      getData();
      setIsDeleteConfirmModal(false);
    } catch (error) {
      console.error('Error deleting employee:', error.message);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmModal(true);
  };

  const handleDeleteConfirmation = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
    }
  };

  const cancelDeleteConfirmation = () => {
    setIsDeleteConfirmModal(false);
    setDeleteId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:8085/updateEmployee/${editEmployee.id}`, editEmployee);
      getData();
      setIsEditModalOpen(false);
      setEditEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setMessage('');
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    setMessage('');
  };

  const filteredData = data.filter((item) =>
    (item.EmployeeName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (searchTerm && filteredData.length === 0) {
      setMessage('No data found');
    } else {
      setMessage('');
    }
  }, [searchTerm, filteredData]);

  const addNewEmployee = () => {
    handlePageChange('AddEmployee');
  };
  const gotohomepage = () =>
  {
    handlePageChange('Homepage1');
  }

  return (
    <>
      <div className="container mt-3">
      <ArrowBackIos onClick={gotohomepage}></ArrowBackIos>
        <h2 className="form-title">Employee Data</h2>
        <div style={{ width: '200px', marginBottom: '-30px' }}>
          <TextField
            label="Search by name"
           
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                 
                  <CloseIcon title ="cancel" onClick={handleSearchClear} style={{cursor:"pointer"}}  />
               
              ),
            }}
          />
        </div>
        <Button  onClick={addNewEmployee} style={{marginLeft:"1080px"}}>
          ADD
        </Button>

        <table className="table table-bordered" style={{ alignItems: 'center' }}>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'center', width: '20%' }}>
                Name
                {sortOrder.name === 'asc' ? (
                  <ArrowDropDownIcon onClick={sortNames} style={{ cursor: 'pointer' }} />
                ) : (
                  <ArrowDropUpIcon onClick={sortNames} style={{ cursor: 'pointer' }} />
                )}
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '20%' }}>
                Role
                {sortOrder.role === 'asc' ? (
                  <ArrowDropDownIcon onClick={sortRoles} style={{ cursor: 'pointer' }} />
                ) : (
                  <ArrowDropUpIcon onClick={sortRoles} style={{ cursor: 'pointer' }} />
                )}
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>Salary</th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>Location</th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>Aadhar No</th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>Mobile No</th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>Joining Date</th>
              <th scope="col" style={{ textAlign: 'center', width: '20%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.EmployeeName}</td>
                <td>{employee.Role}</td>
                <td>{employee.Salary}</td>
                <td>{employee.Location}</td>
                <td>{employee.AadharNo}</td>
                <td>{employee.MobileNo}</td>
                <td>{employee.JoiningDate}</td>
                <td style={{display:"flex"}}>
                  <DeleteIcon
                  title="Delete"
                    variant="contained"
                    color="secondary"
                    onClick={() => confirmDelete(employee.id)}
                    style={{cursor:"pointer"}}
                  
                  ></DeleteIcon>
                
                  <EditIcon
                  title="Edit"
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(employee)}
                    style={{ marginLeft: '10px',cursor:"pointer" }}
                  >
                    
                  </EditIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {message && (
          <p className="no-data-message" style={{ marginLeft: '60px' }}>
            {message}
          </p>
        )}
      </div>

      <Modal isOpen={isDeleteConfirmModal} onDismiss={cancelDeleteConfirmation} className="custom-modal">
        <div className="modal-content">
          <CloseIcon
            onClick={cancelDeleteConfirmation}
            style={{ marginLeft: '440px', marginTop: '-15px', marginBottom: '10px', cursor: 'pointer' }}
          />
          <h3>Are you sure you want to delete this employee?</h3>
          <div>
            <Button onClick={handleDeleteConfirmation}>Yes</Button>
            <Button onClick={cancelDeleteConfirmation}>No</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onDismiss={() => setIsEditModalOpen(false)} className="custom-modal">
        <div className="modal-content">
          <CloseIcon
            onClick={() => setIsEditModalOpen(false)}
            style={{ marginLeft: '440px', marginTop: '-15px', marginBottom: '10px', cursor: 'pointer' }}
          />
          <h3>Edit Employee Data</h3>
          <div>
            <TextField
              label="Name"
              name="EmployeeName"
              value={editEmployee?.EmployeeName || ''}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Role"
              name="Role"
              value={editEmployee?.Role || ''}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Salary"
              name="Salary"
              value={editEmployee?.Salary || ''}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Location"
              name="Location"
              value={editEmployee?.Location || ''}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Aadhar No"
              name="AadharNo"
              value={editEmployee?.AadharNo || ''}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Mobile No"
              name="MobileNo"
              value={editEmployee?.MobileNo || ''}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Joining Date"
              name="JoiningDate"
              value={editEmployee?.JoiningDate || ''}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: '10px' }}
            />
            <div>
              <Button onClick={handleEditSave} variant="contained" color="primary" style={{ marginRight: '10px' }}>
                Save
              </Button>
              <Button onClick={() => setIsEditModalOpen(false)} variant="contained" color="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmployeeData;
