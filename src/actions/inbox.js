import {
  INBOX_UPDATE, INBOX_UPDATE_COUNT, INBOX_MOCK, INBOX_MOCK_READ, INBOX_MOCK_REMOVE,
} from '../constants';
import mock from '../components/Inbox/mock.json';
import { getUnreadMessagesCount } from '../utils/helpers';

export function mockInboxMessages() {
  return {
    type: INBOX_MOCK,
    payload: {
      messages: mock,
      count: getUnreadMessagesCount(mock),
    },
  };
}

export function updateMockInboxReadStatus(codes) {
  return {
    type: INBOX_MOCK_READ,
    payload: codes,
  };
}

export function removeMockInboxMessage(code) {
  return {
    type: INBOX_MOCK_REMOVE,
    payload: code,
  };
}

export function updateUnreadMessagesCount(count) {
  return {
    type: INBOX_UPDATE_COUNT,
    payload: count,
  };
}

export function updateInboxMessages(messages) {
  return {
    type: INBOX_UPDATE,
    payload: messages,
  };
}
