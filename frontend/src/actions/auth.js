import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
} from "./types";
import { setAlert } from "./alert";
import { setAuthToken } from "../utils/setAuthToken";

let nodeserver = "http://localhost:5000";

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get(nodeserver + "/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User //
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post(nodeserver + "/api/users", body, config);
    dispatch(setAlert("Keep going :)", "success"));
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
    let errMesage = error.response.data.message;
    dispatch(setAlert(errMesage, "danger"));
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
