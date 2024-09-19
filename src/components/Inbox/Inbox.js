/* global document */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    updateInboxMessages,
    updateUnreadMessagesCount,
    updateMockInboxReadStatus,
    removeMockInboxMessage,
} from '../../actions/inbox';
import { getPushwoosh } from '../../index';
import InboxList from './InboxList';

const bindActions = {
    updateInboxMessages,
    updateUnreadMessagesCount,
    updateMockInboxReadStatus,
    removeMockInboxMessage,
};

const mapStateToProps = ({ inbox }) => ({
    newMessagesCount: inbox.new_inbox,
    messages: inbox.messages,
    mockMessages: inbox.mockMessages,
    mockUnreadCount: inbox.mockUnreadCount,
});

class Inbox extends Component {
    constructor(props) {
        super(props);

        this.PW = getPushwoosh();
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.outsideClickHandler = this.outsideClickHandler.bind(this);
        this.updateReadStatus = this.updateReadStatus.bind(this);
        this.updateUnreadMessagesCount = this.updateUnreadMessagesCount.bind(this);
        this.performActionForMessage = this.performActionForMessage.bind(this);
        this.removeInboxItem = this.removeInboxItem.bind(this);

        this.state = {
            isOpen: false,
        };
    }

    performActionForMessage(code) {
        if (!this.PW.pwinbox) {
            return;
        }
        this.PW.pwinbox.performActionForMessageWithCode(code)
            .then(() => {
                this.updateUnreadMessagesCount();
                this.toggleDropdown();
            });
    }

    updateReadStatus(codes, mockCodes) {
        this.props.updateMockInboxReadStatus(mockCodes);
        if (!this.PW.pwinbox) {
            return;
        }
        this.PW.pwinbox.readMessagesWithCodes(codes)
            .then(() => {
                this.updateUnreadMessagesCount();
                this.updateMessageList();
            });
    }

    updateMessageList() {
        if (!this.PW.pwinbox) {
            return;
        }
        this.PW.pwinbox.loadMessages()
            .then((messages) => {
                this.props.updateInboxMessages(messages);
            });
    }

    updateUnreadMessagesCount() {
        if (!this.PW.pwinbox) {
            return;
        }
        this.PW.pwinbox.unreadMessagesCount().then((count) => {
            this.props.updateUnreadMessagesCount(count);
        });
    }

    removeInboxItem(code) {
        if (!this.PW.pwinbox) {
            return;
        }
        this.PW.pwinbox.deleteMessagesWithCodes([code])
            .then(() => {
                this.updateMessageList();
            });
    }

    outsideClickHandler(event) {
        if (!this.dropdown) {
            return;
        }

        if (document.contains(event.target) && !this.dropdown.contains(event.target)) {
            this.toggleDropdown();
        }
    }

    toggleDropdown() {
        if (this.state.isOpen) {
            this.setState({
                isOpen: false,
            });
            document.removeEventListener('click', this.outsideClickHandler);
            this.updateUnreadMessagesCount();
        } else {
            if (this.PW.pwinbox) {
                this.PW.pwinbox.loadMessages()
                    .then((messages) => {
                        this.props.updateInboxMessages(messages);
                    });
            }

            this.setState({
                isOpen: true,
            }, () => document.addEventListener('click', this.outsideClickHandler));
        }
    }

    render() {
        const {
            newMessagesCount,
            messages,
            mockMessages,
            mockUnreadCount,
        } = this.props;
        const { isOpen } = this.state;

        const newCount = newMessagesCount + mockUnreadCount;

        return (
            <div className="dropdown-wrapper inbox-wrapper">
                <button
                    onClick={this.toggleDropdown}
                    className="btn btn-shadow"
                >
                    <span className="icon">
                        <img src="/images/icon-bell.svg" alt="Inbox" />
                        {!!newCount && <span className="badge badge-danger">{newCount}</span>}
                    </span>
                </button>
                {isOpen && (
                    <div className="dropdown" ref={(dropdown) => { this.dropdown = dropdown; }}>
                        <InboxList
                            messages={messages}
                            mockMessages={mockMessages}
                            updateReadStatus={this.updateReadStatus}
                            performActionForMessage={this.performActionForMessage}
                            removeItem={this.removeInboxItem}
                            removeMockItem={this.props.removeMockInboxMessage}
                        />
                    </div>
                )}
            </div>
        );
    }
}

Inbox.defaultProps = {
    newMessagesCount: 0,
    mockUnreadCount: 0,
    messages: [],
    mockMessages: [],
};

Inbox.propTypes = {
    removeMockInboxMessage: PropTypes.func.isRequired,
    updateMockInboxReadStatus: PropTypes.func.isRequired,
    updateInboxMessages: PropTypes.func.isRequired,
    updateUnreadMessagesCount: PropTypes.func.isRequired,
    newMessagesCount: PropTypes.number,
    mockUnreadCount: PropTypes.number,
    messages: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string.isRequired,
        title: PropTypes.string,
        message: PropTypes.string,
        imageUrl: PropTypes.string.isRequired,
        sendDate: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ]).isRequired,
        isRead: PropTypes.bool.isRequired,
        isActionPerformed: PropTypes.bool.isRequired,
    })),
    mockMessages: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string.isRequired,
        title: PropTypes.string,
        message: PropTypes.string,
        imageUrl: PropTypes.string.isRequired,
        isRead: PropTypes.bool.isRequired,
    })),
};

export default connect(mapStateToProps, bindActions)(Inbox);
