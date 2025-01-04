import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import styles from '../assets/InkindDonation.module.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const InkindDonation = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [donorName, setDonorName] = useState('');
    const [panNo, setPanNo] = useState('');
    const [date, setDate] = useState('');
    const [donationType, setDonationType] = useState('');
    const [description, setDescription] = useState('');
    const [currentId, setCurrentId] = useState(null);
    const [totalinkindDonors, setTotalinkindDonors] = useState(0);

    const [donations, setDonations] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get('http://localhost:8085/inkind_donation');
                setDonations(response.data);
            } catch (error) {
                console.error('Error fetching donations!', error);
            }
        };

        fetchDonations();

        const fetchInkindDonorsCount = async () => {
            try {
                const response = await axios.get('http://localhost:8085/InkindDonation/count');
                setTotalinkindDonors(response.data.totalInkindlyDonors);
            } catch (error) {
                console.error('Error fetching donor count:', error);
            }
        };
        fetchInkindDonorsCount();
    }, []);

    const openModal = (donation = null) => {
        if (donation) {
            setDonorName(donation.donor_name);
            setPanNo(donation.pan_no);
            setDate(donation.date);
            setDonationType(donation.donation_type);
            setDescription(donation.description);
            setCurrentId(donation.id);
            setIsEditMode(true);
        } else {
            setDonorName('');
            setPanNo('');
            setDate('');
            setDonationType('');
            setDescription('');
            setCurrentId(null);
            setIsEditMode(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = async () => {
        // Validation
        const nameRegex = /^[A-Za-z\s]+$/;  // Regex to allow only letters and spaces
        if (!donorName || !panNo || !date || !donationType || !description) {
            setErrorMessage('All fields are required');
            return;
        }

        // Validate donor name (only letters and spaces)
        if (!nameRegex.test(donorName)) {
            setErrorMessage('Donor name must contain only letters');
            return;
        }

        // Validate PAN number length
        if (panNo.length !== 10) {
            setErrorMessage('PAN number must be exactly 10 characters');
            return;
        }

        const data = {
            donor_name: donorName,
            pan_no: panNo,
            date,
            donation_type: donationType,
            description
        };

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:8085/inkind_donation/${currentId}`, data);
            } else {
                await axios.post('http://localhost:8085/inkind_donation', data);
            }

            const response = await axios.get('http://localhost:8085/inkind_donation');
            setDonations(response.data);

            closeModal();
            setErrorMessage(''); // Clear error message on success
        } catch (error) {
            console.error("Error saving donation!", error.response?.data || error.message);
            setErrorMessage(`An error occurred while saving the donation. Please try again.`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8085/inkind_donation/${id}`);

            const response = await axios.get('http://localhost:8085/inkind_donation');
            setDonations(response.data);
        } catch (error) {
            console.error("Error deleting donation!", error);
            alert("An error occurred while deleting the donation. Please try again.");
        }
    };

    const gotoHomepage = () => {
        navigate('/homepage1');
    }
    const goToNextScreen = () => {
        navigate('/expenseTable');
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    return (
        <div className={styles.inkindDonationContainer}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h5>Number of Donors: {totalinkindDonors}</h5>
                    <button className={styles.addDonationButton} onClick={() => openModal()}>
                        ADD DONATION
                    </button>
                </div>

                <div className={styles.scrollableTableContainer}>

                    <table className={styles.inkindDonationTable}>
                        <thead>
                            <tr>
                                <th>Donor Name</th>
                                <th>PAN No</th>
                                <th>Date</th>
                                <th>Donation Type</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(donation => (
                                <tr key={donation.id}>
                                    <td>{donation.donor_name}</td>
                                    <td>{donation.pan_no}</td>
                                    <td>{formatDate(donation.date)}</td>
                                    <td>{donation.donation_type}</td>
                                    <td className={styles.scrollableTd}>{donation.description}</td>
                                    <td>
                                        <div className={styles.actionIcon}>
                                            <EditIcon className={styles.actionIcon} onClick={() => openModal(donation)} />
                                            <DeleteIcon className={styles.actionIcon} onClick={() => handleDelete(donation.id)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>


                    </table>
                    <br></br>

                </div>



                <Modal
                    open={isModalOpen}
                    onClose={closeModal}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <CloseIcon onClick={closeModal} className={styles.closeIcon} />
                            <h2 id="modal-title" className={styles.modalTitle}>
                                {isEditMode ? 'In-kind Donation' : 'In-kind Donation'}
                            </h2>
                        </div>
                        <form className={styles.modalForm}>
                            {/* Display error message if it exists */}
                            {errorMessage && (
                                <div className={styles.errorMessage}>
                                    {errorMessage}
                                </div>
                            )}
                            <TextField
                                label="Donor Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={donorName}
                                onChange={(e) => setDonorName(e.target.value)}
                            />
                            <TextField
                                label="PAN No"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={panNo}
                                onChange={(e) => setPanNo(e.target.value)}
                            />
                            <TextField
                                label="Date"
                                type="date"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <TextField
                                label="Donation Type"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={donationType}
                                onChange={(e) => setDonationType(e.target.value)}
                            />
                            <TextField
                                label="Description"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                            <div className={styles.cancel_save_buttons}>
                                <button className={styles.cancelButton} onClick={closeModal}> CANCEL</button>
                                <button
                                    className={styles.saveButton}
                                    onClick={handleSave}
                                >
                                    SAVE
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

            </div>
        </div>
    );
};

export default InkindDonation;
