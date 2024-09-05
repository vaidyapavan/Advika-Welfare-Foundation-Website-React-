import React, { useState } from 'react';
import '../assets/AddExpense.css';
import CloseIcon from '@mui/icons-material/Close';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { Modal } from '@fluentui/react/lib/Modal';

const AddExpense = ({ handlePageChange }) => {
    const [formData, setFormData] = useState({
        date: '',
        reason: '',
        category: '',
        amount: '',
        paymentMode: '',
        description: ''
    });

    const [error, setError] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (!formData.date || !formData.reason || !formData.category || !formData.amount || !formData.paymentMode) {
            setError('All fields are required');
            return;
        }

        setError(''); // Clear any existing error message

        // Format the date to YYYY-MM-DD for storage
        const formattedDate = formatDateForStorage(formData.date);

        try {
            const response = await fetch('http://localhost:8085/addExpense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData, date: formattedDate })
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
                setFormData({
                    date: '',
                    reason: '',
                    category: '',
                    amount: '',
                    paymentMode: '',
                    description: ''
                });
                setSuccessModalVisible(true); // Show success modal
            } else {
                console.error('Error:', result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const onCancel = () => {
        handlePageChange('ExpenseTable');
    };

    const formatDateForStorage = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleCloseModal = () => {
        setSuccessModalVisible(false);
        handlePageChange('ExpenseTable');
    };

    return (
        <>
            <div className='main-container'>
                <form onSubmit={handleSubmit}>
                    <h2>Add Transaction</h2>
                    <CloseIcon onClick={onCancel} style={{ cursor: "pointer", marginLeft: "540px", marginTop: "-100px" }} />
                    
                    <label>Transaction Date <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        placeholder="Select the date"
                    />
                    <br />
                    
                    <label>Reason <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="text"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        placeholder="Enter the reason for expense"
                    />
                    <br />
                    
                    <label>Category <span style={{ color: 'red' }}>*</span></label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                    >
                        <option value="">Select a category</option>
                        <option value="food">Food</option>
                        <option value="education">Education</option>
                        <option value="vegetables">Vegetables</option>
                        <option value="travel">Travel</option>
                        <option value="grocery">Grocery</option>
                    </select>
                    <br />
                    
                    <label>Amount (₹) <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                    />
                    <br />
                    
                    <label>Payment Mode <span style={{ color: 'red' }}>*</span></label>
                    <select
                        name="paymentMode"
                        value={formData.paymentMode}
                        onChange={handleInputChange}
                    >
                        <option value="">Select payment mode</option>
                        <option value="cash">Cash</option>
                        <option value="creditCard">Credit Card</option>
                        <option value="debitCard">Debit Card</option>
                        <option value="online">Online Payment</option>
                    </select>
                    <br />
                    
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter description"
                    />
                    <br />
                    
                    {error && (
                        <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
                            {error}
                        </MessageBar>
                    )}
                    
                    <button type="button" onClick={onCancel} style={{ marginLeft: "150px" }}>Cancel</button>
                    <button type="submit" style={{ marginLeft: "20px" }}>Submit</button>
                </form>
            </div>

            <Modal
                isOpen={successModalVisible}
                onDismiss={handleCloseModal}
                isBlocking={false}
                containerClassName="custom-modal"
            >
                <div className="modal-content">
                    <div className="success-message" >
                        Transaction is added successfully!
                    </div>
                    <button className="ok-button" onClick={handleCloseModal} style={{ marginLeft: '90px', marginTop: '10px' }}>
                        OK
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default AddExpense;
