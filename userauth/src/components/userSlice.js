import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  profileImage: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      // Update user data in the state
      return { ...state, ...action.payload };
    },
    clearUserData: (state) => {
      // Clear user data from the state
      return initialState;
    }
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
