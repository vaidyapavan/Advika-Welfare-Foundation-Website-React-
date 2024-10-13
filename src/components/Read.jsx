import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Searchbar from './Searchbar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


import styles from '../assets/Read.module.css';

const Read = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sortOrder, setSortOrder] = useState({ name: 'asc', class: 'asc' });
  const [genderTerm, setGenderTerm] = useState('');
  const [hobbyTerms, setHobbyTerms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:8085/getData');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const sortNames = () => {
    const sortedData = [...data].sort((a, b) => {
      return sortOrder.name === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    setData(sortedData);
    setSortOrder({ ...sortOrder, name: sortOrder.name === 'asc' ? 'desc' : 'asc' });
  };

  const sortClasses = () => {
    const sortedData = [...data].sort((a, b) => {
      return sortOrder.class === 'asc'
        ? a.studentClass.localeCompare(b.studentClass)
        : b.studentClass.localeCompare(a.studentClass);
    });
    setData(sortedData);
    setSortOrder({ ...sortOrder, class: sortOrder.class === 'asc' ? 'desc' : 'asc' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8085/deleteData/${id}`);
      getData();
      setIsDeleteConfirmModal(false);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const setToLocalStorageAndNavigate = (id, name, email, studentClass, hobby, gender) => {
    localStorage.setItem('ID', id);
    localStorage.setItem('Name', name);
    localStorage.setItem('Email', email);
    localStorage.setItem('StudentClass', studentClass);
    localStorage.setItem('Hobby', JSON.stringify(hobby));
    localStorage.setItem('Gender', gender);
    navigate('/Update');
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

  const handleChange = (newValue) => {
    setSearchTerm(newValue || '');
    setMessage('');
  };

  const handleClear = () => {
    setSearchTerm('');
    setMessage('');
  };

  const genderChange = (event, option) => {
    setGenderTerm(option ? option.key : ''); // Set the gender filter based on selected option
  };
  

  const handleHobbyChange = (selectedKeys) => {
    setHobbyTerms(selectedKeys);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const filteredData = data.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = !genderTerm || item.gender.toLowerCase() === genderTerm.toLowerCase(); // Matches all if gender is not selected
    const matchesHobbies = hobbyTerms.length === 0 || hobbyTerms.every((hobby) => item.hobby.includes(hobby));
    
    return matchesName && matchesGender && matchesHobbies;
  });
  
  useEffect(() => {
    if ((searchTerm || genderTerm || hobbyTerms.length > 0) && filteredData.length === 0) {
      setMessage('No data found');
    } else {
      setMessage('');
    }
  }, [searchTerm, genderTerm, hobbyTerms, filteredData]);

  const addStudent = () => {
    navigate('/create');
  };

  const goToHomepage = () => {
    navigate('/homepage1');
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.container}>
        <h2 className={styles.formTitle}>Student Information</h2>
        <button className="btn btn-primary mb-3" title="Go back" onClick={goToHomepage}>
          <ArrowBackIosIcon />
        </button>
        <div className={styles.header}>
          <Searchbar
            searchTerm={searchTerm}
            handleChange={handleChange}
            handleClear={handleClear}
            genderTerm={genderTerm}
            genderChange={genderChange}
            hobbyTerms={hobbyTerms}
            handleHobbyChange={handleHobbyChange}
          />
          <button className="btn btn-primary mb-3" title="Add student" style={{ marginLeft: "270px" }} onClick={addStudent}>
            Add
          </button>
        </div>

        <table className={styles.donationTable}>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>
                Name
                {sortOrder.name === 'asc' ? (
                  <ArrowDropDownIcon onClick={sortNames} style={{ cursor: 'pointer' }} />
                ) : (
                  <ArrowDropUpIcon onClick={sortNames} style={{ cursor: 'pointer' }} />
                )}
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '20%' }}>Email</th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>
                Class
                {sortOrder.class === 'asc' ? (
                  <ArrowDropDownIcon onClick={sortClasses} style={{ cursor: 'pointer' }} />
                ) : (
                  <ArrowDropUpIcon onClick={sortClasses} style={{ cursor: 'pointer' }} />
                )}
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '20%' }}>Hobbies</th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>Gender</th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td style={{ textAlign: 'center' }}>{item.studentClass}</td>
                <td style={{ textAlign: 'center' }}>
                  {Array.isArray(item.hobby) ? (
                    item.hobby.map((h, index) => (
                      <span key={index}>
                        {h}
                        {index !== item.hobby.length - 1 ? ', ' : ''}
                      </span>
                    ))
                  ) : (
                    <span>{item.hobby}</span>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {capitalizeFirstLetter(item.gender)}
                </td>
                <td style={{ textAlign: 'center' }} className={styles.action} >
                  <EditIcon title="Edit" style={{ marginLeft: "80px" }} onClick={() => setToLocalStorageAndNavigate(item.id, item.name, item.email, item.studentClass, item.hobby, item.gender)} />
                  <DeleteIcon title="Delete" style={{ marginLeft: "10px" }} onClick={() => confirmDelete(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {message && <p style={{ textAlign: 'center' }}>{message}</p>}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmModal}
        onDismiss={cancelDeleteConfirmation}
        isBlocking={false}
        className={styles.custom_modal}
      >
        <div className={styles.modal_container}>
          <CloseIcon className={styles.close_icon} onClick={cancelDeleteConfirmation} />
          <div className={styles.modal_body}>
            <h4 className={styles.deleteHeader}>Are you sure you want to delete?</h4>
          </div>
          <br></br>
          <div className={styles.modal_footer}>
            <button  className={styles.cancelButton}onClick={cancelDeleteConfirmation}>Cancel</button>
            <button  className={styles.Addbutton} onClick={handleDeleteConfirmation}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Read;
