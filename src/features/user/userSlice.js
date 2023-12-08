import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAddress } from '../../services/apiGeocoding';

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

//! This is how we call an async fn before the data is manipulate inside the reducer
//* This fetchAddress fn will return promise, so async fn as argument is ideal here. This fn is action creator fn that we will later call in our code/app
//* First argument: action name
//* Second argument: an async fn that will return the payload for the reducer later.
export const fetchAddress = createAsyncThunk(
  'user/fetchAddress',
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    //PAYLOAD OF FULFILLED STATE THAT WILL BE USE IN THE REDUCER FN
    return { position, address };
  },
);

const initialState = {
  userName: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action) {
      state.userName = action.payload;
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        (state.status = 'idle'),
          (state.position = action.payload.position),
          (state.address = action.payload.address);
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = 'error';
        state.error = 'There was a problem fetching your location 😢';
      }),
});

export const { updateName } = userSlice.actions;
export default userSlice.reducer;
