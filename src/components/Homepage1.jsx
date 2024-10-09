import React from 'react';
import '../assets/Homepage1.css';
import logo from '../assets/images/advikalogo.png';
import Footer from './Footer';

const Homepage1 = ({ handlePageChange }) => {

    const expensetransaction = () => {
        handlePageChange('ExpenseTable');
    }
    const studentdata = () => {
        handlePageChange('Read');
    }
    const employeedata = () =>
    {
        handlePageChange('EmployeeData');
    }
    const GotoDonationData = () =>
    {
        handlePageChange('DonationData');
    }

    return (
        <>
            <div className='homecontainer'>
                <div className='header'>
                    <div className='logo'>
                        <img src={logo} alt="Advika Logo" />
                    </div>
                    <div className='body'>
                        <div className='card' onClick={studentdata}>
                            <div className='card-content'>
                                <h2>Student</h2>
                                <p>Manage Student Data</p>
                            </div>
                        </div>

                        <div className='card' onClick={expensetransaction}>
                            <div className='card-content'>
                                <h2>Expense</h2>
                                <p>Track Expenses</p>
                            </div>
                        </div>

                        <div className='card' onClick={employeedata}>
                            <div className='card-content'>
                                <h2>Employee</h2>
                                <p>Employee Data</p>
                            </div>
                        </div>

                        <div className='card' onClick={expensetransaction}>
                            <div className='card-content'>
                                <h2>Monthly Report</h2>
                                <p>Monthly Consumption</p>
                            </div>
                        </div>

                        <div className='card' onClick={GotoDonationData}>
                            <div className='card-content'>
                                <h2>Donation Data</h2>
                                <p>  Our Donation</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default Homepage1;