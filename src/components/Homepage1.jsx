import React from 'react';
import '../assets/Homepage1.css';
import logo from '../assets/images/advikalogo.png';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const Homepage1 = ({email}) => {
    const navigate = useNavigate();

    const expensetransaction = () => {
        navigate('/expenseTable');
    }
    const studentdata = () => {
        navigate('/read');
    }
    const employeedata = () =>
    {
        navigate('/employeeData');
    }
    const GotoDonationData = () =>
    {
        navigate('/donationData');
    }
    const goToReport = () =>
    {
        navigate('/report');
    }
    const goToInventoryPage = () =>
    {
        navigate('/inventoryData');
    }

    return (
        <>
            <div className='homecontainer'>
                <div className='header'>
                    <div className='logo'>
                        <img src={logo} alt="Advika Logo" />
                        <AccountBoxIcon  style={{fontSize:"80px", marginLeft:"1450px", marginTop:"-100px"}}></AccountBoxIcon>
                        <h3  style={{ marginLeft:"1400px", marginTop:"-15px"}}>{email}</h3>
                    </div>
                    <div className='body'>
                    <div className='card' onClick={GotoDonationData}>
                            <div className='card-content'>
                                <h2>Donation Data</h2>
                                <p>  Our Donation</p>
                            </div>
                        </div>
                    <div className='card' onClick={expensetransaction}>
                            <div className='card-content'>
                                <h2>Expense</h2>
                                <p>Track Expenses</p>
                            </div>
                        </div>
                      
                       

                        <div className='card' onClick={studentdata}>
                            <div className='card-content'>
                                <h2>Student</h2>
                                <p>Manage Student Data</p>
                            </div>
                        </div>

                     

                        <div className='card' onClick={employeedata}>
                            <div className='card-content'>
                                <h2>Employee</h2>
                                <p>Employee Data</p>    
                            </div>
                        </div>
                        <div className='card' onClick={goToReport}>
                            <div className='card-content'>
                                <h2>Monthly Report</h2>
                                <p>Monthly Consumption</p>
                            </div>
                        </div>
                        <div className='card' onClick={goToInventoryPage}>
                            <div className='card-content'>
                                <h2>Inventory Record</h2>
                                <p>Management of of the Whole Inventory</p>
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
