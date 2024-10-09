import React, { useState } from 'react';
import styles from '../assets/Login.module.css'; 
import axios from 'axios';
import { Label } from '@fluentui/react/lib/Label';
import { MessageBar, MessageBarType } from '@fluentui/react';

const Login = ({handlePageChange}) => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [requiredError, setRequiredError] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({ email: false, password: false });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));

    // Reset required error message and border when user starts typing
    if (value) {
      setRequiredError('');
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let valid = true;

    if (!values.email || !values.password) {
      setRequiredError('Enter the Email and Password!');
      setErrors({ email: !values.email, password: !values.password });
      valid = false;
    } else if (!validateEmail(values.email)) {
      setRequiredError('Enter a valid Email!');
      setErrors({ email: true, password: false });
      valid = false;
    }

    if (!valid) {
      return;
    }

    axios.post('http://localhost:8085/login', values)
  .then(res => {
    if (res.data === "Success") { 
      handlePageChange('Homepage1');
    } else {
      setError(res.data.message || 'Invalid Email or Password');
    }
  })
  .catch(err => {
    setError('An error occurred. Please try again.');
    console.error(err);
  });

  };

  const handleRegister = () => {
    handlePageChange('Signup');  
  };

  const handleForgotPassword = () => {
    handlePageChange('Error');  
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.mb3} ${styles.inputGroup}`}>
            <Label required>Email</Label>
            <input 
              type="text"
              placeholder="Enter your Email" 
              onChange={handleInput}
              name="email"
              value={values.email}
              className={errors.email ? styles.inputError : styles.input}
            />
          </div>
          <br />
          <div className={`${styles.mb3} ${styles.inputGroup}`}>
            <Label required>Password</Label>
            <input 
              type="password" 
              placeholder="Enter your password"
              name="password"
              onChange={handleInput}
              value={values.password}
              className={errors.password ? styles.inputError : styles.input}
            />
          </div>
          <br />
          {requiredError && (
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={false}
              dismissButtonAriaLabel="Close"
              className={styles.messageBar}
            >
              {requiredError}
            </MessageBar>
          )}
          {error && (
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={false}
              dismissButtonAriaLabel="Close"
              className={styles.messageBar}
            >
              {error}
            </MessageBar>
          )}
          <br />
          <button type="submit" className={`${styles.btn} ${styles.btnSuccess}`}>Sign In</button>
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleRegister}>
            Register
          </button>
          <br />
          <br />
          <button className={styles.forgotPassword} onClick={handleForgotPassword}>Forgot username or Password?</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
