import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import '../assets/Update.css';
import { Label } from '@fluentui/react/lib/Label';


const Update = () => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [hobby, setHobby] = useState([]);
    const [gender, setGender] = useState('');

    const [issavemodal, setIssavemodal] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [hobbyError, setHobbyError] = useState("");
    const [studentClassError, setStudentClassError] = useState("");
    const [genderError, setGenderError] = useState("");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z\s]*$/;
    const navigate = useNavigate();

    useEffect(() => {
        const storedId = localStorage.getItem("ID");
        setId(storedId);
        setName(localStorage.getItem("Name"));
        setEmail(localStorage.getItem("Email"));

        axios.get(`http://localhost:8085/getData`)
            .then(response => {
                const data = response.data.find(item => item.id === parseInt(storedId));
                if (data) {
                    setStudentClass(data.studentClass);

                    // Convert hobbies string into proper select options
                    const hobbiesArray = data.hobby.split(',').map(h => ({ value: h.trim(), label: h.trim() }));
                    setHobby(hobbiesArray);

                    setGender(data.gender.toLowerCase()); // Set gender correctly
                }
            })
            .catch(error => {
                console.error('Error fetching additional data:', error);
            });
    }, []);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const validateForm = () => {
        let isValid = true;

        if (name.length <= 3 || !name.match(nameRegex)) {
            setNameError('Name must be more than 3 letters and contain only letters.');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!email.match(emailRegex)) {
            setEmailError('Invalid email address.');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (studentClass === '') {
            setStudentClassError('Student class field is required.');
            isValid = false;
        } else {
            setStudentClassError('');
        }

        if (hobby.length === 0) {
            setHobbyError('At least one hobby must be selected.');
            isValid = false;
        } else {
            setHobbyError('');
        }

        if (gender === '') {
            setGenderError('Gender field is required.');
            isValid = false;
        } else {
            setGenderError('');
        }

        return isValid;
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const capitalizedGender = capitalizeFirstLetter(gender);
        axios.put(`http://localhost:8085/update/${id}`, {
            name: name,
            email: email,
            studentClass: studentClass,
            hobby: hobby.map(h => h.value).join(','),  // Convert hobby array to string
            gender: capitalizedGender
        })
            .then(response => {
                setIssavemodal(true);
            })
            .catch(error => {
                console.error('Error updating item:', error);
            });
    };

    const handleHobbyChange = (selectedOptions) => {
        setHobby(selectedOptions);
    };

    const cancelUpdate = () => {
        navigate('/read');
    };

    const cancelcloseModal = () => {
        setIsCancelModalOpen(false);
    };

    const gotoreadpage = () => {
        navigate('/read');
    };

    const hobbyOptions = [
        { value: 'Reading', label: 'Reading' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Music', label: 'Music' },
        { value: 'Drawing', label: 'Drawing' },
        // Add more options as needed
    ];

    return (
        <div className="update-container">
            
            <CloseIcon onClick = {gotoreadpage}  style={{marginLeft:"540px"}}></CloseIcon>
            <h2>Update Student Data</h2>
            
            
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <Label required>Name</Label>
                    <input
                        type="text"
                        className={`form-control ${nameError ? 'is-invalid' : ''}`}
                        id="exampleInputName1"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        type="text"
                        className={`form-control ${emailError ? 'is-invalid' : ''}`}
                        id="exampleInputEmail1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        onChange={(e) => setStudentClass(e.target.value)}
                    >
                        <option value="">Select Class</option>
                        <option value="11th">11th</option>
                        <option value="12th">12th</option>
                        <option value="FE">FE</option>
                        <option value="SE">SE</option>
                        <option value="Last year other">Last year other</option>
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
                        className={`basic-multi-select ${hobbyError ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        value={hobby}
                        onChange={handleHobbyChange}
                    />
                    {hobbyError && (
                        <div className="invalid-feedback">
                            {hobbyError}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <Label required>Gender</Label>
                    <div className="form-check" style={{ marginBottom: '10px' }}>
                        <input
                            className={`form-check-input ${genderError ? 'is-invalid' : ''}`}
                            type="radio"
                            id="male"
                            value="male"
                            checked={gender === 'male'}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="male">
                            Male
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className={`form-check-input ${genderError ? 'is-invalid' : ''}`}
                            type="radio"
                            id="female"
                            value="female"
                            checked={gender === 'female'}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="female">
                            Female
                        </label>
                    </div>
                    {genderError && (
                        <div className="invalid-feedback">
                            {genderError}
                        </div>
                    )}
                </div>
                <button type="button" className="btn btn-primary" onClick={gotoreadpage} style={{ marginLeft: "170px", marginRight: "-10px" }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ marginLeft: '30px', marginRight: "80px" }}>Save</button>
            </form>

            <Modal isOpen={issavemodal} onDismiss={cancelcloseModal} className="custom-modal">
                <div className="modal-content" style={{ alignItems: "center" }}>
                    <br />
                    <h4>Updated Successfully</h4>
                    <br />
                    <button type="button" className="btn btn-primary" onClick={gotoreadpage}>OK</button>
                </div>
            </Modal>
        </div>
    );
};

export default Update;
