import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import { Label } from '@fluentui/react/lib/Label';

import '../assets/Create.css';
import { initializeIcons } from '@fluentui/font-icons-mdl2';

initializeIcons();

const Create = ({handlePageChange }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [hobbies, setHobbies] = useState([]);
    const [gender, setGender] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [studentClassError, setStudentClassError] = useState('');
    const [hobbiesError, setHobbiesError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z\s]*$/;

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (value.match(nameRegex) && value.length > 3) {
            setName(value);
            setNameError('');
        } else {
            setName(value);
            setNameError('Name must be more than 3 letters and contain only letters.');
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (!value.match(emailRegex)) {
            setEmailError('Invalid email address.');
        } else {
            setEmailError('');
        }
    };

    const handleStudentClassChange = (e) => {
        const value = e.target.value;
        setStudentClass(value);
        if (value === '') {
            setStudentClassError('Student class field is required.');
        } else {
            setStudentClassError('');
        }
    };

    const handleHobbyChange = (selectedOptions) => {
        setHobbies(selectedOptions);
        if (selectedOptions.length === 0) {
            setHobbiesError('At least one hobby must be selected.');
        } else {
            setHobbiesError('');
        }
    };

    const handleGenderChange = (e) => {
        const value = e.target.value;
        setGender(value);
        if (value === '') {
            setGenderError('Gender field is required.');
        } else {
            setGenderError('');
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8085/create', {
                name,
                email,
                studentClass,
                hobbies: hobbies.map(hobby => hobby.value), // Send hobbies as an array of strings
                gender: capitalizeFirstLetter(gender),
            });

            console.log('Form data submitted successfully:', response.data);

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        handlePageChange('Read');
    };

    const hobbyOptions = [
        { value: 'Reading', label: 'Reading' },
        { value: 'Gaming', label: 'Gaming' },
        { value: 'Travelling', label: 'Travelling' },
        { value: 'Cooking', label: 'Cooking' },
        { value: 'Badminton', label: 'Badminton' },
        { value: 'Singing', label: 'Singing' },
        { value: 'Writting', label: 'Writting' },
        { value: 'Painting', label: 'Painting' },
        { value: 'Cricket', label: 'Cricket' },
        { value: 'Other', label: 'Other' },
        { value: 'None', label: 'None' }
    ];

    const cancelForm = () => {
        handlePageChange('Read');
       
    };

    const validateForm = () => {
        let isValid = true;

        // Validate Name
        if (name.length <= 3 || !name.match(nameRegex)) {
            setNameError('Name must be more than 3 letters and contain only letters.');
            isValid = false;
        } else {
            setNameError('');
        }

        // Validate Email
        if (!email.match(emailRegex)) {
            setEmailError('Invalid email address.');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Validate Student Class
        if (studentClass === '') {
            setStudentClassError('Student class field is required.');
            isValid = false;
        } else {
            setStudentClassError('');
        }

        // Validate Hobbies
        if (hobbies.length === 0) {
            setHobbiesError('At least one hobby must be selected.');
            isValid = false;
        } else {
            setHobbiesError('');
        }

        // Validate Gender
        if (gender === '') {
            setGenderError('Gender field is required.');
            isValid = false;
        } else {
            setGenderError('');
        }

        return isValid;
    };

    return (
        <div className="create-container">
            <div className="form-container">
                <CloseIcon onClick={cancelForm} className="close-icon" style={{ marginLeft: "490px", marginTop: "-20px", marginRight: "-30px", cursor: "pointer" }} />
                <h2 className="form-title">Add Student Data</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <Label required>Name</Label>
                        <input
                            placeholder="Enter student name"
                            type="text"
                            className={`form-control ${nameError ? 'is-invalid' : ''}`}
                            id="exampleInputName1"
                            value={name}
                            onChange={handleNameChange}
                        />
                        {nameError && (
                            <div className="invalid-feedback">
                                {nameError}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                    <Label required>Email</Label>
                        <input
                            placeholder="Enter student email"
                            type="text"
                            className={`form-control ${emailError ? 'is-invalid' : ''}`}
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {emailError && (
                            <div className="invalid-feedback">
                                {emailError}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                    <Label required>Student class</Label>
                        <select
                            className={`form-select ${studentClassError ? 'is-invalid' : ''}`}
                            id="exampleStudentClass"
                            value={studentClass}
                            onChange={handleStudentClassChange}
                        >
                            <option value="">Select Class</option>
                            <option value="11th">11th</option>
                            <option value="12th">12th</option>
                            <option value="FE">First Year</option>
                            <option value="SE">Second Year</option>
                            <option value="TE">Third Year</option>
                            <option value="Last year">Last year</option>
                            <option value="other">Other</option>
                        </select>
                        {studentClassError && (
                            <div className="invalid-feedback">
                                {studentClassError}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                    <Label required>Hobbies</Label>
                        <Select
                            isMulti
                            name="hobbies"
                            options={hobbyOptions}
                            className={`basic-multi-select ${hobbiesError ? 'is-invalid' : ''}`}
                            classNamePrefix="select"
                            value={hobbies}
                            onChange={handleHobbyChange}
                        />
                        {hobbiesError && (
                            <div className="invalid-feedback">
                                {hobbiesError}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                    <Label required>Gender</Label>
                        <br />
                        <div style={{ color: "red" }}>{genderError}</div>
                        <div className="form-check" style={{ marginBottom: '4px', marginLeft:"-20px"}}>
                            <input
                                className="radio-container"
                                type="radio"
                                id="Male"
                                value="Male"
                                checked={gender === 'Male'}
                                onChange={handleGenderChange}
                            />
                            <label className="form-check-label" htmlFor="Male">
                                Male
                            </label>
                        </div>
                        <div className="form-check" style={{marginLeft:"-20px"}}>
                            <input
                                className="radio-button"
                                type="radio"
                                id="Female"
                                value="Female"
                                checked={gender === 'Female'}
                                onChange={handleGenderChange}
                                
                            />
                            <label className="form-check-label" htmlFor="Female" style={{}}>
                                Female
                            </label>
                        </div>
                        {genderError && (
                            <div className="invalid-feedback">
                                {genderError}
                            </div>
                        )}
                    </div>
                    <button type="button" className="btn btn-primary" style={{ marginLeft: '170px', marginRight: '10px' }} onClick={cancelForm}>Back</button>
                    <button type="submit" className="btn btn-primary" style={{ marginLeft: '10px' }}>ADD</button>
                </form>
            </div>

            <Modal isOpen={isModalOpen} onDismiss={closeModal} className="custom-modal">
                <div className="modal-content">
                    <div className="success-message" style={{ color: "black" }}>Form data submitted successfully!!</div>
                    <button className="ok-button" style={{ marginLeft: "100px", marginTop: "40px" }} onClick={closeModal}>OK</button>
                </div>
            </Modal>
        </div>
    );
};

export default Create;
