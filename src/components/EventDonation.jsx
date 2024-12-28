import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import styles from '../assets/EventDonation.module.css'; // Import the CSS Module
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const EventDonation = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [donorName, setDonorName] = useState('');
    const [panNo, setPanNo] = useState('');
    const [date, setDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [currentId, setCurrentId] = useState(null);
    const [totalEventlyDonors, setTotalEventlyDonors] = useState(0);
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get('http://localhost:8085/EventDonation');
                setDonations(response.data);
            } catch (error) {
                console.error('Error fetching donations', error);
            }
        };

        const fetchEventDonorsCount = async () => {
            try {
                const response = await axios.get('http://localhost:8085/EventDonation/count');
                setTotalEventlyDonors(response.data.totalEventlyDonors);
            } catch (error) {
                console.error('Error fetching donor count', error);
            }
        };

        fetchDonations();
        fetchEventDonorsCount();
    }, []);

    const openModal = (donation = null) => {
        if (donation) {
            setDonorName(donation.donor_name);
            setPanNo(donation.pan_no);
            setDate(donation.date);
            setPaymentMode(donation.payment_mode);
            setAmount(donation.amount);
            setReason(donation.reason);
            setCurrentId(donation.id);
            setIsEditMode(true);
        } else {
            setDonorName('');
            setPanNo('');
            setDate('');
            setPaymentMode('');
            setAmount('');
            setReason('');
            setCurrentId(null);
            setIsEditMode(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = async () => {
        try {
            const data = { donorName, panNo, date, paymentMode, amount, reason };
            if (isEditMode) {
                await axios.put(`http://localhost:8085/EventDonation/${currentId}`, data);
            } else {
                await axios.post('http://localhost:8085/EventDonation', data);
            }

            const response = await axios.get('http://localhost:8085/EventDonation');
            setDonations(response.data);
            closeModal();
        } catch (error) {
            console.error('Error saving donation', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8085/EventDonation/${id}`);
            const response = await axios.get('http://localhost:8085/EventDonation');
            setDonations(response.data);
        } catch (error) {
            console.error('Error deleting donation', error);
        }
    };

    const gotoHomepage = () => {
        navigate('/homepage1');
    };
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
        <div className={styles.eventDonationContainer}>
            <div className={styles.container}>
                <div className={styles.countdiv}>
                    <h5>Number of Donors: {totalEventlyDonors}</h5>
                    <button
                        className={styles.addDonationButton}
                        onClick={() => openModal()}
                    >
                        ADD DONATION
                    </button>
                </div>


                <div className={styles.scrollableTableContainer}>

                    <table className={styles.eventDonationTable}>
                        <thead>
                            <tr>
                                <th>Donor Name</th>
                                <th>PAN No</th>
                                <th>Date</th>
                                <th>Payment Mode</th>
                                <th>Amount</th>
                                <th>Reason</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(donation => (
                                <tr key={donation.id}>
                                    <td>{donation.donor_name}</td>
                                    <td>{donation.pan_no}</td>
                                    <td>{formatDate(donation.date)}</td>
                                    <td>{donation.payment_mode}</td>
                                    <td>{donation.amount}</td>
                                    <td>{donation.reason}</td>
                                    <td>
                                        <div className={styles.actionIcon}>
                                            <EditIcon onClick={() => openModal(donation)} />
                                            <DeleteIcon onClick={() => handleDelete(donation.id)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br></br>

                </div>


                <Modal open={isModalOpen} onClose={closeModal}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{isEditMode ? 'Edit Event Donation' : 'Add Event Donation'}</h2>
                            <CloseIcon className={styles.closeIcon} onClick={closeModal} />
                        </div>
                        <form className={styles.modalForm}>
                            <TextField
                                label="Donor Name"
                                fullWidth
                                margin="normal"
                                value={donorName}
                                onChange={(e) => setDonorName(e.target.value)}
                            />
                            <TextField
                                label="PAN No"
                                fullWidth
                                margin="normal"
                                value={panNo}
                                onChange={(e) => setPanNo(e.target.value)}
                            />
                            <TextField
                                label="Date"
                                type="date"
                                fullWidth
                                margin="normal"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <TextField
                                label="Payment Mode"
                                select
                                fullWidth
                                margin="normal"
                                value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}
                            >
                                <MenuItem value="Online">Online</MenuItem>
                                <MenuItem value="Offline">Offline</MenuItem>
                                <MenuItem value="Credit Card">Credit Card</MenuItem>
                                <MenuItem value="Cash">Cash</MenuItem>
                            </TextField>
                            <TextField
                                label="Amount"
                                type="number"
                                fullWidth
                                margin="normal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <TextField
                                label="Reason"
                                fullWidth
                                margin="normal"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                            <div className={styles.cancel_saveButton_division}>
                                <button className={styles.cancelButton} onClick={closeModal}> CANCEL</button>
                                <button className={styles.saveButton} variant="contained" onClick={handleSave}>
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

export default EventDonation;
