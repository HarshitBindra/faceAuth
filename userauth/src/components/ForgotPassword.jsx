import React,{useState,useContext} from 'react'
import logo from './clubs&date.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from './userContext';

function ForgotPassword() {

    //declaring context for user data
    const userState = useContext(UserDataContext)

    //declaring otp generated state
    const {isOtpGenerated,setIsOtpGenerated} = useState(false)

    //declaring otp check state
    const {isOtpChecked,setIsOtpChecked} = useState(false)
    
    //setting form data to user
  const [user,setUser] = useState({
    email:"",
    enterOtp:"",
    password:""
})

    //updating form data to user
const userUpdate = e => {
    const {name,value} = e.target
    setUser({
        ...user,
        [name]:value
    })
}


//toggle password visibility
const [showPassword, setShowPassword] = useState(false);
const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
}; 

//setting error message
const [error, setError] = useState('');

//updating data on click of register button
const generateOtp = async (event) => {
  event.preventDefault(); // Prevent form submission

  try {
    const response = await axios.post("http://localhost:9002/generate-otp", { email: user.email });
    if (response.status === 200) {
      setIsOtpGenerated(true); // Set isOtpGenerated to true after successfully generating OTP
      setError(''); // Clear any previous error messages
    } else {
      setError('Failed to generate OTP'); // Set error message if generating OTP fails
    }
  } catch (error) {
    console.error('Error generating OTP:', error);
    setError('Failed to generate OTP'); // Set error message if an error occurs during OTP generation
  }
};


    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
               <img
                className="mx-auto w-auto"
                src={logo}
                alt="Your Company"
              /> 
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Reset Password
              </h2>
            </div>
            {/* <div className='text-red-800 text-sm py-1 mt-5'>
                {error}
            </div> */}
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label htmlFor="email" className="block text-left text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      value={user.email}
                      onChange={userUpdate}
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

{isOtpGenerated && (<div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="enterOtp" className="block text-sm font-medium leading-6 text-gray-900">
                    One Time Password
                    </label>
                    <div className="text-sm">
                      <a href='/forgot-pass' className="font-semibold text-fuchsia-600 hover:text-fuchsia-500">
                        Resend OTP
                      </a>
                    </div>
                  </div>
                  <div className="mt-2 relative">
                    <input
                      id="enterOtp"
                      name="enterOtp"
                      value={user.enterOtp}
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
                      <label>Hide</label>
                    ) : (
                      <label>Show</label>
                    )}
                    </button>
                  </div>
                </div>
            )}
    
{isOtpChecked && (<div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href='/forgot-pass' className="font-semibold text-fuchsia-600 hover:text-fuchsia-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      name="password"
                      value={user.password}
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
                      <label>Hide</label>
                    ) : (
                      <label>Show</label>
                    )}
                    </button>
                  </div>
                </div>
                )}
                <div>
                  <button
                    onClick={generateOtp}
                    className="flex w-full justify-center rounded-md bg-fuchsia-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-fuchsia-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-600"
                  >
                    Generate OTP
                  </button>
                </div>
                    
              </form>
    
              <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?{' '}
                <a href="/register" className="font-semibold leading-6 text-fuchsia-600 hover:text-fuchsia-500">
                  Register now
                </a>
              </p>
              <p className="mt-2 text-center text-sm text-gray-500">
                Remember your password?{' '}
                <a href="/" className="font-semibold leading-6 text-fuchsia-600 hover:text-fuchsia-500">
                  Sign in now
                </a>
              </p>
            </div>
          </div>
      )
}

export default ForgotPassword