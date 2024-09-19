import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppCodePrompt } from '../components';
import { saveApp } from '../actions/app';


class AppCodePromptContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            inputValue: '',
        };
        this.onSubmitHandler = this.onSubmit.bind(this);
        this.changeInputHandler = this.changeInput.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.setState({ inputValue: this.props.applicationCode }, () => {
            if (this.isValidAppCode()) {
                this.handleApplication();
            }
        });
    }

    onSubmit(event) {
        event.preventDefault();

        if (!this.isValidAppCode()) {
            this.setState({
                error: 'Application Code is invalid',
            });
            return;
        }

        this.handleApplication();
    }

    handleApplication() {
        const { hash } = window.location;

        this.props.saveApp(this.state.inputValue);
        this.props.history.push(`/products/${hash}`);
    }

    isValidAppCode() {
        const regexp = /^\w{5}-\w{5}$/;
        return regexp.test(this.state.inputValue);
    }

    changeInput(event) {
        this.setState({
            inputValue: event.target.value,
        });
    }

    render() {
        return (
            <AppCodePrompt
                error={this.state.error}
                submitHandler={this.onSubmitHandler}
                changeInputHandler={this.changeInputHandler}
            />
        );
    }
}

AppCodePromptContainer.propTypes = {
    applicationCode: PropTypes.string,
    saveApp: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
};

AppCodePromptContainer.defaultProps = {
    applicationCode: '',
};

const bindActions = {
    saveApp,
};

export default withRouter(connect(() => ({}), bindActions)(AppCodePromptContainer));
