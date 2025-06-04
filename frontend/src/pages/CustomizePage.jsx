import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { MdKeyboardBackspace } from 'react-icons/md';

const CustomizePage = () => {
const { BACKEND_URL, userData, backendImage, selectedImage, setUserData } = useContext(userDataContext);
const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

//   handleUpdateAssistant
  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${BACKEND_URL}/api/user/update`,
        formData,
        { withCredentials: true }
      );

      setUserData(result.data);
      navigate("/");
    } catch (error) {
      console.error("Error while updating assistant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
      <MdKeyboardBackspace
        className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]'
        onClick={() => navigate("/customize")}
      />
      <h1 className='text-white mb-[40px] text-[30px] text-center'>
        Enter Your <span className='text-blue-200'>Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder='eg. Jarvis'
        className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className='min-w-[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer bg-white rounded-full text-[19px]'
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {!loading ? "Finally Create Your Assistant" : "Loading..."}
        </button>
      )}
    </div>
  );
}

export default CustomizePage
