import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const Alert = () => {
  const alerts = useSelector((state) => state.alert);

  return (
    alerts != null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.message}
      </div>
    ))
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

// const mapStateToProps = (state) => ({
//   alerts: state.alert,
// });
export default Alert;
