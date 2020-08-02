import loading from "./loading.gif";
import React, { Fragment } from "react";

const Spinner = () => {
  return (
    <Fragment>
      <img
        src={loading}
        alt="loading"
        style={{ width: "200px", margin: "auto", display: "block" }}
      />
    </Fragment>
  );
};

export default Spinner;
