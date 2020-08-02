import axios from "axios";
import { setAlert } from "./alert";

import { GET_PROFILE, PROFILE_ERROR } from "./types";

// Get current user's profile //
export const getCurrentProfile = () => async (dispatch) => {
  try {
    let LOCALHOST = "http://localhost:5000";
    const res = await axios.get(LOCALHOST + "/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data.profile,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
