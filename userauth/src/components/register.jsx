import React,{ useState,useContext } from 'react'
import logo from './clubs&date.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from './userContext'


function Register() {

//declaring context for user data
   const userState = useContext(UserDataContext)
   console.log('Registerdata',userState)
// setting navigating constant
  const navigate = useNavigate();
//setting form data to user
    // const [user,setUser] = useState({
    //     name:"",
    //     email:"",
    //     password:"",
    //     confirmPassword:""
    // })

  //setting error message
    const [error, setError] = useState('');
//updating form data to user
    const userUpdate = e => {
        const {name,value} = e.target
        userState.setUserData({
            ...userState.userData,
            [name]:value
        })
    }
    
    //toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    }; 
    
    //updating data on click of register button
    let isSubmitting = false;
const registerUserData = (event) => {
  event.preventDefault(); // Prevent form submission

  if (isSubmitting) {
      return; // Prevent multiple submissions
  }

  isSubmitting = true;

  const { name, email, password, confirmPassword } = userState.userData;

  if (password === confirmPassword) {
      if (name && email && password) {
          axios.post("http://localhost:9002/register", userState.userData)
              .then(res => {
                navigate('/image-upload')
              })
              .catch(error=>{
                setError(error.response.data.message)
              })
              .finally(() => {
                  isSubmitting = false;
              });
      } else {
          setError('Please fill all mandatory fields and try again');
          isSubmitting = false;
      }
  } else {
    setError('Confirm Password does not match with password entered');
      isSubmitting = false;
  }
}


  return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
           <img
            className="mx-auto w-auto"
            src={logo}
            alt="Your Company"
          /> 
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register User
          </h2>
        </div>
        <div className='text-red-800 text-sm py-1 mt-5'>
            {error}
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
          <div>
              <label htmlFor="fullName" className="block text-left text-sm font-medium leading-6 text-gray-900">
                Full name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  value={userState.userData.name}
                  onChange={userUpdate}
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-left text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  value={userState.userData.email}
                  onChange={userUpdate}
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  value={userState.userData.password}
                  onChange={userUpdate}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute cursor-pointer text-sm inset-y-0 right-0 flex items-center px-2 font-semibold leading-6 text-fuchsia-600 focus:outline-none hover:text-fuchsia-400"
                >
                {showPassword ? (
                  // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  //   <path stroke-linecap="round" stroke-linejoin="round" 
                  //   d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  // </svg>
                  <label>Hide</label>
                
                ) : (
                  // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  //   <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  //   <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  // </svg>
                  <label>Show</label>

                )}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userState.userData.confirmPassword}
                  onChange={userUpdate}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                onClick={(event) => registerUserData(event)}
                className="flex w-full justify-center rounded-md bg-fuchsia-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-fuchsia-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600"
              >
                Next
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{' '}
            <a href="/" className="font-semibold leading-6 text-fuchsia-600 hover:text-fuchsia-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
  )
}

export default Register