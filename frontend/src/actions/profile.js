import axios from "axios";
import { setAlert } from "./alert";

import { GET_PROFILE, PROFILE_ERROR } from "./types";
let LOCALHOST = "http://localhost:5000";
// Get current user's profile //
export const getCurrentProfile = () => async (dispatch) => {
  try {
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

// Create/Update a profile //
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const res = await axios.post(LOCALHOST + "/api/profile", formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data.profile,
    });
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created"));
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (error) {
    console.log(error);
    let errMesage = error.response.data.message;
    dispatch(setAlert(errMesage, "danger"));
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
