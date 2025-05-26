import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate, classnames } from '../../utils/helpers';

class InboxList extends Component {
  constructor(props) {
    super(props);

    this.markVisibleItemsAsRead = this.markVisibleItemsAsRead.bind(this);

    this.inboxItems = {};
    this.inboxList = {};
    this.state = {
      readItems: [],
      mockReadItems: [],
    };
  }

  componentDidMount() {
    this.markVisibleItemsAsRead();
    this.inboxList.addEventListener('scroll', this.markVisibleItemsAsRead);
  }

  componentWillUnmount() {
    const { readItems, mockReadItems } = this.state;
    this.props.updateReadStatus(readItems, mockReadItems);
  }

  markVisibleItemsAsRead() {
    const { readItems, mockReadItems } = this.state;
    const scrollTop = (this.inboxList.clientHeight + this.inboxList.scrollTop) - 50;
    Object.keys(this.inboxItems).forEach((code) => {
      // check message exists and user saw the message in viewport
      if (!this.inboxItems[code] || this.inboxItems[code].offsetTop > scrollTop) {
        return;
      }

      // is message true or moked?
      const message = this.props.messages
        .find((messageItem) => messageItem.code === code);
      const mockMessage = this.props.mockMessages
        .find((messageItem) => messageItem.code === code);

      // mark true inbox messages as read
      if (!!message && !message.isRead && !readItems.includes(code)) {
        readItems.push(code);
      }
      // mark moked inbox messages as read
      if (!!mockMessage && !mockMessage.isRead && !mockReadItems.includes(code)) {
        mockReadItems.push(code);
      }
    });
    this.setState({
      readItems,
      mockReadItems,
    });
  }

  render() {
    const {
      messages,
      mockMessages,
      removeItem,
      removeMockItem,
    } = this.props;
    const { readItems } = this.state;

    const messageItem = (message, onClick, onRemove) => (
      <li
        key={message.code}
        className={classnames({
          'inbox-item': true,
          delivered: !message.isRead,
          open: message.isActionPerformed,
        })}
        ref={(item) => {
          this.inboxItems[message.code] = item;
        }}
      >
        <div
          className="inbox-item-inner"
          onClick={() => onClick(message.code)}
        >
          <div className="inbox-icon">
            <img src={message.imageUrl} alt={message.title || ''} className="inbox-message-image" />
          </div>
          <div className="inbox-content">
            {message.title
                        && (
                        <div className="inbox-item-title">
                          {message.title}
                        </div>
                        )}
            <div className="inbox-body">
              {message.message || 'message'}
            </div>
            <div className="inbox-time">
              {message.sendDate ? formatDate(message.sendDate) : '2 minutes ago'}
            </div>
          </div>
        </div>
        <span
          className="inbox-item-remove"
          onClick={() => onRemove(message.code)}
        />
      </li>
    );

    return [...messages, ...mockMessages].length
      ? (
        <div>
          <h3 className="inbox-title">Inbox</h3>
          <ul className="inbox-list" ref={(inboxList) => { this.inboxList = inboxList; }}>
            {messages.map((message) => {
              const onClick = (code) => this.props.performActionForMessage(code);
              const onRemove = (code) => {
                const visibleItems = readItems
                  .slice(readItems.indexOf(code), 1);
                removeItem(message.code, visibleItems);
              };
              return messageItem(message, onClick, onRemove);
            })}
            {mockMessages.map((message) => {
              const onClick = () => {
                const newTab = window.open('http://www.pushwoosh.com', '_blank');
                newTab.focus();
              };
              return messageItem(message, onClick, removeMockItem);
            })}
          </ul>
        </div>
      )
      : (
        <div className="inbox-list--empty">
          <div className="inbox-list-icon" />
          <div className="inbox-list-title">
            { 'You\'re all caught up' }
          </div>
          <div className="inbox-list-body">
            There are no new messages. Stay tuned!
          </div>
        </div>
      );
  }
}

InboxList.propTypes = {
  updateReadStatus: PropTypes.func.isRequired,
  performActionForMessage: PropTypes.func.isRequired,
  removeMockItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    imageUrl: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    isActionPerformed: PropTypes.bool.isRequired,
    sendDate: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]).isRequired,
  })).isRequired,
  mockMessages: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    imageUrl: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
  })).isRequired,
};

export default InboxList;
