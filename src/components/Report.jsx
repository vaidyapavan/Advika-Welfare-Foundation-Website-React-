import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../assets/Report.module.css'; // Update to use CSS module
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ComboBox } from '@fluentui/react'; // Use ComboBox for multi-select
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { DatePicker, mergeStyles } from '@fluentui/react';

const rootClass = mergeStyles({ maxWidth: 300, selectors: { '> *': { marginBottom: 15 } } });

const Report = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]); // State to hold filtered results
    const [totalBalance, setTotalBalance] = useState(0);

    // State for filtering
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]); // Array to hold selected categories

    const categoryOptions = [
        { key: 'All', text: 'All' },
        { key: 'Education', text: 'Education' },
        { key: 'Travelling', text: 'Travelling' },
        { key: 'Cloth', text: 'Cloth' },
        { key: 'Medicine', text: 'Medicine' },
        { key: 'Grocery', text: 'Grocery' },
        { key: 'Student Welfare', text: 'Student Welfare' },
        { key: 'Office Expense', text: 'Office Expense' },
    ];
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:8085/getExpenses');
            setExpenses(response.data);
            setFilteredExpenses(response.data); // Initially, all expenses are shown
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

    const handleSearch = () => {
        let filtered = expenses;

        // Filter by date range
        if (startDate && endDate) {
            filtered = filtered.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startDate && expenseDate <= endDate;
            });
        }

        // Filter by selected categories
        if (selectedCategories.length > 0 && !selectedCategories.includes('All')) {
            filtered = filtered.filter(expense => selectedCategories.includes(expense.category));
        } else if (selectedCategories.includes('All')) {
            // If "All" is selected, do not filter by category
            // You may want to reset selectedCategories if needed
        }

        setFilteredExpenses(filtered);
    };

    const handleComboBoxChange = (event, option) => {
        if (option) {
            const currentSelection = selectedCategories.includes(option.key)
                ? selectedCategories.filter(cat => cat !== option.key) // Remove if already selected
                : [...selectedCategories, option.key]; // Add to selection

            setSelectedCategories(currentSelection);
        }
    };

    return (
        <div className={styles.container} style={{ marginTop: "40px" }}>
            <div className={styles.expenseTableContainer}>
                <button className={styles.btn} title="Go back" onClick={goToHomepage}>
                    <ArrowBackIosIcon />
                </button>
                <h1 className={styles.header}>Monthly report</h1>
                <h2 className={styles.balance}>Current Available Balance is: ₹{totalBalance.toFixed(2)}</h2>

                {/* Aligning DatePickers and Search Button */}
                <div className={styles.filterContainer}>
                    <DatePicker
                        placeholder='Select Start Date'
                        value={startDate}
                        onSelectDate={setStartDate}
                    />
                    <DatePicker
                        placeholder='Select End Date'
                        value={endDate}
                        onSelectDate={setEndDate}
                    />
                    <ComboBox
                        placeholder='Select Expense Categories'
                        options={categoryOptions}
                        selectedKey={selectedCategories}
                        onChange={handleComboBoxChange}
                        multiSelect 
                    />
                    <Button variant="contained" onClick={handleSearch}>Search</Button>
                </div>

                <table className={styles.expenseTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Payment Mode</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{expense.date}</td>
                                <td>{expense.reason}</td>
                                <td>{expense.category}</td>
                                <td>{expense.amount}</td>
                                <td>{expense.paymentMode}</td>
                                <td>{expense.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />

                {/* Centered Buttons */}
                <div className={styles.footerContent}>
                    <Button variant="contained" className={styles.backButton} onClick={goToHomepage}>Back</Button>
                    <Button variant="contained" className={styles.exportButton}>Export to Excel</Button>
                </div>
            </div>
        </div>
    );
};

export default Report;
