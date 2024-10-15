import React, { useState } from 'react';
import styles from '../assets/Login.module.css';
import axios from 'axios';
import { Label } from '@fluentui/react/lib/Label';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setEmail }) => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [requiredError, setRequiredError] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({ email: false, password: false });
  const navigate = useNavigate();

  // Handle input change and validation reset
  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear validation errors when input is updated
    if (value) {
      setRequiredError('');
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  // Email format validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset previous errors
    setRequiredError('');
    setError('');

    let valid = true;

    // Check if any fields are empty
    if (!values.email || !values.password) {
      setRequiredError('Enter the Email and Password!');
      setErrors({
        email: !values.email,
        password: !values.password
      });
      valid = false;
    }
    // Check if email is valid
    else if (!validateEmail(values.email)) {
      setRequiredError('Enter a valid Email!');
      setErrors((prev) => ({ ...prev, email: true }));
      valid = false;
    }

    // Stop submission if validation fails
    if (!valid) return;

    // Axios request for login
    axios.post('http://localhost:8085/login', values)
      .then((res) => {
        if (res.data === "Success") {
          setEmail(values.email);
          navigate('/homepage1'); // Redirect to homepage
        } else {
          setError(res.data.message || 'Invalid Email or Password');
          // Set errors to true for both email and password when invalid credentials are entered
          setErrors({ email: true, password: true });
        }
      })
      .catch((err) => {
        setError("Your credentials don't match, please try again.");
        setErrors({ email: true, password: true }); // Set both to true in case of error
        console.error(err);
      });
  };

  const handleRegister = () => {
    navigate('/signup');
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
              style={{ border: errors.email ? '1px solid red' : '1px solid #ccc' }}
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
              style={{ border: errors.password ? '1px solid red' : '1px solid #ccc' }}
            />
          </div>
          <br />
          {/* Error messages */}
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
          {/* Submit and Register buttons */}
          <button type="button" style={{ backgroundColor: "#0078d4", marginLeft: "60px" }} className={`${styles.btn} ${styles.btnSuccess}`} onClick={handleRegister}>
            Create Account
          </button>
          <button type="submit" style={{ backgroundColor: "#0078d4" }} className={`${styles.btn} ${styles.btnSuccess}`}>
            Sign In
          </button>
          <br />
          <br />
          <h5>
            <a href="" style={{ marginLeft: "60px", color: "black" }}> Forgot username or Password?</a>
          </h5>
        </form>
      </div>
    </div>
  );
};

export default Login;
