import React, { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import EventDonation from "./EventDonation";
import InkindDonation from "./InkindDonation";

import { useNavigate } from 'react-router-dom';
import { Pivot, PivotItem } from '@fluentui/react';
import styles from '../assets/DonationData.module.css';

const DonationData = () => {
    const navigate = useNavigate();
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
    const [totalMonthlyDonors, setTotalMonthlyDonors] = useState(0);
    const [selectedDonationType, setSelectedDonationType] = useState('monthly');

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
        const fetchMonthlyDonorsCount = async () => {
            try {
                const response = await axios.get('http://localhost:8085/MonthlyDonationData/count');
                setTotalMonthlyDonors(response.data.totalMonthlyDonors);
            } catch (error) {
                console.error('Error fetching donor count:', error);
            }
        };
        fetchMonthlyDonorsCount();
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

    const handleSaveDonation = async () => {
        // Validation
        const nameRegex = /^[A-Za-z\s]+$/; // Regex to allow only letters and spaces
    
        if (!donorName || !panNo || !date || !paymentMode || !amount) {
            setErrorMessage('All fields are required');
            return;
        }
    
        if (!nameRegex.test(donorName)) {
            setErrorMessage('Donor name must contain only letters');
            return;
        }
    
        if (isNaN(amount) || amount <= 0) {
            setErrorMessage('Amount must be a positive number');
            return;
        }
    
        if (panNo.length !== 10) {
            setErrorMessage('Length of PAN number must be exactly 10 characters');
            return;
        }
    
        const newDonation = { donor_name: donorName, pan_no: panNo, date, payment_mode: paymentMode, amount };
    
        try {
            if (editMode) {
                // Update Donation
                await axios.put(`http://localhost:8085/DonationData/${currentDonationId}`, newDonation);
                setSuccessMessage('Donation updated successfully');
            } else {
                // Add New Donation
                await axios.post('http://localhost:8085/DonationData', newDonation);
                setSuccessMessage('Donation added successfully');
            }
    
            // Fetch the updated donations list
            const response = await axios.get('http://localhost:8085/DonationData');
            setDonations(response.data);
    
            // Close the modal after successful operation
            closeModal();
    
            // Clear the input fields
            setDonorName('');
            setPanNo('');
            setDate('');
            setPaymentMode('');
            setAmount('');
    
        } catch (error) {
            console.error('Error saving donation:', error.response || error);
            setErrorMessage(`Error saving donation: ${error.response?.data?.message || error.message}`);
        }
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

    const gotoHomepage = () => {
        navigate('/homepage1');
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const goToNextScreen = () => {
        navigate('/expenseTable');
    };

    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    {/* <h1 className={styles["donationheader"]}>Donation Details</h1> */}
                    <Pivot aria-label="Donation Types" selectedKey={selectedDonationType} onLinkClick={item => setSelectedDonationType(item.props.itemKey)}>
                        <PivotItem headerText="Monthly Donations" itemKey="monthly" headerButtonProps={{
                            style: { fontSize: '20px', fontWeight: 'bold' }
                        }}>
                            <div className={styles["countdiv"]}>
                                <h2 className={styles["donor-count"]}>Number of Donors: {totalMonthlyDonors}</h2>
                                <button className={styles["add-btn"]} onClick={() => openModal()}>ADD DONATION</button>
                            </div>
                            <div className={styles["donation-table-wrapper"]}>

                            <table className={styles["donation-table"]}>
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
    {donations.length > 0 ? donations.map((donation, index) => (
        <tr key={donation.id || index}>
            <td>{donation.donor_name}</td>
            <td>{donation.pan_no}</td>
            <td>{formatDate(donation.date)}</td>
            <td>{donation.payment_mode}</td>
            <td>{donation.amount}</td>
            <td>
                <div className={styles["action-icon"]}>
                    <EditIcon className={styles["edit_action-icon"]} onClick={() => openModal(donation)} />
                    <DeleteIcon className={styles["delete_action-icon"]} onClick={() => handleDeleteDonation(donation.id)} />
                </div>
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
                            <br />
                        </PivotItem>
                        <PivotItem headerText="In-kind Donation" itemKey="inkind"
                            headerButtonProps={{
                                style: { fontSize: '20px', fontWeight: 'bold' }
                            }}>
                            <InkindDonation />
                        </PivotItem>
                        <PivotItem headerText="Event Donation" itemKey="event" headerButtonProps={{
                            style: { fontSize: '20px', fontWeight: 'bold' }
                        }}>
                            <EventDonation />
                        </PivotItem>
                    </Pivot>

                    <Modal open={isModalOpen} onClose={closeModal}>
                        <div className={styles["modal-content"]}>
                            <CloseIcon className={styles["close-icon"]} onClick={closeModal} />
                            <h3 className={styles.modalHeader}>{editMode ? 'Edit Donation' : 'Add Donation'}</h3>
                            <label>Donor Name</label>
                            <input
                                type="text"
                                value={donorName}
                                placeholder="Enter the name"
                                onChange={(e) => setDonorName(e.target.value)}
                            />
                            <br />

                            <label>PAN No</label>
                            <input
                                type="text"
                                value={panNo}
                                placeholder="Enter the PAN No"
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
                            <select
                                value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}
                            >
                                <option value="">Select Payment Mode</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="UPI">UPI</option>
                            </select>
                            <br />

                            <label>Amount</label>
                            <input
                                type="text"
                                value={amount}
                                placeholder="Enter the amount"
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <br />

                            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                            {successMessage && <p className={styles.success}>{successMessage}</p>}
                            <div className={styles.buttonDivision}>
                                <button className={styles.cancelButton} onClick={closeModal}>CANCEL</button>
                                <button className={styles.saveButton} onClick={handleSaveDonation}>{editMode ? 'Update Donation' : 'Save Donation'}</button>

                            </div>


                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default DonationData;
