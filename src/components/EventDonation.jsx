import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, IconButton, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import '../assets/EventDonation.css'; // Import the CSS file
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EventDonation = () => {
    // State to handle modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // State for form inputs
    const [donorName, setDonorName] = useState('');
    const [panNo, setPanNo] = useState('');
    const [date, setDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [currentId, setCurrentId] = useState(null);

    // State for fetched data
    const [donations, setDonations] = useState([]);

    // Fetch donations on component mount
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get('http://localhost:8085/EventDonation');
                setDonations(response.data);
            } catch (error) {
                console.error('There was an error fetching the donations!', error);
            }
        };

        fetchDonations();
    }, []);

    // Function to open the modal
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

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to handle form submission
    const handleSave = async () => {
        try {
            const data = {
                donorName,
                panNo,
                date,
                paymentMode,
                amount,
                reason
            };

            if (isEditMode) {
                // Axios request to update the data
                await axios.put(`http://localhost:8085/EventDonation/${currentId}`, data);
            } else {
                // Axios request to add a new donation
                await axios.post('http://localhost:8085/EventDonation', data);
            }

            // Fetch updated data
            const response = await axios.get('http://localhost:8085/EventDonation');
            setDonations(response.data);

            // Close modal and reset form on successful submission
            closeModal();
        } catch (error) {
            console.error("There was an error saving the donation!", error);
        }
    };

    // Function to handle delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8085/EventDonation/${id}`);

            // Fetch updated data
            const response = await axios.get('http://localhost:8085/EventDonation');
            setDonations(response.data);
        } catch (error) {
            console.error("There was an error deleting the donation!", error);
        }
    };

    return (
        <div className="event-donation-container">
            <h5 className="event-donation-heading">Event Donation</h5>
            <Button className="add-donation-button" variant="contained" color="primary" onClick={() => openModal()}>ADD Event Donation</Button>
            <table className="event-donation-table">
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
                            <td>{donation.date}</td>
                            <td>{donation.payment_mode}</td>
                            <td>{donation.amount}</td>
                            <td>{donation.reason}</td>
                            <td>
                                <IconButton onClick={() => openModal(donation)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(donation.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className="modal-container">
                    <div className="modal-header">
                        <h2 id="modal-title" className="modal-title">{isEditMode ? 'Edit Event Donation' : 'Add Event Donation'}</h2>
                        <IconButton className="modal-close-button" onClick={closeModal}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <form className="modal-form">
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
                            label="Payment Mode"
                            select
                            variant="outlined"
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
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <TextField
                            label="Reason"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <Button
                            className="save-button"
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default EventDonation;
