// import React, { useContext, useState } from 'react';
// import styles from './Registers.module.css';
// import { registerUser, loginUser } from '../../api/auth';
// import { ToastContainer, toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import AuthContext from '../../context/AuthContext';
// import { ColorRing } from 'react-loader-spinner';

// const Register = () => {
//     const [isLogin, setIsLogin] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [loginErrors, setLoginErrors] = useState({});
//     const [registerErrors, setRegisterErrors] = useState({});
//     const [backendError, setBackendError] = useState('');
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
//         if (isLogin) {
//             setLoginErrors({ ...loginErrors, [name]: '' });
//         } else {
//             setRegisterErrors({ ...registerErrors, [name]: '' });
//         }
//     };


//     const handleTabSwitch = (isLoginMode) => {
//         setIsLogin(isLoginMode);
//         setFormData({
//             name: '',
//             email: '',
//             password: '',
//             confirmPassword: ''
//         });
//         // setLoginErrors({});
//         // setRegisterErrors({});
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         let errors = {};
//         const namePattern = /^[a-zA-Z\s]*$/; // Only allow letters and spaces

//         if (!isLogin) {
//             if (!formData.name) {
//                 errors.name = 'Name is required';
//             } 
//             // else if (!namePattern.test(formData.name)) {
//             //     formData.name = '';
//             //     errors.name = 'Invalid name';
//             // }
//         }

//         if (!formData.email) {
//             errors.email = 'Email is required';
//         } 
//         else if (!formData.email.includes('@')) {
//             errors.email = 'Invalid Email';
//         }

//         if (!formData.password) {
//             errors.password = 'Password is required';
//         } 
//         // else if (formData.password.length < 3) {
//         //     errors.password = 'Weak password';
//         // }
       
//         if (!isLogin &&  formData.confirmPassword !== formData.password) {
           
//            formData.confirmPassword = ''
//             errors.confirmPassword =   'Password doesn’t match';
//            // formData.confirmPassword = ''
//         }

//         if (Object.keys(errors).length > 0) {
//             if (isLogin) {
//                 setLoginErrors(errors);
//             } else {
//                 setRegisterErrors(errors);
//             }
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
//                 setFormData({
//                     email: '',
//                     password: ''
//                 });
//                 setLoginErrors({ [response.includes('Email') ? 'email' : 'password']: response });
//                 toast.error(response || 'Login failed');
//             }
//         } else {
//             const response = await registerUser({ name: formData.name, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword });
           
//             if (response.success) {
//                 console.log('scuess');
//                 toast.success('Registration successful!');
//                 setFormData({
//                     name: '',
//                     email: '',
//                     password: '',
//                     confirmPassword: ''
//                 });
//                 setIsLogin(true);
//             } else {
//                 setRegisterErrors({ [response.field]: response });
//                 setBackendError(response)
//                 console.log(response);
//                 toast.error(response);
//             }
//         }
//         setIsLoading(false);
//     };

//     return (
//         <div className={styles.container}>
//               <ToastContainer toastClassName={styles.customToast}/>
//             <div className={styles.card}>
//                 <h1 >QUIZZIE</h1>
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
//                                 className={`${styles.input} ${registerErrors.name ? styles.errorInput : ''}`}
//                                 placeholder={registerErrors.name || ''}
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
//                             className={`${styles.input} ${isLogin ? (loginErrors.email ? styles.errorInput : '') : (registerErrors.email ? styles.errorInput : '')}`}
//                             placeholder={isLogin ? (loginErrors.email || '') : (registerErrors.email || '')}
//                         />
//                     </div>
//                     <div className={styles.inputName}>
//                         <label>Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleInputChange}
//                             className={`${styles.input} ${isLogin ? (loginErrors.password ? styles.errorInput : '') : (registerErrors.password ? styles.errorInput : '')}`}
//                             placeholder={isLogin ? (loginErrors.password || '') : (registerErrors.password || '')}
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
//                                 className={`${styles.input} ${registerErrors.confirmPassword ? styles.errorInput : ''}`}
//                                 placeholder={registerErrors.confirmPassword || ''}
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








import React, { useContext, useState } from 'react';
import { registerUser, loginUser } from '../../api/auth';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { ColorRing } from 'react-loader-spinner';

const Register = () => {
    const [isLogin, setIsLogin] = useState(true);
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
        // Clear form data when switching tabs
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        // Clear errors
        setLoginErrors({});
        setRegisterErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let errors = {};
        const namePattern = /^[a-zA-Z\s]*$/;

        if (!isLogin) {
            if (!formData.name) {
                errors.name = 'Name is required';
            } 
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
       
        if (!isLogin && formData.confirmPassword !== formData.password) {
            errors.confirmPassword = 'Password doesn’t match';
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
                login(response.role, response.token, response.userId);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                
                // Redirect based on role
                if (response.role === 'teacher') {
                    navigate('/teacher/dashboard');
                } else {
                    navigate('/student/dashboard');
                }
            } else {
                setFormData({
                    ...formData,
                    password: '',
                });
                if (response.includes && response.includes('Email')) {
                    setLoginErrors({ email: response });
                } else if (response.includes && response.includes('password')) {
                    setLoginErrors({ password: response });
                } else {
                    setLoginErrors({ general: response });
                }
                toast.error(response || 'Login failed');
            }
        } else {
            const response = await registerUser({ 
                name: formData.name, 
                email: formData.email, 
                password: formData.password, 
                confirmPassword: formData.confirmPassword 
            });
           
            if (response.success) {
                toast.success('Registration successful!');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setIsLogin(true); // Switch to login tab after successful registration
            } else {
                setRegisterErrors({ [response.field || 'general']: response });
                setBackendError(response)
                toast.error(response);
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
                    <h1 className="text-4xl font-bold text-white font-serif">QUIZZIE</h1>
                    <p className="text-indigo-100 mt-2">Your interactive quiz platform</p>
                </div>
                
                <div className="flex border-b border-gray-200">
                    <button 
                        className={`flex-1 py-4 px-4 text-center font-medium transition-colors duration-200 ${
                            !isLogin 
                                ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => handleTabSwitch(false)}
                    >
                        Sign Up
                    </button>
                    <button 
                        className={`flex-1 py-4 px-4 text-center font-medium transition-colors duration-200 ${
                            isLogin 
                                ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => handleTabSwitch(true)}
                    >
                        Log In
                    </button>
                </div>
                
                <div className="p-6">
                    {!isLogin ? (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                                        registerErrors.name 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
                                    }`}
                                    placeholder="Enter your full name"
                                />
                                {registerErrors.name && <p className="mt-1 text-sm text-red-600">{registerErrors.name}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="reg-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                                        registerErrors.email 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
                                    }`}
                                    placeholder="Enter your email"
                                />
                                {registerErrors.email && <p className="mt-1 text-sm text-red-600">{registerErrors.email}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    id="reg-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                                        registerErrors.password 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
                                    }`}
                                    placeholder="Create a password"
                                />
                                {registerErrors.password && <p className="mt-1 text-sm text-red-600">{registerErrors.password}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                                        registerErrors.confirmPassword 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
                                    }`}
                                    placeholder="Confirm your password"
                                />
                                {registerErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{registerErrors.confirmPassword}</p>}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            >
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
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Sign Up
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="login-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                                        loginErrors.email 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
                                    }`}
                                    placeholder="Enter your email"
                                />
                                {loginErrors.email && <p className="mt-1 text-sm text-red-600">{loginErrors.email}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    id="login-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                                        loginErrors.password 
                                            ? 'border-red-500 focus:ring-red-200' 
                                            : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500'
                                    }`}
                                    placeholder="Enter your password"
                                />
                                {loginErrors.password && <p className="mt-1 text-sm text-red-600">{loginErrors.password}</p>}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            >
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
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        Log In
                                    </>
                                )}
                            </button>
                            
                            <div className="text-center pt-4 border-t border-gray-200 mt-6">
                                <p className="text-sm text-gray-600">
                                    For demo purposes, try:<br />
                                    <span className="font-medium">Teacher: teacher@example.com / password</span><br />
                                    <span className="font-medium">Student: student@example.com / password</span>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastClassName="bg-white text-gray-800 shadow-lg rounded-lg p-4"
            />
        </div>
    );
};

export default Register;