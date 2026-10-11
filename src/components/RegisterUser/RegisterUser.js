import React from 'react';
import PropTypes from 'prop-types';
import './RegisterUser.css';

function RegisterUser(props) {
  return (
    <div className="register-user">
      {props.heading && <h5>{props.heading}</h5>}
      <p>{props.hint}</p>
      <p className="register-user-note">
        To prevent spam we do not send emails to outside addresses, ask your sales/CSM for a demo
      </p>
      <div className="register-user-container">
        <input
          type="email"
          value={props.userId}
          className="form-control register-user-input"
          placeholder="Enter your email or user ID"
          onChange={(e) => props.setUserId(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={props.registerUser}
        >
          Register UserID
        </button>
      </div>
    </div>
  );
}

/* eslint-disable react/require-default-props */

RegisterUser.propTypes = {
  setUserId: PropTypes.func,
  registerUser: PropTypes.func,
  userId: PropTypes.string,
  heading: PropTypes.string,
  hint: PropTypes.string,
};

RegisterUser.defaultProps = {
  heading: 'AND',
  hint: 'You can fill this field for register your user id',
};

export default RegisterUser;
