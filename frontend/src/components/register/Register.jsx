

import React, { useContext, useState } from 'react';
import styles from './Registers.module.css';
import { registerUser, loginUser } from '../../api/auth';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { ColorRing } from 'react-loader-spinner';

const Register = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginErrors, setLoginErrors] = useState({});
    const [registerErrors, setRegisterErrors] = useState({});
    const [backendError, setBackendError] = useState('');
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
        if (isLogin) {
            setLoginErrors({ ...loginErrors, [name]: '' });
        } else {
            setRegisterErrors({ ...registerErrors, [name]: '' });
        }
    };


    const handleTabSwitch = (isLoginMode) => {
        setIsLogin(isLoginMode);
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        // setLoginErrors({});
        // setRegisterErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let errors = {};
        const namePattern = /^[a-zA-Z\s]*$/; // Only allow letters and spaces

        if (!isLogin) {
            if (!formData.name) {
                errors.name = 'Name is required';
            } 
            // else if (!namePattern.test(formData.name)) {
            //     formData.name = '';
            //     errors.name = 'Invalid name';
            // }
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } 
        else if (!formData.email.includes('@')) {
            errors.email = 'Invalid Email';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } 
        // else if (formData.password.length < 3) {
        //     errors.password = 'Weak password';
        // }
       
        if (!isLogin &&  formData.confirmPassword !== formData.password) {
           
           formData.confirmPassword = ''
            errors.confirmPassword =   'Password doesn’t match';
           // formData.confirmPassword = ''
        }

        if (Object.keys(errors).length > 0) {
            if (isLogin) {
                setLoginErrors(errors);
            } else {
                setRegisterErrors(errors);
            }
            setIsLoading(false);
            return;
        }

        if (isLogin) {
            const response = await loginUser({ email: formData.email, password: formData.password });
            if (response.success) {
                toast.success('Login successful!');
                login();
                setFormData({
                    email: '',
                    password: ''
                });
                navigate('/');
            } else {
                setFormData({
                    email: '',
                    password: ''
                });
                setLoginErrors({ [response.includes('Email') ? 'email' : 'password']: response });
                toast.error(response || 'Login failed');
            }
        } else {
            const response = await registerUser({ name: formData.name, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword });
           
            if (response.success) {
                console.log('scuess');
                toast.success('Registration successful!');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setIsLogin(true);
            } else {
                setRegisterErrors({ [response.field]: response });
                setBackendError(response)
                console.log(response);
                toast.error(response);
            }
        }
        setIsLoading(false);
    };

    return (
        <div className={styles.container}>
              <ToastContainer toastClassName={styles.customToast}/>
            <div className={styles.card}>
                <h1>QUIZZIE</h1>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`} onClick={() => handleTabSwitch(false)}>Sign Up</button>
                    <button className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`} onClick={() => handleTabSwitch(true)}>Log In</button>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={styles.inputName}>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`${styles.input} ${registerErrors.name ? styles.errorInput : ''}`}
                                placeholder={registerErrors.name || ''}
                            />
                        </div>
                    )}
                    <div className={styles.inputName}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`${styles.input} ${isLogin ? (loginErrors.email ? styles.errorInput : '') : (registerErrors.email ? styles.errorInput : '')}`}
                            placeholder={isLogin ? (loginErrors.email || '') : (registerErrors.email || '')}
                        />
                    </div>
                    <div className={styles.inputName}>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`${styles.input} ${isLogin ? (loginErrors.password ? styles.errorInput : '') : (registerErrors.password ? styles.errorInput : '')}`}
                            placeholder={isLogin ? (loginErrors.password || '') : (registerErrors.password || '')}
                        />
                    </div>
                    {!isLogin && (
                        <div className={styles.inputName}>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`${styles.input} ${registerErrors.confirmPassword ? styles.errorInput : ''}`}
                                placeholder={registerErrors.confirmPassword || ''}
                            />
                        </div>
                    )}
                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? (
                            <ColorRing
                                visible={true}
                                height="30"
                                width="30"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
                            />
                        ) : isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>
            </div>
          
        </div>
    );
};

export default Register;
















// import React, { useContext, useState } from 'react';
// import styles from './Registers.module.css';
// import { registerUser, loginUser } from '../../api/auth';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import AuthContext from '../../context/AuthContext';
// import { ColorRing } from 'react-loader-spinner';

// const Register = () => {
//     const [isLogin, setIsLogin] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();
//     const { login } = useContext(AuthContext);
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//         setErrors({ ...errors, [name]: '' });
//     };

//     const handleTabSwitch = (isLoginMode) => {
//         setIsLogin(isLoginMode);
//         setFormData({
//             name: '',
//             email: '',
//             password: '',
//             confirmPassword: ''
//         });
//         setErrors({});
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         let currentErrors = {};

//         if (!formData.email) {
//             currentErrors.email = 'Email is required';
//         }

//         if (!formData.password) {
//             currentErrors.password = 'Password is required';
//         }

//         if (!isLogin && !formData.name) {
//             currentErrors.name = 'Name is required';
//         }

//         if (!isLogin && !formData.confirmPassword) {
//             currentErrors.confirmPassword = 'Confirm password is required';
//         }

//         if (Object.keys(currentErrors).length > 0) {
//             setErrors(currentErrors);
//             setIsLoading(false);
//             return;
//         }

//         if (isLogin) {
//             const response = await loginUser({ email: formData.email, password: formData.password });
//             if (response.success) {
//                 toast.success('Login successful!');
//                 login();
//                 setFormData({
//                     email: '',
//                     password: ''
//                 });
//                 navigate('/');
//             } else {
//                 setErrors({ [response.includes('Email') ? 'email' : 'password']: response });
//                 toast.error(response || 'Login failed');
//             }
//         } else {
//             const response = await registerUser({ name: formData.name, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword });
//             if (response.success) {
//                 toast.success('Registration successful!');
//                 setFormData({
//                     name: '',
//                     email: '',
//                     password: '',
//                     confirmPassword: ''
//                 });
//                 setIsLogin(true);
//             } else {
//                 setErrors({ [response.field]: response.message });
//                 toast.error(response.message || 'Registration failed');
//             }
//         }
//         setIsLoading(false);
//     };

//     return (
//         <div className={styles.container}>
//             <div className={styles.card}>
//                 <h1>QUIZZIE</h1>
//                 <div className={styles.tabs}>
//                     <button className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`} onClick={() => handleTabSwitch(false)}>Sign Up</button>
//                     <button className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`} onClick={() => handleTabSwitch(true)}>Log In</button>
//                 </div>
//                 <form className={styles.form} onSubmit={handleSubmit}>
//                     {!isLogin && (
//                         <div className={styles.inputName}>
//                             <label>Name</label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleInputChange}
//                                 className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
//                                 placeholder={errors.name || ''}
//                             />
//                         </div>
//                     )}
//                     <div className={styles.inputName}>
//                         <label>Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleInputChange}
//                             className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
//                             placeholder={errors.email || ''}
//                         />
//                     </div>
//                     <div className={styles.inputName}>
//                         <label>Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleInputChange}
//                             className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
//                             placeholder={errors.password || ''}
//                         />
//                     </div>
//                     {!isLogin && (
//                         <div className={styles.inputName}>
//                             <label>Confirm Password</label>
//                             <input
//                                 type="password"
//                                 name="confirmPassword"
//                                 value={formData.confirmPassword}
//                                 onChange={handleInputChange}
//                                 className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ''}`}
//                                 placeholder={errors.confirmPassword || ''}
//                             />
//                         </div>
//                     )}
//                     <button type="submit" className={styles.button} disabled={isLoading}>
//                         {isLoading ? (
//                             <ColorRing
//                                 visible={true}
//                                 height="30"
//                                 width="30"
//                                 ariaLabel="blocks-loading"
//                                 wrapperStyle={{}}
//                                 wrapperClass="blocks-wrapper"
//                                 colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
//                             />
//                         ) : isLogin ? 'Log In' : 'Sign Up'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Register;

