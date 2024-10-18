import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import styles from '../assets/EmployeeData.module.css';

const EmployeeData = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    EmployeeName: '',
    Role: '',
    Salary: '',
    Location: '',
    AadharNo: '',
    MobileNo: '',
    JoiningDate: ''
  });
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [sortOrder, setSortOrder] = useState({ name: 'asc', role: 'asc' });
  const navigate = useNavigate();

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

  const handleSearchClear = () => {
    setSearchTerm('');
    setMessage('');
  };

  const handleSearchChange = (event) => {
    if (event && event.target) {  // Check if event and event.target are defined
      const searchTerm = event.target.value; // Accessing target.value safely
      setSearchTerm(searchTerm); // Update state
    }
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

  const openAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(true);
  };

  const closeAddEmployeeModal = () => {
    setIsAddEmployeeModalOpen(false);
    setNewEmployee({
      EmployeeName: '',
      Role: '',
      Salary: '',
      Location: '',
      AadharNo: '',
      MobileNo: '',
      JoiningDate: ''
    });
    getData();
  };

  const handleAddEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8085/addEmployee', newEmployee);
      closeAddEmployeeModal();
    } catch (error) {
      console.error('Error adding employee:', error.message);
    }
  };

  const openEditModal = (employee) => {
    setEditEmployee(employee);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditEmployee(null);
  };

  const handleEditEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee({ ...editEmployee, [name]: value });
  };

  const handleEditEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8085/updateEmployee/${editEmployee.id}`, editEmployee);
      closeEditModal();
      getData();
    } catch (error) {
      console.error('Error updating employee:', error.message);
    }
  };

  const gotohomepage = () => {
    navigate('/homepage1');
  };
  const goToNextScreen = () =>
  {
    navigate('/report');
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.formTitle}>Employee Data</h1>

        <br />
        <br />
        <div className={styles.searchContainer}>
          <SearchBox
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            styles={{
              root: { width: 300 },
              icon: { color: 'blue' },
            }}
          />
          <button className={styles.addButton} title='Add Employee' onClick={openAddEmployeeModal}>
            ADD
          </button>
        </div>

        <div className={styles.employeeTableWrapper}>
          <table className={styles.employeeTableContainer}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>
                  Name
                  {sortOrder.name === 'asc' ? (
                    <ArrowDropDownIcon onClick={sortNames} className={styles.sortIcon} />
                  ) : (
                    <ArrowDropUpIcon onClick={sortNames} className={styles.sortIcon} />
                  )}
                </th>
                <th className={styles.tableHeader}>
                  Role
                  {sortOrder.role === 'asc' ? (
                    <ArrowDropDownIcon onClick={sortRoles} className={styles.sortIcon} />
                  ) : (
                    <ArrowDropUpIcon onClick={sortRoles} className={styles.sortIcon} />
                  )}
                </th>
                <th className={styles.tableHeader}>Salary</th>
                <th className={styles.tableHeader}>Location</th>
                <th className={styles.tableHeader}>Aadhar No</th>
                <th className={styles.tableHeader}>Mobile No</th>
                <th className={styles.tableHeader}>Joining Date</th>
                <th className={styles.tableHeader}>Actions</th>
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
                  <td>
                    <div className={styles.actionIcons}>
                      <DeleteIcon onClick={() => confirmDelete(employee.id)} />
                      <EditIcon onClick={() => openEditModal(employee)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {message && <div className={styles.alertWarning}>{message}</div>}
        </div>
        <br></br>

        <div className='employeeFooter'>
          <button className={styles.goback} title="Go back" style={{marginLeft:"700px"}} onClick={gotohomepage}>
            BACK
          </button>
          <button className={styles.nextButton} title="Go next" onClick={goToNextScreen}>
            NEXT
          </button>
        </div>
  
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={isAddEmployeeModalOpen} onDismiss={closeAddEmployeeModal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalHeading}>Add Employee</h2>
          <CloseIcon onClick={closeAddEmployeeModal} className={styles.closeIcon} />
        </div>
        <form onSubmit={handleAddEmployeeSubmit} className={styles.modalForm}>
          <label>Name</label>
          <input
            placeholder='Enter Name'
            label="Employee Name"
            name="EmployeeName"
            value={newEmployee.EmployeeName}
            onChange={handleAddEmployeeChange}
            required
          />
          <label>Role</label>
          <input
            placeholder='Enter Role'
            label="Role"
            name="Role"
            value={newEmployee.Role}
            onChange={handleAddEmployeeChange}
            required
          />
          <label>Salary</label>
          <input
            placeholder='Enter Salary'
            label="Salary"
            name="Salary"
            type="number"
            value={newEmployee.Salary}
            onChange={handleAddEmployeeChange}
            required
          />
          <label>Location</label>
          <input
            placeholder='Enter Location'
            label="Location"
            name="Location"
            value={newEmployee.Location}
            onChange={handleAddEmployeeChange}
            required
          />
          <label>Aadhar No</label>
          <input
            placeholder='Enter Aadhar no:'
            label="Aadhar No"
            name="AadharNo"
            value={newEmployee.AadharNo}
            onChange={handleAddEmployeeChange}
            required
          />
          <label>Mobile No:</label>
          <input
            placeholder='Enter Mobile no:'
            label="Mobile No"
            name="MobileNo"
            value={newEmployee.MobileNo}
            onChange={handleAddEmployeeChange}
            required
          />
          <label>Joining Date</label>
          <input
            label="Joining Date"
            name="JoiningDate"
            type="date"
            value={newEmployee.JoiningDate}
            onChange={handleAddEmployeeChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <div className={styles.modalFooter}>
            <button className={styles.cancelButton} onClick={closeAddEmployeeModal}>Cancel</button>
            <button className={styles.Addbutton} type="submit" variant="contained" color="primary">
              Add
            </button>

          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditModalOpen} onDismiss={closeEditModal}>
        <div className={styles.modalHeader}>
          <h2>Edit Employee</h2>
          <CloseIcon onClick={closeEditModal} className={styles.closeIcon} />
        </div>
        <form onSubmit={handleEditEmployeeSubmit} className={styles.modalForm}>
          <label>Name</label>
          <input
            label="Employee Name"
            name="EmployeeName"
            value={editEmployee?.EmployeeName}
            onChange={handleEditEmployeeChange}
            required
          />
          <label>Role</label>
          <input
            label="Role"
            name="Role"
            value={editEmployee?.Role}
            onChange={handleEditEmployeeChange}
            required
          />
          <label>Salary</label>
          <input
            label="Salary"
            name="Salary"
            type="number"
            value={editEmployee?.Salary}
            onChange={handleEditEmployeeChange}
            required
          />
          <label>Location</label>
          <input
            label="Location"
            name="Location"
            value={editEmployee?.Location}
            onChange={handleEditEmployeeChange}
            required
          />
          <label>Aadhar No</label>
          <input
            label="Aadhar No"
            name="AadharNo"
            value={editEmployee?.AadharNo}
            onChange={handleEditEmployeeChange}
            required
          />
          <label>Mobile No</label>
          <input
            label="Mobile No"
            name="MobileNo"
            value={editEmployee?.MobileNo}
            onChange={handleEditEmployeeChange}
            required
          />
          <label>Joining Date</label>
          <input
            label="Joining Date"
            name="JoiningDate"
            type="date"
            value={editEmployee?.JoiningDate}
            onChange={handleEditEmployeeChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <div className={styles.modalFooter}>
            <button className={styles.cancelButton} onClick={closeEditModal}>Cancel</button>
            <button className={styles.Addbutton} type="submit" variant="contained" color="primary">
              Update
            </button>

          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteConfirmModal} onDismiss={cancelDeleteConfirmation}>
        <div className={styles.modalHeader}>
          <h2>Confirm Deletion</h2>
          <CloseIcon onClick={cancelDeleteConfirmation} className={styles.closeIcon} />
        </div>
        <div className={styles.modalBody}>
          <h5>Are you sure you want to delete this employee?</h5>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={handleDeleteConfirmation} variant="contained" color="secondary">
            Delete
          </button>
          <button className={styles.Addbutton} onClick={cancelDeleteConfirmation}>Cancel</button>
        </div>
      </Modal>
    </>
  );
};

export default EmployeeData;
