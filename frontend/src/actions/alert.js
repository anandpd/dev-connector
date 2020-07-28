import { SET_ALERT, REMOVE_ALERT } from "./types";
import uuid from "uuid";

// Action Creator
export const setAlert = (message, alertType) => (dispatch) => {
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: {
      message,
      alertType,
      id,
    },
  });
};
