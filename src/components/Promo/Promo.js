import React from 'react';
import PropTypes from 'prop-types';
import './Promo.css';


const Promo = (props) => {
    const {
        text,
        successText,
        rejectText,
        onSuccess,
        onReject
    } = props;

    const renderButton = (title, action) => (
        <button className="btn btn-default btn-primary" onClick={action}>
            {title}
        </button>
    );

    return (
        <div className="text-center promo_info">
            <h5>{text}</h5>
            {renderButton(successText, onSuccess)}
            {onReject && renderButton(rejectText, onReject)}
        </div>
    );
};

/* eslint-disable react/require-default-props */

Promo.propTypes = {
    text: PropTypes.string,
    successText: PropTypes.string,
    rejectText: PropTypes.string,
    onSuccess: PropTypes.func.isRequired,
    onReject: PropTypes.func
};

Promo.defaultProps = {
    text: 'Would you like to receive information about new items and discounts?',
    successText: 'Yes',
    rejectText: 'No, thanks',
};

export default Promo;
