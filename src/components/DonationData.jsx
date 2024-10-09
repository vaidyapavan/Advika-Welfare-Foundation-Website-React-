import React, { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import '../assets/DonationData.css';
import EventDonation from "./EventDonation";

const DonationData = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [donations, setDonations] = useState([]);
    const [donorName, setDonorName] = useState('');
    const [panNo, setPanNo] = useState('');
    const [date, setDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [amount, setAmount] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentDonationId, setCurrentDonationId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // useEffect(() => {
    //     fetchDonations();

    // }, []);

    // const fetchDonations = () => {
    //     axios.get('http://localhost:8085/DonationData')
    //         .then(response => {
    //             console.log('Fetched donations:', response.data); 
    //             setDonations(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching donations:', error);
    //             setErrorMessage('Error fetching donations');
    //         });
    // };


    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get('http://localhost:8085/DonationData');
                setDonations(response.data);
            } catch (error) {
                console.error('There was an error fetching the donations!', error);
            }
        };

        fetchDonations();
    }, []);




    const openModal = (donation = null) => {
        if (donation) {
            setEditMode(true);
            setCurrentDonationId(donation.id);
            setDonorName(donation.donor_name);
            setPanNo(donation.pan_no);
            setDate(donation.date);
            setPaymentMode(donation.payment_mode);
            setAmount(donation.amount);
        } else {
            setEditMode(false);
            setDonorName('');
            setPanNo('');
            setDate('');
            setPaymentMode('');
            setAmount('');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleSaveDonation = () => {
        if (!donorName || !panNo || !date || !paymentMode || !amount) {
            setErrorMessage('All fields are required');
            return;
        }
    
        if (isNaN(amount) || amount <= 0) {
            setErrorMessage('Amount must be a positive number');
            return;
        }
    
        const newDonation = { donor_name: donorName, pan_no: panNo, date, payment_mode: paymentMode, amount };
    
        if (editMode) {
            axios.put(`http://localhost:8085/DonationData/${currentDonationId}`, newDonation)
                .then(response => {
                    setDonations(donations.map(donation => donation.id === currentDonationId ? response.data : donation));
                    setSuccessMessage('Donation updated successfully');
                    closeModal();
                })
                .catch(error => {
                    console.error('Error updating donation:', error.response || error);
                    setErrorMessage(`Error updating donation: ${error.response?.data?.message || error.message}`);
                });
        } else {
            axios.post('http://localhost:8085/DonationData', newDonation)
                .then(response => {
                    setDonations(prevDonations => [...prevDonations, response.data]);
                    setSuccessMessage('Donation added successfully');
                    closeModal();
                })
                .catch(error => {
                    console.error('Error adding donation:', error.response || error);
                    setErrorMessage(`Error adding donation: ${error.response?.data?.message || error.message}`);
                });
        }
    
        // Reset form fields
        setDonorName('');
        setPanNo('');
        setDate('');
        setPaymentMode('');
        setAmount('');
    };


    const handleDeleteDonation = (id) => {
        if (id === undefined || id === null) {
            console.error('Invalid ID for deletion');
            return;
        }
        axios.delete(`http://localhost:8085/DonationData/${id}`)
            .then(() => {
                setDonations(donations.filter(donation => donation.id !== id));
                setSuccessMessage('Donation deleted successfully');
            })
            .catch(error => {
                setErrorMessage('Error deleting donation');
                console.error('Error deleting donation:', error);
            });
    };
    
    
    

    return (
        <>
            <div className="main-container">
                <h2>Donation Details</h2>
                <button className="add-btn" onClick={() => openModal()}>Add Donation</button>
                <h2>Monthly donation</h2>

                <table className="donation-table">
                    <thead>
                        <tr>
                            <th>Donor Name</th>
                            <th>PAN No</th>
                            <th>Date</th>
                            <th>Payment Mode</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.length > 0 ? donations.map((donation) => (
                            <tr key={donation.id}>
                                <td>{donation.donor_name}</td>
                                <td>{donation.pan_no}</td>
                                <td>{donation.date}</td>
                                <td>{donation.payment_mode}</td>
                                <td>{donation.amount}</td>
                                <td>
                                    <DeleteIcon className="action-icon" onClick={() => handleDeleteDonation(donation.id)} />
                                    <EditIcon className="action-icon" onClick={() => openModal(donation)} />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6">No donations available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <EventDonation></EventDonation>

            <Modal open={isModalOpen} onClose={closeModal}>
                <div className="modal-content">
                    <CloseIcon className="close-icon" onClick={closeModal} />
                    <h3>{editMode ? 'Edit Donation' : 'Add Donation'}</h3>

                    <label>Donor Name</label>
                    <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                    />
                    <br />

                    <label>PAN No</label>
                    <input
                        type="text"
                        value={panNo}
                        onChange={(e) => setPanNo(e.target.value)}
                    />
                    <br />

                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <br />

                    <label>Payment Mode</label>
                    <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                        <option value="">Select Payment Mode</option>
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                        <option value="CreditCard">Credit Card</option>
                    </select>
                    <br />

                    <label>Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <br />

                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <button className="submit-btn" onClick={handleSaveDonation}>
                        {editMode ? 'Update Donation' : 'Add Donation'}
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default DonationData;