import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../Layout';

import './AppCodePrompt.css';

function AppCodePrompt({ error, submitHandler, changeInputHandler }) {
  return (
    <Layout
      showNavigation={false}
    >
      <div className={`app_code_prompt panel ${error ? 'panel-danger' : 'panel-default'}`}>
        <div className="panel-heading text-center">
          {error || 'Please enter Application Code'}
        </div>

        <div className="panel-body">
          <form onSubmit={submitHandler}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="XXXXX-AAAAA"
                onChange={changeInputHandler}
              />

              <span className="input-group-btn">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

AppCodePrompt.propTypes = {
  error: PropTypes.string.isRequired,
  submitHandler: PropTypes.func.isRequired,
  changeInputHandler: PropTypes.func.isRequired,
};

export default AppCodePrompt;
