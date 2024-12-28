import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from '@fluentui/react'; // Make sure you have Fluent UI installed
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    EmployeeName: '',
    Role: '',
    Salary: '',
    Location: '',
    AadharNo: '',
    MobileNo: '',
    JoiningDate: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!name) {
      console.error('Change event triggered by an element without a name attribute.');
      return;
    }
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/addEmployee', employeeData);
      console.log(response.data.message);
      setIsModalOpen(true); // Show the modal upon successful submission
    } catch (error) {
      console.error('There was an error adding the employee:', error);
      alert('Failed to add employee.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/employeeData'); 
  };

  const goback = () => {
    navigate('/employeeData');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <ClearIcon
          style={{ marginLeft: '530px', marginTop: '-5px', cursor: 'pointer' }}
          onClick={goback}
        />
        <h2>Add Employee</h2>

        <div>
          <label htmlFor="EmployeeName">Employee Name</label>
          <input
            type="text"
            name="EmployeeName"
            placeholder="Employee Name"
            value={employeeData.EmployeeName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Role">Role</label>
          <select
            name="Role"
            value={employeeData.Role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Developer">Founder</option>
            <option value="Manager">Administractor</option>
            <option value="Designer">workers</option>
            <option value="Analyst">consultant</option>
            <option value="Analyst">Care taker</option>
          </select>
        </div>
        <div>
          <label htmlFor="Salary">Salary</label>
          <input
            type="text"
            name="Salary"
            placeholder="Salary"
            value={employeeData.Salary}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Location">Location</label>
          <input
            type="text"
            name="Location"
            placeholder="Location"
            value={employeeData.Location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="AadharNo">Aadhar No</label>
          <input
            type="text"
            name="AadharNo"
            placeholder="Aadhar No"
            value={employeeData.AadharNo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="MobileNo">Mobile No</label>
          <input
            type="text"
            name="MobileNo"
            placeholder="Mobile No"
            value={employeeData.MobileNo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="JoiningDate">Joining Date</label>
          <input
            type="date"
            name="JoiningDate"
            value={employeeData.JoiningDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ marginLeft: '230px' }}>SAVE</button>
        <button style={{ marginLeft: '10px' }} onClick={goback}>CANCEL</button>

        <Modal
          isOpen={isModalOpen}
          onDismiss={closeModal}
          className="custom-modal"
        >
          <div className="modal-content">
            <div className="success-message" style={{ color: 'black' }}>
              Form data submitted successfully!!
            </div>
            <button
              className="ok-button"
              style={{ marginLeft: '100px', marginTop: '40px' }}
              onClick={closeModal}
            >
              OK
            </button>
          </div>
        </Modal>
      </form>
    </>
  );
};

export default AddEmployee;
