import React from 'react';
import PropTypes from 'prop-types';
import './RegisterUser.css';

class RegisterUser extends React.Component {

 render() {
  return (
    <div className="register-user">
      <h5>AND</h5>
      <p>You can fill this field for register your user id</p>
      <div className="register-user-container">
        <input
          type="email"
          value={this.props.userId}
          className="form-control register-user-input"
          placeholder="Enter your email or user ID"
          onChange={(e) => this.props.setUserId(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={this.props.registerUser}
        >
          Register UserID
        </button>
      </div>
    </div>
  );
 }
}

/* eslint-disable react/require-default-props */

RegisterUser.propTypes = {
  setUserId: PropTypes.func,
  registerUser: PropTypes.func,
  userId: PropTypes.string
};

export default RegisterUser;
