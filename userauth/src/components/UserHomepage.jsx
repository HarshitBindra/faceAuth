import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserDataContext } from './userContext';
import { useNavigate } from 'react-router-dom'

function UserHomepage() {
  const { userData } = useContext(UserDataContext);
  const [userProfile, setUserProfile] = useState(null);

  //navigate route setup
  const Navigate = useNavigate()

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await axios.get(`http://localhost:9002/user/${userData.email}`);

        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    if (userData.email) {
      fetchUserProfile();
    }
  }, [userData.email]);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  const handleLogout = (e) =>{
    e.preventDefault();
    userData.email=''
    console.log(userData)
    Navigate('/')
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Welcome {userProfile.name}!
      </h2>
      {userProfile.profileImage && (
        <div className="flex justify-center mt-4">
          <img src={`http://localhost:9002/${userProfile.profileImage}`} alt="Profile" className="w-40 h-40 rounded-full" />

        </div>
        
      )}
      <div className='flex flex-col'>
        <button
          onClick={handleLogout}
          className="flex w-40 my-5 self-center justify-center rounded-md bg-fuchsia-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-fuchsia-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600"
        >
          Logout
        </button>
        </div>
    </div>
  );
}

export default UserHomepage;
