import {
    INBOX_MOCK,
    INBOX_UPDATE,
    INBOX_UPDATE_COUNT,
    INBOX_MOCK_READ,
    INBOX_MOCK_REMOVE,
} from '../constants';
import { getUnreadMessagesCount } from '../utils/helpers';

const initialState = {};

const inboxReducer = (state = initialState, action) => {
    switch (action.type) {
        case INBOX_MOCK: {
            const { messages, count } = action.payload;
            return {
                ...state,
                mockMessages: messages,
                mockUnreadCount: count,
            };
        }
        case INBOX_MOCK_READ: {
            const { mockMessages } = state;
            const newMessages = mockMessages.map(message => ({
                ...message,
                isRead: message.isRead || action.payload.includes(message.code),
            }));
            return {
                ...state,
                mockMessages: newMessages,
                mockUnreadCount: getUnreadMessagesCount(newMessages),
            };
        }
        case INBOX_MOCK_REMOVE: {
            const { mockMessages } = state;
            const newMessages = mockMessages.filter(message => message.code !== action.payload);
            return {
                ...state,
                mockMessages: newMessages,
                mockUnreadCount: getUnreadMessagesCount(newMessages),
            };
        }
        case INBOX_UPDATE: {
            return {
                ...state,
                messages: action.payload,
            };
        }
        case INBOX_UPDATE_COUNT: {
            return {
                ...state,
                new_inbox: action.payload,
            };
        }
        default: {
            return state;
        }
    }
};

export default inboxReducer;
