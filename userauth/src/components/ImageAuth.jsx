import React, { useEffect, useRef, useState,useContext } from 'react';
import { Navigate, useLocation,useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import {useSelector,useDispatch} from 'react-redux'
import { setUserData } from './userSlice'; // Import action creator
import { UserDataContext } from './userContext';
import axios from 'axios'

function ImageAuth() {

   //declaring context for user data
   const userState = useContext(UserDataContext)
   console.log('Registerdata',userState)


  const videoRef = useRef(null); // Reference to the video element
  const location = useLocation(); // Get the current location from React Router
  const imageUrl = new URLSearchParams(location.search).get('imageUrl'); // Extract the image URL from the query parameters
  const [isCameraStarted, setIsCameraStarted] = useState(false); // State to track if the camera is started
  const [scanAgain, setScanAgain] = useState(false); // State to track if rescan is required
  const [isMatch, setisMatch] = useState(false); // State to track if match is found
  const [timer, setTimer] = useState(10); // State to track the countdown timer
  const [isTimerRunning, setIsTimerRunning] = useState(false); // State to track if the timer is running
  const [isTimerVisible,setIsTimerVisible] = useState(false);// State to check visibilty of timer
  let matchFound = false;
  const Navigate = useNavigate();

  // const imageUrl = sessionStorage.getItem('profileImage');
  // console.log('Image url',imageUrl)

  //Timer function 
  const startTimer = () => {
    setTimer(10);
    setScanAgain(false)
    setIsTimerVisible(true);

    const countdown = () => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          handleTimeout();
          return 10;
        }
        return prevTimer - 1;
      });
    };

    const timerId = setInterval(countdown, 1000);

    setTimeout(() => {
      clearInterval(timerId);
      setIsTimerVisible(false);
    }, 10000);
  };

  // Function to reset the timer
const resetTimer = () => {
  setTimer(10); // Reset timer to initial value
  setIsTimerVisible(true); // Make timer visible again
  setIsTimerRunning(false); // Stop the timer
};

  // Function to handle actions after the timeout for timer
  const handleTimeout = () => {
    if (isMatch) {
      setScanAgain(false);
    }
    else{
      setScanAgain(true);
    }
    stopVideo()
  };

  // Function to scan for faces in the video stream
  const scanFace = async () => {
    try {
      // Load face recognition models
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models')
      ]);
  
      // Start video stream
      startVideo();
  
      // Start timer
      startTimer();
  
      // Interval to continuously detect faces in the video stream
      const scanInterval = setInterval(async () => {
        // Check if videoRef.current exists before accessing its properties
        if (videoRef.current) {
          const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight }; // Define displaySize
          const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
          // Check if resizedDetections is not empty before creating FaceMatcher
          if (resizedDetections.length > 0) {
            // Load the image and detect faces
            const img = await faceapi.fetchImage(imageUrl);
            const imgDetections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
  
            // Compare descriptors of the detected faces in the video stream with the descriptors of the detected faces in the loaded image
            const faceMatcher = new faceapi.FaceMatcher(imgDetections);
            const matches = resizedDetections.map(face => faceMatcher.findBestMatch(face.descriptor));
  
            // Perform face authentication logic
            matches.forEach(match => {
              if (match._label === 'unknown') {
                // No match found
                matchFound = false;
              } else {
                // Match found
                matchFound = true;
  
                // Stop scanning
                clearInterval(scanInterval);
  
                // Stop timer
                clearInterval(timerId);
                
                // Reset timer
                resetTimer();

                // Hide timer
                setIsTimerVisible(false);
  
                // Close video stream
                stopVideo();
  
                // Proceed to show the "Continue" button
                setisMatch(true);
                setScanAgain(false);
              }
            });
          } else {
            // Handle scenario when no face is detected
            matchFound = false;
          }
        }
      }, 1000 / 15);
  
      // Timeout to handle when the timer ends
      const timerId = setTimeout(() => {
        clearInterval(scanInterval);
        if (!matchFound) {
          // If no match is found before the timer ends, proceed to stop the video and perform relevant actions
          handleTimeout();
        }
      }, 10000);
    } catch (error) {
      console.error('Error loading face recognition models:', error);
    }
  };
  
  

  // Function to start the video stream
  const startVideo = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
          videoRef.current.srcObject = stream;
          setIsCameraStarted(true);
        })
        .catch(err => console.error('Error accessing camera:', err));
    }
  };

  // Function to stop the video stream
const stopVideo = () => {
  if (videoRef.current && videoRef.current.srcObject) {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => {
      track.stop(); // Stop each track in the stream
    });

    videoRef.current.srcObject = null; // Clear the video stream
  }
};

  // Function to handle starting the camera
  const handleStartCamera = (e) => {

    e.preventDefault();
    setIsCameraStarted(true);
    resetTimer();
    scanFace();
  };

  //sending data to backend as a form
  const updateFormData = (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('name', userState.userData.name);
    formData.append('email', userState.userData.email);
    formData.append('password', userState.userData.password);
    formData.append('profileImage', userState.userData.profileImage); // Make sure to append the profile image here

    console.log('form data : ', formData);

    axios.post("http://localhost:9002/image-auth", formData)
      .then(res => {
        Navigate('/user-home');
      })
      .catch(error => {
        alert('Failed to redirect to homepage');
      });
  };

  return (
    <form encType="multipart/form-data" method="post">
      <div className="min-h-screen bg-white py-3 flex flex-col justify-center sm:py-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {isTimerVisible && (<h2 style={{ display: isCameraStarted ? 'block' : 'none' }} className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Please wait for {timer} seconds!
          </h2>)
          }
          <button onClick={handleStartCamera} style={{ display: isCameraStarted ? 'none' : 'block' }} className="w-40 flex justify-center bg-fuchsia-600 text-gray-100 p-4 pb-3 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-fuchsia-400 shadow-lg cursor-pointer transition ease-in duration-300">
            Verify your pic!
          </button>
          <button onClick={updateFormData} style={{ display: isMatch ? 'block' : 'none' }} className="w-40 flex justify-center bg-fuchsia-600 text-gray-100 p-4 pb-3 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-fuchsia-400 shadow-lg cursor-pointer transition ease-in duration-300">
            Continue
          </button>
          {!isMatch && (<button onClick={handleStartCamera} style={{ display: scanAgain ? 'block' : 'none' }} className="w-40 flex justify-center bg-fuchsia-600 text-gray-100 p-4 pb-3 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-fuchsia-400 shadow-lg cursor-pointer transition ease-in duration-300">
            Scan again
          </button>)}
          <video ref={videoRef} autoPlay muted className="w-full max-w-lg mx-auto pt-3 pb-3" />
          {!isMatch && (<button onClick={() => Navigate('/image-upload')} style={{ display: scanAgain ? 'block' : 'none' }} className="w-60 flex justify-center bg-fuchsia-600 text-gray-100 p-4 pb-3 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-fuchsia-400 shadow-lg cursor-pointer transition ease-in duration-300">
            Upload another image
          </button>)}
        </div>
      </div>
    </form>
  );
}

export default ImageAuth;