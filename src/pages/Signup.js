import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/API';

export const Signup = () => {
  const username = useRef('');
  const firstName = useRef('');
  const lastName = useRef('');
  const emailAddress = useRef('');
  const password = useRef('');

  const submitFormHandler = (event) => {
    event.preventDefault();
    console.log('add validation for data entered');

    API.createUser({
      username: username.current.value,
      password: password.current.value,
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      email: emailAddress.current.value,
    }).then(() => {
      alert('The user has been created successfully!');
    });
  };

  return (
    <div>
      <form onSubmit={submitFormHandler}>
        <h3>User - Sign Up</h3>

        <div className="form-group">
          <label>Username: </label>
          <input
            type="text"
            className="form-control"
            placeholder="What username would you like to use?"
            ref={username}
          />
        </div>

        <div className="form-group">
          <label>First Name: </label>
          <input
            type="text"
            className="form-control"
            placeholder="First Name"
            ref={firstName}
          />
        </div>

        <div className="form-group">
          <label>Last name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last Name"
            ref={lastName}
          />
        </div>

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            ref={emailAddress}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            ref={password}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Sign Up
        </button>
        <p className="forgot-password text-right">
          Already registered <a href="/login">sign in?</a>
        </p>
      </form>
    </div>
  );
};