import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../assets/ExpenseTable.module.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Modal } from '@fluentui/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import { SearchBox, ISearchBoxStyles } from '@fluentui/react/lib/SearchBox';

const ExpenseTable = () => {
    const [expenses, setExpenses] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [addBalanceModal, setAddBalanceModal] = useState(false);
    const [addExpenseModal, setAddExpenseModal] = useState(false);
    const [editExpenseModal, setEditExpenseModal] = useState(false);
    const [successMessageModal, setSuccessMessageModal] = useState(false);
    const [sortOrder, setSortOrder] = useState({ amount: 'asc', date: 'asc' });
    const navigate = useNavigate();

    // States for adding or editing an expense
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [paymentMode, setPaymentMode] = useState('online');
    const [reason, setReason] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [currentExpense, setCurrentExpense] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:8085/getExpenses');
            setExpenses(response.data);
            const response1 = await axios.get('http://localhost:8085/getBalance');
            calculateTotalBalance(response1.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const calculateTotalBalance = (currBalance) => {
        const initialBalance = 0;
        const totalExpense = currBalance.reduce((sum, expense) => sum - parseFloat(expense.amount), 0);
        setTotalBalance(initialBalance - totalExpense);
    };

    const goToHomepage = () => {
        navigate('/homepage1');
    };

    const openAddBalanceModal = () => {
        setAddBalanceModal(true);
    };

    const closeAddBalanceModal = () => {
        setAddBalanceModal(false);
    };

    const openAddExpenseModal = () => {
        setAddExpenseModal(true);
    };

    const closeAddExpenseModal = () => {
        setAddExpenseModal(false);
    };

    const openEditExpenseModal = (expense) => {
        setCurrentExpense(expense);
        setAmount(expense.amount);
        setDate(expense.date);
        setReason(expense.reason);
        setCategory(expense.category);
        setPaymentMode(expense.paymentMode);
        setDescription(expense.description);
        setEditExpenseModal(true);
    };

    const closeEditExpenseModal = () => {
        setEditExpenseModal(false);
        setCurrentExpense(null);
    };

    const sortExpenses = (field) => {
        const sortedExpenses = [...expenses].sort((a, b) => {
            if (sortOrder[field] === 'asc') {
                return a[field] > b[field] ? 1 : -1;
            } else {
                return a[field] < b[field] ? 1 : -1;
            }
        });

        setExpenses(sortedExpenses);
        setSortOrder({ ...sortOrder, [field]: sortOrder[field] === 'asc' ? 'desc' : 'asc' });
    };
    const handleSave = async () => {
        const newBalanceData = {
            amount,
            date,
            paymentMode,
        };
        try {
            await fetch('http://localhost:8085/addBalance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBalanceData)
            });

            setTotalBalance(prevBalance => prevBalance + parseFloat(amount));
            closeAddBalanceModal();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddExpense = async () => {
        const newExpense = {
            amount,
            date,
            reason,
            category,
            paymentMode,
            description
        };

        try {
            await axios.post('http://localhost:8085/addExpense', newExpense);
            setTotalBalance(prevBalance => prevBalance - parseFloat(amount));
            setExpenses([...expenses, newExpense]);
            closeAddExpenseModal();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleEditExpense = async () => {
        const updatedExpense = {
            ...currentExpense,
            amount,
            date,
            reason,
            category,
            paymentMode,
            description
        };

        try {
            await axios.put(`http://localhost:8085/updateExpense/${currentExpense.id}`, updatedExpense);
            const updatedExpenses = expenses.map(expense =>
                expense.id === currentExpense.id ? updatedExpense : expense
            );
            setExpenses(updatedExpenses);
            closeEditExpenseModal();
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            const expenseToDelete = expenses.find(expense => expense.id === expenseId);

            await axios.delete(`http://localhost:8085/deleteExpense/${expenseId}`);
            const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
            setExpenses(updatedExpenses);

            if (expenseToDelete) {
                setTotalBalance(prevBalance => prevBalance - parseFloat(expenseToDelete.amount));
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className={styles.container} style={{ marginTop: "40px" }}>
            <div className={styles.expenseTableContainer}>
                
                <h1 className={styles.header}>Expense Details</h1>
                <h2 className={styles.balance}>Current Available Balance is: ₹{totalBalance.toFixed(2)}</h2>
                <button className={styles.btn} title="Add Balance" onClick={openAddBalanceModal}>
                    Add Balance
                </button>
                <button className={styles.btn} title="Add Expense" style={{ marginLeft: "1400px" }} onClick={openAddExpenseModal}>
                    Add Expense
                </button>
                <br></br>
                <SearchBox></SearchBox>
                <div className={styles.expenseTableContainer}>
                    <div className={styles.tableScrollContainer}>
                        <table className={styles.expenseTable}>
                            <thead>
                                <tr>
                                    <th onClick={() => sortExpenses('date')}>
                                        {sortOrder.date === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}Date
                                    </th>
                                    <th>Reason</th>
                                    <th>Category</th>
                                    <th onClick={() => sortExpenses('amount')}>
                                        {sortOrder.amount === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}Amount
                                    </th>
                                    <th>Payment Mode</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td>{formatDate(expense.date)}</td>
                                        <td>{expense.reason}</td>
                                        <td>{expense.category}</td>
                                        <td>{expense.amount}</td>
                                        <td>{expense.paymentMode}</td>
                                        <td>{expense.description}</td>
                                        <td>
                                            <EditIcon
                                                onClick={() => openEditExpenseModal(expense)}
                                                title="Edit transaction"
                                                style={{ cursor: "pointer" }}
                                            />
                                            <DeleteIcon
                                                onClick={() => handleDeleteExpense(expense.id)}
                                                title="Delete transaction"
                                                style={{ marginLeft: "10px", cursor: "pointer" }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.expenseFooter}>
                    <button className={styles.btn} title="Go back" style={{marginLeft:"700px"}}   onClick={goToHomepage}>
                        BACK
                    </button>
                    <button className={styles.btn} title="Go next" onClick={goToHomepage}>
                        NEXT
                    </button>
                </div>
                   
                </div>

               
            </div>

            {/* Modal for adding balance */}
            <Modal isOpen={addBalanceModal} onDismiss={closeAddBalanceModal}>
                <div className={styles.popupContent}>
                    <CloseIcon style={{ marginLeft: "440px", cursor: "pointer" }} onClick={closeAddBalanceModal} />
                    <h3 id={styles.addBalanceHeading}>Add Balance</h3>
                    <label htmlFor="amountInput">Enter amount</label>
                    <input
                        type="text"
                        id="amountInput"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <br />
                    <label htmlFor="dateInput">Date</label>
                    <input
                        type="date"
                        id="dateInput"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <br />
                    <label htmlFor="paymentModeSelect">Payment Mode</label>
                    <select
                        id="paymentModeSelect"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="online">Online</option>
                        <option value="cash">Cash</option>
                    </select>
                    <br />
                    <div className={styles.bottons}>
                        <button className={styles.save} onClick={goToHomepage}>Cancel</button>
                        <button className={styles.save} onClick={handleSave}>Save</button>

                    </div>

                </div>
            </Modal>

            {/* Modal for adding expense */}
            <Modal isOpen={addExpenseModal} onDismiss={closeAddExpenseModal}>
                <div className={styles.popupContent}>
                    <CloseIcon style={{ marginLeft: "440px", cursor: "pointer" }} onClick={closeAddExpenseModal} />
                    <h3 className={styles.addExpenseHeading}>Add Expense</h3>

                    <label htmlFor="expenseAmountInput">Amount</label>
                    <input
                        type="text"
                        id="expenseAmountInput"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <br />

                    <label htmlFor="expenseDateInput">Date</label>
                    <input
                        type="date"
                        id="expenseDateInput"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <br />

                    <label htmlFor="expenseReasonInput">Reason</label>
                    <input
                        type="text"
                        id="expenseReasonInput"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <br />

                    <label htmlFor="expenseCategoryInput">Category</label>
                    <select
                        id="expenseCategoryInput"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select a category</option>
                        <option value="Education">Education</option>
                        <option value="Travelling">Travelling</option>
                        <option value="Cloth">Cloth</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Student Welfare">Student Welfare</option>
                        <option value="Office Expense">Office Expense</option>
                    </select>
                    <br />

                    <label htmlFor="expensePaymentModeSelect">Payment Mode</label>
                    <select
                        id="expensePaymentModeSelect"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="online">Online</option>
                        <option value="cash">Cash</option>
                    </select>
                    <br />

                    <label htmlFor="expenseDescriptionInput">Description</label>
                    <textarea
                        id="expenseDescriptionInput"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <br />

                    <div className={styles.buttons}>
                        <button className={styles.cancelExpenseButton} onClick={closeAddExpenseModal}>Cancel</button>
                        <button className={styles.addExpenseButton} onClick={handleAddExpense}>Add</button>
                    </div>
                </div>
            </Modal>


            {/* Modal for editing expense */}
            <Modal isOpen={editExpenseModal} onDismiss={closeEditExpenseModal}>
                <div className={styles.popupContent}>
                    <CloseIcon style={{ marginLeft: "440px", cursor: "pointer" }} onClick={closeEditExpenseModal} />
                    <h3 className={styles.addExpenseHeading}>Edit Expense</h3>

                    <label htmlFor="editExpenseAmountInput">Amount</label>
                    <input
                        type="text"
                        id="editExpenseAmountInput"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <br />

                    <label htmlFor="editExpenseDateInput">Date</label>
                    <input
                        type="date"
                        id="editExpenseDateInput"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <br />

                    <label htmlFor="editExpenseReasonInput">Reason</label>
                    <input
                        type="text"
                        id="editExpenseReasonInput"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <br />

                    <label htmlFor="editExpenseCategoryInput">Category</label>
                    <select
                        id="editExpenseCategoryInput"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select a category</option>
                        <option value="Education">Education</option>
                        <option value="Travelling">Travelling</option>
                        <option value="Cloth">Cloth</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Student Welfare">Student Welfare</option>
                        <option value="Office Expense">Office Expense</option>
                    </select>
                    <br />

                    <label htmlFor="editExpensePaymentModeSelect">Payment Mode</label>
                    <select
                        id="editExpensePaymentModeSelect"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="online">Online</option>
                        <option value="cash">Cash</option>
                    </select>
                    <br />

                    <label htmlFor="editExpenseDescriptionInput">Description</label>
                    <textarea
                        id="editExpenseDescriptionInput"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <br />

                    <div className={styles.buttons}>
                        <button className={styles.cancelExpenseButton} onClick={closeEditExpenseModal}>Cancel</button>
                        <button className={styles.addExpenseButton} onClick={handleEditExpense}>Update</button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default ExpenseTable;
