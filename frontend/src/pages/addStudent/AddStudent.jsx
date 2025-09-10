import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { addStudent, getStudents, updateStudent, deleteStudent } from '../../api/student';

const AddStudent = () => {
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    class: '',
    dateOfBirth: '',
  });
  const [students, setStudents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setErrorMessage('Failed to load students');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      if (editingStudent) {
        // Update existing student
        await updateStudent(editingStudent._id, formData);
        setSuccessMessage('Student updated successfully!');
      } else {
        // Add new student
        await addStudent(formData);
        setSuccessMessage('Student added successfully!');
      }
      
      // Reset form and refresh student list
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        class: '',
        dateOfBirth: '',
      });
      setEditingStudent(null);
      fetchStudents();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving student:', error);
      setErrorMessage(error.response?.data?.message || 'Error saving student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      studentId: student.studentId,
      class: student.class,
      dateOfBirth: student.dateOfBirth.split('T')[0], // Format date for input
    });
    // Scroll to form
    document.getElementById('student-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId);
        setSuccessMessage('Student deleted successfully!');
        fetchStudents();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting student:', error);
        setErrorMessage('Error deleting student');
      }
    }
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      studentId: '',
      class: '',
      dateOfBirth: '',
    });
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h1>
          <p className="text-gray-600">
            {editingStudent ? 'Update student details below' : 'Fill in the details below to register a new student'}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errorMessage}
          </div>
        )}

        {/* Form Card */}
        <div id="student-form" className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                  placeholder="Enter last name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                  placeholder="student@example.com"
                />
              </div>

              {/* Student ID */}
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID *
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                  placeholder="Enter student ID"
                />
              </div>

              {/* Class */}
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                  Class/Group *
                </label>
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a class</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingStudent ? 'Updating Student...' : 'Adding Student...'}
                  </>
                ) : (
                  editingStudent ? 'Update Student' : 'Add Student'
                )}
              </button>
              
              {editingStudent && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel Edit
                </button>
              )}
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </form>
        </div>

        {/* Students List Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Student List</h2>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
              />
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {students.length === 0 ? 'No students added yet.' : 'No students match your search.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="font-medium text-purple-800">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-purple-50 rounded-2xl shadow-md p-6 border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Important Information
          </h3>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Students will receive an email with login credentials
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Ensure the email address is correct and active
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Student ID must be unique for each student
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;