





import React, { useContext, useState } from 'react';
import styles from './Registers.module.css';
import { registerUser, loginUser } from '../../api/auth';
import { toast } from 'react-toastify'; // Assuming the API functions are in 'api.js'
import { Navigate, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Register = () => {
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (isLogin) {
            const response = await loginUser({ email: formData.email, password: formData.password });
            if (response.success) {
                toast.success("Login successful!");
                login()
                setFormData({
                    // name: '',
                    email: '',
                    password: '',
                    // confirmPassword: ''
                });
                navigate('/');
               
            } else {
                toast.error(response);
            }
            console.log(response);
        } else {
            const response = await registerUser({ name: formData.name, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword});
            if (response.success) {
                toast.success("Register successful!");
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setIsLogin(true);
            } else {
                toast.error(response);
            }
            console.log(response);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>QUIZZIE</h1>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
                    <button className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`} onClick={() => setIsLogin(true)}>Log In</button>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={styles.inputName}>
                            <label>Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={styles.input} />
                        </div>
                    )}
                    <div className={styles.inputName}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={styles.input} />
                    </div>
                    <div className={styles.inputName}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={styles.input} />
                    </div>
                    {!isLogin && (
                        <div className={styles.inputName}>
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={styles.input} />
                        </div>
                    )}
                    <button type="submit" className={styles.button}>{isLogin ? 'Log In' : 'Sign Up'}</button>
                </form>
            </div>
        </div>
    );
};

export default Register;


