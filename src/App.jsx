import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import Dashboard from './pages/Dashboard';
import BranchManage from './pages/BranchManage';
import CommitHistory from './pages/CommitHistory';
import Repository from './pages/Repository';

function App() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: null,
    password: ''
  });

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      setFormData({...formData, avatar: e.target.files[0] })
    }
    else{
      setFormData({...formData, [e.target.name]: e.target.value})
    }
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formDataToSend = new FormData();
  //   formDataToSend.append('username', formData.username);
  //   formDataToSend.append('email', formData.email);
  //   formDataToSend.append('avatar', formData.avatar);
  //   formDataToSend.append('password', formData.password);
    
  //   try {
  //     const response = await axios.post('http://localhost:8000/api/v1/users/register', formDataToSend, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  //     alert(response.data.message);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('avatar', formData.avatar)
    formDataToSend.append('password', formData.password)

    try {
      const response = await axios.post("http://localhost:8000/api/v1/users/register",
        formDataToSend,
        {headers: { 'Content-Type': 'multipart/form-data' }}
      );
      alert(response.data.message)

    } catch (error) {
      console.log('Error: ', error);
    }
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='branchManage' element={<BranchManage />} />
          <Route path='commitHistory' element={<CommitHistory />} />
          <Route path='repository' element={<Repository />} />
        </Routes>
      </Router>

      {/* Registration Form */}
      <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <form className='bg-white p-6 rounded-lg shadow-lg w-96' onSubmit={handleSubmit}>
          <h2 className='text-2xl font-semibold text-center mb-4'>Register</h2>
          
          <label className='block mb-2'>Username</label>
          <input 
            type='text' 
            name='username' 
            value={formData.username} 
            onChange={handleChange} 
            className='w-full p-2 border rounded-lg mb-4' 
            required
          />

          <label className='block mb-2'>Email</label>
          <input 
            type='email' 
            name='email' 
            value={formData.email} 
            onChange={handleChange} 
            className='w-full p-2 border rounded-lg mb-4' 
            required
          />

          <label className='block mb-2'>Avatar (Upload File)</label>
          <input 
            type='file' 
            name='avatar' 
            onChange={handleChange} 
            className='w-full p-2 border rounded-lg mb-4' 
            accept='image/*'
          />

          <label className='block mb-2'>Password</label>
          <input 
            type='password' 
            name='password' 
            value={formData.password} 
            onChange={handleChange} 
            className='w-full p-2 border rounded-lg mb-4' 
            required
          />

          <button 
            type='submit' 
            className='w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition'>
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default App;