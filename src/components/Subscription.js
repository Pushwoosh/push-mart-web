import React from 'react';
import PropTypes from 'prop-types';


const Subscription = ({ status, className = '' }) => {
    switch (status) {
        case 'granted':
            return <span className={`text-success ${className}`}>Subscription granted</span>;
        case 'denied':
            return <span className={`text-danger ${className}`}>Subscription denied</span>;
        case 'default':
            return <span className={`text-warning ${className}`}>Subscription prompt</span>;
        default:
            return null;
    }
};

Subscription.propTypes = {
    status: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Subscription;
