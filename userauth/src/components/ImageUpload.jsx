import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from './userContext';


function ImageUpload() {

  //declaring context for user data
  const userState = useContext(UserDataContext)
  console.log('Registerdata',userState)


  const [image, setImage] = useState(null);
  const Navigate = useNavigate();

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedImage = event.dataTransfer.files[0];
    setImage(droppedImage);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = () => {
    // Implement image upload logic here (e.g., send image to server)
    if (image) {
      console.log('Uploading image:', image);

      userState.userData.profileImage = image
      //using session storage
      // sessionStorage.setItem('profileImage', image);
      // Navigate('/image-auth')
    // using url
    Navigate(`/image-auth?imageUrl=${encodeURIComponent(URL.createObjectURL(image))}`)
      
      // You can use Fetch API or any library like axios to send the image data to the server
    } else {
      console.error('No image selected.');
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow-md rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col items-center space-y-4">
                <div className="block pl-2 items-center font-semibold text-xl text-center text-gray-700">
                    <h2 className="leading-relaxed">Set your Profile Picture</h2>
                    <p className="text-sm text-gray-500 font-normal leading-relaxed">Make sure your face is clearly visible</p>
                </div>
            </div>
            <div
              className="mt-8 border-2 w-full h-24 border-gray-300 border-dashed rounded-lg p-12 flex justify-center items-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                </svg>

                  <span className="mt-2 text-base leading-normal text-gray-700">Tap here to choose your perfect photo</span>
                </div>
              </label>
            </div>
            {image && (
              <div className="mt-4 flex justify-center">
                <div className="rounded-full overflow-hidden w-48 h-48 flex items-center justify-center bg-gray-200">
                  <img src={URL.createObjectURL(image)} alt="Preview" className="object-cover w-full h-full" />
                </div>
              </div>
            )}
            <div className="pt-4 flex items-center space-x-4">
              <button
                onClick={handleUpload}
                className="w-full flex justify-center bg-fuchsia-600 text-gray-100 p-4 rounded-full tracking-wide
                  font-semibold focus:outline-none focus:shadow-outline hover:bg-fuchsia-400 shadow-lg cursor-pointer transition ease-in duration-300"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
